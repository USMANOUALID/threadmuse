import Link from "next/link";
import {
  BarChart3,
  FileQuestion,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Search,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { siteConfig } from "@/config/site";

const nav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Services", href: "/admin/services", icon: Tags },
  { label: "Pricing", href: "/admin/pricing", icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "FAQ", href: "/admin/faq", icon: FileQuestion },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
] as const;

export function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail?: string | null;
}) {
  return (
    <div className="min-h-dvh bg-bg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-line/10 bg-surface/80 p-4 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-2xl border border-line/10 bg-bg p-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 font-black text-accent">
            N
          </span>
          <div>
            <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
            <p className="text-xs text-muted">Admin CMS</p>
          </div>
        </Link>
        <nav className="mt-5 grid gap-1">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-line/10 hover:text-ink"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-line/10 bg-bg/80 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">Secure dashboard</p>
              <p className="text-sm text-muted">{adminEmail ?? "Authenticated admin"}</p>
            </div>
            <Link href="/" className="rounded-full border border-line/10 px-4 py-2 text-sm font-semibold text-ink">
              View website
            </Link>
          </div>
        </header>
        <main className="px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
