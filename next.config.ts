// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pages serves from username.github.io
  basePath: '',
  // No need for assetPrefix with Github Pages when deploying to root
  assetPrefix: ''
}
