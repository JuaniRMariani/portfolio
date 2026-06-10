import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — deployable on Cloudflare (output dir: out/).
  // The / -> /en redirect lives in public/_redirects (Cloudflare format).
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
