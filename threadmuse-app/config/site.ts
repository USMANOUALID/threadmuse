import type { Metadata } from "next";

/**
 * Single source of truth for brand strings, URLs, and SEO defaults.
 * Anything user-facing should pull from here so a rebrand is a one-file change.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seusytv.com";

export const siteConfig = {
  name: "SeusyTV",
  shortName: "STV",
  tagline: "Premium IPTV streaming for every screen.",
  description:
    "SeusyTV delivers premium IPTV subscriptions for Canada and the UK with 40,000+ live channels, 180,000+ movies and series, 24h trial access, reseller plans, tutorials, and priority support.",
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  twitter: "@seusytv",
  pinterest: "seusytv",
  email: "support@seusytv.com",
  legalName: "SeusyTV",
  founded: 2026,
  stats: {
    designs: "180k+",
    creators: "40k+",
    monthlyViewers: "24h",
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
    "IPTV subscription",
    "best IPTV provider",
    "best IPTV Canada",
    "best IPTV UK",
    "premium IPTV",
    "IPTV free trial",
    "IPTV reseller",
    "4K IPTV",
    "live TV streaming",
    "sports IPTV",
    "movies and series IPTV",
    "Fire Stick IPTV",
    "Smart TV IPTV",
    "IPTV tutorial",
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
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
};
