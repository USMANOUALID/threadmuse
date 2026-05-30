import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { buildMetadata } from "@/config/seo";
import { blogPosts } from "@/lib/saas-content";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Premium SaaS, AI automation, Supabase CMS, conversion, and analytics insights.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <MarketingPageShell>
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Blog"
          title="Insights for premium SaaS teams building with AI, CMS, and growth systems."
          description="Search-optimized thought leadership with CMS-ready structure for authors, categories, excerpts, covers, and metadata."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-line/10 bg-surface p-6 transition hover:border-accent/50 hover:shadow-lift">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{post.category}</p>
              <h2 className="mt-4 font-display text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between text-xs text-muted">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <Link href={`/blog#${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Read article <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
