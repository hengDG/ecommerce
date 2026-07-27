import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local static images from the public folder (no remote patterns needed)
    unoptimized: false,
  },
};

export default nextConfig;
