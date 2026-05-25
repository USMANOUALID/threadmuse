"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { mobileNav } from "@/config/nav";
import { Logo } from "@/components/icons/logo";
import type { NavbarCurrentUser } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

export function MobileTopBar({ currentUser: _currentUser }: { currentUser?: NavbarCurrentUser | null }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-line/10 bg-bg/95 px-4 py-3 backdrop-blur-xl md:hidden">
      <Link href="/" aria-label="SeusyTV home" className="flex items-center gap-2">
        <Logo size={26} />
        <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
          SeusyTV
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <Link
          href="https://wa.me/15551234567"
          aria-label="WhatsApp support"
          target="_blank"
          rel="noreferrer"
          className="flex size-9 items-center justify-center rounded-md text-ink hover:bg-line/10"
        >
          <MessageCircle className="size-5" />
        </Link>
        <Link
          href="/free-trial"
          className="ml-1 flex h-9 items-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-3 text-[12.5px] font-semibold text-white shadow-cta"
        >
          Free trial
        </Link>
      </div>
    </header>
  );
}

export function MobileSearchTrigger() {
  return (
    <div className="px-4 pb-3 md:hidden">
      <Link
        href="/pricing"
        className="flex h-10 items-center justify-center rounded-full border border-line/10 bg-surface px-4 text-[13px] font-semibold text-ink"
      >
        <span>View IPTV plans from EUR 9</span>
      </Link>
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-surface pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-2">
        {mobileNav.map((item) => {
          const Icon = item.icon!;
          const isFab = item.key === "trial";
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          if (isFab) {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-label="Start free trial"
                  className="-mt-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-2 text-white shadow-cta"
                >
                  <Icon className="size-5" />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-3 py-1 text-[10.5px]",
                  active ? "text-ink" : "text-muted",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" />
                <span className={active ? "font-semibold" : "font-medium"}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
