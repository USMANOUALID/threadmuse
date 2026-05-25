import Link from "next/link";
import { Mail, ShieldCheck, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/icons/logo";
import { siteConfig } from "@/config/site";

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    heading: "Services",
    links: [
      { label: "IPTV subscriptions", href: "/pricing" },
      { label: "Free trial", href: "/free-trial" },
      { label: "Reseller program", href: "/reseller" },
      { label: "Setup tutorial", href: "/tutorial" },
      { label: "IPTV guides", href: "/blog" },
    ],
  },
  {
    heading: "Devices",
    links: [
      { label: "Smart TV", href: "/tutorial#smart-tv" },
      { label: "Fire Stick", href: "/tutorial#fire-stick" },
      { label: "Android TV", href: "/tutorial#android" },
      { label: "Apple devices", href: "/tutorial#apple" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact support", href: "/contact" },
      { label: "Email support", href: "mailto:support@seusytv.com" },
      { label: "Activation help", href: "/free-trial" },
      { label: "Channel questions", href: "/pricing#faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Reseller terms", href: "/reseller#terms" },
      { label: "Refund policy", href: "/pricing#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SocialPill = ({ Icon, label, href }: { Icon: LucideIcon; label: string; href: string }) => (
  <Link
    href={href}
    aria-label={label}
    className="flex size-9 items-center justify-center rounded-md border border-line/10 bg-surface text-ink hover:bg-line/10"
  >
    <Icon className="size-4" />
  </Link>
);

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line/10 bg-bg text-ink">
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
              Premium IPTV for Canada and the UK with fast activation, curated sports,
              movies, global channels, reseller margins, and setup support for every screen.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialPill Icon={Mail} label="Contact" href="/contact" />
              <SocialPill Icon={ShieldCheck} label="Guarantee" href="/pricing#faq" />
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
          <span>© {new Date().getFullYear()} {siteConfig.name} - Premium IPTV support.</span>
          <span>4K ready streams - secure checkout - 7 day guarantee</span>
        </div>
      </div>
    </footer>
  );
}
