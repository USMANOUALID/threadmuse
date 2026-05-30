import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import type { Post, CardLayout } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CreatorAvatar } from "@/components/ui/avatar";
import { PostIllustration } from "@/components/feed/post-illustration";
import { SaveButton } from "@/components/social/save-button";
import { formatCount, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Pinterest-style post tile.
 *
 *  layout="full"    — image · title · creator · Etsy CTA (default per spec)
 *  layout="info"    — image · title · creator
 *  layout="minimal" — image only (price chip overlaid)
 *
 * Server-renderable. The save overlay is a real client toggle (Phase 4):
 * pass `initialSaved` from a feed-level batch lookup; falls back to false.
 */
export function PostCard({
  post,
  layout = "full",
  priority: _priority = false,
  initialSaved = false,
}: {
  post: Post;
  layout?: CardLayout;
  /** Hint for image priority once we move from inline SVG to <Image>. */
  priority?: boolean;
  /** Hydrated by the feed wrapper from a single batched lookup. */
  initialSaved?: boolean;
}) {
  const { label, isFree } = formatPrice(post.price);

  // Map illustration aspect roughly to a CSS aspect-ratio so the masonry
  // gets useful variance without us needing real image dimensions yet.
  const ratio = (300 / post.illustrationHeight).toFixed(4);

  return (
    <article
      className={cn(
        "tm-card group relative isolate flex flex-col",
        "transition-shadow duration-200 hover:shadow-lift",
      )}
    >
      <Link
        href={`/post/${post.slug}`}
        className="relative block overflow-hidden rounded-t-lg"
        style={{ aspectRatio: ratio }}
        aria-label={post.title}
      >
        <PostIllustration kind={post.kind} seed={post.id} />

        {/* Price / Free chip */}
        <Badge
          variant={isFree ? "free" : "price"}
          className="absolute left-2.5 top-2.5"
        >
          {label}
        </Badge>

        {/* Save heart */}
        <SaveButton
          postId={post.id}
          initialActive={initialSaved}
          variant="icon"
          className="absolute right-2.5 top-2.5"
        />

        {/* Quick-action overlay on hover (desktop only) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 items-end p-2.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-ink/90 px-3 py-1.5 text-[11px] font-semibold text-bg backdrop-blur-sm">
            Open <ArrowUpRight className="size-3" />
          </span>
        </div>
      </Link>

      {layout !== "minimal" && (
        <div className="flex flex-col gap-2.5 p-3.5">
          <Link
            href={`/post/${post.slug}`}
            className="text-pretty text-[13.5px] font-medium leading-snug text-ink"
          >
            {post.title}
          </Link>

          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.creator.username}`} className="flex items-center gap-2">
              <CreatorAvatar
                name={post.creator.name}
                username={post.creator.username}
                src={post.creator.avatarUrl}
                size="xs"
              />
              <span className="text-[12px] text-muted">{post.creator.name}</span>
            </Link>
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted">
              <Heart className="size-3" /> {formatCount(post.likes)}
            </span>
          </div>

          {layout === "full" && (
            <a
              href={post.etsyUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line/10 bg-warm px-3 py-2 text-[12px] font-semibold text-ink hover:bg-sand"
            >
              View on Etsy
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      )}

      {layout === "minimal" && (
        <span className="sr-only">
          {post.title} by {post.creator.name}
        </span>
      )}
    </article>
  );
}
