import type { Metadata } from "next";
import { Filter } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { MobileTopBar, MobileSearchTrigger, MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { TrendingRow } from "@/components/home/trending-row";
import { SeoBlock } from "@/components/home/seo-block";
import { AdSlot } from "@/components/home/ad-slot";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { Button } from "@/components/ui/button";
import { getPosts, getTrendingPosts } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

// Phase 3 reads from Supabase; ISR keeps it snappy at edge.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

const feedFilters = ["For you", "Following", "Newest", "Free only", "Premium"];

export default async function HomePage() {
  const [trending, freshPosts] = await Promise.all([
    getTrendingPosts(6),
    getPosts({ sort: "newest", limit: 24 }),
  ]);

  return (
    <>
      <Navbar />
      <MobileTopBar />
      <MobileSearchTrigger />

      <main id="main" className="pb-24 md:pb-12">
        <Hero />
        <CategoriesGrid />
        <TrendingRow posts={trending} />

        {/* ─── Fresh uploads ─── */}
        <section
          aria-labelledby="fresh-heading"
          className="bg-bg px-4 pt-8 sm:px-6 lg:px-8 xl:px-12"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-4 flex items-end justify-between">
              <h2 id="fresh-heading" className="tm-section-title">
                Fresh uploads
              </h2>
              <a
                href="/explore?sort=newest"
                className="tm-section-link hover:underline"
              >
                See newest
              </a>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <ul className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1">
                {feedFilters.map((label, i) => (
                  <li key={label}>
                    <Button
                      size="sm"
                      variant={i === 0 ? "primary" : "outline"}
                      pill
                    >
                      {label}
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto hidden md:inline-flex"
              >
                <Filter className="size-3.5" />
                Filters
              </Button>
            </div>

            <div className="grid gap-7 lg:grid-cols-[1fr_240px] lg:items-start">
              <MasonryFeed posts={freshPosts} density="balanced" />
              <aside className="hidden lg:block">
                <div className="sticky top-20 space-y-3">
                  <AdSlot size="sidebar" label="Featured: Linen Lab — embroidery shop" />
                  <div className="rounded-lg border border-line/10 bg-surface p-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                      Creator spotlight
                    </h4>
                    <p className="mt-2 text-[13px] text-ink">
                      <span className="font-semibold">Iona Park</span> released 4 new patterns
                      this week — granny squares, mittens, and a chunky beanie.
                    </p>
                    <a
                      href="/profile/oats.and.thread"
                      className="mt-3 inline-flex text-[12.5px] font-semibold text-ink hover:underline"
                    >
                      View profile →
                    </a>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-6">
              <AdSlot label="Yarn shop ad — placed between feed rows · 728×90 leaderboard" />
            </div>
          </div>
        </section>

        <SeoBlock />
      </main>

      <Footer />

      {/* Mobile sticky ad — kept above the bottom nav. */}
      <div className="fixed inset-x-0 bottom-16 z-30 px-4 md:hidden">
        <AdSlot size="mobile-banner" label="Mobile sticky banner — AdSense slot" />
      </div>

      <MobileNav />
    </>
  );
}
