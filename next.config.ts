import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone output for Docker deployment
  output: 'standalone',
  // Disable telemetry for production builds
  experimental: {
    // This is experimental but can help with Docker builds
    outputFileTracingRoot: undefined,
  },
};

export default nextConfig;
