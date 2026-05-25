import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgePercent, CheckCircle2, CircleDollarSign, Headphones, ShieldCheck, Users, Zap } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "IPTV reseller program - premium panel, margins and support",
  description:
    "Start an IPTV reseller business with SeusyTV. Get a premium IPTV panel, scalable credits, setup help, reseller support, and high-converting sales assets.",
  path: "/reseller",
  keywords: ["IPTV reseller", "IPTV reseller panel", "sell IPTV", "IPTV business"],
});

const benefits = [
  {
    icon: CircleDollarSign,
    title: "Margin-first packages",
    text: "Clear reseller tiers help you price trials, monthly lines, and long-term offers with room for profit.",
  },
  {
    icon: Users,
    title: "Customer-ready positioning",
    text: "Premium wording, plan structure, and onboarding flow make it easier to convert customers without sounding generic.",
  },
  {
    icon: Headphones,
    title: "Reseller support",
    text: "Guidance for activation, app setup, troubleshooting, and customer questions keeps your operation moving.",
  },
  {
    icon: ShieldCheck,
    title: "Stable premium lines",
    text: "Sell a service built around reliability, device coverage, and buyer confidence instead of cheap template claims.",
  },
];

const tiers = [
  { name: "Launch", credits: "25 credits", bestFor: "Testing the market", highlight: false },
  { name: "Growth", credits: "100 credits", bestFor: "Small agencies", highlight: true },
  { name: "Scale", credits: "Custom credits", bestFor: "High-volume sellers", highlight: false },
];

const process = [
  "Apply with your target market and expected volume.",
  "Receive reseller pricing, panel access, and setup guidance.",
  "Create trials and paid lines for your customers.",
  "Scale with long-term subscriptions and support workflows.",
];

export default function ResellerPage() {
  return (
    <MarketingShell>
      <section className="relative px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,hsl(var(--accent)/0.24),transparent_30%)]" />
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              <BadgePercent className="size-3.5" />
              IPTV reseller program
            </div>
            <h1 className="mt-5 font-display text-display-lg font-semibold text-ink">
              Launch a premium IPTV reseller business with stronger trust and cleaner sales flow.
            </h1>
            <p className="mt-5 max-w-3xl text-[16px] leading-8 text-muted">
              The reseller page now speaks directly to entrepreneurs: margin potential,
              panel access, activation workflow, and support. It removes vague copy and
              creates a clearer application path.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" pill>
                <Link href="https://wa.me/15551234567" target="_blank" rel="noreferrer">
                  Apply on WhatsApp
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" pill>
                <Link href="/pricing">View retail plans</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-line/10 bg-surface p-6 shadow-lift">
            <div className="rounded-3xl bg-gradient-to-br from-accent/25 to-bg p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Reseller snapshot</p>
              <div className="mt-6 grid gap-4">
                {[
                  ["Credits", "Flexible volume"],
                  ["Activation", "Panel assisted"],
                  ["Support", "24/7 guidance"],
                  ["Devices", "All major IPTV apps"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-line/10 bg-bg/65 p-4">
                    <span className="text-sm text-muted">{label}</span>
                    <span className="text-sm font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Why resellers choose SeusyTV</p>
            <h2 className="mt-3 font-display text-display font-semibold text-ink">
              A reseller page should sell confidence, not just cheap credits.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-line/10 bg-surface p-6">
                <Icon className="size-7 text-accent" />
                <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`rounded-3xl border p-6 ${
                tier.highlight ? "border-accent bg-accent/10 shadow-lift" : "border-line/10 bg-surface"
              }`}
            >
              <h2 className="text-2xl font-semibold text-ink">{tier.name}</h2>
              <p className="mt-2 text-sm text-muted">{tier.bestFor}</p>
              <p className="mt-6 font-display text-4xl font-semibold text-ink">{tier.credits}</p>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {["Panel access", "Trial creation", "Activation support", "Device setup guides"].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7 w-full" variant={tier.highlight ? "primary" : "outline"} pill>
                <Link href="https://wa.me/15551234567" target="_blank" rel="noreferrer">Request tier details</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section id="terms" className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 rounded-[2rem] border border-line/10 bg-surface p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">How it works</p>
            <h2 className="mt-3 font-display text-display font-semibold text-ink">
              A cleaner reseller onboarding path.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {process.map((step, index) => (
              <div key={step} className="rounded-2xl border border-line/10 bg-warm p-5">
                <div className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-semibold leading-7 text-ink">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 text-center sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[960px] rounded-[2rem] border border-accent/30 bg-accent/10 p-8">
          <Zap className="mx-auto size-9 text-accent" />
          <h2 className="mt-4 font-display text-display font-semibold text-ink">
            Ready to sell IPTV with a premium brand experience?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-muted">
            Contact support with your country, expected volume, and target devices to receive reseller details.
          </p>
          <Button asChild className="mt-7" size="lg" pill>
            <Link href="https://wa.me/15551234567" target="_blank" rel="noreferrer">Start reseller application</Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
}
