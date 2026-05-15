/**
 * scripts/seed-stripe.ts
 *
 * Idempotent provisioning of ThreadMuse's paid plans into Stripe + the
 * `public.plans` table. Run with:
 *
 *   pnpm stripe:seed
 *
 * Requires:
 *   STRIPE_SECRET_KEY            (test mode in dev, live in prod)
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * What it does:
 *   1. For each TIER in PLAN_CONFIG, find-or-create a Stripe Product
 *      (matched via `metadata.threadmuse_plan_key`).
 *   2. For each price (monthly / yearly), find-or-create a matching active
 *      Stripe Price (matched on interval + amount + currency).
 *   3. Upsert a row into `public.plans` keyed by the Stripe price id,
 *      writing quotas + features from PLAN_CONFIG.
 *
 * Re-running is safe — every step is find-or-create. Editing PLAN_CONFIG and
 * re-running updates the local plan rows. Stripe Prices are immutable; a true
 * price change means creating a new Price and (optionally) archiving the old.
 * This script does not archive — that's a deliberate decision the operator
 * should make in the Stripe dashboard when migrating customers off a tier.
 *
 * The free plan is NOT created in Stripe (no Stripe product for id='free').
 * It's seeded via supabase/seed.sql + 0006 migration.
 */

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

// ── config — edit here, run again ────────────────────────────────────────

interface PriceConfig {
  interval: "month" | "year";
  amountCents: number;
}

interface PlanConfig {
  /** Stable internal key — used as Stripe metadata to dedupe products. */
  key: "pro" | "studio";
  name: string;
  description: string;
  features: string[];
  displayOrder: number;
  /** Quotas mirrored into public.plans. `-1` = unlimited. */
  maxPublishedPosts: number;
  maxUploadsPerDay: number;
  featureAiTagging: boolean;
  featurePriorityDiscovery: boolean;
  featureAdvancedAnalytics: boolean;
  prices: PriceConfig[];
}

const PLAN_CONFIG: PlanConfig[] = [
  {
    key: "pro",
    name: "Pro",
    description: "For makers shipping a few designs a week. Priority discovery + analytics.",
    features: [
      "Unlimited uploads",
      "Priority placement in Explore",
      "Advanced analytics dashboard",
      "AI tagging credits (200/mo)",
      "Etsy affiliate revenue share",
    ],
    displayOrder: 1,
    maxPublishedPosts: -1,
    maxUploadsPerDay: 50,
    featureAiTagging: true,
    featurePriorityDiscovery: true,
    featureAdvancedAnalytics: true,
    prices: [
      { interval: "month", amountCents: 1200 },  // $12/mo
      { interval: "year",  amountCents: 11900 }, // $119/yr (≈17% off)
    ],
  },
  {
    key: "studio",
    name: "Studio",
    description: "Full-time shops. Everything in Pro plus higher AI quota and white-glove support.",
    features: [
      "Everything in Pro",
      "AI tagging credits (2,000/mo)",
      "Custom shop URL",
      "Priority email support",
      "Featured-creator rotation",
    ],
    displayOrder: 2,
    maxPublishedPosts: -1,
    maxUploadsPerDay: -1,
    featureAiTagging: true,
    featurePriorityDiscovery: true,
    featureAdvancedAnalytics: true,
    prices: [
      { interval: "month", amountCents: 2900 },  // $29/mo
      { interval: "year",  amountCents: 28800 }, // $288/yr (≈17% off)
    ],
  },
];

const CURRENCY = "usd";
const PRODUCT_METADATA_KEY = "threadmuse_plan_key";

// ── runner ───────────────────────────────────────────────────────────────

async function main() {
  const stripeKey = required("STRIPE_SECRET_KEY");
  const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = required("SUPABASE_SERVICE_ROLE_KEY");

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2026-04-22.dahlia",
    appInfo: { name: "ThreadMuse seed-stripe", version: "0.3.0" },
    typescript: true,
  });

  const supabase = createClient<Database>(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  log(`Seeding ${PLAN_CONFIG.length} plans into Stripe (mode: ${stripeKey.startsWith("sk_live") ? "LIVE" : "test"})`);

  for (const plan of PLAN_CONFIG) {
    log(`\n→ ${plan.name}  (${plan.key})`);

    const product = await findOrCreateProduct(stripe, plan);
    log(`  product: ${product.id}`);

    for (const price of plan.prices) {
      const stripePrice = await findOrCreatePrice(stripe, product.id, price);
      log(`  price:   ${stripePrice.id}  (${price.interval}, ${formatMoney(price.amountCents)})`);

      const { error } = await supabase
        .from("plans")
        .upsert(
          {
            id: stripePrice.id,
            product_id: product.id,
            name: plan.name,
            description: plan.description,
            interval: price.interval,
            amount_cents: price.amountCents,
            currency: CURRENCY,
            is_active: true,
            display_order: plan.displayOrder,
            features: plan.features,
            max_published_posts: plan.maxPublishedPosts,
            max_uploads_per_day: plan.maxUploadsPerDay,
            feature_ai_tagging: plan.featureAiTagging,
            feature_priority_discovery: plan.featurePriorityDiscovery,
            feature_advanced_analytics: plan.featureAdvancedAnalytics,
          },
          { onConflict: "id" },
        );
      if (error) {
        throw new Error(`failed to upsert plan row for ${stripePrice.id}: ${error.message}`);
      }
    }
  }

  log("\n✓ done");
  log(
    "\nNext steps:\n" +
      "  • Copy a monthly Pro price id into .env.local as STRIPE_PRICE_PRO_MONTHLY (optional shortcut)\n" +
      "  • In another shell:  pnpm stripe:listen\n" +
      "  • Visit /pricing to see the tiles\n",
  );
}

// ── stripe helpers ───────────────────────────────────────────────────────

async function findOrCreateProduct(stripe: Stripe, plan: PlanConfig): Promise<Stripe.Product> {
  // Search by metadata. Stripe's products endpoint doesn't support metadata
  // filters via the typed client; we paginate the list and match locally.
  for await (const p of stripe.products.list({ active: true, limit: 100 })) {
    if (p.metadata[PRODUCT_METADATA_KEY] === plan.key) {
      // Update name/description if they drifted from config.
      if (p.name !== plan.name || p.description !== plan.description) {
        return stripe.products.update(p.id, {
          name: plan.name,
          description: plan.description,
        });
      }
      return p;
    }
  }
  return stripe.products.create({
    name: plan.name,
    description: plan.description,
    metadata: { [PRODUCT_METADATA_KEY]: plan.key },
  });
}

async function findOrCreatePrice(
  stripe: Stripe,
  productId: string,
  price: PriceConfig,
): Promise<Stripe.Price> {
  for await (const p of stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  })) {
    if (
      p.unit_amount === price.amountCents &&
      p.currency === CURRENCY &&
      p.recurring?.interval === price.interval
    ) {
      return p;
    }
  }
  return stripe.prices.create({
    product: productId,
    currency: CURRENCY,
    unit_amount: price.amountCents,
    recurring: { interval: price.interval },
  });
}

// ── tiny utils ───────────────────────────────────────────────────────────

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required env var: ${name}. ` +
        `Run with \`node --env-file=.env.local …\` or export it in your shell.`,
    );
  }
  return v;
}

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function log(line: string): void {
  // eslint-disable-next-line no-console
  console.log(line);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("\n✗ seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
