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

**Ten of eleven.** The one left is legal text, and no code closes it. **Performance is not closed
either:** `/legal/cookies` sits on the 2.5 s line, and the check that would say whether this sprint
caused it was stopped for low memory (V99, PERFORMANCE section).

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

**Not closed: one page sits on the 2.5 s line, and the check could not finish.**

Lighthouse 12, mobile preset, production builds, on mains power. First a single-build pass (3 runs
per route), then a paired pass against `develop` built in a worktree, alternating run by run. The
system stopped the paired pass for low memory after 15 of 18 reports (1.2 GB free of 15.6 GB, held
mostly by other programs), so its numbers carry that load.

| Route | 13r, single pass | 13r, paired | `develop`, paired |
|---|---|---|---|
| `/` | 2,401 ms | 2,354 · 2,390 · 2,391 | 2,114 · 2,386 |
| `/solutions` | 2,241 ms | 2,238 · 2,244 | 2,237 · 2,241 |
| `/legal/cookies` | **2,542 ms** | **2,501 · 2,530 · 2,542** | 2,115 · **2,535** · 2,008 |

Accessibility, Best Practices and SEO 100 on every run; CLS 0; Performance 97–99.

**`/legal/cookies` is bimodal on both builds.** Every run picks the same LCP element: a paragraph of
server HTML ("It does not cover the vehicle tracking platform…"). It needs no download, and its LCP
is all render delay, either about 1.6 s or about 2.1 s. First paint is about 915 ms on both, and
both font files arrive within about 100 ms. The two builds deliver the page identically (the same
stylesheet, the same preloaded fonts; 13r's HTML is 480 bytes smaller, from the removed nav links),
and `develop` hit the slow mode too (2,535). So nothing this sprint changed explains it, and nothing
here clears it either. This page has no earlier measurement to compare with.

**What closes it:** the paired pass re-run on a machine with memory to spare (about ten minutes;
the `develop` worktree build is kept for it). If `/legal/cookies` still lands at about 2.5 s on
both builds, it is a pre-existing near-miss and belongs with V94 (the late font swap) in Sprint 14.
If only 13r does, it is this sprint's to fix.

## NEEDS_VERIFICATION

- **V95:** raised and fixed.
- **V96:** part-closed; 0050 waits on V98.
- **V97:** `WebPage` schema is specified in ROUTE_MAP and emitted nowhere, even where a comment
  says it is. For your decision.
- **V98:** the token returns 401.
- **V99:** `/legal/cookies` LCP sits on the 2.5 s line; it needs a clean re-measurement.

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
5. **The `/legal/cookies` re-measurement:** run it when the machine has memory free? Until then
   the sprint is not closed on performance.
6. **Merge this sprint into `develop`?** Only after item 5, under the budget rule.

**STOPPING HERE FOR REVIEW.**
