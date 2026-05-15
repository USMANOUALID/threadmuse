import { Share2, Star } from "lucide-react";
import type { Creator } from "@/types";
import { Button } from "@/components/ui/button";
import { CreatorAvatar } from "@/components/ui/avatar";
import { FollowButton } from "@/components/social/follow-button";
import { hashSeed } from "@/lib/utils";

const tints = [
  "#f5cfc0", "#f7c0aa", "#eda692", "#f4a890",
  "#e8b4c8", "#d9a4a4", "#fadccb", "#f7d1b8",
  "#e89280", "#f0bba6",
] as const;

/**
 * Profile hero. The banner is a per-creator deterministic SVG gradient so we
 * don't need stored cover images yet. On mobile the avatar overlaps the banner
 * vertically; on desktop the avatar sits at the bottom-left over the banner.
 *
 * Follow button:
 *  - hidden when viewer is the profile owner
 *  - live (optimistic) when `creatorId` is supplied — page wires it
 */
export function ProfileHeader({
  creator,
  stats,
  creatorId,
  initialFollowing = false,
  isSelf = false,
}: {
  creator: Creator;
  stats: { uploads: number; followers: string; following: string; saves: number };
  /** profile.id of the creator — required to drive the Follow button. */
  creatorId?: string;
  initialFollowing?: boolean;
  isSelf?: boolean;
}) {
  const seed = hashSeed(creator.username);
  const c1 = tints[seed % tints.length]!;
  const c2 = tints[(seed + 4) % tints.length]!;
  const gid = `pb-${creator.username.replace(/\W/g, "")}`;

  const Banner = (
    <div className="relative h-32 overflow-hidden md:h-56 md:rounded-2xl">
      <svg
        viewBox="0 0 800 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="800" height="200" fill={`url(#${gid})`} />
        <g opacity="0.35" stroke="#fff" strokeWidth="1" fill="none">
          {Array.from({ length: 20 }).map((_, i) => (
            <path key={i} d={`M${i * 50} 0 q24 100 0 200`} />
          ))}
        </g>
      </svg>
    </div>
  );

  return (
    <header className="bg-bg">
      {/* Mobile */}
      <div className="md:hidden">
        {Banner}
        <div className="-mt-9 flex flex-col items-center px-4 pb-4">
          <div className="rounded-full bg-surface p-1 shadow-soft">
            <CreatorAvatar
              name={creator.name}
              username={creator.username}
              src={creator.avatarUrl}
              size="xl"
            />
          </div>
          <h1 className="mt-3 font-display text-h1 font-semibold text-ink">{creator.name}</h1>
          <p className="text-[12px] text-muted">
            @{creator.username} · {creator.location}
          </p>
          <p className="mt-2 text-balance px-6 text-center text-[13px] leading-relaxed text-ink/80">
            {creator.bio}
          </p>
          <ProfileInlineStats stats={stats} className="mt-3" />
          <div className="mt-3 flex w-full gap-2">
            {creatorId ? (
              <FollowButton
                targetUserId={creatorId}
                initialActive={initialFollowing}
                isSelf={isSelf}
                size="md"
                className="flex-1"
                signInRedirect={`/profile/${creator.username}`}
              />
            ) : (
              <Button className="flex-1">Follow</Button>
            )}
            <Button variant="outline" className="flex-1">Message</Button>
            <Button variant="outline" size="icon" aria-label="Share">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-[1440px] px-6 pt-6 lg:px-8 xl:px-12">
          {Banner}
          <div className="-mt-14 flex items-end gap-6 px-8">
            <div className="rounded-full bg-surface p-1.5 shadow-lift">
              <CreatorAvatar
                name={creator.name}
                username={creator.username}
                src={creator.avatarUrl}
                size="2xl"
              />
            </div>
            <div className="flex-1 pb-4">
              <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink">
                {creator.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[13px] text-muted">
                <span>@{creator.username}</span>
                <span aria-hidden>·</span>
                <span>{creator.location}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5" /> Top creator
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-4">
              {creatorId ? (
                <FollowButton
                  targetUserId={creatorId}
                  initialActive={initialFollowing}
                  isSelf={isSelf}
                  size="lg"
                  signInRedirect={`/profile/${creator.username}`}
                />
              ) : (
                <Button size="lg">Follow</Button>
              )}
              <Button size="lg" variant="outline">Message</Button>
              <Button size="icon" variant="outline" aria-label="Share">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-8 px-8 lg:grid-cols-[1.2fr_1fr]">
            <p className="text-pretty text-[14.5px] leading-relaxed text-ink/85">
              {creator.bio} A working studio in {creator.location} — releasing one new pattern and
              one new printable each week, hand-tested and small-batch. Every design comes with an
              Etsy listing and a free SEO-friendly preview here on ThreadMuse.
            </p>
            <dl className="grid grid-cols-4 gap-3">
              {[
                ["Uploads", String(stats.uploads)],
                ["Followers", stats.followers],
                ["Following", stats.following],
                ["Saves", abbrev(stats.saves)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-line/10 bg-surface p-4">
                  <dt className="text-[11.5px] text-muted">{label}</dt>
                  <dd className="font-display text-[22px] font-semibold tracking-tight text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileInlineStats({
  stats,
  className,
}: {
  stats: { uploads: number; followers: string; following: string; saves: number };
  className?: string;
}) {
  return (
    <dl className={`flex items-center gap-4 text-[12px] text-muted ${className ?? ""}`}>
      <div className="flex items-baseline gap-1">
        <dd className="font-bold text-ink">{stats.uploads}</dd>
        <dt>uploads</dt>
      </div>
      <div className="flex items-baseline gap-1">
        <dd className="font-bold text-ink">{stats.followers}</dd>
        <dt>followers</dt>
      </div>
      <div className="flex items-baseline gap-1">
        <dd className="font-bold text-ink">{stats.following}</dd>
        <dt>following</dt>
      </div>
    </dl>
  );
}

function abbrev(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return Math.round(n / 1000) + "k";
}
