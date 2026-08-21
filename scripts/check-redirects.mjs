#!/usr/bin/env node
/**
 * REDIRECT VERIFICATION — the Sprint 2 gate, "every old URL resolves".
 *
 * Checks every row of docs/ROUTE_MAP.md §2 by REQUEST, not by reading the
 * config. Brief PART 2.6: verify, don't claim.
 *
 * Usage:  node scripts/check-redirects.mjs [baseUrl]
 * Default base: http://localhost:3000
 *
 * A redirect passes when the status is 301/308 AND the Location header matches
 * the expected destination exactly. The destination is NOT required to return
 * 200 — several targets are built in Sprints 5–6, and a correct redirect to a
 * not-yet-built page is the expected intermediate state.
 */

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');

/** [from, expected destination] — mirrors docs/ROUTE_MAP.md §2. */
const EXPECTED = [
  ['/services', '/solutions'],
  ['/services/car-tracking', '/solutions/vehicle-tracking'],
  ['/services/fuel-monitoring', '/solutions/fuel-monitoring'],
  ['/services/radio-calls', '/solutions/radio-communication'],
  ['/services/vehicle-video-telematics', '/solutions/ai-video-telematics'],
  ['/services/speed-governors', '/solutions/speed-governors'],
  ['/services/car-alarms', '/solutions/vehicle-security'],
  // Found in Sprint 0, absent from every prior inventory.
  ['/services/electronic-cargo-tracking-system', '/solutions/container-e-seal'],
  // Dead nav links on the old site.
  ['/team', '/about/team'],
  ['/clients', '/about/partners'],
  // Shop consolidation.
  ['/shop', '/products'],
  ['/shop/hybrid-tracker', '/products/hybrid-tracker'],
  // Catch-all for anything else under the old namespace.
  ['/services/some-legacy-page', '/solutions'],
];

/** Routes that must resolve 200 and must NOT redirect. */
const MUST_BE_200 = ['/', '/llms.txt', '/robots.txt', '/sitemap.xml'];

let failures = 0;

console.log(`\n  Verifying redirects against ${base}\n`);

for (const [from, expected] of EXPECTED) {
  let res;
  try {
    res = await fetch(`${base}${from}`, { redirect: 'manual' });
  } catch (err) {
    console.error(`  FAIL  ${from}  — request failed: ${err.message}`);
    failures++;
    continue;
  }

  const location = res.headers.get('location');
  const isPermanent = res.status === 301 || res.status === 308;
  const normalised = location?.replace(base, '') ?? null;

  if (isPermanent && normalised === expected) {
    console.log(`  ok    ${res.status}  ${from}  ->  ${normalised}`);
  } else {
    console.error(
      `  FAIL  ${res.status}  ${from}  ->  ${normalised ?? '(no Location)'}   expected 301/308 -> ${expected}`,
    );
    failures++;
  }
}

console.log('');

for (const path of MUST_BE_200) {
  let res;
  try {
    res = await fetch(`${base}${path}`, { redirect: 'manual' });
  } catch (err) {
    console.error(`  FAIL  ${path}  — request failed: ${err.message}`);
    failures++;
    continue;
  }
  if (res.status === 200) {
    console.log(`  ok    200  ${path}`);
  } else {
    console.error(`  FAIL  ${res.status}  ${path}  expected 200`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n  ${failures} redirect check(s) FAILED.\n`);
  process.exit(1);
}

console.log(
  `\n  All ${EXPECTED.length} redirects and ${MUST_BE_200.length} direct routes verified.\n`,
);
