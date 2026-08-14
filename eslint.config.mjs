import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// Next 16 ships flat configs directly, so FlatCompat is no longer needed —
// and `next lint` was removed in 16, which is why package.json calls the
// ESLint CLI instead.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // globalIgnores REPLACES eslint-config-next's defaults rather than adding to
  // them, so the defaults have to be repeated here or build output gets linted.
  globalIgnores([
    // eslint-config-next's own defaults:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Ours: Canvas page snapshots, not source.
    'backups/**',
  ]),
])

export default eslintConfig
