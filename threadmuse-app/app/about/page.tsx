import type { Metadata } from "next";
import { Award, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "About NoirEdge",
  description: "Learn about the premium AI SaaS studio behind NoirEdge.",
  path: "/about",
});

const values = [
  { icon: Sparkles, title: "Luxury-grade craft", text: "Every interface is shaped for clarity, trust, motion, and conversion." },
  { icon: ShieldCheck, title: "Security by default", text: "Supabase Auth, RLS, role checks, and admin-only policies protect sensitive operations." },
  { icon: Compass, title: "Operator-first systems", text: "The CMS reflects how growth, content, analytics, and support teams actually work." },
  { icon: Award, title: "Performance culture", text: "Fast-loading pages, semantic SEO, and focused UX keep the product feeling premium." },
];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="About"
          title="We build SaaS brands that look premium and operate like mature platforms."
          description="NoirEdge combines conversion strategy, AI operations, content systems, analytics, and secure admin tooling in one launch-ready foundation."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {values.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-line/10 bg-surface p-6">
              <Icon className="size-7 text-accent" />
              <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-line/10 bg-surface/45 py-20">
        <div className="container grid gap-10 lg:grid-cols-3">
          {[
            ["01", "Strategy", "Positioning, conversion architecture, CMS modeling, and SEO intent."],
            ["02", "Build", "Next.js pages, Tailwind components, Supabase schema, admin access, and uploads."],
            ["03", "Operate", "Analytics, message review, user management, content updates, and growth iteration."],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-3xl border border-line/10 bg-bg p-6">
              <p className="font-display text-5xl font-semibold text-accent">{step}</p>
              <h3 className="mt-6 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
