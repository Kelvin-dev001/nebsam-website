#!/usr/bin/env node
/**
 * ILLUSTRATIVE CERTIFICATES FOR TESTING VERIFICATION.
 *
 * ── Why this is a script and NOT a migration ────────────────────────────────
 * This is the important part of the file.
 *
 * Migrations run everywhere, in order, including against production at cutover.
 * A migration that inserts certificates would put working test records into the
 * live lookup — and a visitor who happened to type one of these plates would be
 * told, truthfully, that a Nebsam installation exists on it. Seeding fixtures
 * through the migration chain would take the one endpoint on the site whose
 * entire purpose is to be trustworthy and make it lie.
 *
 * So it is a script, run deliberately, with a teardown that removes exactly what
 * it added:
 *
 *     node scripts/seed-verification-fixtures.mjs           # insert
 *     node scripts/seed-verification-fixtures.mjs --remove  # delete
 *
 * ── No real customer data. None. ────────────────────────────────────────────
 * Brief PART 12 and PART 16. The plates below are the illustrative form the
 * brief itself uses for demonstration telemetry — KXX 000X — which is not a
 * valid Kenyan registration format and cannot collide with a real vehicle. The
 * phone factors are 0000-series and belong to nobody.
 *
 * ── One implementation of hashing ───────────────────────────────────────────
 * This imports the SAME normalisation and HMAC the lookup uses, straight from
 * lib/verification/hashing.ts via Node's native TypeScript stripping. It does
 * not reimplement them. A seeder that normalised even slightly differently would
 * write records that can never be found, and the failure would look exactly like
 * customers mistyping their own plates.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  normalisePhoneFactor,
  normalisePlate,
  phoneFactorHash,
  plateHash,
  toBytea,
} from '../lib/verification/hashing.ts';

// ── Config. Read .env.local directly; no secret is ever printed. ────────────
let raw;
try {
  raw = readFileSync('.env.local', 'utf8');
} catch {
  console.error('\n  seed-verification-fixtures: no .env.local — copy .env.example first.\n');
  process.exit(1);
}
const env = Object.fromEntries(
  raw
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i).trim(), line.slice(i + 1).split('#')[0].trim()];
    }),
);
for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'CERT_PLATE_HMAC_SECRET']) {
  if (!env[key]) {
    console.error(`\n  seed-verification-fixtures: ${key} is not set in .env.local\n`);
    process.exit(1);
  }
}
// hashing.ts reads the secret from the environment, so put it there.
process.env.CERT_PLATE_HMAC_SECRET = env.CERT_PLATE_HMAC_SECRET;

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/**
 * The fixtures.
 *
 * `certificate_number_last4` is set because the real certificate specimen
 * numbers its documents (format P051510924U/2007, per the inspection in
 * content-source/05-certifications §4A) and the column exists so a support call
 * can disambiguate. It plays no part in the lookup.
 */
const FIXTURES = [
  {
    label: 'current',
    plate: 'KXX 001X',
    phone: '0700 000 1234',
    installed_on: '2026-01-15',
    expires_on: '2027-01-15',
    status: 'active',
    certificate_number_last4: 'T001',
  },
  {
    label: 'lapsed',
    plate: 'KXX 002X',
    phone: '0700 000 5678',
    installed_on: '2024-03-01',
    expires_on: '2025-03-01',
    status: 'active',
    certificate_number_last4: 'T002',
  },
  {
    label: 'not active',
    plate: 'KXX 003X',
    phone: '0700 000 9012',
    installed_on: '2026-02-01',
    expires_on: '2027-02-01',
    status: 'cancelled',
    certificate_number_last4: 'T003',
  },
];

/**
 * Bulk fixtures, for measurements that need MANY known-good plates.
 *
 * The per-plate limit is 5 lookups a day, and it works — which means a timing
 * experiment that submits twelve wrong-factor attempts against one plate spends
 * its budget after five and then measures the rate limiter instead. The first
 * run of the penetration test did exactly that and reported a 926 ms timing
 * difference that was entirely an artefact of its own test design.
 *
 * So the timing arms draw a fresh known plate per sample from this block. Same
 * illustrative KXX form, all current, none of them real.
 */
const BULK = Array.from({ length: 40 }, (_, i) => ({
  label: `bulk-${i}`,
  plate: `KXX 1${String(i).padStart(2, '0')}X`,
  phone: `0700 00${String(i).padStart(2, '0')} ${String(2000 + i)}`,
  installed_on: '2026-01-15',
  expires_on: '2027-01-15',
  status: 'active',
  certificate_number_last4: `B${String(i).padStart(3, '0')}`,
}));

const ALL_FIXTURES = [...FIXTURES, ...BULK];

const hashes = ALL_FIXTURES.map((f) => ({
  ...f,
  plateBytea: toBytea(plateHash(normalisePlate(f.plate))),
  phoneBytea: toBytea(phoneFactorHash(normalisePhoneFactor(f.phone))),
}));

async function remove() {
  const { error } = await db
    .from('installation_certificates')
    .delete()
    .in(
      'plate_hash',
      hashes.map((h) => h.plateBytea),
    );
  if (error) {
    console.error('\n  seed-verification-fixtures: delete failed —', error.message, '\n');
    process.exit(1);
  }
  console.log(`\n  removed ${hashes.length} fixture certificate(s)\n`);
}

async function insert() {
  // Delete first so the script is idempotent AND so a rotated
  // CERT_PLATE_HMAC_SECRET does not leave orphaned rows nothing can ever match.
  await db
    .from('installation_certificates')
    .delete()
    .in(
      'plate_hash',
      hashes.map((h) => h.plateBytea),
    );

  const { data, error } = await db
    .from('installation_certificates')
    .insert(
      hashes.map((h) => ({
        plate_hash: h.plateBytea,
        phone_last4_hash: h.phoneBytea,
        certificate_number_last4: h.certificate_number_last4,
        installed_on: h.installed_on,
        expires_on: h.expires_on,
        status: h.status,
      })),
    )
    .select('id, expires_on, status');

  if (error) {
    console.error('\n  seed-verification-fixtures: insert failed —', error.message, '\n');
    process.exit(1);
  }

  console.log('\n  seeded illustrative certificates — NOT REAL, NOT FOR PRODUCTION\n');
  console.log(`    3 named + ${BULK.length} bulk fixtures`);
  data.slice(0, FIXTURES.length).forEach((row, i) => {
    console.log(
      `    ${hashes[i].plate.padEnd(10)} last4 ${normalisePhoneFactor(hashes[i].phone)}  ` +
        `${hashes[i].label.padEnd(10)} expires ${row.expires_on}  id ${row.id}`,
    );
  });
  console.log('\n  remove them with:  node scripts/seed-verification-fixtures.mjs --remove\n');
}

/** Printed so the penetration test can pick up the ids it needs for QR tokens. */
export async function fixtureIds() {
  const { data } = await db
    .from('installation_certificates')
    .select('id, plate_hash, expires_on, status')
    .in(
      'plate_hash',
      hashes.map((h) => h.plateBytea),
    );
  return (data ?? []).map((row) => ({
    ...row,
    label: hashes.find((h) => h.plateBytea === row.plate_hash)?.label ?? 'unknown',
  }));
}

export const FIXTURE_PLATES = hashes.map(({ label, plate, phone }) => ({
  label,
  plate,
  phoneLast4: normalisePhoneFactor(phone),
}));

// Run the side effects only when invoked directly. The penetration test imports
// this module for FIXTURE_PLATES and fixtureIds and must not reseed on import.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  if (process.argv.includes('--remove')) await remove();
  else await insert();
}
