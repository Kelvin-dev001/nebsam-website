#!/usr/bin/env node
/**
 * MIGRATION CONSISTENCY CHECK.
 *
 * This is not a SQL parser and it does not replace applying the migrations. It
 * catches the specific error class that is both most likely and most dangerous
 * on this project: a table that ships WITHOUT row level security.
 *
 * Brief PART 16 requires RLS on every table. A table created without
 * `enable row level security` is readable by anyone holding the anon key — the
 * exact failure the policy model is built to prevent, and one that is invisible
 * until someone goes looking.
 *
 * Checks:
 *   1. every `create table` has a matching `enable row level security`
 *   2. every table named in a policy or grant actually exists
 *   3. every public view is granted to anon, and no base table is
 *   4. migrations are sequentially numbered with no gaps or duplicates
 *
 * Usage: node scripts/check-migrations.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'supabase/migrations';

const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.error('  check-migrations: no migrations found in ' + DIR);
  process.exit(1);
}

const problems = [];
const tables = new Set();
const rlsEnabled = new Set();
const views = new Set();
const grantedToAnon = new Set();
const seenNumbers = [];

for (const file of files) {
  const sql = readFileSync(join(DIR, file), 'utf8');
  // Strip line comments so commented-out SQL is not treated as real.
  const code = sql.replace(/--[^\n]*/g, '');

  const num = Number(file.slice(0, 4));
  if (Number.isNaN(num)) problems.push(`${file}: filename does not start with a 4-digit number`);
  else seenNumbers.push(num);

  for (const m of code.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?([a-z_][a-z0-9_]*)/gi)) {
    tables.add(m[1].toLowerCase());
  }
  for (const m of code.matchAll(/alter\s+table\s+([a-z_][a-z0-9_]*)\s+enable\s+row\s+level\s+security/gi)) {
    rlsEnabled.add(m[1].toLowerCase());
  }
  for (const m of code.matchAll(/create\s+view\s+([a-z_][a-z0-9_]*)/gi)) {
    views.add(m[1].toLowerCase());
  }
  // grant select on a, b, c to anon, authenticated;
  for (const m of code.matchAll(/grant\s+select\s+on\s+([\s\S]*?)\s+to\s+([^;]+);/gi)) {
    const targets = m[1]
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (/\banon\b/i.test(m[2])) targets.forEach((t) => grantedToAnon.add(t));
  }
}

// 1. RLS on every table
for (const table of tables) {
  if (!rlsEnabled.has(table)) {
    problems.push(`table "${table}" is created but never has row level security enabled`);
  }
}

// 2. policies reference real tables
for (const file of files) {
  const code = readFileSync(join(DIR, file), 'utf8').replace(/--[^\n]*/g, '');
  for (const m of code.matchAll(/create\s+policy\s+\S+\s+on\s+([a-z_][a-z0-9_]*)/gi)) {
    const t = m[1].toLowerCase();
    if (!tables.has(t)) problems.push(`${file}: policy targets unknown table "${t}"`);
  }
}

// 3. anon may read views only, never a base table
for (const target of grantedToAnon) {
  if (tables.has(target)) {
    problems.push(
      `base table "${target}" is granted to anon — anon must read public views only (0009)`,
    );
  }
  if (!views.has(target) && !tables.has(target)) {
    problems.push(`grant to anon names "${target}", which is neither a table nor a view here`);
  }
}
for (const view of views) {
  if (!grantedToAnon.has(view)) {
    problems.push(`view "${view}" exists but is never granted to anon — it will be unreadable`);
  }
}

// 4. sequential numbering
seenNumbers.sort((a, b) => a - b);
for (let i = 0; i < seenNumbers.length; i++) {
  if (seenNumbers[i] !== i + 1) {
    problems.push(
      `migration numbering is not sequential: expected ${String(i + 1).padStart(4, '0')}, found ${String(seenNumbers[i]).padStart(4, '0')}`,
    );
    break;
  }
}

console.log(
  `\n  ${files.length} migrations · ${tables.size} tables · ${views.size} public views\n`,
);

if (problems.length > 0) {
  console.error('  MIGRATION CHECK FAILED\n');
  for (const p of problems) console.error(`    - ${p}`);
  console.error('');
  process.exit(1);
}

console.log(`  check-migrations: clean — RLS on all ${tables.size} tables, ` +
  `${views.size} views granted to anon, no base table exposed\n`);
