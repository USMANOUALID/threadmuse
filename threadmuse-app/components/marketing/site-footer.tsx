import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/cms";
import { marketingNav } from "@/lib/saas-content";
import { siteConfig } from "@/config/site";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line/10 bg-bg">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 font-black text-accent">
                N
              </span>
              <span className="font-display text-xl font-semibold">{siteConfig.name}</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Premium SaaS website, admin CMS, AI automation, and executive analytics for teams
              that want a luxury brand experience with serious operating leverage.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent"
            >
              Start a premium build <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Company</h3>
            <ul className="mt-4 space-y-3">
              {marketingNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted transition hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted transition hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Newsletter</h3>
            <p className="mt-4 text-sm leading-6 text-muted">
              Growth teardown, AI operations playbooks, and premium SaaS conversion insights.
            </p>
            <form action={subscribeToNewsletter} className="mt-4 flex rounded-full border border-line/10 bg-surface p-1">
              <input type="hidden" name="redirectTo" value="/contact" />
              <input type="hidden" name="source" value="footer" />
              <input
                aria-label="Newsletter email"
                name="email"
                type="email"
                placeholder="you@company.com"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted"
              />
              <button className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white" type="submit">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line/10 pt-6 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</span>
          <span>Dark SaaS system powered by Next.js, Tailwind CSS, and Supabase.</span>
        </div>
      </div>
    </footer>
  );
}
