// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,  // This helps with static exports
  // Add distDir configuration
  distDir: '.next',
  // Add assetPrefix configuration for static files
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
}