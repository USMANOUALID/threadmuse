import { cn } from "@/lib/utils";

/**
 * Reserved AdSense slot. Renders the dashed placeholder in dev and ships
 * pre-sized so cumulative layout shift stays at 0 when the real ad mounts.
 * Wired to AdSense in Phase 7 via `NEXT_PUBLIC_ADSENSE_CLIENT`.
 */
export function AdSlot({
  size = "leaderboard",
  label,
  className,
}: {
  size?: "leaderboard" | "sidebar" | "mobile-banner";
  label?: string;
  className?: string;
}) {
  const dims = {
    leaderboard: { w: "100%", h: 90, text: "728×90 leaderboard" },
    sidebar:     { w: 240,    h: 250, text: "300×250 medium rectangle" },
    "mobile-banner": { w: "100%", h: 50, text: "320×50 sticky banner" },
  }[size];

  return (
    <div
      role="complementary"
      aria-label="Advertisement"
      className={cn("tm-ad flex items-center justify-between gap-3", className)}
      style={{
        width: typeof dims.w === "number" ? dims.w : undefined,
        minHeight: dims.h,
      }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
          Sponsored
        </span>
        <span className="text-[13px] text-ink">{label ?? `Ad slot · ${dims.text}`}</span>
      </div>
      <span className="text-[11px] text-muted">AdSense</span>
    </div>
  );
}
