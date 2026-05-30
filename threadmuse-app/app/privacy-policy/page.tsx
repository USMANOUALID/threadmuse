import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "NoirEdge privacy policy for website visitors, leads, newsletter subscribers, and admin users.",
  path: "/privacy-policy",
});

const sections = [
  ["Information we collect", "We collect contact form submissions, newsletter emails, authentication data, usage analytics, uploaded media metadata, and CMS activity required to operate the service."],
  ["How we use data", "We use information to respond to inquiries, provide admin access, improve website performance, secure the platform, personalize operations, and measure conversion activity."],
  ["Supabase storage", "Application data is modeled in Supabase tables with row-level security policies. Sensitive admin and contact data is restricted to authenticated administrators."],
  ["Your choices", "You may request access, correction, deletion, or unsubscribe actions by contacting hello@noiredge.ai."],
];

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell>
      <section className="container max-w-4xl py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Legal</p>
        <h1 className="mt-3 font-display text-display font-semibold">Privacy Policy</h1>
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
