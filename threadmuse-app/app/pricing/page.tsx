import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, HelpCircle, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "IPTV pricing plans - 4K live TV, movies and series",
  description:
    "Compare SeusyTV IPTV plans for 1 month, 6 months, 12 months, and 24 months with 17,000+ channels, 100,000+ VOD titles, support, and a 7 day guarantee.",
  path: "/pricing",
  keywords: ["IPTV pricing", "IPTV plans", "IPTV subscription price", "4K IPTV subscription"],
});

const plans = [
  {
    name: "1 Month",
    price: "EUR 9",
    badge: "Starter",
    description: "A simple way to test the full premium line.",
    highlight: false,
  },
  {
    name: "6 Months",
    price: "EUR 29",
    badge: "Smart save",
    description: "Lower monthly cost for steady viewing.",
    highlight: false,
  },
  {
    name: "12 Months",
    price: "EUR 45",
    badge: "Most popular",
    description: "Best balance of value, stability, and support.",
    highlight: true,
  },
  {
    name: "24 Months",
    price: "EUR 65",
    badge: "Best value",
    description: "Maximum savings for long-term viewers.",
    highlight: false,
  },
];

const included = [
  "17,000+ worldwide live channels",
  "100,000+ movies and series",
  "4K, FHD, HD and SD quality",
  "EPG guide where available",
  "All major IPTV apps supported",
  "Smart TV, Fire Stick, Android, iOS, MAG and PC",
  "Fast activation after confirmation",
  "24/7 WhatsApp and email support",
];

const faqs = [
  {
    question: "Which plan should I choose?",
    answer:
      "Choose 1 month if you are testing. Choose 12 months for the strongest balance of savings and flexibility, or 24 months for the lowest effective monthly cost.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes. The pricing experience now highlights a 7 day satisfaction guarantee so buyers feel safer before purchase.",
  },
  {
    question: "Can I upgrade to more connections?",
    answer:
      "Yes. Standard plans include one active connection. Contact support for multi-room, family, or reseller packages.",
  },
  {
    question: "Are all devices supported?",
    answer:
      "Yes. Smart TVs, Android boxes, Fire Stick, Apple devices, MAG, Kodi, VLC, and IPTV Smarters style apps are supported.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="relative px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--accent)/0.25),transparent_32%)]" />
        <div className="mx-auto max-w-[1180px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            <Sparkles className="size-3.5" />
            Transparent IPTV pricing
          </div>
          <h1 className="mt-5 font-display text-display-lg font-semibold text-ink">
            Pick a premium IPTV plan with confidence.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-muted">
            Clear pricing, visible guarantees, device support, and strong plan comparison
            remove purchase anxiety and make the offer feel premium.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1440px] gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-6 shadow-soft ${
                plan.highlight
                  ? "border-accent bg-gradient-to-b from-accent/20 to-surface shadow-lift"
                  : "border-line/10 bg-surface"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-ink">{plan.name}</h2>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
                  {plan.badge}
                </span>
              </div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-muted">{plan.description}</p>
              <div className="mt-6 font-display text-5xl font-semibold text-ink">{plan.price}</div>
              <p className="mt-2 text-sm text-muted">One active connection included</p>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {included.slice(0, 5).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7 w-full" variant={plan.highlight ? "primary" : "outline"} pill>
                <Link href="/free-trial">Start with this plan</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 rounded-[2rem] border border-line/10 bg-surface p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Every plan includes</p>
            <h2 className="mt-3 font-display text-display font-semibold text-ink">
              The complete premium IPTV experience.
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-muted">
              The previous section listed features without hierarchy. This version groups value,
              quality, device support, and buyer safety in a more scannable format.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {included.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl border border-line/10 bg-warm p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                <span className="text-sm font-medium text-ink">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "7 day guarantee", text: "A clear guarantee improves buyer trust and reduces checkout hesitation." },
            { icon: Zap, title: "Fast activation", text: "Activation and device setup are positioned as part of the product value." },
            { icon: Star, title: "Premium support", text: "Support is promoted as a trust asset, not hidden in a generic footer." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-line/10 bg-surface p-6">
              <Icon className="size-7 text-accent" />
              <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[960px]">
          <div className="text-center">
            <HelpCircle className="mx-auto size-8 text-accent" />
            <h2 className="mt-3 font-display text-display font-semibold text-ink">Pricing FAQ</h2>
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
    </MarketingShell>
  );
}
