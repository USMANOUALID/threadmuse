import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Download, Flame, MonitorSmartphone, Router, Settings, Smartphone, Tv } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "IPTV setup tutorial - Smart TV, Fire Stick, Android and iOS",
  description:
    "Follow SeusyTV IPTV setup tutorials for Smart TV, Fire Stick, Android TV, Apple devices, MAG, VLC, and IPTV Smarters style apps.",
  path: "/tutorial",
  keywords: ["IPTV tutorial", "IPTV setup", "IPTV Smarters setup", "Fire Stick IPTV", "Smart TV IPTV"],
});

const deviceGuides = [
  {
    id: "smart-tv",
    icon: Tv,
    title: "Smart TV",
    steps: ["Install a trusted IPTV player from your TV app store.", "Open the app and choose Xtream Codes or M3U login.", "Enter the credentials from SeusyTV support.", "Refresh channels and start streaming."],
  },
  {
    id: "fire-stick",
    icon: Flame,
    title: "Amazon Fire Stick",
    steps: ["Install Downloader from the app store.", "Install your chosen IPTV player.", "Add Xtream Codes credentials.", "Set EPG refresh and test playback."],
  },
  {
    id: "android",
    icon: Smartphone,
    title: "Android TV and phone",
    steps: ["Install IPTV Smarters style player.", "Select login with Xtream Codes API.", "Enter server, username, and password.", "Download live TV, movies, and series lists."],
  },
  {
    id: "apple",
    icon: MonitorSmartphone,
    title: "iPhone, iPad and Apple TV",
    steps: ["Install a compatible IPTV player.", "Add your M3U or Xtream login.", "Enable EPG where supported.", "Save favorites for faster browsing."],
  },
];

const optimization = [
  "Use wired Ethernet or a strong 5 GHz Wi-Fi signal for 4K streams.",
  "Restart your router and device if channels buffer unexpectedly.",
  "Keep only one active stream per standard subscription line.",
  "Try a different player if your device has audio, subtitle, or EPG issues.",
  "Contact support with a screenshot and device name for faster help.",
];

export default function TutorialPage() {
  return (
    <MarketingShell>
      <section className="relative px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--accent)/0.23),transparent_32%)]" />
        <div className="mx-auto max-w-[1180px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            <Settings className="size-3.5" />
            IPTV setup tutorial
          </div>
          <h1 className="mt-5 font-display text-display-lg font-semibold text-ink">
            Set up IPTV on Smart TV, Fire Stick, Android, iOS, and more.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-muted">
            A tutorial page improves SEO, reduces support tickets, and makes the service
            feel more professional. These device-specific guides replace vague setup copy
            with practical instructions.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" pill>
              <Link href="/free-trial">Request credentials</Link>
            </Button>
            <Button asChild size="lg" variant="outline" pill>
              <Link href="https://wa.me/15551234567" target="_blank" rel="noreferrer">Ask support</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-2">
          {deviceGuides.map(({ id, icon: Icon, title, steps }) => (
            <article id={id} key={id} className="rounded-3xl border border-line/10 bg-surface p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="size-6" />
                </div>
                <h2 className="text-2xl font-semibold text-ink">{title}</h2>
              </div>
              <ol className="mt-6 space-y-4">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-2xl border border-line/10 bg-warm p-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[12px] font-bold text-accent">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-7 text-ink">{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 rounded-[2rem] border border-line/10 bg-surface p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Playback checklist</p>
            <h2 className="mt-3 font-display text-display font-semibold text-ink">
              Improve stream quality before contacting support.
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-muted">
              These tips address the most common IPTV pain points: buffering, weak Wi-Fi,
              overloaded devices, wrong app settings, and multiple active connections.
            </p>
          </div>
          <div className="grid gap-3">
            {optimization.map((tip) => (
              <div key={tip} className="flex items-start gap-3 rounded-2xl border border-line/10 bg-warm p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                <span className="text-sm font-medium leading-7 text-ink">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-3">
          {[
            { icon: Download, title: "Install app", text: "Choose a trusted IPTV player compatible with your device." },
            { icon: Router, title: "Check internet", text: "Use at least 25 Mbps for HD and 50 Mbps or more for 4K." },
            { icon: Settings, title: "Enter credentials", text: "Paste server URL, username, and password exactly as provided." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-line/10 bg-surface p-6">
              <Icon className="size-7 text-accent" />
              <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
