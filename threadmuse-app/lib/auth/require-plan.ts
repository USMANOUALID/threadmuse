import "server-only";

import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import type { PlanRow, CurrentPlanRow } from "@/types/database";

/**
 * Plan gating for server actions and pages.
 *
 * `getMyEntitlements()` resolves the *effective* plan for the current user —
 * which means: their active subscription's plan if status is healthy
 * (trialing / active), otherwise the Free plan. We deliberately drop users
 * back to free-tier limits when `past_due` so a failing card doesn't grant
 * unlimited uploads while we wait for the dunning cycle.
 *
 * `requirePlan({ feature })` throws a typed `PlanGateError` that callers
 * convert to the `{ ok: false, error, upgradeRequired }` shape the UI
 * already expects.
 */

// Gate codes — exposed in errors so the UI can switch on them.
export type GateCode =
  | "OVER_PUBLISHED_POSTS"
  | "OVER_DAILY_UPLOADS"
  | "FEATURE_AI_TAGGING_REQUIRED"
  | "FEATURE_PRIORITY_DISCOVERY_REQUIRED"
  | "FEATURE_ADVANCED_ANALYTICS_REQUIRED"
  | "SUBSCRIPTION_PAST_DUE"
  | "AUTH_REQUIRED";

export class PlanGateError extends Error {
  readonly code: GateCode;
  readonly currentPlan: string;
  /** Optional hint about what limit was hit, for the UI banner. */
  readonly detail?: { used: number; limit: number };

  constructor(args: {
    code: GateCode;
    message: string;
    currentPlan: string;
    detail?: { used: number; limit: number };
  }) {
    super(args.message);
    this.name = "PlanGateError";
    this.code = args.code;
    this.currentPlan = args.currentPlan;
    this.detail = args.detail;
  }
}

export interface Entitlements {
  /** The resolved plan row for the user. `null` only if there's no Free plan in the DB. */
  plan: PlanRow;
  /** True when a paid subscription exists but is past_due — UI shows the banner. */
  isPastDue: boolean;
  /** True when the active subscription is set to cancel at period end. */
  willCancel: boolean;
  /** Raw view row, kept for callers that want the subscription status string. */
  current: CurrentPlanRow | null;
}

/**
 * Resolve the current user's plan + subscription status. Returns `null` when
 * the user is unauthenticated. Cached per render.
 */
export const getMyEntitlements = cache(async (): Promise<Entitlements | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();

  // current_plan is a view that already does the "best active plan or free"
  // join. We read it once and then pull the full plan row by id.
  const { data: current } = await supabase
    .from("current_plan")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // If the resolved status is past_due, drop the user back to the free plan
  // for gating purposes. The current_plan view returns the past_due plan
  // because that's still the "best" subscription Stripe knows about, but
  // for *entitlements* we want the free quotas until they pay.
  const isPastDue = current?.status === "past_due";
  const planIdForGate = !current || isPastDue ? "free" : current.plan_id;

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planIdForGate)
    .maybeSingle();

  if (!plan) {
    // Shouldn't happen — 0005 seeds 'free' and 0006 ensures its quotas.
    throw new Error(
      `Plan '${planIdForGate}' not found. Run \`pnpm db:reset\` to re-seed.`,
    );
  }

  return {
    plan,
    isPastDue,
    willCancel: current?.cancel_at_period_end ?? false,
    current: current ?? null,
  };
});

/**
 * Throws when the current user can't perform `feature`. Returns the resolved
 * `Entitlements` when the gate passes so the caller doesn't need a second
 * lookup.
 *
 * Counts that need a DB query (e.g. published-posts) are passed in by the
 * caller via `usage` — keeps this helper free of feature-specific selects.
 */
export async function requirePlan(args: {
  feature:
    | { kind: "ai_tagging" }
    | { kind: "priority_discovery" }
    | { kind: "advanced_analytics" }
    | { kind: "publish_post"; usage: { publishedPosts: number; uploadsToday: number } };
}): Promise<Entitlements> {
  const ent = await getMyEntitlements();
  if (!ent) {
    throw new PlanGateError({
      code: "AUTH_REQUIRED",
      message: "Sign in to continue.",
      currentPlan: "anon",
    });
  }

  const plan = ent.plan;

  // Past-due users with paid features are already downgraded to free in
  // getMyEntitlements — but we still surface a distinct error code so the UI
  // can show "Your payment failed — update your card" instead of a generic
  // upgrade prompt.
  if (ent.isPastDue && args.feature.kind === "publish_post") {
    throw new PlanGateError({
      code: "SUBSCRIPTION_PAST_DUE",
      message: "Your subscription payment failed. Update your card to continue uploading.",
      currentPlan: plan.name,
    });
  }

  switch (args.feature.kind) {
    case "ai_tagging":
      if (!plan.feature_ai_tagging) {
        throw new PlanGateError({
          code: "FEATURE_AI_TAGGING_REQUIRED",
          message: "AI tagging is available on Pro and Studio.",
          currentPlan: plan.name,
        });
      }
      break;

    case "priority_discovery":
      if (!plan.feature_priority_discovery) {
        throw new PlanGateError({
          code: "FEATURE_PRIORITY_DISCOVERY_REQUIRED",
          message: "Priority discovery is available on Pro and Studio.",
          currentPlan: plan.name,
        });
      }
      break;

    case "advanced_analytics":
      if (!plan.feature_advanced_analytics) {
        throw new PlanGateError({
          code: "FEATURE_ADVANCED_ANALYTICS_REQUIRED",
          message: "Advanced analytics are available on Pro and Studio.",
          currentPlan: plan.name,
        });
      }
      break;

    case "publish_post": {
      const { publishedPosts, uploadsToday } = args.feature.usage;
      if (
        plan.max_published_posts !== -1 &&
        publishedPosts >= plan.max_published_posts
      ) {
        throw new PlanGateError({
          code: "OVER_PUBLISHED_POSTS",
          message: `You've reached the ${plan.max_published_posts}-post limit on ${plan.name}.`,
          currentPlan: plan.name,
          detail: { used: publishedPosts, limit: plan.max_published_posts },
        });
      }
      if (
        plan.max_uploads_per_day !== -1 &&
        uploadsToday >= plan.max_uploads_per_day
      ) {
        throw new PlanGateError({
          code: "OVER_DAILY_UPLOADS",
          message: `Daily upload limit reached on ${plan.name}. Try again tomorrow or upgrade.`,
          currentPlan: plan.name,
          detail: { used: uploadsToday, limit: plan.max_uploads_per_day },
        });
      }
      break;
    }
  }

  return ent;
}
