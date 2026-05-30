import Link from "next/link";
import { Bookmark } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { Button } from "@/components/ui/button";
import { getMySavedPosts } from "@/lib/queries";

export default async function SavedPage() {
  const posts = await getMySavedPosts();

  return (
    <PageShell>
      <section className="bg-bg px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Bookmark className="size-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Library</p>
              <h1 className="font-display text-display font-semibold text-ink">Saved posts</h1>
            </div>
          </div>
          {posts.length > 0 ? <MasonryFeed posts={posts} density="balanced" /> : (
            <div className="rounded-3xl border border-line/10 bg-surface p-10 text-center">
              <h2 className="font-display text-2xl font-semibold">No saved posts yet</h2>
              <p className="mt-2 text-sm text-muted">Save posts from the feed to build your private library.</p>
              <Button asChild className="mt-5"><Link href="/explore">Explore posts</Link></Button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
