import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

const settingsLinks = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/account", label: "Account" },
  { href: "/settings/billing", label: "Billing" },
];

export function SettingsShell({ children }: { children: React.ReactNode }) {
  return (
    <PageShell showMobileSearch={false}>
      <section className="bg-bg px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Settings</p>
            <h1 className="mt-2 font-display text-display font-semibold text-ink">Account settings</h1>
          </div>
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Settings navigation">
              {settingsLinks.map((item) => (
                <Link key={item.href} href={item.href} className="shrink-0 rounded-xl border border-line/10 bg-surface px-4 py-3 text-sm font-semibold text-ink hover:border-accent/50">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div>{children}</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
