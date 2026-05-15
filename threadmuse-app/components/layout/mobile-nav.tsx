"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search as SearchIcon } from "lucide-react";
import { mobileNav } from "@/config/nav";
import { Logo } from "@/components/icons/logo";
import { CreatorAvatar } from "@/components/ui/avatar";
import type { NavbarCurrentUser } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

/**
 * Mobile-only chrome: a compact top bar + a fixed bottom tab bar with a
 * centre-floating upload FAB. Both pieces are hidden on `md:` upward.
 */

export function MobileTopBar({ currentUser }: { currentUser: NavbarCurrentUser | null }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 bg-bg/95 px-4 pt-3 pb-2 backdrop-blur-sm md:hidden">
      <Link href="/" aria-label="ThreadMuse — Home" className="flex items-center gap-2">
        <Logo size={26} />
        <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
          ThreadMuse
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <Link
          href="/search"
          aria-label="Search"
          className="flex size-9 items-center justify-center rounded-md text-ink hover:bg-warm"
        >
          <SearchIcon className="size-5" />
        </Link>
        {currentUser ? (
          <>
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="flex size-9 items-center justify-center rounded-md text-ink hover:bg-warm"
            >
              <Bell className="size-5" />
            </Link>
            <Link
              href={`/profile/${currentUser.username}`}
              aria-label={`${currentUser.name} — your profile`}
              className="ml-1"
            >
              <CreatorAvatar
                name={currentUser.name}
                username={currentUser.username}
                src={currentUser.avatarUrl ?? undefined}
                size="xs"
              />
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="ml-1 flex h-9 items-center rounded-md bg-ink px-3 text-[12.5px] font-medium text-bg"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export function MobileSearchTrigger() {
  return (
    <div className="px-4 pb-3 md:hidden">
      <Link
        href="/search"
        className="flex h-10 items-center gap-2.5 rounded-full border border-line/10 bg-surface px-4 text-[13px] text-muted"
      >
        <SearchIcon className="size-4" />
        <span>Search designs, creators, tags…</span>
      </Link>
    </div>
  );
}

/**
 * Bottom tab bar. The middle item (upload) renders as a floating FAB.
 */
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
          const isFab = item.key === "upload";
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          if (isFab) {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-label="Upload"
                  className="-mt-5 flex size-12 items-center justify-center rounded-2xl bg-ink text-bg shadow-cta"
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
