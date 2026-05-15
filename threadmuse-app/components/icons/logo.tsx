import { cn } from "@/lib/utils";

/**
 * Brand mark. Three nested "thread" arches — same shape used everywhere
 * the brand needs to appear. Scales cleanly via the `size` prop and inherits
 * `currentColor`.
 */
export function Logo({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-ink text-bg",
        className,
      )}
      style={{ width: size, height: size, borderRadius: size * 0.3 }}
      aria-hidden
    >
      <svg
        width={Math.round(size * 0.55)}
        height={Math.round(size * 0.55)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 7 Q12 1 19 7 M5 12 Q12 6 19 12 M5 17 Q12 11 19 17" />
      </svg>
    </div>
  );
}

/** Logo + wordmark in a single inline cluster. */
export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Logo size={size} />
      <span className="font-display text-[18px] font-semibold tracking-tight text-ink">
        ThreadMuse
      </span>
    </div>
  );
}
