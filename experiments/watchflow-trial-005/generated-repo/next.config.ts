import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: {
    root: process.cwd()
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/media/poster"
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
