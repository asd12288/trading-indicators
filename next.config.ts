import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lcwpenbtlqwuxtlrdzbq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "auth.trader-map.com",
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["react-icons", "framer-motion"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
