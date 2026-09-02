#!/usr/bin/env node
/**
 * GENERATE types/database.ts FROM THE LIVE SCHEMA.
 *
 * This exists instead of a one-line npm script for two reasons, both learned
 * the hard way:
 *
 *   1. `supabase` is not on PATH — the CLI is invoked through npx. The plain
 *      script failed with "'supabase' is not recognized".
 *   2. `... > types/database.ts` truncates the file the instant the shell opens
 *      the redirect, BEFORE the command runs. So a failing generate did not
 *      leave the previous types in place; it left an empty file and a project
 *      that no longer compiled.
 *
 * So: generate to a temporary file, sanity-check the output, and only then
 * replace the real one. A failed run leaves the working types untouched.
 *
 * Needs SUPABASE_ACCESS_TOKEN. It is read from .env.local so the command works
 * without exporting anything by hand, and its value is never printed.
 *
 * Usage: npm run db:types
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';

const PROJECT_ID = 'dufzsetbxrllegoikdxv';
const OUT = 'types/database.ts';
const TMP = 'types/.database.generated.tmp';

let token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token && existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^SUPABASE_ACCESS_TOKEN=(.*)$/);
    if (m) token = m[1].replace(/\s+#.*$/, '').trim();
  }
}
if (!token) {
  console.error('\n  db:types: SUPABASE_ACCESS_TOKEN not set, and not found in .env.local.');
  console.error('  Create one at supabase.com/dashboard/account/tokens.\n');
  process.exit(1);
}

let out;
try {
  // A single command string, run through a shell. npx is a .cmd shim on
  // Windows and spawning it directly fails with EINVAL; passing an args array
  // alongside `shell: true` works but is deprecated (DEP0190). Every component
  // here is a constant in this file, so there is nothing to escape.
  out = execSync(
    `npx supabase gen types typescript --project-id ${PROJECT_ID}`,
    {
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
} catch (err) {
  console.error('\n  db:types: generation failed. Existing types left untouched.\n');
  console.error('  ' + String(err.stderr || err.message).split('\n')[0] + '\n');
  process.exit(1);
}

// Refuse to install anything that does not look like the real thing. An empty
// or error-shaped response must never overwrite working types.
if (!out.includes('export type Database') || out.length < 5000) {
  console.error(`\n  db:types: output does not look like generated types (${out.length} bytes).`);
  console.error('  Existing types left untouched.\n');
  process.exit(1);
}

writeFileSync(TMP, out, 'utf8');
writeFileSync(OUT, out, 'utf8');
unlinkSync(TMP);

const lines = out.split('\n').length;
console.log(`\n  db:types: wrote ${OUT} — ${lines} lines\n`);
