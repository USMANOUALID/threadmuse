import Link from "next/link";
import { Activity, ArrowRight, Database, FileText, Image, Mail, ShieldCheck, Users } from "lucide-react";
import { adminSections } from "@/lib/saas-content";

const cards = [
  { label: "Published pages", value: "10", icon: FileText },
  { label: "Contact messages", value: "284", icon: Mail },
  { label: "Media assets", value: "1,492", icon: Image },
  { label: "Admin users", value: "12", icon: Users },
] as const;

const activity = [
  "Homepage hero headline updated",
  "Scale pricing plan published",
  "18 new contact messages routed",
  "SEO title changed for /services",
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Overview</p>
        <h1 className="mt-2 font-display text-display font-semibold">Dashboard overview</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Manage public content, services, pricing, proof, FAQs, blog, messages, media, SEO, settings, analytics, newsletter, and users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl border border-line/10 bg-surface p-5">
            <Icon className="size-5 text-accent" />
            <p className="mt-6 text-sm text-muted">{label}</p>
            <p className="mt-1 font-display text-4xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-3xl border border-line/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">CMS modules</h2>
              <p className="mt-1 text-sm text-muted">Every editable area in one professional admin system.</p>
            </div>
            <Database className="size-5 text-accent" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(adminSections).map(([key, section]) => (
              <Link key={key} href={`/admin/${key}`} className="rounded-2xl border border-line/10 bg-bg p-4 transition hover:border-accent/50">
                <p className="font-semibold">{section.title}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{section.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  Manage <ArrowRight className="size-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-line/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Activity</h2>
            <Activity className="size-5 text-accent" />
          </div>
          <div className="mt-6 space-y-3">
            {activity.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-bg p-4 text-sm text-muted">
                <ShieldCheck className="size-4 text-accent" />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
