#!/usr/bin/env node
/**
 * LIVE DATABASE VERIFICATION.
 *
 * The counterpart to check-migrations.mjs. That script reads the SQL and proves
 * the migrations are internally consistent; this one talks to the actual
 * Supabase project and proves the schema that is really there behaves the way
 * the policies claim.
 *
 * Both are needed. A migration file can say `enable row level security` and
 * still leave a table writable if a later policy is wider than intended — the
 * static check cannot see that, because the answer depends on how Postgres
 * composes every policy on the table.
 *
 * This is the evidence behind the Sprint 3 acceptance criterion "anon key
 * confirmed unable to write" (docs/SPRINT_PLAN.md). It confirms:
 *
 *   1. every table in the migrations exists in the live database
 *   2. every public view is readable with the anon key
 *   3. NO base table is readable with the anon key
 *   4. NO table accepts a write with the anon key
 *   5. no customer data sits in any customer-bearing table
 *
 * Deliberately NOT part of `npm run build`: it needs .env.local and network,
 * and a build must not depend on either. Run it by hand after any migration.
 *
 * Usage: npm run verify:db
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

// ── Config. Read .env.local directly; nothing here is ever printed. ──────────
let raw;
try {
  raw = readFileSync('.env.local', 'utf8');
} catch {
  console.error('\n  verify-db: no .env.local — copy .env.example and fill in the Supabase keys.\n');
  process.exit(1);
}

const env = {};
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  // Strip an aligned trailing comment; .env.example documents values that way.
  if (m) {
    const v = m[2].replace(/\s+#.*$/, '').trim();
    if (v) env[m[1]] = v;
  }
}

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;

const missing = [
  ['NEXT_PUBLIC_SUPABASE_URL', URL_],
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', ANON],
  ['SUPABASE_SERVICE_ROLE_KEY', SERVICE],
]
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`\n  verify-db: .env.local is missing ${missing.join(', ')}\n`);
  process.exit(1);
}

// ── Expected shape, derived from the migrations. ─────────────────────────────
const TABLES = [
  'audit_log', 'authors', 'blog_categories', 'blog_post_revisions', 'blog_posts',
  'branches', 'certifications', 'client_logos', 'coverage_locations', 'downloads',
  'faqs', 'industries', 'installation_certificates', 'installation_plates_restricted',
  'media', 'order_items', 'orders', 'payment_intents', 'payments', 'product_categories',
  'product_industries', 'product_solutions', 'products', 'profiles', 'redirects', 'shipments',
  'solution_industries', 'solutions', 'submissions', 'testimonials', 'verification_attempts',
];

const VIEWS = [
  'public_authors', 'public_blog_categories', 'public_blog_posts', 'public_branches',
  'public_certifications', 'public_client_logos', 'public_coverage_locations',
  'public_downloads', 'public_faqs', 'public_industries', 'public_product_categories',
  'public_product_industries', 'public_product_solutions', 'public_products',
  'public_solution_industries', 'public_solutions', 'public_testimonials',
];

/** Tables that must never hold data outside production operations. */
const MUST_BE_EMPTY = [
  'orders', 'order_items', 'submissions', 'installation_certificates',
  'installation_plates_restricted', 'testimonials', 'client_logos', 'payments', 'profiles',
];

const service = createClient(URL_, SERVICE, { auth: { persistSession: false } });
const anon = createClient(URL_, ANON, { auth: { persistSession: false } });

const problems = [];
const notes = [];

// ── 1. Every table exists. ───────────────────────────────────────────────────
const missingTables = [];
for (const t of TABLES) {
  const { error } = await service.from(t).select('*', { head: true, count: 'exact' }).limit(1);
  if (error) missingTables.push(`${t} (${error.code ?? '?'}: ${error.message})`);
}
if (missingTables.length) {
  problems.push(`${missingTables.length} table(s) missing or unreadable by the service role:`);
  missingTables.forEach((t) => problems.push(`    ${t}`));
}

// ── 2. Every public view is readable by anon. ────────────────────────────────
const unreadableViews = [];
for (const v of VIEWS) {
  const { error } = await anon.from(v).select('*', { head: true, count: 'exact' }).limit(1);
  if (error) unreadableViews.push(`${v} (${error.code ?? '?'}: ${error.message})`);
}
if (unreadableViews.length) {
  problems.push(`${unreadableViews.length} public view(s) NOT readable by anon:`);
  unreadableViews.forEach((v) => problems.push(`    ${v}`));
}

// ── 3. No base table is readable by anon. Each hit is a data leak. ───────────
const anonReadable = [];
for (const t of TABLES) {
  const { error } = await anon.from(t).select('*', { head: true, count: 'exact' }).limit(1);
  if (!error) anonReadable.push(t);
}
if (anonReadable.length) {
  problems.push(`LEAK — anon can READ base table(s): ${anonReadable.join(', ')}`);
}

// ── 4. No table accepts a write from anon. ───────────────────────────────────
// An empty insert is used on purpose. If RLS denies, Postgres refuses before it
// ever evaluates column constraints, so a 42501 is unambiguous. Any OTHER error
// means the write was stopped by a constraint and RLS was never consulted —
// that is reported as inconclusive rather than counted as a pass.
const anonWrote = [];
const inconclusive = [];
let denied = 0;
for (const t of TABLES) {
  const { error } = await anon.from(t).insert({}).select();
  if (!error) {
    anonWrote.push(t);
  } else if (error.code === '42501' || /row-level security|permission denied/i.test(error.message)) {
    denied += 1;
  } else {
    inconclusive.push(`${t} (${error.code ?? '?'}: ${error.message.slice(0, 90)})`);
  }
}
if (anonWrote.length) {
  problems.push(`CRITICAL — anon WROTE to: ${anonWrote.join(', ')}`);
}
if (inconclusive.length) {
  problems.push(`${inconclusive.length} table(s) blocked a write, but NOT by RLS — verify by hand:`);
  inconclusive.forEach((t) => problems.push(`    ${t}`));
}

// ── 5. No customer data. Brief: "no customer data in seed files." ────────────
const populated = [];
for (const t of MUST_BE_EMPTY) {
  const { count, error } = await service.from(t).select('*', { head: true, count: 'exact' });
  if (!error && count > 0) populated.push(`${t} (${count} rows)`);
}
if (populated.length) {
  notes.push(`customer-bearing table(s) are NOT empty: ${populated.join(', ')}`);
}

// ── Report. ──────────────────────────────────────────────────────────────────
console.log(
  `\n  ${TABLES.length - missingTables.length}/${TABLES.length} tables · ` +
    `${VIEWS.length - unreadableViews.length}/${VIEWS.length} public views readable by anon · ` +
    `${denied}/${TABLES.length} tables refused an anon write\n`,
);

if (notes.length) {
  console.warn('  NOTE');
  notes.forEach((n) => console.warn(`    - ${n}`));
  console.warn('');
}

if (problems.length > 0) {
  console.error('  DATABASE VERIFICATION FAILED\n');
  for (const p of problems) console.error(`    - ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `  verify-db: clean — all ${TABLES.length} tables present, no base table readable by anon, ` +
    'no table writable by anon\n',
);
