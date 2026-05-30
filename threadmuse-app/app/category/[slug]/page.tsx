import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryPills } from "@/components/feed/category-pills";
import { FilterSidebar } from "@/components/feed/filter-sidebar";
import { SortToolbar } from "@/components/feed/sort-toolbar";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { AdSlot } from "@/components/home/ad-slot";
import { RelatedSearches } from "@/components/search/related-searches";
import { CategoryIcon } from "@/components/icons/category-icon";
import { getCategoryBySlug, getPosts } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";
import { formatCount } from "@/lib/format";

// SSG every category page; revalidate as posts churn.
export const revalidate = 600;

export async function generateStaticParams() {
  return [];
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Not found" };
  return buildMetadata({
    title: `${cat.name} — free & premium digital designs`,
    description:
      cat.blurb ??
      `Browse ${formatCount(cat.count)} ${cat.name.toLowerCase()} from independent makers on ThreadMuse.`,
    path: `/category/${cat.slug}`,
    keywords: [
      cat.name.toLowerCase(),
      `free ${cat.name.toLowerCase()}`,
      `best ${cat.name.toLowerCase()}`,
      `2026 ${cat.name.toLowerCase()}`,
    ],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const posts = await getPosts({ category: cat.slug, sort: "trending", limit: 24 });

  return (
    <PageShell>
      {/* SEO header */}
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: cat.name },
            ]}
          />
          <div className="mt-4 flex items-center gap-4">
            <div
              className="flex size-14 items-center justify-center rounded-lg text-bg shadow-soft"
              style={{ background: "linear-gradient(135deg,#e89280 0%,#f4a8a8 100%)" }}
            >
              <CategoryIcon kind={cat.icon} size={26} />
            </div>
            <div>
              <h1 className="font-display text-display font-semibold tracking-tight text-ink">
                {cat.name}
              </h1>
              <p className="mt-1 text-[13.5px] text-muted">
                <strong className="font-bold text-ink">{formatCount(cat.count)}</strong> designs · refreshed daily
              </p>
            </div>
          </div>
          {cat.blurb && (
            <p className="mt-4 max-w-[720px] text-pretty text-[14.5px] leading-relaxed text-ink/85">
              {cat.blurb}
            </p>
          )}
        </div>
      </section>

      <div className="mt-3 lg:hidden">
        <CategoryPills activeSlug={cat.slug} />
      </div>

      {/* Main grid */}
      <section className="bg-bg px-4 pt-7 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-7 lg:grid-cols-[240px_1fr] lg:items-start">
          <FilterSidebar className="hidden lg:block" />
          <div>
            <div className="mb-5 flex items-center gap-2 rounded-md border border-line/10 bg-warm px-4 py-2.5 text-[12.5px] text-ink">
              <Sparkles className="size-3.5" />
              <span>
                Showing in <strong className="font-semibold">warm-pink</strong> palette — try
                other tones in filters →
              </span>
              <span className="ml-auto text-[11px] text-muted">SEO H2 block</span>
            </div>

            <SortToolbar showFilterButton={false} />
            <div className="mt-4">
              {posts.length > 0 ? (
                <MasonryFeed posts={posts} density="balanced" />
              ) : (
                <EmptyState category={cat.name} />
              )}
            </div>

            <div className="mt-6">
              <AdSlot label={`${cat.name} sponsor · 728×90 leaderboard`} />
            </div>

            <div className="mt-10">
              <RelatedSearches heading={`Related ${cat.name.toLowerCase()} searches`} />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line/15 bg-surface p-10 text-center">
      <h2 className="font-display text-h3 font-semibold text-ink">No {category.toLowerCase()} yet</h2>
      <p className="mt-1.5 text-[13px] text-muted">
        Be the first to upload — your design will be live in minutes.
      </p>
    </div>
  );
}
