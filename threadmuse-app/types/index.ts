/**
 * Shared domain types for ThreadMuse.
 * Kept framework-agnostic so they can be reused by API routes, Supabase row
 * shims, and components alike. Once Phase 3 wires Supabase, the DB row types
 * will live in `types/db.ts` and these stay as the UI-facing models.
 */

export type CategorySlug =
  | "crochet-patterns"
  | "wallpapers"
  | "printable-art"
  | "digital-planners"
  | "embroidery"
  | "knitting"
  | "svg-files"
  | "stickers"
  | "ai-art"
  | "home-decor";

export type IllustrationKind =
  | "crochet"
  | "wallpaper"
  | "print"
  | "planner"
  | "embroidery"
  | "knit"
  | "svg"
  | "sticker"
  | "ai"
  | "home";

export interface Category {
  slug: CategorySlug;
  name: string;
  icon: IllustrationKind;
  count: number;
  /** Short marketing line shown on /category/[slug] hero — Phase 2. */
  blurb?: string;
}

export interface Creator {
  /** URL handle, e.g. "noor.studio" */
  username: string;
  name: string;
  bio: string;
  location: string;
  followers: string;
  /** Filled in Phase 3 from Supabase storage. */
  avatarUrl?: string;
}

export interface Post {
  /** uuid in production, kept as `string` so it can also seed the placeholder
   *  illustration without converting to int. */
  id: string;
  slug: string;
  title: string;
  description?: string;
  kind: IllustrationKind;
  /** Aspect height hint used to seed the SVG illustration aspect ratio. */
  illustrationHeight: number;
  /** "Free" or a price string like "$3.20". Phase 6 replaces with `pricing`. */
  price: string;
  isPremium: boolean;
  tags: string[];
  category: CategorySlug;
  creator: Creator;
  etsyUrl?: string;
  views: number;
  likes: number;
  saves: number;
  /** ISO 8601. */
  createdAt: string;
}

/** What a feed query returns once Supabase is wired. */
export interface Page<T> {
  items: T[];
  cursor: string | null;
}

/** Card variants — driven by future user / tweak preference. */
export type CardLayout = "minimal" | "info" | "full";
