import type { Metadata, Viewport } from "next";
import { IptvHomepage } from "@/components/iptv/homepage";
import { counters, faqs, iptvBrand, plans } from "@/components/iptv/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astraview.tv";
const pageTitle = "AstraView - Luxury IPTV for Live TV, Sports, Movies and 4K Streaming";
const pageDescription =
  "AstraView is a premium IPTV landing experience for 25,000+ channels, 120,000+ VOD, 99.9% uptime, 4K UHD streaming, flexible plans, and guided device setup.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: `%s | ${iptvBrand.name}`,
  },
  description: pageDescription,
  applicationName: iptvBrand.name,
  authors: [{ name: iptvBrand.name, url: siteUrl }],
  creator: iptvBrand.name,
  publisher: iptvBrand.name,
  category: "Entertainment",
  classification: "Premium IPTV streaming service",
  keywords: [
    "premium IPTV",
    "luxury IPTV",
    "live TV streaming",
    "sports IPTV",
    "movies and series IPTV",
    "4K IPTV",
    "UHD IPTV",
    "Smart TV IPTV",
    "IPTV subscription",
    "IPTV VOD",
    "streaming TV service",
    "cable alternative",
  ],
  alternates: { canonical: "/" },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: iptvBrand.name,
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AstraView premium IPTV dashboard with live TV, sports, VOD, and 4K streaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#020617",
    "color-scheme": "dark",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": iptvBrand.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: iptvBrand.name,
  image: `${siteUrl}/opengraph-image`,
  description: pageDescription,
  brand: { "@type": "Brand", name: iptvBrand.name },
  category: "IPTV streaming service",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "18400",
  },
  additionalProperty: counters.map((counter) => ({
    "@type": "PropertyValue",
    name: `${counter.value} ${counter.label}`,
    value: counter.detail,
  })),
  offers: plans.map((plan) => ({
    "@type": "Offer",
    name: `${iptvBrand.name} ${plan.name}`,
    priceCurrency: "USD",
    price: plan.price.replace("$", ""),
    availability: "https://schema.org/InStock",
    description: plan.description,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: iptvBrand.name,
  url: siteUrl,
  email: iptvBrand.email,
  telephone: iptvBrand.phone,
  slogan: iptvBrand.tagline,
  logo: `${siteUrl}/opengraph-image`,
  sameAs: [siteUrl],
};

export default function HomePage() {
  return (
    <>
      <IptvHomepage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
