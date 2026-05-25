import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

// Route segment config for /opengraph-image
export const runtime = "edge";
export const alt = `${siteConfig.name} - ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default site-wide OG image. Per-post / per-category routes can ship their
 * own opengraph-image.tsx alongside their page.tsx.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #05070d 0%, #111827 55%, #e11d2e 100%)",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: "#e11d2e", color: "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, fontWeight: 700,
            }}
          >
            STV
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#ffffff", letterSpacing: -0.5 }}>
            {siteConfig.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 88, fontWeight: 700, color: "#ffffff",
              letterSpacing: -2, lineHeight: 1, maxWidth: 980,
            }}
          >
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#cbd5e1", maxWidth: 900 }}>
            17,000+ channels, 100,000+ VOD titles, 4K streaming, and premium IPTV support.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
