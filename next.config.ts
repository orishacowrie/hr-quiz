import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @cloudflare/next-on-pages
  // All server-side routes run on the Cloudflare Workers edge runtime
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
