/**
 * Display formatters — share between server and client. All deterministic
 * (no Intl locale fallback drift between SSR + hydration).
 */

/** 1284 → "1.3k", 18421 → "18.4k", 1620000 → "1.6M" */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  if (n < 1_000_000) return Math.round(n / 1000) + "k";
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
}

/** 18421 → "18,421" */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** ISO date → "3 days ago", "2h ago", "just now" */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now.getTime() - then) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86_400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 7 * 86_400) return `${Math.floor(diff / 86_400)}d ago`;
  if (diff < 30 * 86_400) return `${Math.floor(diff / (7 * 86_400))}w ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format a price chip — Free designs render the literal "Free" everywhere. */
export function formatPrice(price: string): { label: string; isFree: boolean } {
  const isFree = price.trim().toLowerCase() === "free";
  return { label: isFree ? "FREE" : price, isFree };
}
