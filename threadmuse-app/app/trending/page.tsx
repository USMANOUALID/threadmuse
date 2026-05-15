import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryPills } from "@/components/feed/category-pills";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { AdSlot } from "@/components/home/ad-slot";
import { getPosts } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";

export const revalidate = 300; // 5 min; trending shouldn't churn every request.

export const metadata: Metadata = buildMetadata({
  title: "Trending now — most-loved digital designs",
  description:
    "What thousands of makers are saving this week — crochet, wallpapers, printables, AI art and more.",
  path: "/trending",
  keywords: ["trending designs", "popular crochet", "best wallpapers"],
});

export default async function TrendingPage() {
  const posts = await getPosts({ sort: "mostViewed", limit: 30 });

  return (
    <PageShell>
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trending" }]} />
          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-md bg-ink text-bg">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <h1 className="font-display text-h1 font-semibold text-ink">Trending this week</h1>
              <p className="text-[14px] text-muted">Most viewed across all categories.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-3 lg:hidden">
        <CategoryPills />
      </div>

      <section className="bg-bg px-4 pt-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <MasonryFeed posts={posts} density="balanced" />
          <div className="mt-6">
            <AdSlot label="Featured Etsy shop · 728×90" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
