import Link from "next/link";
import { Activity, ArrowRight, Database, FileText, Image, Mail, ShieldCheck, Users } from "lucide-react";
import { cmsSections, type CmsSectionKey } from "@/lib/admin/cms-config";
import { displayValue, getAdminOverview } from "@/lib/admin/cms-data";

const highlightCards: { key: CmsSectionKey; label: string; icon: typeof FileText }[] = [
  { key: "homepage", label: "Homepage sections", icon: FileText },
  { key: "messages", label: "Contact messages", icon: Mail },
  { key: "media", label: "Media assets", icon: Image },
  { key: "users", label: "Users", icon: Users },
];

export default async function AdminDashboardPage() {
  const overview = await getAdminOverview();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Overview</p>
        <h1 className="mt-2 font-display text-display font-semibold">Dashboard overview</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Live Supabase CMS control center for content, media, leads, newsletter, analytics, SEO, settings, roles, and users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlightCards.map(({ key, label, icon: Icon }) => (
          <Link key={key} href={`/admin/${key}`} className="rounded-3xl border border-line/10 bg-surface p-5 transition hover:border-accent/50 hover:shadow-lift">
            <Icon className="size-5 text-accent" />
            <p className="mt-6 text-sm text-muted">{label}</p>
            <p className="mt-1 font-display text-4xl font-semibold">{overview.counts[key] ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-3xl border border-line/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">CMS modules</h2>
              <p className="mt-1 text-sm text-muted">Every module is connected to a real Supabase table with CRUD actions.</p>
            </div>
            <Database className="size-5 text-accent" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(Object.keys(cmsSections) as CmsSectionKey[]).map((key) => {
              const section = cmsSections[key];
              return (
                <Link key={key} href={`/admin/${key}`} className="rounded-2xl border border-line/10 bg-bg p-4 transition hover:border-accent/50">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{section.label}</p>
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-xs text-accent">{overview.counts[key] ?? 0}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{section.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    Manage <ArrowRight className="size-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-line/10 bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">Recent messages</h2>
              <Mail className="size-5 text-accent" />
            </div>
            <div className="mt-6 space-y-3">
              {overview.recentMessages.map((item) => (
                <Link key={String(item.id)} href="/admin/messages" className="block rounded-2xl bg-bg p-4 text-sm text-muted">
                  <p className="font-semibold text-ink">{displayValue(item.name)} · {displayValue(item.status)}</p>
                  <p className="mt-1 truncate">{displayValue(item.email)} {item.company ? `· ${displayValue(item.company)}` : ""}</p>
                </Link>
              ))}
              {overview.recentMessages.length === 0 && <p className="text-sm text-muted">No contact messages yet.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-line/10 bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">Recent analytics</h2>
              <Activity className="size-5 text-accent" />
            </div>
            <div className="mt-6 space-y-3">
              {overview.recentEvents.map((item) => (
                <Link key={String(item.id)} href="/admin/analytics" className="flex gap-3 rounded-2xl bg-bg p-4 text-sm text-muted">
                  <ShieldCheck className="size-4 shrink-0 text-accent" />
                  <span>{displayValue(item.event_name)} on {displayValue(item.path)}</span>
                </Link>
              ))}
              {overview.recentEvents.length === 0 && <p className="text-sm text-muted">No analytics events yet.</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
