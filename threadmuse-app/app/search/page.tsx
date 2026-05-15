import type { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FilterSidebar } from "@/components/feed/filter-sidebar";
import { MasonryFeed } from "@/components/feed/masonry-feed";
import { AdSlot } from "@/components/home/ad-slot";
import { SearchAutocomplete } from "@/components/search/search-autocomplete";
import { RelatedSearches } from "@/components/search/related-searches";
import { searchPosts } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";

// Search results are personalised + can include user queries — never indexed.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const trimmed = q.trim();
  return buildMetadata({
    title: trimmed ? `Search · ${trimmed}` : "Search ThreadMuse",
    description: trimmed
      ? `Search results for "${trimmed}" on ThreadMuse — crochet patterns, wallpapers, printable art and more.`
      : "Search 100,000+ designs from independent makers.",
    path: trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search",
    noIndex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const trimmed = q.trim();
  const results = trimmed ? await searchPosts(trimmed, 24) : [];

  return (
    <PageShell showMobileSearch={false}>
      {/* Search header */}
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Search" }, ...(trimmed ? [{ label: trimmed }] : [])]}
          />
          <div className="mt-4 max-w-[680px]">
            <form
              action="/search"
              method="GET"
              role="search"
              className="flex items-center gap-3 rounded-lg border-[1.5px] border-ink bg-bg px-4 py-3"
            >
              <SearchIcon className="size-[18px] text-ink" aria-hidden />
              <input
                type="search"
                name="q"
                defaultValue={trimmed}
                placeholder="Try “pink wallpaper”, “granny square”…"
                aria-label="Search"
                autoComplete="off"
                className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
              />
              <button type="submit" className="text-[11px] text-muted">↵ to search</button>
            </form>

            {/* Suggestions panel (server-rendered) */}
            <div className="mt-2">
              <SearchAutocomplete
                q={trimmed}
                recent={["boho phone wallpaper", "free crochet flower", "cottagecore desktop"]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* H1 / result count */}
      <section className="bg-bg px-4 pt-7 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          {trimmed ? (
            <>
              <h1 className="font-display text-display font-semibold tracking-tight text-ink">
                {prettyQuery(trimmed)}
              </h1>
              <p className="mt-2 text-[14px] text-muted">
                <strong className="font-semibold text-ink">{results.length}</strong>{" "}
                {results.length === 1 ? "result" : "results"}
                {" · "}
                <span>curated by ThreadMuse · refreshed 6 hours ago</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-h1 font-semibold text-ink">Search ThreadMuse</h1>
              <p className="mt-2 max-w-[640px] text-[14px] text-muted">
                Find crochet patterns, wallpapers, printable art and more from 4,820 creators.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Results grid */}
      <section className="bg-bg px-4 pt-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-7 lg:grid-cols-[240px_1fr] lg:items-start">
          <FilterSidebar className="hidden lg:block" />
          <div>
            {trimmed && results.length === 0 && <NoResults q={trimmed} />}
            {results.length > 0 && <MasonryFeed posts={results} density="balanced" />}
            {!trimmed && (
              <div className="rounded-2xl border border-dashed border-line/15 bg-surface p-10 text-center">
                <h2 className="font-display text-h3 font-semibold text-ink">Start searching</h2>
                <p className="mt-1.5 text-[13px] text-muted">
                  Try a tag, a color or a category. Cmd / Ctrl + K from anywhere.
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-6">
                <AdSlot label="Pinterest-style sponsored row · 728×90" />
              </div>
            )}

            <div className="mt-10">
              <RelatedSearches heading="Related searches" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function prettyQuery(q: string) {
  return q
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function NoResults({ q }: { q: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line/15 bg-surface p-10 text-center">
      <h2 className="font-display text-h3 font-semibold text-ink">
        No matches for "{q}" — yet.
      </h2>
      <p className="mt-1.5 text-[13px] text-muted">
        Try fewer words, a different palette, or browse categories below.
      </p>
    </div>
  );
}
