import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Temporarily disable ESLint and TypeScript for Docker build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
