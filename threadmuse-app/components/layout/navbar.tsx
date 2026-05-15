"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageCircle, Upload as UploadIcon } from "lucide-react";
import { desktopNav, utilityNav } from "@/config/nav";
import { Wordmark } from "@/components/icons/logo";
import { CreatorAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/layout/search-bar";
import { cn } from "@/lib/utils";

export interface NavbarCurrentUser {
  username: string;
  name: string;
  avatarUrl?: string | null;
}

/**
 * Desktop top bar. Hidden below `md:` — mobile uses MobileNav at the bottom.
 * The active nav item is derived from the current pathname. `currentUser` is
 * fetched server-side by `PageShell` and passed down so the navbar can render
 * a real avatar (or a "Sign in" affordance) without an extra client request.
 */
export function Navbar({ currentUser }: { currentUser: NavbarCurrentUser | null }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 hidden border-b border-line/10 bg-surface md:block",
        // Smooth shadow on scroll — applied via CSS-only scroll-driven animation
        // would be ideal here, but it's not supported everywhere; a static
        // bottom border is the safest cross-browser choice for now.
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-6 lg:px-8 xl:px-12">
        <Link href="/" aria-label="ThreadMuse — Home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="ml-2 flex items-center gap-1">
          {desktopNav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] transition-colors",
                  active
                    ? "bg-sand font-semibold text-ink"
                    : "font-medium text-ink hover:bg-warm",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-3 max-w-[520px] flex-1">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {currentUser && utilityNav.map(({ key, label, href, icon: Icon }) => (
            <Button key={key} asChild variant="ghost" size="icon" aria-label={label}>
              <Link href={href}>{Icon && <Icon className="size-[18px]" />}</Link>
            </Button>
          ))}

          {currentUser ? (
            <>
              <Button asChild size="md">
                <Link href="/upload">
                  <UploadIcon className="size-4" />
                  Upload
                </Link>
              </Button>
              <Link
                href={`/profile/${currentUser.username}`}
                className="ml-1"
                aria-label={`${currentUser.name} — your profile`}
              >
                <CreatorAvatar
                  name={currentUser.name}
                  username={currentUser.username}
                  src={currentUser.avatarUrl ?? undefined}
                  size="sm"
                />
              </Link>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="md">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="md">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Re-exported icons so other files don't need to dual-import lucide.
export { Bell, MessageCircle };
