import { Eye, Heart, Bookmark } from "lucide-react";
import type { Post } from "@/types";
import { formatNumber, formatRelativeTime } from "@/lib/format";

export function PostMeta({ post }: { post: Post }) {
  return (
    <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-muted">
      <div className="flex items-center gap-1.5">
        <Eye className="size-3.5" />
        <dt className="sr-only">Views</dt>
        <dd>{formatNumber(post.views)} views</dd>
      </div>
      <div className="flex items-center gap-1.5">
        <Heart className="size-3.5" />
        <dt className="sr-only">Likes</dt>
        <dd>{formatNumber(post.likes)} likes</dd>
      </div>
      <div className="flex items-center gap-1.5">
        <Bookmark className="size-3.5" />
        <dt className="sr-only">Saves</dt>
        <dd>{formatNumber(post.saves)} saves</dd>
      </div>
      <div className="ml-auto">
        <dt className="sr-only">Posted</dt>
        <dd>Posted {formatRelativeTime(post.createdAt)}</dd>
      </div>
    </dl>
  );
}

/** 4-col attribute table — Format / Skill / Hoop size / License. */
export function PostAttributes({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-3.5 border-y border-line/10 py-4 sm:grid-cols-4">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">
            {label}
          </dt>
          <dd className="mt-1 text-[13.5px] font-medium text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
