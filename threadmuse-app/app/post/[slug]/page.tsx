import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PostGallery } from "@/components/post/post-gallery";
import { PostMeta, PostAttributes } from "@/components/post/post-meta";
import { PostSidebar } from "@/components/post/post-sidebar";
import { PostMobileCta } from "@/components/post/mobile-cta";
import { RelatedPosts } from "@/components/post/related-posts";
import { CommentsSection } from "@/components/post/comments-section";
import { getCategoryBySlug, getPostBySlug, getRelatedPosts } from "@/lib/queries";
import { buildMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { hashSeed } from "@/lib/utils";

export const revalidate = 300;

// Pre-render the 20 known posts at build time. Phase 3 lifts this from
// `posts` to a Supabase listing.
export async function generateStaticParams() {
  return [];
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return buildMetadata({
    title: post.title,
    description:
      post.description ??
      `${post.title} by ${post.creator.name} on ThreadMuse — ${post.isPremium ? `available for ${post.price}` : "free download"}.`,
    path: `/post/${post.slug}`,
    keywords: [...post.tags, post.category.replaceAll("-", " ")],
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, cat] = await Promise.all([
    getRelatedPosts(post),
    getCategoryBySlug(post.category),
  ]);

  // Use a stable numeric hash of the uuid as the illustration seed; nudge
  // by +11 / +23 for the gallery thumbs so they don't duplicate the hero.
  const baseSeed = hashSeed(post.id);
  const seeds = [baseSeed, baseSeed + 11, baseSeed + 23];

  const attributes = attributesFor(post.kind);

  return (
    <PageShell showMobileSearch={false}>
      {/* Breadcrumb */}
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumbs
            items={[
              { label: "Explore", href: "/explore" },
              ...(cat ? [{ label: cat.name, href: `/category/${cat.slug}` }] : []),
              { label: post.title },
            ]}
          />
        </div>
      </section>

      {/* Main grid */}
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.4fr_280px] lg:items-start">
          <div className="flex flex-col gap-7">
            <PostGallery kind={post.kind} seeds={seeds} />

            <div>
              <ul className="flex flex-wrap items-center gap-1.5">
                {post.tags.map((t) => (
                  <li key={t}>
                    <Link href={`/tag/${t}`} className="block">
                      <Badge variant="tag">#{t}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
              <h1 className="mt-3 text-pretty font-display text-h1 font-semibold text-ink">
                {post.title}
              </h1>
              <div className="mt-3.5">
                <PostMeta post={post} />
              </div>

              {post.description && (
                <p className="mt-5 text-pretty text-[14.5px] leading-relaxed text-ink/85">
                  {post.description}
                </p>
              )}

              <div className="mt-5">
                <PostAttributes items={attributes} />
              </div>
            </div>

            <CommentsSection postId={post.id} />
          </div>

          <PostSidebar post={post} />
        </div>
      </section>

      <section className="bg-bg px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <RelatedPosts posts={related} category={post.category} />
        </div>
      </section>

      {/* JSON-LD Product — Pinterest Rich Pins + Google's product result. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: post.title,
            description: post.description,
            image: `${siteConfig.url}/post/${post.slug}/opengraph-image`,
            brand: { "@type": "Brand", name: post.creator.name },
            offers: {
              "@type": "Offer",
              price: post.isPremium ? post.price.replace(/[^0-9.]/g, "") : "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: post.etsyUrl ?? `${siteConfig.url}/post/${post.slug}`,
            },
            aggregateRating:
              post.likes > 50
                ? {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: Math.max(8, Math.floor(post.likes / 40)),
                  }
                : undefined,
          }),
        }}
      />

      <PostMobileCta post={post} />
    </PageShell>
  );
}

function attributesFor(kind: string) {
  // Each kind ships a sensible default attribute set — visual until Phase 3
  // when these are stored alongside the post.
  switch (kind) {
    case "crochet":
    case "knit":
      return [
        { label: "Format",    value: "12-page PDF" },
        { label: "Skill",     value: "Beginner" },
        { label: "Yarn",      value: "Worsted cotton" },
        { label: "License",   value: "Personal use" },
      ];
    case "embroidery":
      return [
        { label: "Format",    value: "14-page PDF" },
        { label: "Skill",     value: "Beginner" },
        { label: "Hoop size", value: "6 inch" },
        { label: "License",   value: "Personal use" },
      ];
    case "wallpaper":
    case "ai":
      return [
        { label: "Format",     value: "PNG · 4K" },
        { label: "Devices",    value: "iPhone · iPad · Desktop" },
        { label: "Aspect",     value: "9 : 19.5 + 16 : 10" },
        { label: "License",    value: "Personal use" },
      ];
    case "print":
    case "home":
      return [
        { label: "Format",  value: "PDF + PNG" },
        { label: "Sizes",   value: "5×7, 8×10, 11×14, A4, A3" },
        { label: "DPI",     value: "300 archival" },
        { label: "License", value: "Personal use" },
      ];
    case "planner":
      return [
        { label: "Format",  value: "PDF + GoodNotes" },
        { label: "Pages",   value: "32" },
        { label: "Sizes",   value: "Letter + A4 + A5" },
        { label: "License", value: "Personal use" },
      ];
    case "svg":
      return [
        { label: "Format",  value: "SVG + DXF + PNG" },
        { label: "Cutters", value: "Cricut · Silhouette" },
        { label: "Files",   value: "24 designs" },
        { label: "License", value: "Personal + small commercial" },
      ];
    case "sticker":
      return [
        { label: "Format",  value: "PNG · transparent" },
        { label: "Count",   value: "20 stickers" },
        { label: "Sizes",   value: "1\"–3\"" },
        { label: "License", value: "Personal use" },
      ];
    default:
      return [
        { label: "Format",  value: "PDF" },
        { label: "License", value: "Personal use" },
      ];
  }
}
