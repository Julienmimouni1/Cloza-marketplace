import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
};

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ← ignore toutes les erreurs TS au build
  },
  eslint: {
    ignoreDuringBuilds: true, // ← ignore aussi les erreurs ESLint
  },
};


export default withNextIntl(config);
