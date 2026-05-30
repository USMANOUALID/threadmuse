import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund Policy",
  description: "NoirEdge refund policy for SaaS subscriptions and premium implementation services.",
  path: "/refund-policy",
});

const sections = [
  ["Subscriptions", "Monthly SaaS subscriptions may be cancelled before renewal. Access remains available through the paid billing period unless otherwise stated."],
  ["Implementation work", "Custom implementation fees cover strategy, design, development, CMS setup, schema work, and delivery milestones. Refund eligibility is defined by the signed scope."],
  ["Duplicate charges", "Verified duplicate payments or billing errors are refunded to the original payment method after review."],
  ["How to request", "Email hello@noiredge.ai with account details, invoice ID, and a short explanation so the admin team can review the request."],
];

export default function RefundPolicyPage() {
  return (
    <MarketingPageShell>
      <section className="container max-w-4xl py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Legal</p>
        <h1 className="mt-3 font-display text-display font-semibold">Refund Policy</h1>
        <p className="mt-4 text-sm leading-6 text-muted">Last updated May 30, 2026.</p>
        <div className="mt-10 space-y-5">
          {sections.map(([title, text]) => (
            <section key={title} className="rounded-3xl border border-line/10 bg-surface p-6">
              <h2 className="font-display text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
            </section>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
