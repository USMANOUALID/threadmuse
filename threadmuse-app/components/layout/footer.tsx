import Link from "next/link";
import { Sparkles, MessageCircle, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/icons/logo";
import { categories } from "@/lib/mock-data";
import { siteConfig } from "@/config/site";

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    heading: "Discover",
    links: [
      { label: "Explore",      href: "/explore" },
      { label: "Trending",     href: "/trending" },
      { label: "New uploads",  href: "/explore?sort=newest" },
      { label: "Free designs", href: "/explore?price=free" },
      { label: "Premium drops",href: "/explore?price=premium" },
    ],
  },
  {
    heading: "Categories",
    links: categories.slice(0, 6).map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
  },
  {
    heading: "Creators",
    links: [
      { label: "Become a creator", href: "/upload" },
      { label: "Upload guide",     href: "/guide" },
      { label: "Seller handbook",  href: "/handbook" },
      { label: "Affiliate program",href: "/affiliate" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about" },
      { label: "Press kit", href: "/press" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms",   href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SocialPill = ({ Icon, label, href }: { Icon: LucideIcon; label: string; href: string }) => (
  <Link
    href={href}
    aria-label={label}
    className="flex size-9 items-center justify-center rounded-md bg-surface text-ink hover:bg-sand"
  >
    <Icon className="size-4" />
  </Link>
);

export function Footer() {
  return (
    <footer className="mt-20 bg-warm text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-8 xl:px-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Logo size={34} />
              <span className="font-display text-[22px] font-semibold tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="max-w-[280px] text-[13px] leading-relaxed text-muted">
              A discovery feed for crochet patterns, wallpapers, printable art and beautiful
              digital things.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialPill Icon={Sparkles} label="Pinterest" href="https://pinterest.com" />
              <SocialPill Icon={MessageCircle} label="Discord"  href="https://discord.gg" />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col items-start justify-between gap-2 border-t border-line/10 pt-7 text-[12px] text-muted sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {siteConfig.name} — Made for makers.</span>
          <span>Crafted in cream, blush and peach · v1.0</span>
        </div>
      </div>
    </footer>
  );
}
