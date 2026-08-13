/**
 * Canvas credential lookup, matching the convention the sibling Canvas repos
 * use (see canvas-cli/src/index.ts and canvas-courses/CLAUDE.md).
 *
 * Order, first file to define a variable wins:
 *   1. ./.env.local            per-project override, gitignored
 *   2. ./.env                  per-project override, gitignored
 *   3. ~/.config/canvas/.env   user-level default, mode 600
 *
 * Keeping the token in the shared file means rotating it is a one-place edit
 * instead of one edit per repo — which is how this repo ended up holding an
 * expired copy while the others kept working.
 *
 * Note: this covers the scripts in this directory. The deployed site reads
 * Vercel's own environment variables and is unaffected by any of these files.
 */

import { config } from 'dotenv';
import { homedir } from 'os';
import { resolve } from 'path';

export function sharedCanvasEnvPath(): string {
  const base = process.env.XDG_CONFIG_HOME || resolve(homedir(), '.config');
  return resolve(base, 'canvas', '.env');
}

export function loadCanvasEnv(): void {
  // dotenv does not overwrite variables already present in process.env, so
  // loading in this order gives first-defined-wins without extra bookkeeping.
  const candidates = [
    resolve(process.cwd(), '.env.local'),
    resolve(process.cwd(), '.env'),
    sharedCanvasEnvPath(),
  ];

  for (const path of candidates) {
    config({ path });
  }
}

/** Load credentials and fail loudly if they are still missing. */
export function requireCanvasEnv(): { baseUrl: string; token: string } {
  loadCanvasEnv();

  const baseUrl = process.env.CANVAS_BASE_URL;
  const token = process.env.CANVAS_API_TOKEN;

  if (!baseUrl || !token) {
    console.error(
      'Missing Canvas credentials.\n' +
        'Set CANVAS_BASE_URL and CANVAS_API_TOKEN in .env.local, or in the shared file:\n' +
        `  ${sharedCanvasEnvPath()}`
    );
    process.exit(1);
  }

  return { baseUrl, token };
}
