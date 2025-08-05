import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: '../public',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
