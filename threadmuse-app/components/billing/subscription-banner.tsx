import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { getMyEntitlements } from "@/lib/auth/require-plan";

/**
 * Subscription-status banner. Server component — fetches the current user's
 * entitlements and renders a thin warm strip across the top of the layout
 * when one of these applies:
 *
 *   - past_due:  payment failed, uploads are gated until card is updated
 *   - willCancel: cancel_at_period_end is true (kept the gentlest variant —
 *                 the user already chose this, no need to nag aggressively)
 *
 * Renders nothing for happy-path users (free, trialing, active without
 * pending cancel). Safe to drop anywhere — it just returns null when there's
 * nothing to say.
 */
export async function SubscriptionBanner() {
  const ent = await getMyEntitlements();
  if (!ent) return null;

  if (ent.isPastDue) {
    return (
      <UpgradePrompt
        size="banner"
        title="Payment failed"
        description="Update your card to resume uploads and keep your subscription active."
        currentPlan={ent.plan.name}
        ctaLabel="Update payment"
        ctaHref="/settings/billing"
        secondary={{ label: "View plans", href: "/pricing" }}
      />
    );
  }

  if (ent.willCancel && ent.current?.current_period_end) {
    // Gentle nudge, not a scary banner — they chose to cancel.
    const endDate = new Date(ent.current.current_period_end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return (
      <UpgradePrompt
        size="banner"
        title="Subscription ending"
        description={`Your ${ent.plan.name} access ends on ${endDate}. Resume any time.`}
        currentPlan={ent.plan.name}
        ctaLabel="Manage billing"
        ctaHref="/settings/billing"
      />
    );
  }

  return null;
}
