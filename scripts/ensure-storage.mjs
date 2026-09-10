#!/usr/bin/env node
/**
 * ENSURE THE STORAGE BUCKET EXISTS.
 *
 * `docs/SECURITY_REQUIREMENTS.md` §3: uploads go to a PRIVATE bucket and are
 * served only through short-lived signed URLs. This creates that bucket, and it
 * is idempotent — running it twice does nothing the second time.
 *
 * ── Why a script and not a migration ────────────────────────────────────────
 *
 * `DATABASE_ARCHITECTURE.md` says schema is never mutated outside a migration,
 * and a bucket is a row in `storage.buckets`, so a migration would be the
 * consistent choice. Two reasons it is not:
 *
 *   1. The bucket's PRIVACY is enforced by the `public` flag and by storage
 *      policies, and getting those wrong in a migration that has already run
 *      everywhere is worse than getting them wrong in a script that can be
 *      re-run. The Storage API validates what it is given; raw inserts into
 *      `storage.buckets` do not.
 *   2. It needs the service-role key, which every environment has, rather than
 *      a personal access token, which only a developer's machine has.
 *
 * Recorded in the Sprint 12 report as a candidate to move into a migration once
 * the bucket configuration has stopped changing.
 *
 * Usage: npm run storage:init
 */

import { readFileSync, existsSync } from 'node:fs';

const BUCKET = 'uploads';

/**
 * PRIVATE. Not a default that happens to be off — the whole upload design rests
 * on it. A public bucket would serve an uncleared brochure to anyone who
 * guessed its path, which is exactly the failure `cleared_for_publication`
 * exists to prevent, routed around.
 */
const CONFIG = {
  id: BUCKET,
  name: BUCKET,
  public: false,
  // 8 MB, matching MAX_DOCUMENT_BYTES in lib/admin/uploads.ts. Enforced here as
  // well as in the server action: the action is the boundary, and this is the
  // backstop if a future code path forgets to call it.
  file_size_limit: 8 * 1024 * 1024,
  // The same allowlist as UPLOAD_KINDS. SVG is deliberately absent — it can
  // carry scripts and is served with a MIME type browsers execute.
  allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
};

function env(name) {
  if (process.env[name]) return process.env[name];
  if (!existsSync('.env.local')) return undefined;
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const match = line.match(new RegExp(`^${name}=(.*)$`));
    if (match) return match[1].replace(/\s+#.*$/, '').trim();
  }
  return undefined;
}

const url = env('NEXT_PUBLIC_SUPABASE_URL');
const key = env('SUPABASE_SERVICE_ROLE_KEY');

if (!url || !key) {
  console.error('\n  storage:init: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.\n');
  process.exit(1);
}

const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

const listed = await fetch(`${url}/storage/v1/bucket`, { headers });
if (!listed.ok) {
  console.error(`\n  storage:init: could not list buckets — ${listed.status} ${await listed.text()}\n`);
  process.exit(1);
}
const buckets = await listed.json();
const existing = buckets.find((bucket) => bucket.id === BUCKET || bucket.name === BUCKET);

if (existing) {
  // Update rather than skip: the size cap and the MIME allowlist are security
  // configuration, and a bucket created by an earlier version of this script
  // must end up with the current values.
  const updated = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      public: CONFIG.public,
      file_size_limit: CONFIG.file_size_limit,
      allowed_mime_types: CONFIG.allowed_mime_types,
    }),
  });
  if (!updated.ok) {
    console.error(`\n  storage:init: bucket exists but could not be updated — ${updated.status} ${await updated.text()}\n`);
    process.exit(1);
  }
  console.log(`\n  storage:init: '${BUCKET}' already existed — configuration reapplied.`);
} else {
  const created = await fetch(`${url}/storage/v1/bucket`, {
    method: 'POST',
    headers,
    body: JSON.stringify(CONFIG),
  });
  if (!created.ok) {
    console.error(`\n  storage:init: could not create bucket — ${created.status} ${await created.text()}\n`);
    process.exit(1);
  }
  console.log(`\n  storage:init: created private bucket '${BUCKET}'.`);
}

// Read it back and assert the property that matters, rather than trusting the
// write. A bucket that reports itself public here is a finding, not a warning.
const verify = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, { headers });
const final = await verify.json();

if (final.public !== false) {
  console.error(`\n  storage:init: FAILED — '${BUCKET}' reports public=${final.public}. It must be private.\n`);
  process.exit(1);
}

console.log(`  private: yes · size cap: ${Math.round((final.file_size_limit ?? 0) / 1024)} KB`);
console.log(`  mime allowlist: ${(final.allowed_mime_types ?? []).join(', ') || 'none set'}\n`);
