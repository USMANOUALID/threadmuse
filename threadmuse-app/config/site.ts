import type { Metadata } from "next";

/**
 * Single source of truth for brand strings, URLs, and SEO defaults.
 * Anything user-facing should pull from here so a rebrand is a one-file change.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noiredge.ai";

export const siteConfig = {
  name: "NoirEdge",
  shortName: "NE",
  tagline: "The premium AI operating system for revenue teams.",
  description:
    "NoirEdge unifies AI workflows, customer intelligence, automation, and executive analytics in a premium SaaS platform built for high-growth teams.",
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  twitter: "@noiredgeai",
  pinterest: "noiredge",
  email: "hello@noiredge.ai",
  legalName: "NoirEdge Labs Inc.",
  founded: 2026,
  stats: {
    designs: "24M",
    creators: "1,200+",
    monthlyViewers: "99.98%",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Default metadata for any route that doesn't override it. */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "premium SaaS",
    "AI automation platform",
    "revenue operations software",
    "enterprise AI dashboard",
    "SaaS admin CMS",
    "customer intelligence",
    "workflow automation",
    "AI agency platform",
    "analytics dashboard",
    "modern SaaS website",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: siteConfig.twitter,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.svg", apple: "/icon.svg" },
  manifest: "/site.webmanifest",
  verification: { other: { "theme-color": "#09090b" } },
};
