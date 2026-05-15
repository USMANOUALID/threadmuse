import { ArrowUpRight, Bookmark, Heart } from "lucide-react";
import type { Post } from "@/types";
import { LikeButton } from "@/components/social/like-button";
import { SaveButton } from "@/components/social/save-button";
import { isPostLikedByMe, isPostSavedByMe } from "@/lib/queries";
import { formatPrice } from "@/lib/format";

/**
 * Mobile-only sticky bottom action bar on /post/[slug]. Hidden on `md:` so the
 * desktop sidebar isn't duplicated. `pb-[env(safe-area-inset-bottom)]` keeps
 * the CTA off iOS home indicators.
 *
 * Server component — hydrates like/save state from the current session before
 * rendering the client buttons.
 */
export async function PostMobileCta({ post }: { post: Post }) {
  const { label, isFree } = formatPrice(post.price);
  const [liked, saved] = await Promise.all([
    isPostLikedByMe(post.id),
    isPostSavedByMe(post.id),
  ]);
  const signInRedirect = `/post/${post.slug}`;

  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line/10 bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-[0_-8px_24px_rgba(42,36,32,0.06)] md:hidden">
      <div className="flex items-center gap-2.5">
        <MobileIconShell>
          <SaveButton
            postId={post.id}
            initialActive={saved}
            variant="icon"
            signInRedirect={signInRedirect}
            className="size-11 rounded-md border border-line/10 bg-warm shadow-none"
          />
        </MobileIconShell>
        <MobileIconShell>
          <LikeButton
            postId={post.id}
            initialActive={liked}
            initialCount={post.likes}
            variant="icon"
            signInRedirect={signInRedirect}
            className="size-11 rounded-md border border-line/10 bg-warm shadow-none"
          />
        </MobileIconShell>
        <a
          href={post.etsyUrl ?? "#"}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-ink px-4 text-[14px] font-semibold text-bg shadow-cta"
        >
          {isFree ? "Get free download" : `Buy on Etsy · ${label}`}
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

/**
 * Wrapper so the SignInPrompt link from a button doesn't disturb the fixed
 * bar's flex layout — we hide overflow at the action-bar level and let the
 * button's internal Fragment render naturally.
 */
function MobileIconShell({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>;
}

/**
 * Static icon-shell tokens — exported so we can reuse the visual size/treatment
 * elsewhere if needed. Not currently consumed; left as a hook for Phase 5.
 */
export const MOBILE_CTA_ICON_TOKENS = {
  size: "size-11" as const,
  surface: "bg-warm" as const,
  iconHeart: Heart,
  iconBookmark: Bookmark,
};
