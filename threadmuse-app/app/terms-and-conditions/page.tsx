import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "Terms and conditions for NoirEdge website, SaaS services, CMS access, and admin use.",
  path: "/terms-and-conditions",
});

const sections = [
  ["Use of service", "You agree to use NoirEdge lawfully, protect credentials, and avoid actions that disrupt the website, CMS, Supabase project, or connected integrations."],
  ["Admin responsibilities", "Administrators are responsible for content accuracy, media rights, user invitations, role assignments, and complying with privacy requirements."],
  ["Intellectual property", "NoirEdge brand materials, templates, components, and documentation remain protected unless explicitly transferred in a written agreement."],
  ["Limitations", "The service is provided with reasonable care, but we are not liable for indirect, incidental, or consequential damages to the maximum extent allowed by law."],
];

export default function TermsPage() {
  return (
    <MarketingPageShell>
      <section className="container max-w-4xl py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Legal</p>
        <h1 className="mt-3 font-display text-display font-semibold">Terms & Conditions</h1>
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
