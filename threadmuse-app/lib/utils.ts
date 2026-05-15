import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class strings, resolving conflicts.
 * `cn("p-2", condition && "p-4")` → `"p-4"` when condition is true.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Stable hash → small int. Used for deterministic SVG illustrations. */
export function hashSeed(seed: number | string): number {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Tiny seeded PRNG (xorshift) — same illustration every render. */
export function seededRng(seed: number | string) {
  let state = (hashSeed(seed) || 1) >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
}

/** Pick N deterministic items from an array using a seed. */
export function seededPick<T>(items: readonly T[], seed: number | string): T {
  if (items.length === 0) throw new Error("seededPick: empty array");
  const idx = hashSeed(seed) % items.length;
  return items[idx] as T;
}

/** Truncate a string with a trailing ellipsis, respecting word boundaries when possible. */
export function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + "…";
}

/** Strip non-URL-safe chars from a string. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
