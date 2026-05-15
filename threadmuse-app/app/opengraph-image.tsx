import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

// Route segment config for /opengraph-image
export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
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
          background: "linear-gradient(135deg, #fdfaf6 0%, #f9efe4 60%, #f4a8a8 100%)",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: "#2a2420", color: "#fdfaf6",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, fontWeight: 700,
            }}
          >
            TM
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#2a2420", letterSpacing: -0.5 }}>
            {siteConfig.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 88, fontWeight: 700, color: "#2a2420",
              letterSpacing: -2, lineHeight: 1, maxWidth: 980,
            }}
          >
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#7a6f66", maxWidth: 900 }}>
            Crochet patterns, wallpapers, printable art & more — from independent makers.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
