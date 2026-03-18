import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: configDir,
  },

  // General
  compress: true,
  poweredByHeader: false,

  // Proxy all /api/* requests to the Express backend (port 4000)
  // From the browser everything appears on port 3000.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },

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

};

export default nextConfig;
