import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Post } from "@/types";
import { PostCard } from "@/components/feed/post-card";
import { cn } from "@/lib/utils";

/**
 * Trending strip. Renders as a 6-up grid on `lg:`, a horizontal scroller on
 * smaller screens (mobile-first feel — swipeable to discover).
 */
export function TrendingRow({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <section
      aria-labelledby="trending-heading"
      className={cn("bg-bg px-4 pb-2 pt-6 sm:px-6 lg:px-8 xl:px-12", className)}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="trending-heading" className="tm-section-title">
              Trending this week
            </h2>
            <p className="mt-1 text-[13px] text-muted">Most viewed across all categories</p>
          </div>
          <Link href="/trending" className="tm-section-link hover:underline">
            Open trending <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Mobile rail */}
        <ul className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 lg:hidden">
          {posts.map((p) => (
            <li key={p.id} className="w-44 shrink-0">
              <PostCard post={p} layout="info" />
            </li>
          ))}
        </ul>

        {/* Desktop 6-up */}
        <ul className="hidden grid-cols-6 gap-3.5 lg:grid">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard post={p} layout="info" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
