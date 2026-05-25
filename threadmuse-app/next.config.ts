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
remotePatterns.push({ protocol: "https", hostname: "lh3.googleusercontent.com" });
remotePatterns.push({ protocol: "https", hostname: "images.unsplash.com" });

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
  async redirects() {
    return [
      { source: "/explore", destination: "/pricing", permanent: false },
      { source: "/trending", destination: "/", permanent: false },
      { source: "/categories", destination: "/pricing", permanent: false },
      { source: "/upload", destination: "/reseller", permanent: false },
      { source: "/search", destination: "/pricing", permanent: false },
      { source: "/signup", destination: "/free-trial", permanent: false },
      { source: "/login", destination: "/free-trial", permanent: false },
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/settings/billing", destination: "/pricing", permanent: false },
      { source: "/profile", destination: "/", permanent: false },
      { source: "/category/:path*", destination: "/pricing", permanent: false },
      { source: "/tag/:path*", destination: "/", permanent: false },
      { source: "/post/:path*", destination: "/", permanent: false },
      { source: "/profile/:path*", destination: "/", permanent: false },
    ];
  },
};

export default config;
