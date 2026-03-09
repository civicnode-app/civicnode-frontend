import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // General
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Compiler
  compiler: {
    // Strip console.* in production builds
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental
  experimental: {
    // Inline critical CSS
    optimizeCss: true,
  },
};

export default nextConfig;
