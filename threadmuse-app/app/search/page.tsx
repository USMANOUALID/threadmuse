import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { buildMetadata } from "@/config/seo";
import { features } from "@/lib/saas-content";
import { getPublicBlogPosts, getPublicPricingPlans, getPublicServices } from "@/lib/cms-public";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return buildMetadata({
    title: q ? `Search results for "${q}"` : "Search",
    description: "Search NoirEdge features, services, pricing, and articles.",
    path: q ? `/search?q=${encodeURIComponent(q)}` : "/search",
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const [services, pricingPlans, blogPosts] = await Promise.all([
    getPublicServices(),
    getPublicPricingPlans(),
    getPublicBlogPosts(),
  ]);
  const searchIndex = [
    ...features.map((item) => ({ title: item.title, description: item.description, href: "/", type: "Feature" })),
    ...services.map((item) => ({ title: item.title, description: item.description, href: "/services", type: "Service" })),
    ...pricingPlans.map((item) => ({ title: `${item.name} plan`, description: item.description, href: "/pricing", type: "Pricing" })),
    ...blogPosts.map((item) => ({ title: item.title, description: item.excerpt, href: "/blog", type: "Article" })),
  ];
  const results = query
    ? searchIndex.filter((item) =>
        [item.title, item.description, item.type].join(" ").toLowerCase().includes(query),
      )
    : searchIndex;

  return (
    <MarketingPageShell>
      <section className="container py-20 md:py-28">
        <div className="rounded-3xl border border-line/10 bg-surface p-6 shadow-lift">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <Search className="size-4" />
            Search
          </div>
          <h1 className="mt-4 font-display text-display font-semibold">
            {query ? `Results for "${q}"` : "Search the NoirEdge platform"}
          </h1>
          <form className="mt-6 flex flex-col gap-3 rounded-2xl border border-line/10 bg-bg p-2 sm:flex-row" action="/search">
            <input
              name="q"
              defaultValue={q}
              placeholder="Try CMS, pricing, analytics, AI automation..."
              className="min-h-12 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted"
            />
            <button className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white" type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-4">
          {results.map((item) => (
            <Link
              key={`${item.type}-${item.title}`}
              href={item.href}
              className="rounded-3xl border border-line/10 bg-surface p-5 transition hover:border-accent/50"
            >
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{item.type}</span>
              <h2 className="mt-4 font-display text-2xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="rounded-3xl border border-line/10 bg-surface p-8 text-center text-muted">
              No results found. Try "pricing", "CMS", "AI", or "analytics".
            </div>
          )}
        </div>
      </section>
    </MarketingPageShell>
  );
}
