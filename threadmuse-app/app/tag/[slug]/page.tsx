import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { AdSlot } from "@/components/home/ad-slot";
import { RelatedSearches } from "@/components/search/related-searches";
import { getAllTags, getPosts } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";
import { slugify } from "@/lib/utils";
import { formatCount } from "@/lib/format";

export const revalidate = 600;

export async function generateStaticParams() {
  return [];
}


async function resolveTag(slug: string) {
  // Tag slugs are stored slugified — find the original by re-slugifying.
  const all = await getAllTags();
  return all.find((t) => slugify(t) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await resolveTag(slug);
  if (!tag) return { title: "Not found" };
  return buildMetadata({
    title: `#${tag} — designs tagged ${tag}`,
    description: `Every design on ThreadMuse tagged "${tag}". Save, share, and click through to the creator's Etsy shop.`,
    path: `/tag/${slug}`,
    keywords: [tag, `${tag} digital design`, `${tag} pattern`, `${tag} printable`],
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await resolveTag(slug);
  if (!tag) notFound();

  const posts = await getPosts({ tag, sort: "newest", limit: 24 });

  return (
    <PageShell>
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tags", href: "/tags" },
              { label: `#${tag}` },
            ]}
          />
          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-warm text-ink">
              <Tag className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-h1 font-semibold text-ink">#{tag}</h1>
              <p className="text-[13.5px] text-muted">
                <strong className="font-bold text-ink">{formatCount(posts.length)}</strong> designs tagged "{tag}"
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 pt-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          {posts.length > 0 ? (
            <MasonryFeed posts={posts} density="balanced" />
          ) : (
            <div className="rounded-2xl border border-dashed border-line/15 bg-surface p-10 text-center">
              <h2 className="font-display text-h3 font-semibold text-ink">No designs tagged #{tag} yet</h2>
              <p className="mt-1.5 text-[13px] text-muted">
                Be the first — add the <strong>#{tag}</strong> tag when you upload.
              </p>
            </div>
          )}
          <div className="mt-6">
            <AdSlot label={`Tag sponsor: #${tag} — 728×90`} />
          </div>
          <div className="mt-10">
            <RelatedSearches heading="Related searches" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
