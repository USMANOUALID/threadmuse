"use client";

import * as React from "react";
import type { IllustrationKind } from "@/types";
import { PostIllustration } from "@/components/feed/post-illustration";
import { cn } from "@/lib/utils";

/**
 * Image gallery for /post/[slug]. Thumb rail to the left on desktop, dot
 * indicators on mobile. Client component because we track the active index.
 * Once Phase 3 swaps illustrations for real Supabase images this becomes a
 * `next/image` carousel with priority-fetch on index 0.
 */
export function PostGallery({
  kind,
  seeds,
  className,
}: {
  kind: IllustrationKind;
  /** First seed is the hero; rest are thumbs. */
  seeds: number[];
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  const activeSeed = seeds[active] ?? seeds[0]!;

  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row lg:gap-5", className)}>
      {/* Thumb rail — desktop only */}
      <ul className="hidden flex-col gap-2.5 lg:flex">
        {seeds.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1} of ${seeds.length}`}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "block h-[120px] w-[120px] overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-ink" : "border-transparent",
              )}
            >
              <PostIllustration kind={kind} seed={s} />
            </button>
          </li>
        ))}
      </ul>

      {/* Hero */}
      <div className="flex flex-col gap-3 lg:flex-1">
        <div className="overflow-hidden rounded-2xl shadow-soft" style={{ aspectRatio: "1 / 1" }}>
          <PostIllustration kind={kind} seed={activeSeed} />
        </div>

        {/* Mobile dot indicators */}
        <ul className="flex justify-center gap-2 lg:hidden">
          {seeds.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Image ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-5 bg-ink" : "w-1.5 bg-line/30",
                )}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
