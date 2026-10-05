# SPRINT 13 — SEO / LLM AUDIT (RESTARTED)

**Branch:** `sprint/13r-seo-llm-audit`, cut from `develop` at `5e705f4` on 5 October 2026. Not merged.
**The original:** `sprint/13-seo-llm-audit` (11 September 2026), never merged and 168 commits behind.
It is kept as the record. Rebasing it would have meant force-pushing a pushed branch, so its work was
carried across instead: the auditor by cherry-pick, the fixes re-applied by hand to today's files.
**Gate:** crawl report clean, `docs/SEO_LLM_STRATEGY.md` §8.

## THE GATE

`npm run audit:crawl -- <base>` against today's production build. **12 problems to 2.**

| §8 criterion | State |
|---|---|
| Full crawl with JavaScript disabled | ✅ 67 URLs, all 200 |
| Every schema type validated | ✅ JSON-LD parses everywhere; required types present per route; no `Review`, `AggregateRating` or price-less `Offer` |
| No duplicate titles or descriptions | ✅ |
| Exactly one H1 per page | ✅ |
| Every page has an inbound internal link | ✅ and every indexable page is in the sitemap |
| Sitemap matches published content | ✅ 66 URLs, all 200, none noindex |
| `llms.txt` current | ✅ it named five category URLs that 404 (V95) |
| Every 301 in one hop | ✅ two went to 404s (V95) |
| **No `[[NEEDS_VERIFICATION]]` on a public page** | ❌ **2 remain**, privacy notice (4) and terms (2): V66–V70, for the legal adviser |
| No page indexed that should be noindex | ✅ |
| *Added:* a share image on every indexable page | ✅ every one loads; two article covers are under 1200×630 (notes) |

**Ten of eleven.** The one left is legal text, and no code closes it. **Performance: no regression.**
Paired against `develop`, 13r is level or slightly faster on every page measured. `/legal/cookies`
misses the 2.5 s budget by about 45 ms on both builds, so the miss predates this sprint (V99, for
Sprint 14).

## WHAT THE RESTART FOUND

The September branch fixed 30 problems. Against today's site the audit found 12, so the work was
re-checked, not replayed.

**Still broken, fixed again (V95):**
- **`/platform` in the header**, a 404 from every page. V13 (platform screenshots) is still open.
- **Seven dead links in the phone drawer:** `/about/team`, `/about/partners` and five
  `/products/category/<slug>`. No crawler reaches the drawer, so these are a dead end only for
  someone on a phone.
- **`llms.txt` listed the same five category URLs.** It now lists the published products, read from
  the view the sitemap reads. The product admin now refreshes it, which the September fix did not:
  without that, a product renamed in the admin would keep its old name in the file assistants read.
- **`/team` and `/clients` redirected to the two unbuilt pages.** Both now go to `/about`.

**Already fixed on `develop`, so not re-applied:** the footer's link to the draft school-bus page
(12b introduced `LINKED_SOLUTIONS`).

**Metadata (V96), re-derived instead of replayed.** The September values no longer all fit. One said
"ten solutions" (nine are published), and two described certificate verification, removed by
ADR-0007. So:
- **Static pages:** the `/solutions` and `/industries` descriptions were over 155 (166, 159). Twelve
  titles rendered at 36–49 characters, and the cookie notice description at 129. Every new value
  restates what its page already says.
- **The catalogue:** the 38 product, solution and industry values fixed on 11 September were
  written straight into the database (the token was dead then, V61) and never recorded as a
  migration. **`0050_seo_metadata_corrections.sql`** records them, renumbered from 0044, which
  `develop` has used since. Checked against the published views: **all 38 match the live database**,
  so applying it changes nothing here, and a database built from migrations will match this one.
  The two updates for the retired Inrico S-100 are dropped.

**A new check.** The audit now checks every page's share image: it must exist, load as an image,
and claim the large Twitter card only for an image big enough. V45 (a 225×225 default) went
unnoticed for two sprints because nothing checked.

## DEVIATIONS

- **0050 is written, not applied.** The Supabase access token in `.env.local` now returns 401
  (V98); it worked on 4 October. Since the values are already in the database, nothing on the site
  waits on it; only the ledger does.
- **Search Console is untouched.** It needs V10 (which properties) and V25 (the indexed-URL
  cross-check), both yours.
- **Six database values stay a few characters short** of a minimum (titles 47–49, descriptions
  134–135). Reported as notes. Padding them would add words just to satisfy a counter.

## FILES

- **New:** `scripts/crawl-audit.mjs` (+ `npm run audit:crawl`),
  `supabase/migrations/0050_seo_metadata_corrections.sql`, this report.
- **Changed:**
  - Navigation and metadata: `components/layout/nav-data.ts`, `app/llms.txt/route.ts`,
    `app/(admin)/admin/products/actions.ts`, twelve `app/(site)/**/page.tsx` metadata blocks.
  - Redirects: `next.config.mjs`, `scripts/check-redirects.mjs`.
  - Docs: `docs/ROUTE_MAP.md`, `docs/NEEDS_VERIFICATION.md` (V95–V98), `docs/SPRINT_PLAN.md`,
    `docs/PERFORMANCE_BASELINE.md` §19, `CLAUDE.md`.

## DATABASE CHANGES / DEPENDENCIES

- **Database:** 0050, written and not yet applied (above). No data changed in this sprint.
- **Dependencies:** none. The auditor uses `fetch` and `JSON.parse` only.

## VERIFICATION

- `tsc --noEmit`, ESLint and Prettier on every commit. A production build of 71 pages with the
  fetch cache moved aside first (V54b); the migration and retired-strings checks are clean.
- `npm run audit:crawl`: 12 problems before, 2 after, both legal tokens.
- `check-redirects`: 13 redirects and 4 direct routes. `check-sitemap`: every URL returns 200.
- `llms.txt` read back: nine solutions, 18 products, no retired radio.
- In a browser (Playwright):
  - At 1440 px the header shows Solutions, Products, Industries, Resources and About, with no
    Platform.
  - At 360 px the phone menu opens with Enter, every section expanded. All 24 of its internal
    links return 200; 8 were dead before. Escape closes it and focus returns to the menu button.
  - No console errors or warnings.
- 0050 was checked against the published views with the anon key, read-only: 38 of 38 values
  match.

## PERFORMANCE

**No regression from this sprint.** One page, `/legal/cookies`, misses the 2.5 s budget by about
45 ms, and it misses by the same amount on `develop` (V99, for Sprint 14).

Lighthouse 12, mobile preset, production builds, on mains power. The first paired pass (both
servers at once) was stopped by the system for low memory after 15 of 18 reports, so it was re-run
at Kelvin's request with **one server at a time**, the builds alternating run by run and the order
flipped each round, so both saw the same conditions: 1.3–2.8 GB free throughout (logged per run),
`benchmarkIndex` 2,413–3,289. Four rounds:

| Route | 13r median | `develop` median | 13r runs | `develop` runs |
|---|---|---|---|---|
| `/legal/cookies` | 2,506 ms | 2,545 ms | 2,498 · 2,546 · 2,506 · 2,130 | 2,516 · 2,557 · 2,538 · 2,545 |
| `/` | 2,376 ms | 2,396 ms | 2,367 · 2,391 · 2,350 · 2,376 | 2,401 · 2,375 · 2,396 · 2,359 |
| `/solutions` | 2,230 ms | 2,242 ms | 2,198 · 2,249 · 2,205 · 2,230 | 2,224 · 2,248 · 2,242 · 2,236 |

Performance 96–99; Accessibility, Best Practices and SEO 100 on every run; CLS 0.

**`/legal/cookies`.** Every run picks the same LCP element, a paragraph of server HTML ("It does not
cover the vehicle tracking platform…"). It needs no download, and its LCP is almost all render
delay: about 2.05–2.09 s, and once 1.67 s. First paint is about 915 ms and both font files arrive
within about 100 ms on both builds, and the two builds deliver the page identically (the same
stylesheet, the same preloaded fonts). So this is a pre-existing near-miss on the longest text page,
and it goes to Sprint 14 with V94 (the late font swap).

## NEEDS_VERIFICATION

- **V95:** raised and fixed.
- **V96:** part-closed; 0050 waits on V98.
- **V97:** `WebPage` schema is specified in ROUTE_MAP and emitted nowhere, even where a comment
  says it is. For your decision.
- **V98:** the token returns 401.
- **V99:** `/legal/cookies` misses the LCP budget by about 45 ms on both builds. It predates this
  sprint and goes to Sprint 14.

## KNOWN ISSUES

- **The cookie notice covers the open phone menu:** it sits on top of the drawer and hides its lower
  links until a choice is made. This sprint didn't change it, and it belongs to Sprint 14
  (accessibility).
- **`PRODUCT_CATEGORIES` and `ROUTES.productCategory` are now unused.** They are kept until the
  catalogue has a category route or the constant is retired.

## DECISIONS NEEDED

1. **V98:** a new Supabase access token in `.env.local`, so 0050 can be applied and recorded.
2. **V97:** implement `WebPage` schema, or correct the documentation to match the site?
3. **V66–V70:** the legal text on the privacy notice and terms. This is all that stands between this
   sprint and a clean gate.
4. **V10 and V25:** Search Console. Which properties, and the indexed-URL cross-check.
Answered by Kelvin, 5 Oct 2026: "re-run the speed test then merge sprint 13". Re-run, one server at
a time: no regression (PERFORMANCE). Merged into `develop`.

**STOPPING HERE FOR REVIEW.**
