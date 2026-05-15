import Link from "next/link";
import { ArrowUpRight, Share2, Tag } from "lucide-react";
import type { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { CreatorAvatar } from "@/components/ui/avatar";
import { AdSlot } from "@/components/home/ad-slot";
import { LikeButton } from "@/components/social/like-button";
import { SaveButton } from "@/components/social/save-button";
import { FollowButton } from "@/components/social/follow-button";
import {
  getProfileIdByUsername,
  isFollowingUser,
  isPostLikedByMe,
  isPostSavedByMe,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth/get-session";
import { formatPrice } from "@/lib/format";

/**
 * Desktop right-rail on /post/[slug]. Sticky CTA block + creator card + ad.
 *
 * Server component — it hydrates the social toggle state from the current
 * user session and then hands typed initial state to the client buttons.
 *
 * The Etsy link carries `rel="sponsored noopener noreferrer"` — required for
 * Etsy's affiliate ToS and also tells Google this is monetised, protecting
 * organic ranking.
 */
export async function PostSidebar({ post }: { post: Post }) {
  const { label, isFree } = formatPrice(post.price);

  // Parallelise the four lookups — RSC dedupes via React cache().
  const [currentUser, liked, saved, creatorId] = await Promise.all([
    getCurrentUser(),
    isPostLikedByMe(post.id),
    isPostSavedByMe(post.id),
    getProfileIdByUsername(post.creator.username),
  ]);
  const following = creatorId ? await isFollowingUser(creatorId) : false;
  const isSelf = !!currentUser && !!creatorId && currentUser.id === creatorId;

  const signInRedirect = `/post/${post.slug}`;

  return (
    <aside className="flex w-full flex-col gap-3.5 lg:sticky lg:top-24">
      {/* CTA block */}
      <div className="rounded-lg border border-line/10 bg-surface p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          <Tag className="size-3.5" />
          {isFree ? "Free download" : `Premium · ${label}`}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {post.etsyUrl ? (
            <Button asChild size="lg">
              <a href={post.etsyUrl} target="_blank" rel="sponsored noopener noreferrer">
                {isFree ? "Get free download" : "View on Etsy"}
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          ) : (
            <Button size="lg" disabled>
              Coming soon
            </Button>
          )}
          <SaveButton
            postId={post.id}
            initialActive={saved}
            variant="tile"
            signInRedirect={signInRedirect}
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <LikeButton
            postId={post.id}
            initialActive={liked}
            initialCount={post.likes}
            variant="pill"
            signInRedirect={signInRedirect}
          />
          <Button variant="outline" size="sm" className="bg-bg">
            <Share2 className="size-3.5" />
            Share
          </Button>
          <SaveButton
            postId={post.id}
            initialActive={saved}
            variant="pill"
            signInRedirect={signInRedirect}
          />
        </div>
      </div>

      {/* Creator */}
      <div className="rounded-lg border border-line/10 bg-surface p-5">
        <div className="flex items-center gap-3">
          <CreatorAvatar
            name={post.creator.name}
            username={post.creator.username}
            src={post.creator.avatarUrl}
            size="md"
          />
          <div className="flex-1">
            <Link
              href={`/profile/${post.creator.username}`}
              className="block text-[13.5px] font-semibold text-ink hover:underline"
            >
              {post.creator.name}
            </Link>
            <div className="text-[11.5px] text-muted">
              @{post.creator.username} · {post.creator.followers}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{post.creator.bio}</p>
        {creatorId && (
          <FollowButton
            targetUserId={creatorId}
            initialActive={following}
            isSelf={isSelf}
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            label={{ idle: "Follow creator", active: "Following" }}
            signInRedirect={signInRedirect}
          />
        )}
      </div>

      <AdSlot size="sidebar" label="Skyscraper sidebar slot — kept calm to protect UX" />
    </aside>
  );
}
