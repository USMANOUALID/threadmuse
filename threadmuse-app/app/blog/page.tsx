import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Flame, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "IPTV guides for Canada and UK viewers",
  description:
    "Read premium IPTV guides for Canada and UK viewers, including Fire Stick setup, Smart TV apps, free trial testing, reseller basics, and stream quality tips.",
  path: "/blog",
  keywords: ["IPTV blog", "IPTV guides Canada", "IPTV guides UK", "Fire Stick IPTV guide"],
});

const posts = [
  {
    icon: Flame,
    title: "Best IPTV setup for Fire Stick in Canada and the UK",
    text: "A practical setup path for Downloader, IPTV player selection, login details, EPG refresh, and playback checks.",
    href: "/tutorial#fire-stick",
  },
  {
    icon: MonitorSmartphone,
    title: "Smart TV IPTV checklist before you start a trial",
    text: "What to test during the first 24 hours: app compatibility, Wi-Fi quality, VOD loading, subtitles, and live sports.",
    href: "/free-trial",
  },
  {
    icon: ShieldCheck,
    title: "How to compare premium IPTV plans without getting burned",
    text: "Use device support, channel categories, activation quality, support visibility, and trial access as buying signals.",
    href: "/pricing",
  },
];

export default function BlogPage() {
  return (
    <MarketingShell>
      <section className="relative px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_0%,hsl(var(--accent)/0.24),transparent_30%)]" />
        <div className="mx-auto max-w-[1180px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            <BookOpen className="size-3.5" />
            IPTV guides
          </div>
          <h1 className="mt-5 font-display text-display-lg font-semibold text-ink">
            Modern IPTV guides for Canada and UK viewers.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-muted">
            Blog-style guides add SEO depth and help customers solve device, trial,
            pricing, and stream quality questions before contacting support.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-4 lg:grid-cols-3">
          {posts.map(({ icon: Icon, title, text, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-3xl border border-line/10 bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent/40 hover:bg-accent/10"
            >
              <Icon className="size-7 text-accent" />
              <h2 className="mt-5 text-xl font-semibold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent">
                Read guide
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
