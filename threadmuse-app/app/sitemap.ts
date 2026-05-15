import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllCategories, getAllCreatorUsernames, getAllTags, getPosts } from "@/lib/queries";
import { slugify } from "@/lib/utils";

/**
 * Dynamic sitemap. Hits Supabase for the moving parts (posts, profiles, tags)
 * + a fixed list of marketing routes. Sitemap output is cached at the edge
 * for an hour via Next's default route segment behaviour.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [categories, posts, creators, tags] = await Promise.all([
    getAllCategories(),
    getPosts({ limit: 5000, sort: "newest" }),
    getAllCreatorUsernames(),
    getAllTags(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url,                  lastModified: now, changeFrequency: "daily",   priority: 1   },
    { url: `${siteConfig.url}/explore`,     lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${siteConfig.url}/trending`,    lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${siteConfig.url}/categories`,  lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${siteConfig.url}/upload`,      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/login`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${siteConfig.url}/signup`,      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${siteConfig.url}/tag/${slugify(t)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteConfig.url}/post/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const creatorRoutes: MetadataRoute.Sitemap = creators.map((c) => ({
    url: `${siteConfig.url}/profile/${c.username}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...postRoutes, ...creatorRoutes];
}
