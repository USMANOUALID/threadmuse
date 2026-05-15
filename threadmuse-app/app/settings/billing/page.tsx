import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { getMyActiveSubscription, getMyCurrentPlan } from "@/lib/queries";
import { openCustomerPortal } from "@/app/actions/billing";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Billing",
  description: "Manage your ThreadMuse subscription.",
  path: "/settings/billing",
  noIndex: true,
});

/**
 * /settings/billing — protected by `middleware.ts`. Shows the user's current
 * plan, links to the portal for changes, and surfaces the post-checkout
 * confirmation banner.
 */
export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const [plan, sub] = await Promise.all([getMyCurrentPlan(), getMyActiveSubscription()]);

  const justUpgraded = checkout === "success";

  return (
    <PageShell showMobileSearch={false}>
      <section className="bg-bg px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[760px]">
          <header>
            <h1 className="font-display text-display font-semibold tracking-tight text-ink">
              Billing
            </h1>
            <p className="mt-1.5 text-[14px] text-muted">
              Manage your plan, payment method, and invoices.
            </p>
          </header>

          {justUpgraded && (
            <div className="mt-6 rounded-md border border-line/10 bg-warm px-4 py-3 text-[13px] text-ink">
              You're upgraded. It may take a few seconds for the new plan to appear here while we
              confirm the payment.
            </div>
          )}

          {/* Current plan card */}
          <article className="mt-8 rounded-2xl border border-line/10 bg-surface p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Current plan
                </div>
                <h2 className="mt-1 font-display text-h2 font-semibold text-ink">
                  {plan?.plan_name ?? "Free"}
                </h2>
                {sub ? (
                  <p className="mt-1 text-[13px] text-muted">
                    {sub.cancel_at_period_end
                      ? `Cancels on ${formatDate(sub.current_period_end)}`
                      : `Renews on ${formatDate(sub.current_period_end)}`}
                    {" · "}
                    Status: <span className="text-ink">{sub.status}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[13px] text-muted">
                    You're on the free plan. Upgrade any time.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {sub ? (
                  <form
                    action={async () => {
                      "use server";
                      await openCustomerPortal();
                    }}
                  >
                    <Button type="submit" variant="outline">
                      <ExternalLink className="size-4" />
                      Manage in portal
                    </Button>
                  </form>
                ) : (
                  <Button asChild>
                    <Link href="/pricing">View plans</Link>
                  </Button>
                )}
              </div>
            </div>

            {sub?.latest_invoice_id && (
              <div className="mt-5 border-t border-line/10 pt-5 text-[12.5px] text-muted">
                Latest invoice:{" "}
                <code className="rounded bg-warm px-1.5 py-0.5 text-[11.5px] text-ink">
                  {sub.latest_invoice_id}
                </code>{" "}
                — full receipt available from the portal.
              </div>
            )}
          </article>

          {/* Help block */}
          <article className="mt-6 rounded-2xl border border-line/10 bg-surface p-6">
            <h3 className="font-display text-[16px] font-semibold text-ink">Need help?</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Billing questions are handled by our team — VAT, refunds, or upgrading mid-cycle.
              Email{" "}
              <a
                href="mailto:support@threadmuse.com"
                className="text-ink underline-offset-4 hover:underline"
              >
                support@threadmuse.com
              </a>{" "}
              and we'll get back the same day.
            </p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
