# Sprint 5 — Solutions

**Branch** `sprint/05-solutions` → `develop`
**Report date** 3 September 2026
**Format** Brief PART 21.2

---

## 1. Completed

| Sprint 5 acceptance criterion | State |
|---|---|
| Eleven-section model per solution | ✅ template implements all eleven; two render pending Sprint 6 |
| `vehicle-tracking`, `vehicle-security`, `vehicle-recovery` **derived** from product write-ups | ✅ recovery's service specifics tokenised as **V48** |
| `container-e-seal` carries "Electronic Cargo Tracking System (ECTS)" in title and H1 | ✅ verified in the rendered page |
| AI video telematics: no NTSA transmission claim, "KEBS accredited" corrected | ✅ **0** NTSA in the page body |
| Speed governors: IRMS resolved (V02) or omitted | ✅ the write-up contains no IRMS mention — nothing to omit |
| School bus: V17–V24 resolved, legal review | ❌ **not met — all eight open, held as draft** |
| Every source hedge preserved word for word | ✅ verified per page |
| `fleet-management` / `asset-tracking` not built, not in sitemap | ✅ verified |

Seven of eight. The exception is school bus, and it is blocked on client answers rather than on work.

**Nine solution pages published**, 1,300–1,570 words each, plus the solutions index and a reusable
template. **73 FAQs**, each marked up as `FAQPage` from the same rows the page renders.

---

## 2. Deviations from plan

**A `sections jsonb` column was added** (approved during the sprint). The eleven-section model is a
fixed shape, so it can be typed. Chosen over markdown or sanitised HTML in `body` for three reasons:
no renderer dependency on a 180 KB route budget, the design system holds because an editor cannot
introduce arbitrary structure, and Sprint 11's admin becomes per-section fields rather than one
freeform box.

Only the six *prose* sections live there. Hardware, coverage, FAQs and related stay in the tables
that already model them, so no fact exists in two places.

**Two of the eleven sections render nothing yet.** Section 6 (hardware options) reads
`product_solutions`, which is empty until Sprint 6. Section 10 (related) needs the same joins. Both
are wired and appear on their own when the rows exist. Nothing is stubbed, because a placeholder
product is a fabricated product.

**School bus is seeded but unpublished.** The row exists so the slug is reserved and Sprint 11 has
something to attach content to. It carries no summary and no sections: there is nothing to draft that
would not be guesswork, and a half-written draft is what gets published by accident later.

---

## 3. Files

**Added**
```
app/(site)/solutions/page.tsx              index, reads the published view
app/(site)/solutions/[slug]/page.tsx       the reusable template
components/solution/prose-sections.tsx     sections 1,2,3,4,5,7
components/solution/solution-faqs.tsx      section 9 + FAQPage source
scripts/gen-types.mjs                      safe type generation
.prettierrc.json                           the config that did not exist
supabase/migrations/0012                   sections jsonb column
supabase/migrations/0013…0022              ten solutions
docs/sprint-reports/SPRINT-05.md           this report
```

**Changed**
```
app/sitemap.ts            reads the published view, not the static list
lib/seo/metadata.ts       guards against a doubled brand suffix
types/content.ts          SolutionSections + a safe accessor
types/database.ts         regenerated after the schema change
package.json              db:types now calls a script
docs/NEEDS_VERIFICATION.md  V48 raised
```

---

## 4. Database changes

Migration **0012** adds `solutions.sections jsonb`, recreates `public_solutions` to expose it, and
**re-issues the grants** — recreating a view drops them, and without the grant `anon` gets
"permission denied" and every solution page renders empty.

Migrations **0013–0022** seed ten solutions and 73 FAQs. Verified live: 10 rows in the base table,
**9 in the public view**, school bus excluded by `status = 'draft'`.

---

## 5. Defects found and fixed

**A soft 404 on every unknown solution slug.** Without `dynamicParams = false`, Next rendered an
unknown slug on demand, `notFound()` produced the 404 page, and the response was cached and served
with **HTTP 200** — verified: `/solutions/does-not-exist` returned 200 while `/totally-unknown`
correctly returned 404. Search engines index a 200, which is how a site accumulates thousands of
indexable empty URLs. Solutions are a known finite set, so any slug outside `generateStaticParams` is
now a hard 404. That also moved the school bus draft gate down to the routing layer: the URL is
unreachable rather than merely unlinked.

**The sitemap advertised a 404.** It mapped the static `LAUNCH_SOLUTIONS` list, which contains all
ten, so `/solutions/school-bus-management` was listed while that route returned 404 — the exact
self-authored crawl error the file's own comment warns about, and an advertisement for an
unpublished page about children's data. It now reads the published view: 9 entries, school bus
absent. A hand-written list has to remember; reading the view cannot forget.

**The doubled brand suffix returned, from data this time.** A seeded `seo_title` containing
"| Nebsam" produced "… | Nebsam | Nebsam" — the same shape as the template bug fixed in Sprint 4.
`buildMetadata` now ignores a suffix that is already present. The likeliest source of the next one is
a staff member typing a title into the Sprint 11 SEO panel, so the guard is on the input.

**`npm run db:types` could destroy the types it was regenerating.** The script assumed `supabase` was
on PATH (it is not; we use npx) *and* redirected shell output into `types/database.ts`. The shell
opens the redirect before the command runs, so a failed generate did not leave the previous types
alone — it truncated the file to zero bytes and broke the build. That happened. Generation now writes
to a temp file, refuses output that does not look like generated types, and only then replaces the
real one.

**Prettier had no config,** so running it reformatted files to double quotes against a single-quote
codebase, while CLAUDE.md §11 requires Prettier to pass. `printWidth: 100` was measured as the closest
fit. See §10 — the existing 43 files are not reformatted here.

---

## 6. Content accuracy

Verified against the **rendered page bodies**, with site chrome excluded — the first scan produced
two false positives from the footer, which is why the check was redone properly.

| Check | Result |
|---|---|
| NTSA on `ai-video-telematics` | **0** — absent, not hedged, per V01 |
| NTSA on `speed-governors` | 10 — correct, this is the regulatory function |
| KEBS on `ai-video-telematics` | 5 — correct, the permit is scoped to this product |
| KEBS on `speed-governors` | **0** — the source claimed it; omitted |
| "accredited" anywhere | **0** |
| "unlimited" anywhere | **0** |
| Banned phrases across all nine bodies | **0** |

Three source phrases were dropped rather than softened, and each looked harmless:

- **"KEBS and NTSA-compliant"** on speed governors. The KEBS permit is product-scoped to STREAMAX
  video telematics cameras. Repeating this would extend a real permit to a product it does not cover.
- **"high-precision"** on fuel monitoring. Sensor accuracy is one of that page's eight open tokens, so
  the adjective asserts exactly the unverified thing.
- **"unprecedented visibility"** — a superlative.

`impossible to steal` was flagged by the scan and checked: both occurrences are **negations** —
"No security system makes a vehicle impossible to steal, and we will not tell you otherwise" — which
is the framing §5 requires.

**Every source hedge survives**, verified per page: *according to the configured security
permissions* · *designed to detect* · *selected events* · *where supported by the vehicle system* ·
*varies by vehicle make, model, year and immobilizer architecture* · *under specified operating
conditions* · *Battery performance varies depending on…* · *subject to network coverage and service
availability*.

---

## 7. Verification actually run

| | |
|---|---|
| `tsc --noEmit`, `eslint .`, `npm run build` | pass |
| `npm run verify:db` | pass |
| Routes | 9 solutions → 200; school bus → **404**; unknown slug → **404** |
| Sitemap | 9 solution URLs, school bus absent |
| ECTS criterion | phrase present in both `<title>` and `<h1>` |
| Schema | `Service` + `BreadcrumbList` + `FAQPage` on each page |
| Console | zero messages |
| Retired strings | 130 build artefacts, 0 violations |

---

## 8. Performance — measured

Lighthouse mobile, median of three on `/solutions/container-e-seal`. A single run reported 86; three
runs showed that was machine noise, which is why the median is used.

| Metric | Measured | Budget | |
|---|---|---|---|
| Performance | **94–95** | ≥ 90 | ✅ |
| Accessibility | **100** | ≥ 95 | ✅ |
| Best Practices | **96** | ≥ 95 | ✅ |
| SEO | **100** | ≥ 95 | ✅ |
| CLS | **0.012** | ≤ 0.05 | ✅ |
| TBT | 80–120 ms | — | |
| **LCP** | **2.9 s** | ≤ 2.5 s | ❌ **V47** |

The solution template carries the same profile as the homepage: everything passes except LCP, which
is the accepted critical-path-bytes issue recorded as V47. Adding nine content-heavy pages did not
move it, which is consistent with the diagnosis — the cost is JS and fonts, not page content.

---

## 9. Accessibility

Lighthouse accessibility **100** on the solution template. Exactly one H1 per page, visible
breadcrumbs marked up as `BreadcrumbList`, FAQs as real headings and paragraphs rather than a
`<details>` accordion — collapsed content is the crawlability failure this rebuild exists to fix, and
an accordion also hides the answer from the reader scanning it.

---

## 10. Decisions needed from the human

1. **School bus (V17–V24 + legal review).** Eight client answers and a legal review. Until then the
   page stays a draft. **Changing the status alone would publish an empty page about children's
   data** — the content has to be written after the answers arrive, not before.
2. **V48 — is there a recovery service?** The page currently says the tracker supports a recovery
   rather than performing one. If a service does exist, its terms are needed; if it does not, the
   present wording is correct and should not be softened.
3. **Prettier reformat of the existing 43 files.** Deliberately not done here — a 43-file formatting
   diff inside a content sprint would bury the work, which §12 warns against. Worth its own chore
   commit.

---

## 11. Known issues and open register items

| Item | Effect |
|---|---|
| **V17–V24** | School bus. Eight open items plus legal review. Page held as draft |
| **V48** | Whether a stolen-vehicle recovery **service** exists. Raised this sprint |
| **V47** | Homepage and solution LCP 2.878 s against ≤ 2.5 s. Accepted for Sprint 4 |
| **V01** | NTSA transmission claim. Honoured by omission on the video telematics page |
| **V02** | IRMS. No effect on the speed governor page — the write-up never mentions it |
| **V13** | Platform screenshots. Still blocks `/platform` |
| **V25** | Search Console cross-check. **Sprint 2 still cannot formally close** |
| **V28a** | ODPC claim in `lib/company.ts`, now live on ten pages |
| Fuel monitoring | 8 spec and commercial tokens written around, not resolved. Price, accuracy, calibration and installation terms remain unstated |
| AI video telematics | 10 tokens written around. Retention periods and consent procedures deliberately unstated |
| Sections 6 and 10 | Hardware and related render nothing until Sprint 6 supplies products |

**No new `[[NEEDS_VERIFICATION]]` tokens reached any public page.**

---

## 12. Recommended next step

Sprint 6 — Products. It fills section 6 on all nine solution pages and section 10's related links,
turning the current pages from complete-but-unlinked into a connected set. The relationship rule in
`CONTENT_ARCHITECTURE` §1 — no orphan pages — is not satisfied until products exist.

---

**STOPPING HERE FOR REVIEW.**
