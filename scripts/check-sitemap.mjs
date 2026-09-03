#!/usr/bin/env node
/**
 * SITEMAP INTEGRITY CHECK — every URL in the sitemap must return 200.
 *
 * This exists because the same defect appeared three times in three sprints:
 *
 *   Sprint 5  /solutions/school-bus-management was listed while the route
 *             404'd, because the sitemap mapped a static list containing a
 *             draft — and it advertised an unpublished page about children's
 *             data.
 *   Sprint 6  all five /products/category/* entries 404'd; those pages arrive
 *             in Sprint 7.
 *   Sprint 6  19 of 37 entries 404'd, because the static list named every route
 *             the site will eventually have rather than the ones it has.
 *
 * A sitemap is a set of assertions that these URLs are real and worth crawling.
 * Listing one that 404s is a crawl error authored by us, and it is exactly the
 * kind of mistake nobody notices until a Search Console report months later.
 *
 * NOT part of `npm run build`: it needs a running server. Run it against a
 * production build before merging a sprint, and before Sprint 15 puts any of
 * this in front of a crawler.
 *
 * Usage: npm start,  then  npm run check:sitemap [baseUrl]
 */

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100';

let xml;
try {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  xml = await res.text();
} catch (err) {
  console.error(`\n  check-sitemap: could not fetch ${BASE}/sitemap.xml`);
  console.error(`  ${err.message}`);
  console.error('  Is the server running? `npm start` first.\n');
  process.exit(1);
}

const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) {
  console.error('\n  check-sitemap: the sitemap contains no URLs at all.\n');
  process.exit(1);
}

const broken = [];
for (const url of urls) {
  // Sitemap URLs carry the production origin; test the same path locally.
  const path = url.replace(/^https?:\/\/[^/]+/, '') || '/';
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
    if (res.status !== 200) broken.push({ path, status: res.status });
  } catch (err) {
    broken.push({ path, status: err.message });
  }
}

console.log(`\n  ${urls.length} URLs in the sitemap\n`);

if (broken.length > 0) {
  console.error('  SITEMAP CHECK FAILED — these entries do not return 200:\n');
  for (const b of broken) console.error(`    ${String(b.status).padEnd(6)} ${b.path}`);
  console.error('\n  A sitemap entry pointing at a 404 is a crawl error we authored.');
  console.error('  Either build the page or remove the entry until the sprint that does.\n');
  process.exit(1);
}

console.log('  check-sitemap: clean — every sitemap URL returns 200\n');
