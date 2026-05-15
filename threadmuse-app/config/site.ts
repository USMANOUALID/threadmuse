import type { Metadata } from "next";

/**
 * Single source of truth for brand strings, URLs, and SEO defaults.
 * Anything user-facing should pull from here so a rebrand is a one-file change.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://threadmuse.app";

export const siteConfig = {
  name: "ThreadMuse",
  shortName: "TM",
  tagline: "Discover beautiful digital designs.",
  description:
    "ThreadMuse is a discovery feed for independent makers — crochet patterns, wallpapers, printable art, planners, embroidery PDFs, SVG files and more.",
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  twitter: "@threadmuse",
  pinterest: "threadmuse",
  email: "hello@threadmuse.app",
  // Used in JSON-LD Organization markup (Phase 7).
  legalName: "ThreadMuse Inc.",
  founded: 2026,
  // Hard-coded so it survives Phase 2 + 3 swaps without breaking SEO numbers.
  stats: {
    designs: "108k",
    creators: "4,820",
    monthlyViewers: "1.6M",
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
    "crochet patterns",
    "free crochet patterns",
    "wallpapers",
    "pink wallpapers",
    "iPhone wallpapers",
    "printable wall art",
    "digital planners",
    "embroidery PDF",
    "knitting patterns",
    "SVG bundle",
    "sticker pack",
    "AI wall art",
    "Etsy digital downloads",
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
  // Pinterest Rich Pins: claim domain via meta tag in Phase 7.
  verification: { other: { "p:domain_verify": "TODO_PINTEREST_VERIFICATION" } },
};
