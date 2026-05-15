import type { NextConfig } from "next";

// Supabase storage host derived from the project URL so we can whitelist
// remote images without an extra env var.
function supabaseImageHost(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
const sb = supabaseImageHost();
if (sb) remotePatterns.push({ protocol: "https", hostname: sb });
remotePatterns.push({ protocol: "https", hostname: "lh3.googleusercontent.com" }); // Google OAuth avatars
remotePatterns.push({ protocol: "https", hostname: "images.unsplash.com" });        // demo fallbacks

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;
