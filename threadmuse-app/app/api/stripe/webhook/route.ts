import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeEnv } from "@/lib/stripe/client";
import {
  markSubscriptionDeleted,
  upsertSubscriptionFromStripe,
} from "@/lib/stripe/sync";

/**
 * Stripe webhook receiver. Mounted at `/api/stripe/webhook`.
 *
 * Hard requirements:
 *   - Body must be read as the raw bytes (NOT parsed JSON). Stripe's signature
 *     is computed over the exact request payload; any normalisation breaks it.
 *     `request.text()` returns the raw body in Next 15 route handlers.
 *   - `runtime = "nodejs"` — the Edge runtime doesn't expose the timing-safe
 *     compare Stripe's SDK uses internally.
 *
 * Stripe retries failed deliveries with exponential backoff for up to ~3 days,
 * so it's fine — actually preferred — to surface a 5xx when the DB sync errors.
 */
export const runtime = "nodejs";
// Don't cache webhook responses.
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      rawBody,
      signature,
      stripeEnv.webhookSecret(),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("stripe webhook handler error", { type: event.type, id: event.id, err });
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.trial_will_end":
      // For trial_will_end we don't change status, but mirroring the row
      // refreshes current_period_end + trial_end so the UI is accurate.
      await upsertSubscriptionFromStripe(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await markSubscriptionDeleted(sub.id);
      break;
    }

    case "checkout.session.completed": {
      // Defensive: when the checkout flow finalises a subscription, Stripe
      // emits `customer.subscription.created` alongside this event — but the
      // ordering isn't guaranteed. If the session has a subscription, fetch
      // and upsert so the UI reflects the new plan on the redirect-back page
      // even before the subscription event lands.
      const session = event.data.object as Stripe.Checkout.Session;
      if (typeof session.subscription === "string") {
        const sub = await stripe().subscriptions.retrieve(session.subscription);
        await upsertSubscriptionFromStripe(sub);
      }
      break;
    }

    case "invoice.payment_failed":
    case "invoice.payment_succeeded":
      // Status changes from payment events are already conveyed by the
      // `customer.subscription.updated` event that follows. We log only.
      // eslint-disable-next-line no-console
      console.info("stripe invoice event noted", { type: event.type, id: event.id });
      break;

    default:
      // We don't care about every event type — Stripe sends dozens we don't
      // need to handle. Logging at debug level keeps the noise out of prod.
      break;
  }
}
