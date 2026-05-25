import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact SeusyTV - IPTV trial, setup and reseller support",
  description:
    "Contact SeusyTV for Canada and UK IPTV trial activation, setup support, pricing questions, reseller applications, and device troubleshooting.",
  path: "/contact",
  keywords: ["IPTV contact", "IPTV support Canada", "IPTV support UK", "IPTV reseller contact"],
});

const reasons = [
  "Request a 24h free trial",
  "Get setup help for Fire Stick, Smart TV, Android, or Apple devices",
  "Ask about Canada and UK channel categories",
  "Apply for reseller access and credit packages",
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="relative px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--accent)/0.25),transparent_32%)]" />
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              <Sparkles className="size-3.5" />
              Premium IPTV support
            </div>
            <h1 className="mt-5 font-display text-display-lg font-semibold text-ink">
              Contact the SeusyTV team for trial, setup, or reseller help.
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-8 text-muted">
              A real premium IPTV brand needs a clear support destination. Use this page
              for trial requests, device questions, reseller applications, and activation help.
            </p>
          </div>
          <div className="rounded-[2rem] border border-line/10 bg-surface p-6 shadow-lift">
            <Mail className="size-9 text-accent" />
            <h2 className="mt-4 text-2xl font-semibold text-ink">Email support</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Send your device, country, preferred plan, and the type of help you need.
            </p>
            <Button asChild className="mt-6 w-full" size="lg" pill>
              <Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-2">
          {reasons.map((reason) => (
            <div key={reason} className="flex items-start gap-3 rounded-2xl border border-line/10 bg-surface p-5">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
              <span className="text-sm font-semibold leading-7 text-ink">{reason}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 text-center sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[960px] rounded-[2rem] border border-accent/30 bg-accent/10 p-8">
          <ShieldCheck className="mx-auto size-9 text-accent" />
          <h2 className="mt-4 font-display text-display font-semibold text-ink">
            Trial-first support for Canada and UK viewers.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-muted">
            Include your device and internet speed so the team can guide you to the best setup path.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" pill>
              <Link href="/free-trial">Start trial flow</Link>
            </Button>
            <Button asChild size="lg" variant="outline" pill>
              <Link href="/tutorial">Open setup guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
