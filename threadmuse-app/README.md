# ThreadMuse

A discovery-first SaaS for digital creators — crochet patterns, wallpapers, printable art, and
digital designs. Built for SEO, Pinterest virality, and Etsy affiliate revenue.

## Status

| Phase | Scope                                                                                           | Status |
| ----- | ----------------------------------------------------------------------------------------------- | ------ |
| 1     | Next 15 + Tailwind + shadcn + design system + homepage                                          | ✅ done |
| 2     | /explore · /trending · /category · /tag · /post · /profile · /search · /upload (UI) · /categories | ✅ done |
| 3     | Supabase auth + DB + storage + uploads                                                          | ✅ done |
| 4     | Likes · saves · follows (optimistic, hydrated)                                                  | ✅ done |
| 5     | Creator dashboard · analytics · billing                                                         | ✅ done |
| 6     | Stripe checkout + portal + plan gating + past_due handling                                      | ✅ done |
| 7     | Sitemap · OG · JSON-LD · category SEO                                                           | —      |
| 8     | Lighthouse 90+ · infinite scroll · CDN                                                          | —      |

## Stack

- **Next.js 15** (App Router, RSC, Turbopack dev)
- **React 19**
- **TypeScript** strict + `noUncheckedIndexedAccess`
- **Tailwind 3.4** + `tailwindcss-animate`
- **shadcn/ui** (New York style, CSS variables)
- **lucide-react** for icons

## Getting started

```bash
pnpm install         # or npm / yarn / bun
cp .env.example .env.local
pnpm dev             # http://localhost:3000
```

## Project structure

```
app/                     # App-Router routes
  layout.tsx             # Root layout, fonts, <html>, metadata template
  page.tsx               # Homepage (server component)
  globals.css            # Tailwind + CSS variables (palette tokens)
  sitemap.ts             # Dynamic /sitemap.xml
  robots.ts              # Dynamic /robots.txt

components/
  ui/                    # shadcn-style primitives (button, input, badge…)
  layout/                # Navbar, MobileNav, Footer, Container, SearchBar
  feed/                  # PostCard, MasonryFeed, CategoryPills, PostIllustration
  home/                  # Hero, CategoriesGrid, TrendingRow, SeoBlock, AdSlot
  icons/                 # CategoryIcon, Logo

config/
  site.ts                # Brand, URLs, social
  nav.ts                 # Nav items (desktop + mobile)
  seo.ts                 # Default metadata builder

lib/
  utils.ts               # cn() + shared helpers
  format.ts              # Number / price / count formatters
  mock-data.ts           # Demo posts/creators/categories (replaced in Phase 3)

types/
  index.ts               # Post, Creator, Category, etc.
```

## Design system

The visual language ships as CSS variables on `:root` (see `app/globals.css`) and is consumed by
Tailwind via the colour palette in `tailwind.config.ts`. Switching the theme is a matter of
swapping the variables — no recompile required. We never reference hex codes outside that file.

| Token         | Use                                                       |
| ------------- | --------------------------------------------------------- |
| `bg`          | Page background — warm cream                              |
| `surface`     | Cards, sheets — pure white                                |
| `sand`        | Subtle fills (nav active, callouts)                       |
| `warm`        | Warmer fills (CTAs on cards, chips)                       |
| `ink`         | Primary text + primary button                             |
| `muted`       | Secondary text                                            |
| `line`        | Borders, dividers                                         |
| `accent`      | Brand peach                                               |
| `accent-2`    | Brand light-peach                                         |
| `soft`        | Brand blush                                               |

Typography: **Poppins** for display, **Inter** for UI. Loaded with `next/font/google` (no FOUT,
preloaded subsets, hashed to a stable CSS variable so Tailwind can resolve them).

## Conventions

- Server components by default. `"use client"` only where state, refs, or browser APIs are needed.
- Strict imports: `@/components/...`, `@/lib/...`, `@/types`, `@/config/...`.
- Style with Tailwind utilities; share style primitives via `cva` in `components/ui`.
- No dark mode (per brand). No glass / blur backgrounds.
- Every interactive element has a visible focus state (`focus-visible:ring-2 ring-ink`).

## Routes (Phase 2)

| Route                      | Rendering                  | Notes                                                  |
| -------------------------- | -------------------------- | ------------------------------------------------------ |
| `/`                        | RSC · ISR 60s              | Hero, categories, trending, fresh, SEO block            |
| `/explore`                 | RSC · ISR 120s             | Sidebar filters · sort toolbar · ad slots               |
| `/trending`                | RSC · ISR 300s             | Most-viewed grid                                        |
| `/categories`              | RSC · ISR 600s             | Index of all 10 categories                              |
| `/category/[slug]`         | RSC · SSG + ISR 600s       | SEO landing per category · related searches · ad slots |
| `/tag/[slug]`              | RSC · SSG + ISR 600s       | Auto-generated from all tags                            |
| `/post/[slug]`             | RSC · SSG + ISR 300s       | Gallery · creator · Etsy CTA · JSON-LD Product · related |
| `/profile/[username]`      | RSC · SSG + ISR 300s       | Banner · stats · uploads tab · JSON-LD Person          |
| `/search?q=…`              | RSC · `force-dynamic`      | Autocomplete · noindex · related searches               |
| `/upload`                  | RSC · noindex              | UI scaffold · Supabase wiring lands in Phase 3          |
| `/profile`                 | redirect                   | Redirects to a demo creator until auth lands            |

Loading + error + not-found boundaries are wired for `/`, `/explore`, `/post/[slug]`,
`/profile/[username]`, `/category/[slug]`.

## Billing operations

ThreadMuse is integrated with Stripe (subscriptions only — no one-off payments).

### First-time setup (per environment)

```bash
# 1. Set keys in .env.local
#    STRIPE_SECRET_KEY=sk_test_…   (test) or sk_live_…   (prod)
#    STRIPE_WEBHOOK_SECRET=whsec_… (from `stripe listen` in dev,
#                                   or the dashboard endpoint in prod)
#    NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY

# 2. Provision products + prices in Stripe and mirror to public.plans
pnpm stripe:seed

# 3. In dev, forward webhooks to the local server
pnpm stripe:listen
```

The seed script is idempotent — edit `PLAN_CONFIG` in `scripts/seed-stripe.ts` and re-run to
update names, descriptions, features, or quotas. Stripe Prices are immutable, so a price-amount
change creates a new Price; the script doesn't archive the old one (operator's choice in the
dashboard).

### Plan gating

`lib/auth/require-plan.ts` exposes `getMyEntitlements()` and `requirePlan({ feature })`. The
upload action uses it to gate by published-post count and daily-upload count; quota fields live
on `public.plans` (`-1` means unlimited).

`past_due` subscriptions are auto-downgraded to free quotas server-side. The global
`<SubscriptionBanner />` in `PageShell` surfaces the recovery CTA on every page for affected users.

### The canonical upgrade UI

`<UpgradePrompt />` (`components/billing/upgrade-prompt.tsx`) is the single source of truth for
upgrade UX. Three sizes: `card` (default), `inline` (in-form), `banner` (full-width strip). Use
it instead of hand-rolling a callout — keeps copy and visual treatment consistent.
