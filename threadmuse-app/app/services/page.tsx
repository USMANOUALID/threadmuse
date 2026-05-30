import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";
import { services } from "@/lib/saas-content";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "Premium SaaS design, AI automation, CMS, SEO, and analytics services.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <MarketingPageShell>
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Services"
          title="A complete premium SaaS launch system, from brand surface to admin backend."
          description="Choose a focused engagement or combine services into a full AI-powered website and CMS platform."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="rounded-3xl border border-line/10 bg-surface p-6 transition hover:border-accent/50 hover:shadow-lift">
              <h2 className="font-display text-2xl font-semibold">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{service.description}</p>
              <ul className="mt-6 grid gap-3">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-center gap-3 text-sm text-muted">
                    <CheckCircle2 className="size-4 text-accent" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-3xl border border-accent/20 bg-accent/10 p-8 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Need the full platform?</h2>
            <p className="mt-2 text-sm text-muted">We can combine every service into a deployment-ready SaaS website and dashboard.</p>
          </div>
          <Button asChild size="lg" className="mt-6 md:mt-0">
            <Link href="/contact">Request scope <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
    </MarketingPageShell>
  );
}
