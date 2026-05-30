import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";
import { pricingPlans } from "@/lib/saas-content";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Premium SaaS website, admin CMS, AI automation, and analytics pricing for high-growth teams.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Pricing"
          title="Premium plans for teams that want a serious SaaS presence."
          description="Start with a conversion website and CMS, then add deeper AI operations, analytics, and enterprise governance."
          align="center"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-3xl border p-6 ${
                plan.featured
                  ? "border-accent bg-accent/10 shadow-lift"
                  : "border-line/10 bg-surface"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-muted">{plan.description}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-5xl font-semibold">{plan.price}</span>
                <span className="pb-2 text-sm text-muted">{plan.cadence}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted">
                    <Check className="size-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full" variant={plan.featured ? "primary" : "outline"}>
                <Link href="/contact">{plan.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-line/10 bg-surface p-4 text-sm text-muted">
          <ShieldCheck className="size-5 text-accent" />
          All plans include Supabase-backed authentication, admin access controls, CMS tables, and deployment-ready SEO foundations.
        </div>
      </section>
    </MarketingPageShell>
  );
}
