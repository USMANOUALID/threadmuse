"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { desktopNav } from "@/config/nav";
import { Wordmark } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavbarCurrentUser {
  username: string;
  name: string;
  avatarUrl?: string | null;
}

export function Navbar({ currentUser: _currentUser }: { currentUser?: NavbarCurrentUser | null }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 hidden border-b border-line/10 bg-bg/90 backdrop-blur-xl md:block",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-6 lg:px-8 xl:px-12">
        <Link href="/" aria-label="SeusyTV home" className="shrink-0">
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
                    ? "bg-line/10 font-semibold text-ink"
                    : "font-medium text-muted hover:bg-line/10 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="md">
            <Link href="/tutorial">Setup help</Link>
          </Button>
          <Button asChild size="md">
            <Link href="/free-trial">
              Start free trial
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="WhatsApp support">
            <Link href="https://wa.me/15551234567" target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export { MessageCircle };
