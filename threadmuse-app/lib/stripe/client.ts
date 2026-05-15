import "server-only";

import Stripe from "stripe";

/**
 * Singleton Stripe client. Throws at construct time if `STRIPE_SECRET_KEY`
 * is missing so a misconfigured deploy fails loud instead of silently
 * degrading.
 *
 * API version is pinned to the version stripe-node v22 ships with, matching
 * the type definitions. Bump together — never override the apiVersion to a
 * newer string without upgrading the SDK in lockstep.
 */

let _client: Stripe | null = null;

export function stripe(): Stripe {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env.local.");
  }
  _client = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    appInfo: { name: "ThreadMuse", version: "0.3.0" },
    typescript: true,
  });
  return _client;
}

export const stripeEnv = {
  webhookSecret: () => required("STRIPE_WEBHOOK_SECRET"),
  pricePro: {
    monthly: () => optional("STRIPE_PRICE_PRO_MONTHLY"),
    yearly: () => optional("STRIPE_PRICE_PRO_YEARLY"),
  },
};

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}
function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}
