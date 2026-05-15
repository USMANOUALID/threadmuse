import { Heart } from "lucide-react";
import Link from "next/link";
import { CreatorAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format";
import { getCommentsForPost } from "@/lib/queries";
import { getCurrentUserWithProfile } from "@/lib/auth/get-session";
import { createComment } from "@/app/actions/comments";

/**
 * Real comment thread, fetched server-side. Posting is a server action
 * (`createComment`) — no client JS needed for the happy path. Phase 5 adds
 * optimistic updates + replies.
 */
export async function CommentsSection({ postId }: { postId: string }) {
  const [comments, currentUser] = await Promise.all([
    getCommentsForPost(postId),
    getCurrentUserWithProfile(),
  ]);

  return (
    <section aria-labelledby="comments-heading" className="mt-2">
      <h3 id="comments-heading" className="font-display text-[18px] font-semibold text-ink">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </h3>

      {currentUser ? (
        <form
          action={async (formData) => {
            "use server";
            await createComment({ postId, body: String(formData.get("body") ?? "") });
          }}
          className="mt-3.5 flex items-center gap-3 rounded-md border border-line/10 bg-surface p-3"
        >
          <CreatorAvatar
            name={currentUser.profile.name}
            username={currentUser.profile.username}
            src={currentUser.profile.avatar_url ?? undefined}
            size="sm"
          />
          <Input
            name="body"
            required
            maxLength={2000}
            placeholder="Leave a kind comment…"
            className="h-9 flex-1 border-0 bg-transparent px-1 focus-visible:ring-0"
          />
          <Button type="submit" size="sm">
            Post
          </Button>
        </form>
      ) : (
        <div className="mt-3.5 flex items-center gap-3 rounded-md border border-line/10 bg-warm p-3">
          <p className="flex-1 text-[13px] text-ink">Sign in to leave a comment.</p>
          <Button asChild size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      )}

      {comments.length > 0 ? (
        <ul className="mt-1">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex items-start gap-3 border-b border-line/10 py-3.5 last:border-b-0"
            >
              <CreatorAvatar
                name={c.author.name}
                username={c.author.username}
                src={c.author.avatarUrl}
                size="sm"
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <Link
                    href={`/profile/${c.author.username}`}
                    className="text-[12.5px] font-semibold text-ink hover:underline"
                  >
                    {c.author.name}
                  </Link>
                  <span className="text-[11.5px] text-muted">{formatRelativeTime(c.createdAt)}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-ink/90">
                  {c.body}
                </p>
                <div className="mt-1.5 flex items-center gap-3.5 text-[11.5px] text-muted">
                  <button type="button" className="inline-flex items-center gap-1 hover:text-ink">
                    <Heart className="size-3" /> {c.likes}
                  </button>
                  <button type="button" className="hover:text-ink">
                    Reply
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-md border border-dashed border-line/15 bg-surface p-5 text-center text-[13px] text-muted">
          Be the first to comment.
        </p>
      )}
    </section>
  );
}
