import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, MonitorSmartphone, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "IPTV free trial - test channels, VOD and device setup",
  description:
    "Request a 24h SeusyTV IPTV free trial for Canada and UK viewers to test live channels, VOD, sports, 4K quality, and device compatibility.",
  path: "/free-trial",
  keywords: ["IPTV free trial", "free IPTV trial", "test IPTV", "IPTV trial Smart TV"],
});

const trialSteps = [
  "Tell us your device and country.",
  "Receive trial credentials and app guidance.",
  "Test live TV, sports, movies, and VOD quality.",
  "Choose the plan that fits your viewing needs.",
];

const formFields = [
  "Name",
  "Best contact email",
  "Email address",
  "Device type",
  "Country",
  "Preferred plan",
];

export default function FreeTrialPage() {
  return (
    <MarketingShell>
      <section className="relative px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_0%,hsl(var(--accent)/0.25),transparent_32%)]" />
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              <Sparkles className="size-3.5" />
              24h premium IPTV test
            </div>
            <h1 className="mt-5 font-display text-display-lg font-semibold text-ink">
              Test the Canada + UK IPTV experience before you buy.
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-8 text-muted">
              Trial-first conversion removes risk. Test your device, internet speed,
              sports channels, VOD quality, and setup flow before choosing a paid plan.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Clock3, label: "Fast activation" },
                { icon: MonitorSmartphone, label: "Device guidance" },
                { icon: ShieldCheck, label: "No-risk testing" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-line/10 bg-surface p-4">
                  <Icon className="size-6 text-accent" />
                  <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-line/10 bg-surface p-6 shadow-lift">
            <div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Trial request</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Request guided trial activation</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                This polished intake panel collects the exact details needed for a clean
                trial: device, market, contact email, and preferred plan.
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {formFields.map((field) => (
                <div key={field} className="rounded-2xl border border-line/10 bg-warm px-4 py-3">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{field}</span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-6 w-full" size="lg" pill>
              <Link href="/contact">
                Request trial access
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 rounded-[2rem] border border-line/10 bg-surface p-6 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Trial flow</p>
            <h2 className="mt-3 font-display text-display font-semibold text-ink">
              Make testing feel simple and safe.
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-muted">
              A trial should collect the exact details support needs: device, app, country,
              and contact channel. That prevents confusion and improves activation speed.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trialSteps.map((step, index) => (
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

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">What to test</p>
            <h2 className="mt-3 font-display text-display font-semibold text-ink">
              Trial checklist for better conversions.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Open the playlist on your exact device, not only a phone.",
              "Test sports or live events during busy viewing hours.",
              "Check VOD loading, subtitles, and audio language options.",
              "Confirm internet speed and app settings before judging quality.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-line/10 bg-surface p-5">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                <p className="text-sm font-medium leading-7 text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 text-center sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[960px] rounded-[2rem] border border-accent/30 bg-accent/10 p-8">
          <h2 className="font-display text-display font-semibold text-ink">
            Test first, then choose your plan.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-muted">
            If your device is ready, the pricing page gives you the simplest path to a paid subscription.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" pill>
              <Link href="/contact">Request trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" pill>
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
