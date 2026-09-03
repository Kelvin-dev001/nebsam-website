# Sprint 8 — Industries

**Branch** `sprint/08-industries` → `develop`
**Report date** 3 September 2026
**Format** Brief PART 21.2

**Sprint 7 (Commerce) was deferred by client decision** and is recorded as **V49**. See §10.

---

## 1. Completed

| Sprint 8 acceptance criterion | State |
|---|---|
| Only industries the source documents actually name | ✅ thirteen, from `CONTENT_ARCHITECTURE` §2.7 |
| Each page says something specific about that sector, or is honestly a link hub | ✅ six specific, seven honest hubs |
| No orphan pages: solution ↔ product ↔ industry all linked | ✅ verified by crawl — **0 orphans, 0 broken links** |

All three met.

Thirteen industry pages, the industries index, 44 solution↔industry links and 17 product↔industry
links. Solution pages now link back to their sectors, closing the loop.

---

## 2. Deviations from plan

**None on scope.** The one judgement worth recording is what the criterion permits and this sprint
used: seven of the thirteen pages do not have sector-specific operational content in the sources, so
they say plainly that they are a starting point rather than being padded to look substantial.

That was the alternative worth resisting. Generic copy about "improving efficiency and reducing
costs" would have made all thirteen pages look equal and told a reader nothing. An industry page is
the easiest page on a website to fabricate — nobody can disprove a claim to serve a sector — and the
list here is not extended, not rounded up to a nicer number, and not padded with sectors that sound
plausible for Kenya.

**School transport was written deliberately narrow.** The school bus solution is a draft blocked on
V17–V24 and legal review, so this page describes the *vehicle* — speed limiters and tracking, both
documented, both genuinely applicable to a school bus — and says nothing about attendance,
biometrics, alcohol screening or children's data. It states that the dedicated offering is not yet
published, rather than implying it does not exist.

---

## 3. Files

**Added**
```
app/(site)/industries/page.tsx              index
app/(site)/industries/[slug]/page.tsx       industry template
components/solution/solution-industries.tsx section 10 — the return link
supabase/migrations/0028_seed_industries.sql
supabase/migrations/0029_link_industries.sql
docs/sprint-reports/SPRINT-08.md            this report
```

**Changed**
```
lib/content/index.ts    three relation accessors
app/sitemap.ts          industries added
app/(site)/solutions/[slug]/page.tsx        section 10 wired in
docs/NEEDS_VERIFICATION.md                  V49 — Sprint 7 deferral
```

---

## 4. Database changes

Migrations 0028–0029 seed 13 industries and the two join tables. Both join views filter **both** sides
to published, so a draft on either end cannot produce a link to a 404 — load-bearing here, because
the school bus solution and four products are drafts.

Links are made where the source supports them rather than everywhere they would be plausible.
Linking every solution to all thirteen industries would satisfy the letter of the criterion and
destroy its purpose.

---

## 5. Verification actually run

| | |
|---|---|
| `tsc --noEmit`, `eslint .`, `npm run build` | pass |
| `npm run check:sitemap` | pass — **32 URLs, all 200** |
| `npm run verify:db` | pass |
| **Orphan crawl** | 32 pages crawled; **0 with no inbound internal link** |
| **Link integrity** | 36 distinct internal targets; **0 not returning 200** |
| Console | zero messages on the industry template |
| Retired strings | 196 build artefacts, 0 violations |

The orphan crawl is the verification that matters for this sprint, because "no orphan pages" is not
something a page-by-page check can establish — it is a property of the whole graph.

---

## 6. Performance

Not re-measured. The industry template is structurally identical to the solution template — server
components, no new client JS — which Sprint 5 measured at Performance 94–95 and CLS 0.012, with LCP
2.9 s against the accepted **V47**.

---

## 7. Accessibility

Same template patterns as solutions and products: one H1 per page, visible breadcrumbs marked up as
`BreadcrumbList`, 44 px minimum tap targets on the sector links, and no client-only content.

`WebPage` rather than `Service` schema on industry pages. An industry is not a service Nebsam offers,
it is a description of who its services are for, and `Service` would assert something the page does
not say.

---

## 8. Decisions needed from the human

1. **A01–A07 and V05** — still the largest blockage. They hold four products as drafts and leave
   installation terms unstated everywhere. They also gate Sprint 7.
2. **V17–V24 + legal review** — school bus. The industry page now points at its absence.
3. **The twelve unbuilt products**, including the Hybrid Dashcam, which carries an unmet Sprint 6
   criterion.

---

## 9. Known issues and open register items

| Item | Effect |
|---|---|
| **V49** | **Sprint 7 (Commerce) deferred.** Blocks revenue; must land before Sprint 15 |
| **A01–A07** | Four products held as drafts; A07 also blocks Sprint 7 bundle pricing |
| **V05** | Installation terms unstated on every product |
| **V17–V24** | School bus solution still a draft, legal review outstanding |
| **V48** | Whether a stolen-vehicle recovery *service* exists |
| **V47** | LCP 2.878 s against ≤ 2.5 s. Accepted |
| **V13** | Platform screenshots; `/platform` still unbuilt |
| **V25** | Search Console cross-check. **Sprint 2 still cannot formally close** |
| **V28a** | ODPC claim, live across the site |
| **V12 / V45** | Client logos; OG image 225×225 |
| `CERT_PLATE_HMAC_SECRET` | Empty; required before any certificate import |
| Unbuilt routes | platform, resources, blog, downloads, faqs, about and its children, support, contact, quote, legal. Deliberately absent from the sitemap until built |
| Prettier | 43 existing files unformatted |
| Housekeeping | `_to_delete/`, `nebsam-scaffold.zip`; removal approved but denied at the prompt |
| Ultrawide | Never rendered on real hardware |

---

## 10. Sprint 7 — deferred, not skipped

Recorded as **V49**. Commerce delivers price and VAT labelling, categories, filters, cart, order
creation, WhatsApp handoff and order lookup. It was deferred because the catalogue it would sell is
about 40% built: ten of roughly twenty-six products published, four held as drafts under A01–A07, and
V05 unanswered for every category. A07 in particular is a *bundling and pricing* claim which may need
a bundle concept in the data model before a cart can price it.

**This must not quietly disappear.** The shop is one of the three commercial objectives in
CLAUDE.md §1, and it has to land before Sprint 15. Its prerequisites are A01–A07, V05, and enough
catalogue to be worth a cart.

---

## 11. Recommended next step

Sprint 9 — Blog and CMS — is the natural continuation and depends on nothing currently blocked.

But the higher-value move remains unchanged from the Sprint 6 report: **A01–A07 and V05 are seven
short factual answers and one commercial decision**, and they currently block four product pages, all
installation terms, and the entire commerce sprint. Nothing built since has reduced that.

---

**STOPPING HERE FOR REVIEW.**
