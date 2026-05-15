import "server-only";

import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";

/**
 * Resolve the Stripe customer for `userId`, creating one if necessary.
 *
 * Idempotent — safe to call from any server action that needs to start a
 * checkout or open the billing portal. We always run as service-role so the
 * insert into `public.customers` succeeds regardless of RLS.
 *
 * The Stripe customer is tagged with `metadata.user_id` so a webhook missing
 * the local mapping can still reconcile by looking at the event payload.
 */
export async function ensureStripeCustomer(args: {
  userId: string;
  email: string | null;
  displayName: string | null;
}): Promise<string> {
  const admin = createAdminClient();

  // 1. Existing row?
  const { data: existing } = await admin
    .from("customers")
    .select("stripe_customer_id")
    .eq("user_id", args.userId)
    .maybeSingle();
  if (existing) return existing.stripe_customer_id;

  // 2. Create in Stripe.
  const customer = await stripe().customers.create({
    email: args.email ?? undefined,
    name: args.displayName ?? undefined,
    metadata: { user_id: args.userId },
  });

  // 3. Persist. If the insert races with another concurrent caller (rare but
  // possible during double-clicks), the unique(user_id) constraint will catch
  // it; we then re-read and prefer the row that landed first.
  const { error } = await admin.from("customers").insert({
    user_id: args.userId,
    stripe_customer_id: customer.id,
    email: args.email,
  });
  if (error) {
    if (error.code === "23505") {
      const { data: winner } = await admin
        .from("customers")
        .select("stripe_customer_id")
        .eq("user_id", args.userId)
        .maybeSingle();
      if (winner) return winner.stripe_customer_id;
    }
    throw error;
  }
  return customer.id;
}

/**
 * Persist a Stripe Subscription into the local `subscriptions` table.
 * Called from both the webhook handler and (defensively) the checkout-return
 * path so a slow webhook doesn't leave the dashboard empty.
 *
 * Returns the resolved local `user_id` if the subscription was mapped, or
 * null if we couldn't find the customer locally (in which case the caller
 * should swallow — Stripe will retry the webhook).
 */
export async function upsertSubscriptionFromStripe(
  sub: Stripe.Subscription,
): Promise<string | null> {
  const admin = createAdminClient();
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const { data: customer } = await admin
    .from("customers")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!customer) return null;

  // A subscription can have multiple items; we treat the *first* item's price
  // as the plan. ThreadMuse only sells single-item subscriptions, so this is
  // always correct. Throw loudly if Stripe sends a shape we don't expect.
  const firstItem = sub.items.data[0];
  if (!firstItem) throw new Error(`subscription ${sub.id} has no items`);
  const priceId = firstItem.price.id;

  // Make sure the plan exists locally — otherwise the FK will fail. If a new
  // price was added in Stripe and we haven't seeded it, mirror it now from
  // the event payload so the subscription can be stored.
  await admin
    .from("plans")
    .upsert(
      {
        id: priceId,
        product_id:
          typeof firstItem.price.product === "string"
            ? firstItem.price.product
            : firstItem.price.product.id,
        name: priceId, // placeholder; seed script can update
        interval: (firstItem.price.recurring?.interval ?? "month") as "month" | "year",
        amount_cents: firstItem.price.unit_amount ?? 0,
        currency: firstItem.price.currency,
        is_active: firstItem.price.active,
      },
      { onConflict: "id", ignoreDuplicates: true },
    );

  const row = {
    id: sub.id,
    user_id: customer.user_id,
    plan_id: priceId,
    status: sub.status as Stripe.Subscription.Status,
    current_period_start: new Date(firstItem.current_period_start * 1000).toISOString(),
    current_period_end: new Date(firstItem.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
    canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    latest_invoice_id:
      typeof sub.latest_invoice === "string"
        ? sub.latest_invoice
        : sub.latest_invoice?.id ?? null,
  };

  const { error } = await admin.from("subscriptions").upsert(row, { onConflict: "id" });
  if (error) throw error;

  return customer.user_id;
}

/**
 * Mark a local subscription as canceled, e.g. on `customer.subscription.deleted`.
 * Idempotent.
 */
export async function markSubscriptionDeleted(subscriptionId: string): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      cancel_at_period_end: false,
    })
    .eq("id", subscriptionId);
}
