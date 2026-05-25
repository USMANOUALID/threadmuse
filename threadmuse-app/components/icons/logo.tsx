import { cn } from "@/lib/utils";

export function Logo({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center bg-gradient-to-br from-accent to-accent-2 text-white shadow-cta",
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
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 5v14" />
        <path d="M7 5l11 7-11 7" />
        <path d="M12 8.5v7" />
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
        SeusyTV
      </span>
    </div>
  );
}
