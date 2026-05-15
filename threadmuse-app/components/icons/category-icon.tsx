import * as React from "react";
import type { IllustrationKind } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Category icon set — one stroke-style glyph per `IllustrationKind`.
 * Drawn at 24×24 with stroke-width 1.6 so they sit nicely beside Inter 13.
 */
export function CategoryIcon({
  kind,
  size = 22,
  className,
}: {
  kind: IllustrationKind;
  size?: number;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const glyphs: Record<IllustrationKind, React.JSX.Element> = {
    crochet: (
      <g {...common}>
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="6.5" cy="7" r="2" />
        <circle cx="17.5" cy="7" r="2" />
        <circle cx="6.5" cy="17" r="2" />
        <circle cx="17.5" cy="17" r="2" />
      </g>
    ),
    wallpaper: (
      <g {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 12c3 0 3-4 6-4s3 4 6 4 3-2 4-2" />
      </g>
    ),
    print: (
      <g {...common}>
        <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
        <path d="M8 9h8M8 12h8M8 15h5" />
      </g>
    ),
    planner: (
      <g {...common}>
        <rect x="4" y="5" width="16" height="15" rx="1.5" />
        <path d="M4 9h16M9 3v4M15 3v4" />
      </g>
    ),
    embroidery: (
      <g {...common}>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M8 12l4-4 4 4-4 4z" />
      </g>
    ),
    knit: (
      <g {...common}>
        <path d="M6 4q3 4 0 8 q-3 4 0 8M12 4q3 4 0 8 q-3 4 0 8M18 4q3 4 0 8 q-3 4 0 8" />
      </g>
    ),
    svg: (
      <g {...common}>
        <circle cx="8" cy="9" r="3.2" />
        <rect x="12" y="6" width="7" height="7" rx="1" />
        <path d="M6 20l4-6 4 6" />
      </g>
    ),
    sticker: (
      <g {...common}>
        <path d="M5 5h11l3 3v11l-3 0v-3l3-0 M5 5v14h11" />
      </g>
    ),
    ai: (
      <g {...common}>
        <path d="M12 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
        <circle cx="18.5" cy="18" r="1.5" />
      </g>
    ),
    home: (
      <g {...common}>
        <path d="M4 11l8-7 8 7M6 10v9h12v-9" />
        <path d="M10 19v-5h4v5" />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {glyphs[kind]}
    </svg>
  );
}
