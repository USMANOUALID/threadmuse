import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { PlanCard } from "@/components/billing/plan-card";
import { getActivePlans, getMyCurrentPlan } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth/get-session";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — free forever, with optional Pro",
  description:
    "ThreadMuse is free for makers. Pro unlocks priority discovery, advanced analytics, and AI tagging.",
  path: "/pricing",
});

export const revalidate = 600;

/**
 * /pricing — public marketing surface for the paid plans. Reads `plans` from
 * the DB (RLS allows `is_active = true` for everyone), then renders tiles
 * with state-aware CTAs (current / upgrade / sign-up).
 */
export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const [plans, user, currentPlan] = await Promise.all([
    getActivePlans(),
    getCurrentUser(),
    getMyCurrentPlan(),
  ]);

  const cancelled = checkout === "cancelled";

  // We don't have Pro / Studio seeded yet in dev — the page still works,
  // it'll just render the Free tile. Stripe seeding lives in scripts/.
  return (
    <PageShell showMobileSearch={false}>
      <section className="bg-bg px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1024px] text-center">
          <h1 className="font-display text-display font-semibold tracking-tight text-ink">
            Pricing built for makers.
          </h1>
          <p className="mx-auto mt-3 max-w-[640px] text-pretty text-[15px] leading-relaxed text-muted">
            Free forever for new creators. Upgrade when your shop earns more than the
            subscription does.
          </p>
        </div>

        {cancelled && (
          <div className="mx-auto mt-6 max-w-md rounded-md border border-line/10 bg-warm px-4 py-3 text-center text-[13px] text-ink">
            Checkout cancelled. You can pick a plan whenever you're ready.
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-[1024px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p, i) => {
            const isCurrent = !!currentPlan && currentPlan.plan_id === p.id;
            const variant: "current" | "upgrade" | "anon" = !user
              ? "anon"
              : isCurrent
                ? "current"
                : "upgrade";
            return (
              <PlanCard
                key={p.id}
                plan={p}
                variant={variant}
                highlight={i === 1}
                signedIn={!!user}
              />
            );
          })}
        </div>

        <p className="mt-10 text-center text-[12px] text-muted">
          Already a member?{" "}
          <Link href="/settings/billing" className="underline-offset-4 hover:underline">
            Manage your billing →
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
