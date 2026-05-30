"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import * as React from "react";
import { marketingNav } from "@/lib/saas-content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function BrandMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 text-sm font-black text-accent red-glow">
      N
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-bg/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="NoirEdge home">
          <BrandMark />
          <span className="font-display text-lg font-semibold tracking-tight">NoirEdge</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {marketingNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-line/10 hover:text-ink",
                  active && "bg-line/10 text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="md">
            <Link href="/search">
              <Search className="size-4" />
              Search
            </Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/admin/login">Admin</Link>
          </Button>
          <Button asChild size="md">
            <Link href="/contact">Book strategy call</Link>
          </Button>
        </div>

        <button
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line/10 bg-surface text-ink lg:hidden"
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line/10 bg-bg/95 p-4 shadow-lift lg:hidden">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-line/10 bg-surface px-4 py-3 text-sm font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <Link href="/admin/login">Admin</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Book call</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
