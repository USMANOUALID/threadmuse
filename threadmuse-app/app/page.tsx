import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CirclePlay,
  Clock3,
  Globe2,
  Headphones,
  MonitorSmartphone,
  PlayCircle,
  ShieldCheck,
  Signal,
  Sparkles,
  Tv,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { MobileTopBar, MobileSearchTrigger, MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} - Premium IPTV subscription with 4K live TV`,
  description: siteConfig.description,
  path: "/",
  keywords: [
    "best IPTV subscription",
    "premium IPTV provider",
    "4K IPTV",
    "IPTV free trial",
    "IPTV reseller",
    "live sports IPTV",
  ],
});

const proofStats = [
  { value: "17,000+", label: "live channels" },
  { value: "100,000+", label: "movies and series" },
  { value: "4K/FHD", label: "stream quality" },
  { value: "24/7", label: "human support" },
];

const benefits = [
  {
    icon: Signal,
    title: "Low-buffer premium servers",
    text: "Optimized IPTV lines with stable routing for live sports, news, PPV, kids, movies, and international channels.",
  },
  {
    icon: MonitorSmartphone,
    title: "Works on every device",
    text: "Smart TV, Fire Stick, Android TV, iPhone, iPad, MAG, Enigma, VLC, Kodi, and IPTV Smarters compatible.",
  },
  {
    icon: Clock3,
    title: "Fast activation",
    text: "Start watching quickly after checkout or trial approval, with setup guidance included for your device.",
  },
  {
    icon: ShieldCheck,
    title: "7 day satisfaction guarantee",
    text: "A safer buying experience with friendly support if a device, app, or playlist needs help.",
  },
];

const featured = [
  "Premier sports and PPV",
  "US, UK, Canada, Latino and EU",
  "Kids, documentary and news",
  "Latest movies and full seasons",
  "EPG guide and catch-up where available",
  "Anti-freeze technology",
];

const plans = [
  { name: "1 Month", price: "EUR 9", note: "Best for testing", highlight: false },
  { name: "6 Months", price: "EUR 29", note: "Save 46%", highlight: false },
  { name: "12 Months", price: "EUR 45", note: "Most popular", highlight: true },
  { name: "24 Months", price: "EUR 65", note: "Best value", highlight: false },
];

const steps = [
  "Choose your plan or request a free trial.",
  "Tell us your device and preferred IPTV app.",
  "Receive your login credentials and setup guide.",
  "Start streaming live TV, movies, sports, and series.",
];

const faqs = [
  {
    question: "How fast do I receive my IPTV subscription?",
    answer:
      "Most orders are activated quickly after payment confirmation. Trial requests are reviewed and sent with setup instructions.",
  },
  {
    question: "What internet speed do I need?",
    answer:
      "We recommend at least 25 Mbps for HD and 50 Mbps or more for the smoothest FHD and 4K playback.",
  },
  {
    question: "Can I use the same plan on multiple devices?",
    answer:
      "A standard line supports one active connection. Reseller and multi-connection options are available for families and agencies.",
  },
  {
    question: "Do you help with setup?",
    answer:
      "Yes. The tutorial page covers the most popular devices and our support team can help you choose the right app.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MobileTopBar />
      <MobileSearchTrigger />

      <main id="main" className="overflow-hidden pb-24 md:pb-12">
        <section className="relative px-4 py-12 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--accent)/0.28),transparent_28%),radial-gradient(circle_at_80%_0%,hsl(var(--accent-2)/0.18),transparent_26%)]" />
          <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                <Sparkles className="size-3.5" />
                Premium IPTV subscription provider
              </div>
              <h1 className="mt-6 max-w-4xl font-display text-display-lg font-semibold text-ink">
                Stream live TV, sports, movies, and series in a premium 4K IPTV experience.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-8 text-muted lg:text-[18px]">
                Upgrade from the weak template experience to a polished entertainment hub:
                fast activation, 17,000+ global channels, 100,000+ VOD titles, premium
                support, and setup help for every screen.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" pill>
                  <Link href="/free-trial">
                    Start free trial
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" pill>
                  <Link href="/pricing">
                    View pricing
                    <CirclePlay className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {proofStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-line/10 bg-surface/70 p-4">
                    <div className="text-2xl font-bold text-ink">{stat.value}</div>
                    <div className="mt-1 text-[12px] text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-3xl" />
              <div className="relative rounded-[2rem] border border-line/10 bg-surface p-4 shadow-lift">
                <div className="overflow-hidden rounded-[1.5rem] border border-line/10 bg-black">
                  <div className="flex items-center gap-2 border-b border-line/10 px-4 py-3">
                    <span className="size-3 rounded-full bg-accent" />
                    <span className="size-3 rounded-full bg-accent-2" />
                    <span className="size-3 rounded-full bg-line/30" />
                    <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      SeusyTV Live
                    </span>
                  </div>
                  <div className="grid gap-3 p-4 sm:grid-cols-[1.2fr_0.8fr]">
                    <div className="flex min-h-[280px] flex-col justify-between rounded-2xl bg-[linear-gradient(135deg,hsl(var(--accent)/0.85),hsl(0_0%_0%/0.7)),radial-gradient(circle_at_70%_30%,hsl(var(--accent-2)/0.8),transparent_30%)] p-6">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-[12px] font-semibold text-white">
                        <PlayCircle className="size-4" />
                        LIVE SPORT 4K
                      </div>
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.2em] text-white/70">Now streaming</p>
                        <h2 className="mt-2 font-display text-4xl font-semibold text-white">
                          Match night without buffering.
                        </h2>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {["Movies", "Series", "News"].map((label, index) => (
                        <div key={label} className="rounded-2xl border border-line/10 bg-warm p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-ink">{label}</span>
                            <BadgeCheck className="size-4 text-accent" />
                          </div>
                          <div className="mt-4 h-2 rounded-full bg-line/10">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-accent to-accent-2"
                              style={{ width: `${72 + index * 8}%` }}
                            />
                          </div>
                          <p className="mt-3 text-[12px] text-muted">Ultra-fast CDN route active</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Why customers switch
              </p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                Built to feel like a premium streaming service, not a generic IPTV template.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto grid max-w-[1440px] gap-8 rounded-[2rem] border border-line/10 bg-surface p-6 shadow-lift lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Channel universe</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                All the TV your audience is already searching for.
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Position the service around clear outcomes: global live channels, premium VOD,
                sports coverage, stable playback, and support. These are stronger conversion
                drivers than vague claims like "best service".
              </p>
              <Button asChild className="mt-7" size="lg" pill>
                <Link href="/free-trial">Test compatibility</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {featured.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-line/10 bg-warm p-4">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium text-ink">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Simple pricing</p>
                <h2 className="mt-3 font-display text-display font-semibold text-ink">
                  Premium IPTV plans with clear value.
                </h2>
              </div>
              <Button asChild variant="outline" pill>
                <Link href="/pricing">Compare all plans</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative rounded-3xl border p-6 shadow-soft ${
                    plan.highlight
                      ? "border-accent bg-gradient-to-b from-accent/20 to-surface"
                      : "border-line/10 bg-surface"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                      Popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted">{plan.note}</p>
                  <div className="mt-5 font-display text-4xl font-semibold text-ink">{plan.price}</div>
                  <ul className="mt-5 space-y-3 text-sm text-muted">
                    <li className="flex gap-2"><CheckCircle2 className="size-4 text-accent" /> 1 active connection</li>
                    <li className="flex gap-2"><CheckCircle2 className="size-4 text-accent" /> All devices supported</li>
                    <li className="flex gap-2"><CheckCircle2 className="size-4 text-accent" /> 4K, FHD, HD and SD</li>
                  </ul>
                  <Button asChild className="mt-6 w-full" variant={plan.highlight ? "primary" : "outline"} pill>
                    <Link href="/free-trial">Start now</Link>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Setup flow</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                From order to watching in four clear steps.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
              {steps.map((step, index) => (
                <div key={step} className="rounded-3xl border border-line/10 bg-surface p-6">
                  <div className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {index + 1}
                  </div>
                  <p className="mt-5 text-lg font-semibold leading-7 text-ink">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1440px] rounded-[2rem] border border-line/10 bg-[linear-gradient(135deg,hsl(var(--accent)/0.18),hsl(var(--surface))_42%,hsl(var(--accent-2)/0.12))] p-6 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Trust and conversion</p>
                <h2 className="mt-3 font-display text-display font-semibold text-ink">
                  Make the buyer feel safe before they click.
                </h2>
                <p className="mt-4 text-[15px] leading-8 text-muted">
                  Clear guarantees, real support routes, device tutorials, and transparent plan
                  differences reduce friction and replace the "cheap template" feeling.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Headphones, title: "Live support", text: "WhatsApp and email help" },
                  { icon: Globe2, title: "Global library", text: "Channels from key regions" },
                  { icon: Zap, title: "Fast setup", text: "Guided activation flow" },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-line/10 bg-bg/55 p-5">
                    <Icon className="size-6 text-accent" />
                    <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                    <p className="mt-2 text-sm text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1024px]">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">FAQ</p>
              <h2 className="mt-3 font-display text-display font-semibold text-ink">
                Questions buyers need answered before purchasing.
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

        <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-[1180px] rounded-[2rem] border border-accent/30 bg-accent/10 p-8 text-center shadow-lift">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-white">
              <Tv className="size-7" />
            </div>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-display font-semibold text-ink">
              Ready to make your IPTV website feel premium?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-muted">
              Start with a free trial, confirm device compatibility, then choose the plan
              that matches your viewing needs.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" pill>
                <Link href="/free-trial">Request free trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" pill>
                <Link href="/reseller">Become a reseller</Link>
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
              sameAs: ["https://wa.me/15551234567"],
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
