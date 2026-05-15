import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startCheckout } from "@/app/actions/billing";
import type { PlanRow } from "@/types/database";
import { cn } from "@/lib/utils";

/**
 * Pricing tile. Three states:
 *   - current: the user is on this plan → "Current plan" disabled button
 *   - upgrade: the user can move here → "Upgrade" submit button (server action)
 *   - free + signed-out: anonymous → "Get started" link to /signup
 *
 * The Upgrade flow posts to the `startCheckout` server action which redirects
 * to Stripe Checkout. No client-side fetch — works without JS.
 */
export function PlanCard({
  plan,
  variant,
  highlight = false,
  signedIn,
}: {
  plan: PlanRow;
  variant: "current" | "upgrade" | "anon";
  /** Apply a peach border for the "recommended" plan. */
  highlight?: boolean;
  signedIn: boolean;
}) {
  const isFree = plan.amount_cents === 0;
  const price = isFree
    ? "Free"
    : `$${(plan.amount_cents / 100).toFixed(plan.amount_cents % 100 === 0 ? 0 : 2)}`;

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-surface p-6",
        highlight ? "border-accent shadow-lift" : "border-line/10",
      )}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-[18px] font-semibold text-ink">{plan.name}</h3>
        {highlight && (
          <span className="rounded-full bg-warm px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink">
            Recommended
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-[32px] font-semibold tracking-tight text-ink">
          {price}
        </span>
        {!isFree && (
          <span className="text-[12.5px] text-muted">/{plan.interval}</span>
        )}
      </div>
      {plan.description && (
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{plan.description}</p>
      )}

      <ul className="mt-5 flex flex-col gap-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[13px] text-ink/85">
            <Check className="mt-[3px] size-3.5 shrink-0 text-accent" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {variant === "current" && (
          <Button variant="outline" disabled className="w-full">
            Current plan
          </Button>
        )}
        {variant === "upgrade" && !isFree && (
          <form
            action={async () => {
              "use server";
              await startCheckout(plan.id);
            }}
          >
            <Button type="submit" className="w-full" variant={highlight ? "primary" : "secondary"}>
              Upgrade to {plan.name}
            </Button>
          </form>
        )}
        {variant === "upgrade" && isFree && (
          <Button variant="outline" disabled className="w-full">
            Included
          </Button>
        )}
        {variant === "anon" && (
          <Button asChild className="w-full" variant={highlight ? "primary" : "secondary"}>
            <a href={isFree ? "/signup" : `/signup?redirect=/pricing`}>
              {isFree ? "Get started free" : `Start with ${plan.name}`}
            </a>
          </Button>
        )}
      </div>

      {!signedIn && variant === "anon" && (
        <p className="mt-3 text-[11.5px] text-muted">
          Sign up and upgrade any time from settings.
        </p>
      )}
    </div>
  );
}
