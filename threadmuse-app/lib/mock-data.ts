import type { Category, Creator } from "@/types";

/**
 * Static reference constants kept after Phase 3.
 *
 * `categories` and `creators` here are the FIXED reference data mirrored by
 * `supabase/seed.sql` — so chrome surfaces (footer, mobile rails, sample
 * comments) can render without a DB round-trip when it's not needed.
 *
 * Post data is now sourced exclusively from Supabase via `lib/queries.ts`.
 */

export const categories: Category[] = [
  { slug: "crochet-patterns", name: "Crochet Patterns", icon: "crochet",   count: 12480, blurb: "Daisy coasters, granny squares, cottage cardigans." },
  { slug: "wallpapers",       name: "Wallpapers",       icon: "wallpaper", count: 28310, blurb: "Phone, desktop and tablet — mostly free, all warm-toned." },
  { slug: "printable-art",    name: "Printable Art",    icon: "print",     count:  9842, blurb: "Typographic and botanical prints for slow weekends." },
  { slug: "digital-planners", name: "Digital Planners", icon: "planner",   count:  4216, blurb: "Planners that earn their keep." },
  { slug: "embroidery",       name: "Embroidery",       icon: "embroidery",count:  6710, blurb: "Hoop patterns, beginner-friendly stitch guides." },
  { slug: "knitting",         name: "Knitting",         icon: "knit",      count:  5380, blurb: "Mittens, beanies, slow-knit sweaters." },
  { slug: "svg-files",        name: "SVG Files",        icon: "svg",       count:  7902, blurb: "Cricut-ready cut files and bundles." },
  { slug: "stickers",         name: "Stickers",         icon: "sticker",   count: 11270, blurb: "Journaling sets dropped every Friday." },
  { slug: "ai-art",           name: "AI Art",           icon: "ai",        count: 18650, blurb: "Hand-curated AI wall art series." },
  { slug: "home-decor",       name: "Home Decor",       icon: "home",      count:  3984, blurb: "Gallery walls, shelf styling, linen rooms." },
];

/**
 * Synthetic creators used only by the sample-comments fallback in
 * `comments-section.tsx`. Once Phase 3 has live data, that component reads
 * from the DB and these go unused.
 */
export const creators: Creator[] = [
  { username: "noor.studio",     name: "Noor Studio",   bio: "Slow stitches, soft palettes.",     location: "Lisbon",      followers: "12.4k" },
  { username: "oats.and.thread", name: "Iona Park",     bio: "Crochet patterns & seasonal makes.",location: "Glasgow",     followers: "38.1k" },
  { username: "paper.kestrel",   name: "Mira Aldana",   bio: "Botanical printables.",             location: "Mexico City", followers: "6.8k"  },
  { username: "sundial.house",   name: "Sundial House", bio: "Warm-toned wallpapers.",            location: "Marrakech",   followers: "24.7k" },
  { username: "linen.lab",       name: "Linen Lab",     bio: "Embroidery hoop patterns.",         location: "Kyoto",       followers: "9.3k"  },
  { username: "kindling.co",     name: "Kindling Co.",  bio: "Printable planners that feel.",     location: "Wellington",  followers: "14.2k" },
  { username: "salt.fern",       name: "Salt + Fern",   bio: "Boho prints for tiny rooms.",       location: "Galway",      followers: "5.2k"  },
  { username: "pip.and.poppy",   name: "Pip & Poppy",   bio: "Sticker sets, every Friday.",       location: "Brooklyn",    followers: "18.9k" },
];

export const popularSearches = [
  "boho wallpaper",
  "free crochet patterns",
  "cute iPhone wallpapers",
  "pink aesthetic",
  "granny square",
  "printable wall art",
  "embroidery PDF",
  "cottagecore",
  "SVG bundle",
  "AI wall art",
  "minimalist planner",
  "cross-stitch",
];
