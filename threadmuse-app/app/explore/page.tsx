import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryPills } from "@/components/feed/category-pills";
import { FilterSidebar } from "@/components/feed/filter-sidebar";
import { SortToolbar } from "@/components/feed/sort-toolbar";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { AdSlot } from "@/components/home/ad-slot";
import { RelatedSearches } from "@/components/search/related-searches";
import { getPosts } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: "Explore — every craft, every palette",
  description:
    "Browse 100,000+ digital designs from independent makers. Filter by craft, color, style and price.",
  path: "/explore",
  keywords: ["explore digital designs", "creative marketplace", "Pinterest alternatives"],
});

export default async function ExplorePage() {
  const posts = await getPosts({ sort: "trending", limit: 24 });

  return (
    <PageShell>
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Explore" }]} />
          <h1 className="mt-3 font-display text-display font-semibold text-ink">
            Explore
          </h1>
          <p className="mt-1.5 max-w-[640px] text-pretty text-[14.5px] leading-relaxed text-muted">
            A handpicked feed of crochet patterns, wallpapers, printable art and a few thousand
            other lovely digital things. Refreshed every hour.
          </p>
        </div>
      </section>

      {/* Category rail */}
      <div className="mt-3 lg:hidden">
        <CategoryPills />
      </div>

      {/* Main grid */}
      <section className="bg-bg px-4 pt-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-7 lg:grid-cols-[240px_1fr] lg:items-start">
          <FilterSidebar className="hidden lg:block" />
          <div>
            <SortToolbar />
            <div className="mt-4">
              <MasonryFeed posts={posts} density="balanced" />
            </div>
            <div className="mt-6">
              <AdSlot label="Yarn shop ad — placed between feed rows · 728×90 leaderboard" />
            </div>
            <div className="mt-10">
              <RelatedSearches heading="Popular right now" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
