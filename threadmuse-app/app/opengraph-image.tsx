import { ImageResponse } from "next/og";
import { counters, iptvBrand } from "@/components/iptv/data";

// Route segment config for /opengraph-image
export const runtime = "edge";
export const alt = `${iptvBrand.name} - ${iptvBrand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph image for the premium IPTV landing page.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background:
          "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.35), transparent 32%), radial-gradient(circle at 82% 22%, rgba(168,85,247,0.38), transparent 34%), linear-gradient(135deg, #020617 0%, #0f172a 48%, #111827 100%)",
        fontFamily: "system-ui",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: "linear-gradient(135deg, #67e8f9, #8b5cf6)",
            color: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 900,
          }}
        >
          AV
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.5 }}>{iptvBrand.name}</div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#a5f3fc",
            }}
          >
            Premium IPTV
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            fontSize: 82,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 0.96,
            maxWidth: 980,
          }}
        >
          Luxury IPTV for live TV, sports, movies and 4K streaming.
        </div>
        <div style={{ fontSize: 26, color: "#cbd5e1", maxWidth: 960 }}>
          25,000+ channels, 120,000+ VOD, 99.9% uptime and premium device setup.
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {counters.map((counter) => (
          <div
            key={counter.label}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "16px 20px",
              minWidth: 150,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 900 }}>{counter.value}</div>
            <div
              style={{
                marginTop: 3,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2,
                color: "#a5f3fc",
                textTransform: "uppercase",
              }}
            >
              {counter.label}
            </div>
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
