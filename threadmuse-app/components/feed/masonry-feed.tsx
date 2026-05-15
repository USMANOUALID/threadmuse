import type { Post, CardLayout } from "@/types";
import { PostCard } from "@/components/feed/post-card";
import { getSavedPostIds } from "@/lib/queries";
import { cn } from "@/lib/utils";

/**
 * CSS-columns masonry feed. No JS, no layout shift, SSR-friendly.
 *
 *   < 640px  → 2 cols   (mobile)
 *   640–1024 → 3 cols   (tablet)
 *   1024–1280→ 4 cols
 *   ≥ 1280   → 5 cols   (wide desktop)
 *
 * `density` lets a parent override that scale. Server component — it
 * batch-fetches "which of these posts have I saved?" in one round-trip and
 * hydrates each card's `initialSaved`. Anonymous viewers skip the lookup.
 */
export type FeedDensity = "airy" | "balanced" | "dense";

const densityClass: Record<FeedDensity, string> = {
  airy:     "columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-3 [column-gap:1rem]",
  balanced: "columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-4 [column-gap:0.875rem]",
  dense:    "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-5 [column-gap:0.75rem]",
};

export async function MasonryFeed({
  posts,
  layout = "full",
  density = "balanced",
  className,
}: {
  posts: Post[];
  layout?: CardLayout;
  density?: FeedDensity;
  className?: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line/15 bg-surface p-10 text-center">
        <p className="text-[14px] text-muted">No designs to show yet.</p>
      </div>
    );
  }

  const savedSet = await getSavedPostIds(posts.map((p) => p.id));

  return (
    <div className={cn("masonry-column", densityClass[density], className)}>
      {posts.map((post, i) => (
        <div key={post.id} className="mb-3.5 break-inside-avoid">
          <PostCard
            post={post}
            layout={layout}
            priority={i < 4}
            initialSaved={savedSet.has(post.id)}
          />
        </div>
      ))}
    </div>
  );
}
