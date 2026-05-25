import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Crown,
  Flame,
  Globe2,
  Headphones,
  MonitorSmartphone,
  PlayCircle,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { MobileTopBar, MobileSearchTrigger, MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} - Premium IPTV for Canada and UK`,
  description:
    "Premium IPTV for Canada and the UK with 4K live TV, sports, movies, VOD, 24h trial, reseller options, and setup support for every device.",
  path: "/",
  keywords: [
    "best IPTV Canada",
    "best IPTV UK",
    "IPTV Canada free trial",
    "IPTV UK subscription",
    "4K IPTV sports",
    "IPTV reseller Canada",
  ],
});

const stats = [
  { value: "40K+", label: "live channels" },
  { value: "180K+", label: "VOD titles" },
  { value: "4K/FHD", label: "stream quality" },
  { value: "24h", label: "trial access" },
];

const devices = ["Fire Stick", "Android TV", "Smart TV", "Apple TV", "iPhone & iPad", "Windows & Mac", "MAG Box", "IPTV Smarters"];

const benefits = [
  { icon: Zap, title: "Instant activation", text: "Trial and paid access are positioned around speed, clarity, and a guided setup flow." },
  { icon: ShieldCheck, title: "Anti-freeze stability", text: "Premium routing, clear internet guidance, and device setup tips reduce buffering anxiety." },
  { icon: Globe2, title: "Canada + UK coverage", text: "Sports, news, kids, movies, Punjabi, Arabic, French, UK, US, and Canadian channel categories." },
  { icon: Headphones, title: "Human support", text: "Support is visible across the funnel so buyers feel safe before they start a trial." },
];

const plans = [
  { name: "1 Month", price: "CAD $15", note: "Trial-to-paid starter", highlight: false },
  { name: "3 Months", price: "CAD $35", note: "Flexible seasonal viewing", highlight: false },
  { name: "6 Months", price: "CAD $55", note: "Better monthly value", highlight: false },
  { name: "12 Months", price: "CAD $85", note: "Most popular", highlight: true },
];

const testimonials = [
  {
    name: "Marcus T.",
    market: "Toronto, CA",
    quote: "Sports nights finally feel reliable. The Fire Stick setup was quick and the interface feels premium.",
  },
  {
    name: "Amelia R.",
    market: "Manchester, UK",
    quote: "I tested the trial first, then moved to yearly. Channels, movies, and support all felt much better than generic IPTV sites.",
  },
  {
    name: "Nadia K.",
    market: "Vancouver, CA",
    quote: "The device guide made setup simple on my Smart TV. Clear pricing and the trial made the decision easy.",
  },
];

const faqs = [
  {
    question: "Can I test the IPTV service first?",
    answer: "Yes. The site is built around a 24h trial flow so Canada and UK viewers can test device compatibility, sports, VOD, and stream quality before choosing a plan.",
  },
  {
    question: "Which devices are supported?",
    answer: "Fire Stick, Android TV, Smart TV, Apple TV, iOS, Android phones, Windows, Mac, MAG, M3U, and Xtream Codes compatible apps are supported.",
  },
  {
    question: "What speed is recommended for 4K IPTV?",
    answer: "Use at least 25 Mbps for HD and 50 Mbps or higher for the smoothest FHD and 4K experience, preferably with strong 5 GHz Wi-Fi or Ethernet.",
  },
  {
    question: "Do you support resellers?",
    answer: "Yes. The reseller funnel includes credit packages, customer-ready positioning, activation support, and a cleaner application path.",
  },
];

const guides = [
  { title: "Best IPTV setup for Fire Stick", href: "/tutorial#fire-stick" },
  { title: "Canada vs UK IPTV channel checklist", href: "/blog" },
  { title: "How to test IPTV before buying", href: "/free-trial" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MobileTopBar />
      <MobileSearchTrigger />

      <main id="main" className="overflow-hidden pb-24 md:pb-12">
        <section className="relative px-4 py-12 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,hsl(var(--accent)/0.36),transparent_30%),radial-gradient(circle_at_86%_6%,hsl(var(--accent-2)/0.2),transparent_25%)]" />
          <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                <Crown className="size-3.5" />
                Canada + UK premium IPTV
              </div>
              <h1 className="mt-6 max-w-5xl font-display text-display-lg font-semibold text-ink">
                Premium IPTV streaming with a cleaner, faster, high-end TV experience.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-8 text-muted lg:text-[18px]">
                Stream live sports, UK and Canadian channels, movies, series, and global TV
                in a luxury red/black interface designed to convert trial users into loyal subscribers.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" pill>
                  <Link href="/free-trial">
                    Start 24h free trial
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" pill>
                  <Link href="/pricing">View premium plans</Link>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-line/10 bg-surface/70 p-4 shadow-soft backdrop-blur">
                    <div className="text-2xl font-bold text-ink">{stat.value}</div>
                    <div className="mt-1 text-[12px] text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/20 blur-3xl" />
              <div className="relative rounded-[2rem] border border-line/10 bg-surface/80 p-4 shadow-lift backdrop-blur">
                <div className="overflow-hidden rounded-[1.5rem] border border-line/10 bg-black">
                  <div className="flex items-center gap-2 border-b border-line/10 px-4 py-3">
                    <span className="size-3 rounded-full bg-accent" />
                    <span className="size-3 rounded-full bg-accent-2" />
                    <span className="size-3 rounded-full bg-line/30" />
                    <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      SeusyTV Command Center
                    </span>
                  </div>
                  <div className="grid gap-3 p-4 sm:grid-cols-[1.2fr_0.8fr]">
                    <div className="flex min-h-[320px] flex-col justify-between rounded-2xl bg-[linear-gradient(135deg,hsl(var(--accent)/0.88),hsl(0_0%_0%/0.72)),radial-gradient(circle_at_72%_28%,hsl(var(--accent-2)/0.9),transparent_28%)] p-6">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-[12px] font-semibold text-white">
                        <PlayCircle className="size-4" />
                        LIVE SPORT 4K
                      </div>
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.2em] text-white/70">Tonight on SeusyTV</p>
                        <h2 className="mt-2 font-display text-4xl font-semibold text-white">
                          Premier matches, films, and global TV without cable friction.
                        </h2>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {["Canada", "United Kingdom", "VOD Library"].map((label, index) => (
                        <div key={label} className="rounded-2xl border border-line/10 bg-warm p-4 transition hover:-translate-y-1 hover:border-accent/40">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-ink">{label}</span>
                            <BadgeCheck className="size-4 text-accent" />
                          </div>
                          <div className="mt-4 h-2 rounded-full bg-line/10">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-accent to-accent-2"
                              style={{ width: `${78 + index * 7}%` }}
                            />
                          </div>
                          <p className="mt-3 text-[12px] text-muted">Optimized stream route active</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line/10 bg-surface/45 px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-[13px] font-semibold text-muted">
            <span className="text-accent">Built for Canada + UK viewers</span>
            <span>24h trial before paying</span>
            <span>All devices supported</span>
            <span>Sports, films, news, kids, international</span>
            <span>Secure checkout-ready funnel</span>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Compatible with</p>
                <h2 className="mt-3 font-display text-display font-semibold text-ink">
                  Universal device access, presented like a premium SaaS product.
                </h2>
              </div>
              <Button asChild variant="outline" pill>
                <Link href="/tutorial">Open setup guides</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {devices.map((device) => (
                <div key={device} className="rounded-2xl border border-line/10 bg-surface p-4 text-sm font-semibold text-ink transition hover:-translate-y-1 hover:border-accent/40 hover:bg-accent/10">
                  <MonitorSmartphone className="mb-3 size-5 text-accent" />
                  {device}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto grid max-w-[1440px] gap-8 rounded-[2rem] border border-line/10 bg-surface/80 p-6 shadow-lift backdrop-blur lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">How it works</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                Start watching in three frictionless steps.
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                The funnel is built to reduce hesitation: trial first, guided setup second,
                then a clear premium plan when the stream quality is proven.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["01", "Start trial", "Choose your device and market."],
                ["02", "Set up", "Use guided app instructions."],
                ["03", "Upgrade", "Pick the plan after testing."],
              ].map(([num, title, text]) => (
                <div key={title} className="rounded-3xl border border-line/10 bg-bg/60 p-6">
                  <div className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">{num}</div>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Premium plans</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                Modern pricing cards built for trial-to-paid conversion.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative rounded-3xl border p-6 shadow-soft transition hover:-translate-y-1 ${
                    plan.highlight ? "border-accent bg-gradient-to-b from-accent/25 to-surface shadow-lift" : "border-line/10 bg-surface"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                      Best value
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted">{plan.note}</p>
                  <div className="mt-5 font-display text-4xl font-semibold text-ink">{plan.price}</div>
                  <ul className="mt-5 space-y-3 text-sm text-muted">
                    {["1 active connection", "4K/FHD/HD quality", "Canada + UK categories"].map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 w-full" variant={plan.highlight ? "primary" : "outline"} pill>
                    <Link href="/free-trial">Test this plan</Link>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Premium trust layer</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                Testimonials that feel modern, local, and credible.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
                  <div className="flex gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-[15px] leading-8 text-ink">"{testimonial.quote}"</blockquote>
                  <figcaption className="mt-5 text-sm text-muted">
                    <span className="font-semibold text-ink">{testimonial.name}</span> - {testimonial.market}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-line/10 bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent/40">
                <Icon className="size-7 text-accent" />
                <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto grid max-w-[1440px] gap-8 rounded-[2rem] border border-line/10 bg-[linear-gradient(135deg,hsl(var(--accent)/0.18),hsl(var(--surface))_45%,hsl(var(--accent-2)/0.12))] p-6 shadow-lift lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Guides and device SEO</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                Blog-style guide structure for search and support.
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Device and market guides help Canada and UK buyers find answers before
                contacting support, improving SEO and conversion quality.
              </p>
            </div>
            <div className="grid gap-3">
              {guides.map((guide) => (
                <Link key={guide.title} href={guide.href} className="group flex items-center justify-between rounded-2xl border border-line/10 bg-bg/55 p-5 transition hover:border-accent/40 hover:bg-accent/10">
                  <span className="font-semibold text-ink">{guide.title}</span>
                  <ArrowRight className="size-4 text-accent transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1024px]">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">FAQ</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                Questions buyers ask before starting a trial.
              </h2>
            </div>
            <div className="mt-8 grid gap-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-line/10 bg-surface p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
                    {faq.question}
                    <span className="text-accent group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1180px] rounded-[2rem] border border-accent/30 bg-accent/10 p-8 text-center shadow-lift">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-white">
              <Flame className="size-7" />
            </div>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-display font-semibold text-ink">
              Test the premium stream before choosing your plan.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-muted">
              Built for Canada and UK audiences who want sports, films, channels, and support without a generic IPTV experience.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" pill>
                <Link href="/free-trial">Start 24h free trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" pill>
                <Link href="/reseller">Explore reseller program</Link>
              </Button>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              email: siteConfig.email,
              areaServed: ["CA", "GB"],
              description: siteConfig.description,
            }),
          }}
        />
      </main>

      <Footer />
      <MobileNav />
    </>
  );
}
