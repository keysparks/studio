import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  port: 3000,

  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
