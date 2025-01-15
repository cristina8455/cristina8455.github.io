// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Remove distDir config to use default 'out' directory
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
}