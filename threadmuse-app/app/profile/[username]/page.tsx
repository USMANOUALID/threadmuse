import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { SortMenuButton } from "@/components/feed/sort-toolbar";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  getAllCreatorUsernames,
  getCreatorByUsername,
  getCreatorStats,
  getPosts,
  getProfileIdByUsername,
  isFollowingUser,
} from "@/lib/queries";
import { getCurrentUserWithProfile } from "@/lib/auth/get-session";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const revalidate = 300;

export async function generateStaticParams() {
  return getAllCreatorUsernames();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) return { title: "Not found" };
  return buildMetadata({
    title: `${creator.name} (@${creator.username}) — designs on ThreadMuse`,
    description: creator.bio,
    path: `/profile/${creator.username}`,
    keywords: [creator.name, creator.username, "creator", "etsy", "digital designer"],
  });
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) notFound();

  const session = await getCurrentUserWithProfile();
  const isOwner = !!session && session.profile.username === creator.username;

  const [stats, ownPosts, creatorId] = await Promise.all([
    getCreatorStats(creator.username),
    getPosts({ creator: creator.username, sort: "newest", limit: 24 }),
    getProfileIdByUsername(creator.username),
  ]);
  const initialFollowing = creatorId ? await isFollowingUser(creatorId) : false;

  // Fall back to platform posts when a creator has none — keeps the feed lively
  // during the mock-data phase.
  const fallback = ownPosts.length < 4 ? await getPosts({ limit: 12 }) : [];
  const dedupe = new Set<string>();
  const feed = [...ownPosts, ...fallback].filter((p) => {
    if (dedupe.has(p.id)) return false;
    dedupe.add(p.id);
    return true;
  });

  return (
    <PageShell>
      <ProfileHeader
        creator={creator}
        stats={stats}
        creatorId={creatorId ?? undefined}
        initialFollowing={initialFollowing}
        isSelf={isOwner}
      />
      <ProfileTabs username={creator.username} active="uploads" className="mx-auto max-w-[1440px]" />

      <section className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-2">
          <ul className="flex gap-1.5">
            {["All", "Crochet", "Knitting", "Free only"].map((t, i) => (
              <li key={t}>
                <Button size="sm" pill variant={i === 0 ? "primary" : "outline"}>
                  {t}
                </Button>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            {isOwner && <SignOutButton variant="outline" size="sm" />}
            <SortMenuButton value="Newest" />
          </div>
        </div>

        <div className="mt-5">
          <MasonryFeed posts={feed} density="balanced" />
        </div>
      </section>

      {/* JSON-LD Person — creator schema for rich results. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: creator.name,
            alternateName: `@${creator.username}`,
            description: creator.bio,
            url: `${siteConfig.url}/profile/${creator.username}`,
            address: { "@type": "PostalAddress", addressLocality: creator.location },
          }),
        }}
      />
    </PageShell>
  );
}
