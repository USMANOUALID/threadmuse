import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Post, CategorySlug } from "@/types";
import { PostCard } from "@/components/feed/post-card";
import { categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * 4-up "More like this" row at the bottom of /post/[slug]. Links the
 * "See all" CTA to the post's own category so internal SEO graph is dense.
 */
export function RelatedPosts({
  posts,
  category,
  heading = "More like this",
  className,
}: {
  posts: Post[];
  category: CategorySlug;
  heading?: string;
  className?: string;
}) {
  const cat = categories.find((c) => c.slug === category);

  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className={cn("mt-12", className)}>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="related-heading" className="font-display text-[22px] font-semibold tracking-tight text-ink">
          {heading}
        </h2>
        {cat && (
          <Link href={`/category/${cat.slug}`} className="tm-section-link hover:underline">
            See all {cat.name.toLowerCase()}
            <ChevronRight className="size-3.5" />
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {posts.slice(0, 4).map((p) => (
          <li key={p.id}>
            <PostCard post={p} layout="info" />
          </li>
        ))}
      </ul>
    </section>
  );
}
