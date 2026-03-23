import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // General
  compress: true,
  poweredByHeader: false,

  // Izinkan eval() untuk MetaMask extension di development
  async headers() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
          },
        ],
      },
    ];
  },

  // Proxy all /api/* requests to the Express backend (port 4000)
  // From the browser everything appears on port 3000.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // Compiler
  compiler: {
    // Strip console.* in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental
  experimental: {
    // Inline critical CSS
    optimizeCss: true,
  },
};

export default nextConfig;
