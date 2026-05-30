import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, Bot, Check, Gauge, Lock, Sparkles, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ContactForm } from "@/components/marketing/contact-form";
import {
  benefits,
  faqs,
  features,
  heroStats,
  partnerLogos,
  testimonials,
} from "@/lib/saas-content";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

const iconMap = [Bot, Workflow, BarChart3, Lock];

function DashboardPreview() {
  return (
    <div className="relative rounded-[2rem] border border-line/10 bg-surface p-3 shadow-lift">
      <div className="rounded-[1.5rem] border border-line/10 bg-bg p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Command center</p>
            <h3 className="mt-1 font-display text-xl font-semibold">AI revenue operations</h3>
          </div>
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            Live
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {["Pipeline AI", "SEO CMS", "Lead scoring"].map((label, index) => (
            <div key={label} className="rounded-2xl border border-line/10 bg-surface p-4">
              <div className="mb-5 h-2 rounded-full bg-line/10">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: `${64 + index * 12}%` }}
                />
              </div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-1 text-xs text-muted">{index === 0 ? "84%" : index === 1 ? "42 pages" : "1,248 leads"}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-line/10 bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Automation throughput</p>
              <Gauge className="size-4 text-accent" />
            </div>
            <div className="mt-6 flex h-32 items-end gap-2">
              {[38, 54, 48, 72, 64, 86, 92, 78, 96, 88].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-accent to-accent-2 opacity-80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line/10 bg-surface p-4">
            <p className="text-sm font-semibold">Admin tasks</p>
            <div className="mt-4 space-y-3">
              {["Publish pricing update", "Review 18 contact messages", "Approve hero image"].map((task) => (
                <div key={task} className="flex items-center gap-3 rounded-xl bg-bg p-3 text-xs text-muted">
                  <BadgeCheck className="size-4 text-accent" />
                  {task}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <MarketingPageShell>
      <section className="premium-grid relative overflow-hidden">
        <div className="absolute left-1/2 top-0 size-[620px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
        <div className="container relative grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1fr_0.92fr] lg:py-28">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Sparkles className="size-4" />
              Premium AI SaaS website + full admin CMS
            </div>
            <h1 className="mt-8 max-w-5xl font-display text-[clamp(3rem,8vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              A luxury SaaS presence with an AI-powered admin engine.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
              Launch a Stripe-level dark website with red-brand energy, conversion-focused pages,
              Supabase CMS, image uploads, secure admins, SEO controls, analytics, and editable content.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">
                  Book strategy call <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/admin/login">View admin portal</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line/10 bg-surface/70 p-4 backdrop-blur">
                  <dt className="text-xs text-muted">{stat.label}</dt>
                  <dd className="mt-2 font-display text-2xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section className="overflow-hidden border-y border-line/10 bg-surface/40 py-5">
        <div className="flex animate-marquee gap-4 whitespace-nowrap">
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <span
              key={`${logo}-${index}`}
              className="rounded-full border border-line/10 bg-bg px-8 py-3 text-xs font-semibold tracking-[0.22em] text-muted"
            >
              {logo}
            </span>
          ))}
        </div>
      </section>

      <section className="container py-20 md:py-28" id="features">
        <SectionHeading
          eyebrow="Platform"
          title="Everything a premium SaaS brand needs to launch, manage, and grow."
          description="The public website and protected admin system are designed together, so your content model, conversion strategy, and database security stay aligned."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = iconMap[index] ?? Sparkles;
            return (
              <article key={feature.title} className="group rounded-3xl border border-line/10 bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift">
                <Icon className="size-8 text-accent" />
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{feature.eyebrow}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-surface/45 py-20 md:py-28" id="benefits">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Benefits"
            title="High-conversion marketing plus back-office control."
            description="NoirEdge is structured for teams that need a premium front-end and a real CMS, not a static template."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex gap-3 rounded-2xl border border-line/10 bg-bg p-4">
                <Check className="mt-0.5 size-5 shrink-0 text-accent" />
                <p className="text-sm leading-6 text-muted">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28" id="testimonials">
        <SectionHeading
          eyebrow="Proof"
          title="Trusted by operators building category-leading AI companies."
          align="center"
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="rounded-3xl border border-line/10 bg-surface p-6">
              <blockquote className="text-base leading-7 text-ink">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-6 border-t border-line/10 pt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-surface/45 py-20 md:py-28" id="faq">
        <div className="container">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions buyers and admins ask before launch."
            align="center"
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-line/10 rounded-3xl border border-line/10 bg-bg">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="cursor-pointer list-none font-display text-lg font-semibold">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28" id="contact">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Call to action"
              title="Ready for a SaaS site that feels expensive and works hard?"
              description="Tell us what you want to launch. The contact form stores every inquiry in Supabase for admin review and follow-up."
            />
            <div className="mt-8 rounded-3xl border border-accent/20 bg-accent/10 p-6">
              <p className="text-sm font-semibold text-accent">Deployment ready foundation</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Next.js App Router, Tailwind design system, Supabase schema, RLS policies, CMS admin screens,
                SEO metadata, responsive layouts, and fast CSS-first motion.
              </p>
            </div>
          </div>
          <ContactForm redirectTo="/" />
        </div>
      </section>
    </MarketingPageShell>
  );
}
