import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Eye, Heart, Bookmark, Users } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Sparkline } from "@/components/dashboard/sparkline";
import { Button } from "@/components/ui/button";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { getDashboardSummary } from "@/lib/queries/dashboard";
import { getCurrentUserWithProfile } from "@/lib/auth/get-session";
import { getMyEntitlements } from "@/lib/auth/require-plan";
import { formatCount, formatNumber } from "@/lib/format";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Creator dashboard",
  description: "Your views, saves, likes, and top posts.",
  path: "/dashboard",
  noIndex: true,
});

/**
 * /dashboard — protected by middleware. Server component: pulls a single
 * summary blob and renders cards + a 14-day chart. No client JS needed.
 */
export default async function DashboardPage() {
  const session = await getCurrentUserWithProfile();
  // Middleware should have redirected an unauthenticated visitor; this is a
  // defensive null-check so static analysis is happy.
  if (!session) {
    return (
      <PageShell showMobileSearch={false}>
        <section className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="text-[14px] text-muted">Sign in to see your dashboard.</p>
          <Button asChild className="mt-4">
            <Link href="/login?redirect=/dashboard">Sign in</Link>
          </Button>
        </section>
      </PageShell>
    );
  }

  const [summary, entitlements] = await Promise.all([
    getDashboardSummary(session.user.id),
    getMyEntitlements(),
  ]);
  const onFreePlan = entitlements?.plan.id === "free";

  return (
    <PageShell showMobileSearch={false}>
      <section className="bg-bg px-4 pt-7 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Welcome back
              </div>
              <h1 className="mt-1 font-display text-display font-semibold tracking-tight text-ink">
                {session.profile.name}
              </h1>
              <p className="mt-1 text-[14px] text-muted">
                Last 14 days across your published designs.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/profile/${session.profile.username}`}>
                  View profile
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild>
                <Link href="/upload">Upload</Link>
              </Button>
            </div>
          </div>

          {/* Metric tiles */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricTile
              label="Published"
              value={formatNumber(summary.totals.publishedPosts)}
              icon={<BarChart3 className="size-4" />}
            />
            <MetricTile
              label="Views"
              value={formatCount(summary.totals.views)}
              icon={<Eye className="size-4" />}
            />
            <MetricTile
              label="Likes"
              value={formatCount(summary.totals.likes)}
              icon={<Heart className="size-4" />}
            />
            <MetricTile
              label="Saves"
              value={formatCount(summary.totals.saves)}
              icon={<Bookmark className="size-4" />}
            />
            <MetricTile
              label="Followers"
              value={formatCount(summary.totals.followers)}
              icon={<Users className="size-4" />}
            />
          </div>

          {/* Views chart */}
          <div className="mt-8">
            <Sparkline data={summary.viewsByDay} label="Views · last 14 days" />
          </div>

          {/* Top posts */}
          <div className="mt-8">
            <h2 className="font-display text-[18px] font-semibold text-ink">Top posts</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-line/10 bg-surface">
              {summary.topPosts.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-muted">
                  No published posts yet.{" "}
                  <Link href="/upload" className="text-ink underline-offset-4 hover:underline">
                    Upload your first design →
                  </Link>
                </div>
              ) : (
                <table className="w-full text-[13px]">
                  <thead className="bg-warm/60 text-[11px] uppercase tracking-[0.08em] text-muted">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold">Post</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Views</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Likes</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Saves</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.topPosts.map((p) => (
                      <tr key={p.id} className="border-t border-line/10">
                        <td className="px-4 py-3 text-ink">
                          <Link
                            href={`/post/${p.slug}`}
                            className="hover:underline underline-offset-4"
                          >
                            {p.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink">
                          {formatNumber(p.views)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink">
                          {formatNumber(p.likes_count)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink">
                          {formatNumber(p.saves_count)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Upgrade nudge — only for free-plan users. Past_due / canceled
              cases are surfaced by the global SubscriptionBanner in PageShell. */}
          {onFreePlan && (
            <div className="mt-8 mb-10">
              <UpgradePrompt
                title="Want priority discovery?"
                description="Pro accounts get featured slots, advanced analytics, and AI tagging credits."
                currentPlan={entitlements?.plan.name ?? "Free"}
              />
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function MetricTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line/10 bg-surface p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-display text-[24px] font-semibold tracking-tight text-ink tabular-nums">
        {value}
      </div>
    </div>
  );
}
