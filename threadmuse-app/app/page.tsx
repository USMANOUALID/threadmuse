import type { Metadata, Viewport } from "next";
import { IptvHomepage, iptvBrand, iptvFaqs, iptvPlans } from "@/components/iptv/homepage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astraview.tv";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AstraView - Premium IPTV for Live TV, Sports, Movies and Series",
  description:
    "AstraView is a premium IPTV service concept with live channels, sports, movies, series, 4K-ready streams, device setup support, and flexible plans.",
  applicationName: iptvBrand.name,
  authors: [{ name: iptvBrand.name, url: siteUrl }],
  creator: iptvBrand.name,
  keywords: [
    "premium IPTV",
    "live TV streaming",
    "sports IPTV",
    "movies and series IPTV",
    "4K IPTV",
    "Smart TV IPTV",
    "IPTV subscription",
    "streaming TV service",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: iptvBrand.name,
    title: "AstraView - Premium IPTV for every screen",
    description:
      "Stream live TV, sports, movies, and series with premium stability, device compatibility, and guided setup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstraView - Premium IPTV for every screen",
    description:
      "Stream live TV, sports, movies, and series with premium stability, device compatibility, and guided setup.",
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
  description:
    "Premium IPTV service concept with live channels, sports, movies, series, device support, and flexible plans.",
  brand: { "@type": "Brand", name: iptvBrand.name },
  offers: iptvPlans.map((plan) => ({
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
  mainEntity: iptvFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
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
    </>
  );
}
