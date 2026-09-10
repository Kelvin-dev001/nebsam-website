#!/usr/bin/env node
/**
 * APPLY A MIGRATION TO THE SUPABASE PROJECT.
 *
 * ── Why this exists ─────────────────────────────────────────────────────────
 *
 * Migrations 0001–0040 were applied by pasting them into the dashboard SQL
 * editor, because the Supabase CLI is not installed on this machine and
 * `npm run db:push` therefore fails with "'supabase' is not recognized". That
 * worked, and it is not repeatable: there is no record of WHICH file was pasted,
 * a paste can be partial, and a partial paste of a security migration is the
 * kind of thing nobody notices until a policy is missing in production.
 *
 * This runs the file, whole, through the Management API's query endpoint, and
 * refuses to run one that is already recorded as applied.
 *
 * ── The ledger ──────────────────────────────────────────────────────────────
 *
 * `schema_migrations` records what has run. It is created on first use. This is
 * NOT the Supabase CLI's own ledger and does not pretend to be — adopting the
 * CLI later means reconciling the two, which is a smaller problem than not
 * knowing what is applied at all.
 *
 * ── What it will not do ─────────────────────────────────────────────────────
 *
 * It does not roll back. Postgres runs each statement in its own transaction
 * through this endpoint unless the file wraps itself in begin/commit, so a file
 * that fails halfway leaves the earlier statements applied. Every migration on
 * this project is written to be re-runnable or to fail on its first statement;
 * where that is not true the file says so.
 *
 * Needs SUPABASE_ACCESS_TOKEN, read from .env.local. LOCAL DEV ONLY — it is a
 * personal access token with full project rights and must never reach a
 * deployment.
 *
 * Usage:
 *   node scripts/apply-migration.mjs 0041_submission_attempts.sql
 *   node scripts/apply-migration.mjs --pending      # every unapplied file, in order
 *   node scripts/apply-migration.mjs --status       # what is applied, what is not
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_ID = 'dufzsetbxrllegoikdxv';
const DIR = 'supabase/migrations';
const API = `https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`;

function env(name) {
  if (process.env[name]) return process.env[name];
  if (!existsSync('.env.local')) return undefined;
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(new RegExp(`^${name}=(.*)$`));
    if (m) return m[1].replace(/\s+#.*$/, '').trim();
  }
  return undefined;
}

const token = env('SUPABASE_ACCESS_TOKEN');
if (!token) {
  console.error('\n  apply-migration: SUPABASE_ACCESS_TOKEN not set, and not found in .env.local.');
  console.error('  Create one at supabase.com/dashboard/account/tokens.\n');
  process.exit(1);
}

async function query(sql) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

await query(`
  create table if not exists schema_migrations (
    version    text primary key,
    applied_at timestamptz not null default now()
  );
  alter table schema_migrations enable row level security;
  revoke all on table schema_migrations from anon;
`);

const applied = new Set(
  (await query('select version from schema_migrations')).map((row) => row.version),
);

const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.sql'))
  .sort();

const arg = process.argv[2];

if (!arg || arg === '--status') {
  console.log('');
  for (const file of files) {
    console.log(`  ${applied.has(file) ? '·  applied' : '>  PENDING'}  ${file}`);
  }
  const pending = files.filter((f) => !applied.has(f));
  console.log(`\n  ${applied.size} applied · ${pending.length} pending\n`);
  process.exit(0);
}

const targets = arg === '--pending' ? files.filter((f) => !applied.has(f)) : [arg];

if (targets.length === 0) {
  console.log('\n  Nothing pending.\n');
  process.exit(0);
}

for (const file of targets) {
  if (!files.includes(file)) {
    console.error(`\n  apply-migration: ${file} is not in ${DIR}\n`);
    process.exit(1);
  }
  if (applied.has(file)) {
    console.log(`  ·  already applied, skipping  ${file}`);
    continue;
  }

  const sql = readFileSync(join(DIR, file), 'utf8');
  process.stdout.write(`  >  ${file} … `);
  try {
    await query(sql);
    // Recorded only AFTER the file succeeds. A ledger entry for a migration
    // that failed is worse than no ledger at all — it makes the next run skip
    // the thing that did not happen.
    await query(
      `insert into schema_migrations (version) values ('${file.replace(/'/g, "''")}')
       on conflict (version) do nothing`,
    );
    console.log('applied');
  } catch (error) {
    console.log('FAILED');
    console.error(`\n  ${error.message}\n`);
    console.error('  Not recorded as applied. Fix the file and run again.\n');
    process.exit(1);
  }
}

console.log('');
