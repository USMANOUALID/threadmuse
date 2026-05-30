import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { defaultMetadata, siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  preload: true,
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.name,
                url: siteConfig.url,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${siteConfig.url}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteConfig.legalName,
                url: siteConfig.url,
                email: siteConfig.email,
                foundingDate: String(siteConfig.founded),
                logo: `${siteConfig.url}/icon.svg`,
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
