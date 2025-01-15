// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Remove distDir config - let Next.js use default 'out'
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}
