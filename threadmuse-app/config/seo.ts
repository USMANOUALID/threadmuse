import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Per-page metadata builder. Use in `generateMetadata` for any dynamic route.
 *
 *   export async function generateMetadata({ params }): Promise<Metadata> {
 *     const post = await getPost(params.slug);
 *     return buildMetadata({
 *       title: post.title,
 *       description: post.description,
 *       path: `/post/${post.slug}`,
 *       image: post.coverImageUrl,
 *     });
 *   }
 */
export function buildMetadata(opts: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = new URL(opts.path, siteConfig.url).toString();
  const image = opts.image ?? siteConfig.ogImage;
  const description = opts.description ?? siteConfig.description;

  return {
    title: opts.title,
    description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description,
      images: [image],
      creator: siteConfig.twitter,
    },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
  };
}
