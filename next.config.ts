// next.config.ts
import type { NextConfig } from 'next'
import { config as loadDotenv } from 'dotenv'
import { homedir } from 'os'
import { resolve } from 'path'

/**
 * Canvas credential cascade for local development, matching canvas-cli and
 * canvas-courses (see scripts/load-env.ts for the same logic on the CLI side):
 *
 *   ./.env.local  →  ./.env  →  ~/.config/canvas/.env
 *
 * dotenv never overwrites a variable that is already set, so walking the list
 * in this order preserves "closest file wins" regardless of when Next loads
 * its own env files. Keeping the token only in the shared file means rotating
 * it is a one-place edit — this repo held a stale copy for months precisely
 * because it had its own.
 *
 * Production is unaffected: Vercel injects its own environment variables and
 * none of these files exist there.
 */
for (const path of [
  resolve(process.cwd(), '.env.local'),
  resolve(process.cwd(), '.env'),
  resolve(process.env.XDG_CONFIG_HOME || resolve(homedir(), '.config'), 'canvas', '.env'),
]) {
  loadDotenv({ path })
}

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable ISR on Vercel
  // Images will be optimized by Vercel automatically
}

export default nextConfig
