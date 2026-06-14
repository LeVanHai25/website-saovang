import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow static image serving from public/assets
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },
  // Enable JSON module resolution
  experimental: {},
  // Strict mode
  reactStrictMode: true,
};

export default nextConfig;
