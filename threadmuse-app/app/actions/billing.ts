"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/client";
import { ensureStripeCustomer } from "@/lib/stripe/sync";
import { getCurrentUserWithProfile } from "@/lib/auth/get-session";

/**
 * Start a Stripe Checkout Session for a price (subscription mode), then
 * redirect the user to Stripe's hosted page. The flow:
 *
 *   click "Upgrade"  →  this action runs  →  302 to checkout.stripe.com  →
 *   user pays         →  redirect back to /settings/billing?checkout=success
 *   webhook arrives   →  subscriptions table mirrored             ←
 *
 * On failure (no priceId, no auth) we return `{ ok: false, error }` so the
 * client form can render inline.
 */

type ActionResult = { ok: true; url: string } | { ok: false; error: string };

export async function startCheckout(priceId: string): Promise<ActionResult> {
  const session = await getCurrentUserWithProfile();
  if (!session) {
    return { ok: false, error: "Sign in to upgrade." };
  }
  if (!priceId) {
    return { ok: false, error: "Missing price." };
  }

  const customerId = await ensureStripeCustomer({
    userId: session.user.id,
    email: session.user.email ?? null,
    displayName: session.profile.name,
  });

  const origin = await getOrigin();
  const checkout = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/settings/billing?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    allow_promotion_codes: true,
    // Capture the billing address so we can support EU VAT later. Stripe's
    // Tax product reads from it automatically when enabled.
    billing_address_collection: "auto",
    // Hint Stripe we want a clear subscription summary on the receipt page.
    subscription_data: {
      metadata: { user_id: session.user.id },
    },
    // Metadata also on the session, so webhooks-by-session can resolve us.
    metadata: { user_id: session.user.id },
  });

  if (!checkout.url) {
    return { ok: false, error: "Stripe returned no checkout URL." };
  }
  redirect(checkout.url);
}

/**
 * Open Stripe's customer portal so the user can update card details, change
 * plan, cancel, or download invoices. The portal handles its own UI; we
 * just shuttle the user there.
 */
export async function openCustomerPortal(): Promise<ActionResult> {
  const session = await getCurrentUserWithProfile();
  if (!session) return { ok: false, error: "Sign in first." };

  const customerId = await ensureStripeCustomer({
    userId: session.user.id,
    email: session.user.email ?? null,
    displayName: session.profile.name,
  });

  const origin = await getOrigin();
  const portal = await stripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/settings/billing`,
  });

  redirect(portal.url);
}

async function getOrigin(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}
