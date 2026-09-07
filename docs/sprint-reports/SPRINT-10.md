# SPRINT 10 — RESOURCES

**Branch** `sprint/10-resources` · ten commits · 5-6 September 2026 · **merged to develop 7 September**
**Delivers** Downloads, FAQs, guides

---

## 1. Acceptance criteria

| Criterion | State |
|---|---|
| `cleared_for_publication` enforced — nothing publishes without a human clearance | ✅ **Proven, not asserted.** Four rows seeded, all blocked. Evidence in §7 |
| Decision on regenerating the four proposals rather than redacting the Canva originals | ❌ **Not taken — client-owned.** The recommendation and its reasoning are in §12.1 |
| File size shown before the click | ✅ Implemented and unit-verified against the real byte counts. **Not yet exercised on a rendered row**, because no row is cleared |
| Definitional content published: telematics, geofencing, immobilisation, anti-jamming, fuel siphoning detection, PoC radio, e-seal | ✅ Seven articles live |

Three of four met. The fourth is a decision only the client can take, and this
report puts it to them with a recommendation.

---

## 2. What was built

**`/resources`** — the hub, and the middle breadcrumb level the blog has been
missing since Sprint 9. Three destinations rendered as an index with a live count
each, rather than three cards: brief 6.6 prohibits uniform rounded-card grids and
three-column feature blocks as the default answer, and a hub with exactly three
children is the likeliest place on the site to reach for one. The count is the
content: "Downloads — nothing published yet" tells a visitor something a tile
never could.

**`/resources/faqs`** — eight global questions, rendered as headings and
paragraphs and marked up as `FAQPage` from the same rows. Not an accordion:
collapsed content is the crawlability failure this rebuild exists to fix, and it
hides the answer from the reader scanning an FAQ, which is every reader.

**`/resources/downloads`** — the download centre, showing type, size, date and
version before the click. It renders its empty state today.

**Seven definitional articles** at `/resources/blog/[slug]`, each titled with the
question a buyer types and opening with the definition as its first paragraph.

**Supporting work:** a `Breadcrumbs` component, `lib/format.ts`, and
`ARTICLE_SOLUTION` so every article links out to a solution.

---

## 3. Deviations and judgement calls

**Definitional content went to the blog, not a glossary.** `CONTENT_ARCHITECTURE`
gives the Article type the job of "acquisition and definitional depth" with a
question as its H1, and `ROUTE_MAP` mints no glossary route. Slugs are permanent,
so `/resources/glossary` would have been a URL whose naming nobody confirmed.

**`ARTICLE_SOLUTION` is a constant, not a column.** A `related_solution_id` on
`blog_posts` is the better long-term answer and is recommended for Sprint 11 —
but it is a data-model change, and CLAUDE.md §3.5 requires those to be proposed
and approved before they are made. The page validates the mapped slug against
*published* solutions, so the draft school bus solution cannot produce a dead
link.

**No FAQ restates the ODPC registration.** That claim lives in exactly one
constant, `CANONICAL_DESCRIPTION`, which is what makes V28a a one-line fix if the
renewal does not land. Seeding a second copy into the database would have quietly
destroyed that property — the constant would be corrected and the FAQ row would
go on asserting a lapsed registration.

**Four obvious FAQs were not written**, because answering them would have meant
inventing: installation duration, warranty terms, a count of technicians, and
which vehicles can be fitted. Absent beats guessed.

**The download page's empty state carries no internal reasons.** A visitor does
not need to be told which retired addresses a draft proposal still contains. The
reasons are in the migration, the source notes and §12.1.

**`download_started` analytics not wired.** It would make the listing a client
component. With zero rows to track and the perf baseline pricing the whole client
bundle at three points, that boundary is not worth adding before there is
something to measure.

**Breadcrumbs extracted but only four pages migrated.** Eight pages had already
inlined the markup; this sprint added three more and had to edit a fourth.
Migrating the other seven is a mechanical change across templates this sprint has
no other reason to touch — listed in §12.3.

---

## 4. Files

```
NEW   app/(site)/resources/page.tsx
NEW   app/(site)/resources/faqs/page.tsx
NEW   app/(site)/resources/downloads/page.tsx
NEW   components/layout/breadcrumbs.tsx
NEW   lib/format.ts
NEW   supabase/migrations/0033_seed_global_faqs.sql
NEW   supabase/migrations/0034_seed_downloads_uncleared.sql
NEW   supabase/migrations/0035_seed_definitional_articles.sql
NEW   supabase/migrations/0036_fix_article_seo_titles.sql
NEW   supabase/migrations/0037_trim_article_seo_description.sql
EDIT  app/(site)/resources/blog/page.tsx        breadcrumb gains Resources
EDIT  app/(site)/resources/blog/[slug]/page.tsx breadcrumb fix + link out
EDIT  app/sitemap.ts                            3 routes + published posts
EDIT  app/llms.txt/route.ts                     3 routes
EDIT  lib/constants.ts                          ARTICLE_SOLUTION
EDIT  lib/supabase/server.ts                    V54 — tagged reads
EDIT  app/(admin)/admin/blog/actions.ts         V54 — revalidateTag
EDIT  app/(site)/resources/blog/[slug]/page.tsx dynamicParams = true (V54a)
EDIT  docs/NEEDS_VERIFICATION.md                V54a closed, V54b open
```

---

## 5. Database changes

Five migrations, all additive. No schema change — `faqs`, `downloads` and
`blog_posts` were built in Sprints 3–4 and needed nothing.

| | |
|---|---|
| 0033 | 8 global FAQs |
| 0034 | 4 downloads, **all draft and uncleared**, plus a table comment warning against clearing in a migration |
| 0035 | 7 definitional articles |
| 0036 | 3 SEO titles lengthened into the 50–60 range |
| 0037 | 1 SEO description trimmed to 155 |

`check-migrations`: clean — RLS on all 31 tables, 17 views granted to anon, no
base table exposed.

---

## 6. Dependencies added

**None.**

---

## 7. Verification actually run

**The clearance gate, end to end.** This is the sprint's load-bearing criterion,
so it was proven against the live database rather than read off the SQL:

```
downloads BASE TABLE (service role):  4
   fuel-monitoring-solution-proposal        status=draft cleared=false
   vehicle-tracking-and-security-brochure   status=draft cleared=false
   radio-communication-proposal             status=draft cleared=false
   school-bus-solution                      status=draft cleared=false
public_downloads VIEW (anon key):     0
downloads BASE TABLE (anon key):      refused — permission denied for table downloads
```

Four rows exist, none reaches the view, and the base table is not readable by the
anon key at all. The rendered page contains no occurrence of any seeded title.

**Server-rendered, verified not assumed.** `curl` with no JavaScript returns the
FAQ questions and answers in the HTML, and the `FAQPage` JSON-LD parses with
`mainEntity` of 8.

**Schema.** `Organization`, `WebSite`, `BreadcrumbList` and `FAQPage` all parse.
`FAQPage` is generated from the rows that render, so it cannot contradict the
page.

**Sitemap and llms.txt.** All three routes plus seven article URLs present.

**Browser.** All five routes rendered and interacted with. Zero console messages
of any kind — not merely zero errors — on the article template.

**Focus rings, measured per ground:**

| Link | Ground | Outline |
|---|---|---|
| Breadcrumb crumbs | dark | `rgb(61, 139, 255)` — `#3D8BFF` |
| Body and related links | light | `rgb(24, 87, 196)` — `#1857C4` |

The `data-section` system resolves correctly on both. Offset present on every
one. Measured width came back 1.6px rather than the specified 2px, consistently
across every link on the page including pre-existing ones — a rendering scale
artefact of the capture, not a token change.

**Structural checks:** exactly one H1 per page, no horizontal overflow, no
element with a rigid width above 360px.

**Formatters, unit-tested against the real byte counts:**

```
 542163 -> "542 KB"     3677863 -> "3.68 MB"      0 -> null
1803068 -> "1.80 MB"          -5 -> null       null -> null
```

**Build:** 59 static pages. `check-retired-strings` clean across 265 build
artefacts — up from 233, so the new content was scanned.

`tsc --noEmit`, `eslint` and `check-migrations` all pass.

---

## 8. Performance

Measured on the production build, and read the way `PERFORMANCE_BASELINE.md` now
requires: **paired against a known reference, because absolute scores on this
machine are not trustworthy.**

| | Median paired delta |
|---|---|
| `/resources/faqs` against `/` | **−1 point** (3 pairs: +3, −3, −1) |

The new pages are indistinguishable from the existing ones. Absolute scores
during this session ran 71–79 on *both* the FAQ page and the homepage — the same
homepage that medianed 93 earlier the same day — which is the loaded-rig
behaviour V54's neighbour V47 documents, not a regression introduced here.

| | |
|---|---|
| First Load JS, all new routes | **103 kB** (budget ≤ 180 KB) ✅ |
| Route size | 165 B ✅ |
| Transfer, `/resources/faqs` | **298 KB** (budget ≤ 1.0 MB) ✅ |
| CLS | **0.000** ✅ |
| Accessibility / Best practices / SEO | **100 / 96 / 100** ✅ |

No new client JavaScript was added by this sprint. All three routes are server
components.

---

## 9. Accessibility

Lighthouse accessibility **100** on the new routes. One H1 each, no heading-level
jumps, one `main` landmark. FAQ questions are `h2` inside a `dl`, so the structure
a screen reader announces matches the structure the schema declares.

The download link repeats the file size in its accessible name, so a
screen-reader user hears it **before** activating the link rather than after —
which is the entire point of the "size before the click" requirement, and is easy
to satisfy visually while failing for the people it matters most to.

Breadcrumbs now carry `aria-current="page"` on the article template, which they
did not before.

**Not verified:** 360 px on a real viewport. The window would not resize below the
docked panel's width, the same limitation Sprint 4 recorded. Verified
structurally instead — no horizontal overflow and no rigid element above 360 px.
Ultrawide remains unrendered.

---

## 10. Security and content safety

No new endpoints, no new mutations, no new client JavaScript, no PII.

The publication gate is layered rather than implemented in the page: the WHERE
clause on `public_downloads`, the anon grant that excludes the base table, and a
CHECK constraint that refuses a clearance without `cleared_by` and `cleared_at`.
A clearance is therefore always attributable to a person. A gate implemented in a
component is a gate the next component forgets.

Every article and FAQ answer traces to `content-source/` or to already-approved
published copy. Source hedging is carried word for word. The KEBS answer states
the permit's product scope and quotes the laboratory report's reference, date and
result rather than paraphrasing it into anything stronger.

---

## 11. New register items

**V54 — a rebuild, and the CMS publish button, could serve a stale database
read. RAISED AND FIXED THE SAME DAY**, at the client's instruction to settle it
before Sprint 11. Full account in §15.

No new `[[NEEDS_VERIFICATION]]` tokens were created. No public page ships carrying
one.

---

## 12. Decisions needed from the human

### 12.1 The four documents — regenerate or redact

**The sprint's second criterion, and it is the client's call.** All four prepared
PDFs fail content clearance:

| Document | Blockers |
|---|---|
| Fuel monitoring proposal | Unpublished phone number, two retired addresses, third-party platform branding in dashboard screenshots (V13), an unsubstantiated fuel-theft claim, and ~70 named clients without permission (V12) |
| Tracking & security brochure | Two retired product names throughout, the wrong tagline, undeclared AI-generated imagery |
| Radio proposal | Retired addresses in every footer, an unpublishable range claim |
| School bus proposal | Highest legal sensitivity on the project — children's data and biometrics; eight open items (V17–V24); undated; undeclared AI imagery |

**Recommendation: regenerate from `content-source/`, do not redact.** The
write-ups already have the retired names corrected, the unpublishable claims
removed and the hedging preserved. Redacting a Canva export to the same standard
is more work than re-laying-out a corrected document, and it leaves artefacts.
The school bus proposal should not be regenerated at all until legal review.

A fifth document, the video telematics proposal, is **not in the repository** and
carries the worst exposure on the project — customer plates, coordinates, device
IDs and two identifiable faces. That is V14, and it is NOT CLEARED on arrival.

### 12.2 V54b — a rebuild can still serve a stale database read
The publish path is fixed and verified (§15). The rebuild path is not, and it is
the one that matters at cutover. Clear the data cache on deploy, shorten the
fetch-level revalidate, or accept the window — a decision, not a fix.

### 12.3 Smaller items

- A `related_solution_id` column on `blog_posts` would replace `ARTICLE_SOLUTION`
  properly. Proposed for Sprint 11.
- Seven older pages still inline breadcrumb markup.
- `llms.txt` still lists six routes that do not exist yet — platform,
  certifications, coverage, support, contact, quote. That is the same
  self-authored-404 problem the sitemap was fixed for. Left alone deliberately:
  each is owned by the sprint that builds it.
- `formatFileType` renders an unknown MIME type as e.g. `VND.MS-E`. Only PDFs are
  seeded, so it does not bite today.

---

## 13. Known issues

| Item | Effect |
|---|---|
| **V54a** | **Fixed.** Saving a post no longer 404s it |
| **V54b** | **Open.** A rebuild can still emit stale content; matters at cutover |
| Downloads criterion 2 | The regenerate-vs-redact decision is unmade |
| File-size rendering | Correct in unit tests, never exercised on a cleared row |
| File delivery | No storage bucket exists; signed-URL delivery is Sprint 12 |
| V13 | Platform screenshots — blocks one of the fuel proposal's blockers |
| V12 | Client permissions — blocks the fuel proposal's client list |
| V17–V24 | School bus, still draft and legally sensitive |
| V14 | The missing fifth PDF |
| 360 px / ultrawide | Not rendered on real hardware |
| Prettier | 43 pre-existing files unformatted |
| ~~`chore/perf-baseline-re-measure`~~ | **Merged 7 September**, before this branch |

---

## 14. Recommended next step

**Both branches are now merged into `develop`** — `chore/perf-baseline-re-measure`
first as recommended, then this one. Neither conflicted; git resolved the register
cleanly, and it was checked by hand afterwards rather than trusted: V47 carries its
re-diagnosed form from the perf branch, V53 is present, V54a is closed and V54b is
open, with no duplicate identifiers. The merged tree passes typecheck, lint,
migration checks and the build, all twelve public routes return 200, an unknown
blog slug still hard-404s, and the favicon is 3,475 bytes.

Next is **Sprint 11 — Trust & Support**: the certifications page, `display_status`
and the V51 override, and the natural home for the `related_solution_id` proposal
from §3.

Sprint 11 is not gated on V54 — the publish path is fixed (V54a). It *is* gated on
client answers, and more tightly than any sprint so far: V03 and V04 decide how
certificate verification is built at all, and V15, V12, V13, V32, V33 and V34 are
its content. Starting it without those means building templates with nothing to put
in them.

---

## 15. V54 — and the correction that followed

Added after the client asked for it to be settled before Sprint 11, then
**substantially corrected** after they pushed on the one thing this report had
left unverified. That push was right, and it found a worse bug than the one being
chased.

### 15.1 What the first attempt got wrong

The first fix was shipped on a plausible causal story that turned out to be
wrong. The cached entry for `/public_blog_posts?slug=eq.what-is-a-container-e-seal`
was genuinely recovered from `.next/cache/fetch-cache` and decoded — it held the
old `seo_title` with `revalidate: 3600` and `tags: []` while the database held
the new value. All true. The inference drawn from it — that empty tags were why
the CMS could not publish — was not tested, and it was wrong.

**Tested afterwards, on a running production build:** after a direct database
change, `revalidatePath` **alone** already produced fresh output, on both a
dynamic article route and the statically generated blog index. Adding
`revalidateTag` changed nothing observable.

### 15.2 What was actually broken — and it was worse

Verifying the round trip meant calling `revalidatePath` on a real article. It did
not refresh the article. **It took it offline.**

```
before revalidatePath:  What is telematics? A plain explanation | Nebsam
after  revalidatePath:  Page not found | Nebsam
server log:             Error: Internal: NoFallbackError
```

Reproduced on a second article to confirm it was systemic. The cause: the blog
route set `dynamicParams = false`. That is correct for solutions, products and
industries — finite published sets, where an unknown slug should be a hard 404
rather than a soft 200, and where the draft gate is enforced at the routing
layer. It is wrong for the one route type staff publish to **between deploys**,
which is the entire reason the Sprint 9 CMS exists.

So the publish button did not merely fail to publish. **Saving a post
unpublished it**, until the next full build.

That bug was sitting in the Sprint 9 code, and this sprint's own
`revalidateBlogSurfaces()` inherited it. It would have been found by the first
person to press Save — or not found, if nobody checked the post afterwards.

### 15.3 The fix

`dynamicParams = true`, on the blog route only. The soft-404 concern that
motivated `false` was re-tested on this route rather than assumed:

| Check | Result |
|---|---|
| `/resources/blog/does-not-exist` | **HTTP 404** — hard, not a soft 200 |
| `/totally-unknown` | **HTTP 404** |
| Real article after `revalidatePath` | **HTTP 200**, fresh content |
| `generateStaticParams` | Still prerenders all seven posts at build |

Solutions, products and industries keep `dynamicParams = false`. Nothing about
their reasoning changed.

### 15.4 What was tried and rejected

`cache: 'no-store'` on the Supabase client, on the argument that the page cache
is already the cache and a second cache underneath it can only go stale. A good
argument and the wrong answer — **measured rather than reasoned about**. The
build moved the homepage, `/solutions`, `/products`, `/industries`, all three
resources routes and `/sitemap.xml` from prerendered to server-rendered on
demand. Only routes with `generateStaticParams` survived, and
`check-retired-strings` fell from 265 build artefacts to 163 because there was
less prerendered output left to scan.

That trades a staleness bug for a performance regression on every index page, for
an audience specified as a mid-range Android on metered data. Reverted.

### 15.5 The tagging, kept but demoted

Every read is still tagged with the PostgREST view it hit — 133 of 133 cached
reads, across 12 views, none untagged — and `revalidateBlogSurfaces()` still
calls `revalidateTag` alongside `revalidatePath`, now also covering the resources
hub (live article count) and the sitemap (post list).

But it is kept as hygiene, not sold as the fix. It is the only handle that exists
on that cache, the ISR background-regeneration path could not be tested without
waiting out a full hour, and a tag costs nothing to carry. The code comments in
`lib/supabase/server.ts` and `actions.ts` were rewritten to say exactly this,
because they had claimed more.

The admin and service-role clients take `no-store`. They run only in
`force-dynamic` admin routes and server actions, so they cannot pull a public
route out of static generation, and a cached answer to "what does this row
currently say" is a correctness bug in an editor.

### 15.6 The round trip, now actually verified

Run against a running production build, with the database changed directly
between steps and restored afterwards:

| Step | Result |
|---|---|
| Baseline | page matches database |
| Database changed, nothing invalidated | page unchanged — correct, that is the ISR window |
| `revalidatePath` | **page fresh** |
| `revalidateTag` + `revalidatePath` | page fresh |
| Unknown slug throughout | HTTP 404 |

The test used a temporary local route handler to call the two halves separately.
It was removed afterwards and is not committed; `/api/v54-test` returns 404 in the
final build, and no `/api` route exists. The test row was restored and all seven
articles verified against the database.

### 15.7 What is still broken — V54b

**A rebuild still serves a stale database read.** With the previous build cache
present, a fresh `npm run build` emitted the old value while the database held
the new one. Verified twice. That is the original symptom that raised V54, and
**it is not fixed** — tagging cannot help, because nothing calls `revalidateTag`
during a build.

Ordinary CMS publishing is unaffected: that path is fixed and verified above.
This matters at **cutover**, when the deployed content must match the database
exactly. Options are to clear the Next data cache on deploy, shorten the
fetch-level revalidate, or accept a content change landing within an hour of a
deploy. That is a decision, and it is now V54b in the register rather than a
closed item that was never closed.

---

**STOPPING HERE FOR REVIEW.**
