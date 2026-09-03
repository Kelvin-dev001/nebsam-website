# Sprint 6 — Products

**Branch** `sprint/06-products` → `develop`
**Report date** 3 September 2026
**Format** Brief PART 21.2

---

## 1. Completed — and what is not

**This sprint did not deliver its full scope, and the shortfall is the headline
rather than a footnote.** The plan says "Product template + all products + families +
comparison". What shipped is the template, the index, **ten of roughly twenty-six products**, and
family grouping. There is **no comparison feature**.

| Sprint 6 acceptance criterion | State |
|---|---|
| Built to the confirmed names; no retired name anywhere | ✅ verified in rendered output |
| **Specifications server-rendered, never in a client-only tab** | ✅ real `<table>`, verified in raw HTML |
| Hybrid Dashcam ↔ AI Video Telematics cross-linked, difference stated | ❌ **not built** |
| Hybrid Pro Max: KIPI as an intellectual property registration, never "certified" | ✅ verified |
| Four priced radio models as full pages; other seven "request price" | ⚠️ four shipped; **the seven are not built at all** |
| Audit items A01–A07 resolved before the affected pages ship | ❌ **all seven open** — four products held as drafts |
| V05 (installation terms) resolved | ❌ **open** |

Three met, one partial, three not met. All three failures are blocked on answers rather than on work.

**Published: 10 products.** Two trackers, four car alarms, four PoC radios.
**Draft: 4 products**, each blocked by an open audit item.
**Not built: ~12** — seven radios, the Hybrid Dashcam, AI Vehicle Video Telematics, the fuel
monitoring system, the speed governor and the container e-seal as products.

---

## 2. Deviations from plan

**Four products are held as drafts because A01–A07 are open.** Each audit item is a discrepancy
between what the printed brochure claims and what the write-up documents, and every one is a question
about what the product actually does — not something a website may answer on the customer's behalf:

- **Hybrid Tracker** — brochure claims a mobile app (A01), global tracking (A02) and "no credit top
  up" (A03). The last is a *recurring cost* statement, and brief 10.2 requires recurring costs on the
  product page. If top-up is not required, say so; if it is, the cost must be published.
- **Standard Tracker** — as A01 and A03. Note the brochure calls it "Basic Tracker", a retired name.
- **Recovery Tracker** — brochure claims "Playback" (A06). On a device sending one location per day,
  playback may mean something materially different from playback on a live tracker.
- **Hybrid Car Alarm** — brochure claims it "comes complete with Hybrid Tracker package (optional)"
  (A07). That is a bundling and pricing claim the shop must be able to sell, and it may need a bundle
  concept in the data model before Sprint 7.

**The seven unpriced radios are not built at all**, rather than shipped as "request price" pages. Each
write-up carries 8–17 unresolved specification tokens, so a page would consist of a name and a
sentence. `SHOP_ARCHITECTURE` §2.1 already anticipates holding them as an "other models" section
until specifications arrive.

**Installation terms are asserted nowhere.** V05 is open for every category, and each priced radio's
source tokenises it explicitly. The pages say terms are confirmed on order rather than claiming
either inclusion or exclusion — the register is explicit that ambiguity here generates order
disputes, and guessing would manufacture exactly that.

**No comparison feature.** It needs a populated catalogue to compare, and with twelve products
unbuilt it would compare an arbitrary subset.

---

## 3. Files

**Added**
```
app/(site)/products/page.tsx           index, grouped by family
app/(site)/products/[slug]/page.tsx    merged spec + commerce page
components/product/product-specs.tsx   server-rendered specification table
components/product/product-price.tsx   price, recurring fee, Request price
components/solution/solution-hardware.tsx  section 6 of the solution model
scripts/check-sitemap.mjs              every sitemap URL must return 200
supabase/migrations/0023…0027          products, drafts, and the joins
docs/sprint-reports/SPRINT-06.md       this report
```

**Changed**
```
app/sitemap.ts          lists only routes that exist; adds products
lib/content/index.ts    getProductsForSolution
types/content.ts        ProductFeature + accessor
app/(site)/solutions/[slug]/page.tsx   section 6 wired in
package.json            check:sitemap
```

---

## 4. Database changes

Migrations 0023–0027 seed 14 products (10 published, 4 draft) and the `product_solutions` joins.
`public_product_solutions` filters **both** sides to published, so a draft product cannot reach a
solution page through the join even though the row exists.

Section 6 of the solution model now renders on `vehicle-tracking`, `vehicle-security` and
`radio-communication`. It is correctly absent on the other six, which have no published hardware
joined to them.

---

## 5. Defects found and fixed

**The sitemap asserted 19 URLs that returned 404.** Every route later sprints will build —
industries, platform, resources, about, support, contact, legal — has been listed since Sprint 2,
plus five product category pages that arrive in Sprint 7. A sitemap is a set of assertions that these
URLs are real and worth crawling; listing an unbuilt page is not optimism, it is 19 crawl errors we
authored. It now lists **18 URLs, all returning 200**.

Production is still pinned to `main`, so nothing has crawled it — but this had to be found before
Sprint 15 regardless.

**This defect has now appeared three times in two sprints** — the school bus draft, the category
routes, and the static list. So `scripts/check-sitemap.mjs` now verifies every sitemap URL returns
200. **Proven to fail, not merely to run:** a deliberately broken route was injected, the check caught
it and exited 1, and the route was removed.

**A verification hazard, not a production bug.** Next reuses `.next/cache` across builds, so a
content-only change left the prerendered `/products` index serving six products after four more were
seeded — while `/products/[slug]` regenerated correctly because `generateStaticParams` re-ran. The
data was right (10 rows in the view) and the component was right (the dev server, which does not use
that cache, rendered 10). Only the cached prerender was stale. It self-corrects within the revalidate
window and Sprint 12's on-demand revalidation makes it immediate — but it means **a prerendered page
is not evidence that seeded content appears**, and the products index carries a comment saying so.

---

## 6. Naming and spec accuracy

| Check | Result |
|---|---|
| "Basic Tracker" in rendered output | **0** |
| "Hybrid Alarm" in rendered output | **0** |
| "certified by KIPI" | **0** |
| "intellectual property" on the Hybrid Pro Max | 2 |
| "strongest active…" / "no way a thief…" | **0** |
| `Offer` schema on a priced product | present |
| `Offer` schema on an unpriced product | **absent** |

**KIPI is described as an intellectual property registration.** The source says "certified by KIPI"
twice. KIPI registers patents, trademarks and industrial designs; it does not certify that a product
works or is safe, so "certified" reads as an endorsement no institution has given. It is still worth
stating — locally engineered hardware with registered IP is a real differentiator — but stated
accurately.

**Specification tables carry only documented values.** The radio write-ups mark every unknown as a
verification token, so the T-521 has four rows and the S-200 has nine. That asymmetry is accurate:
the S-200 is genuinely the best-documented handset in the range, and adding rows to even them up
would be fabricating specifications.

---

## 7. Verification actually run

| | |
|---|---|
| `tsc --noEmit`, `eslint .`, `npm run build` | pass |
| `npm run check:sitemap` | pass — 18 URLs, all 200 |
| `npm run verify:db` | pass |
| Routes | 10 products → 200; 4 drafts → **404**; unknown → **404** |
| Specs | present in raw HTML, in a `<table>`, with no JS |
| Retired strings | 160 build artefacts, 0 violations |
| Section 6 | renders on 3 solutions, absent on 6 — correct |

---

## 8. Performance

Not re-measured this sprint. The product template is structurally the same as the solution template —
server-rendered content, no new client components — and Sprint 5 measured that at Performance 94–95,
CLS 0.012, with LCP 2.9 s against the accepted **V47**. A measurement should be taken on a product
page in Sprint 7, when add-to-cart introduces the first genuinely new client-side behaviour.

---

## 9. Decisions needed from the human

1. **A01–A07.** Seven brochure-versus-write-up discrepancies. Until they are answered, four products
   cannot ship, and one of them — the Hybrid Car Alarm bundle — also blocks pricing work in Sprint 7.
2. **V05, installation terms per category.** Every priced page currently says terms are confirmed on
   order. That is honest but it is not an answer, and a shop needs one.
3. **The seven unpriced radios.** ~90 open specification tokens between them. Either the
   specifications arrive, or they stay off the site as `SHOP_ARCHITECTURE` anticipates.
4. **The remaining twelve products.** The dashcam, video telematics, fuel monitoring, speed governor
   and container e-seal product pages are unbuilt. The dashcam in particular carries an explicit
   Sprint 6 criterion that is not met.

---

## 10. Known issues and open register items

| Item | Effect |
|---|---|
| **A01–A07** | Four products held as drafts. A07 also blocks Sprint 7 bundle pricing |
| **V05** | Installation terms unstated on every product |
| **V17–V24** | School bus solution still a draft |
| **V48** | Whether a recovery service exists |
| **V47** | LCP 2.878 s against ≤ 2.5 s. Accepted |
| **V13** | Platform screenshots; blocks `/platform` |
| **V25** | Search Console cross-check. **Sprint 2 still cannot formally close** |
| **V28a** | ODPC claim, now live across the site |
| Category routes | `/products/category/*` unbuilt; removed from the sitemap until Sprint 7 |
| Comparison | Not built |
| Prettier | 43 existing files still unformatted; deliberately not touched in a content sprint |
| Housekeeping | `_to_delete/` and `nebsam-scaffold.zip` still present; removal approved but denied at the prompt |

---

## 11. Recommended next step

**Not Sprint 7.** Commerce on a catalogue that is 40% built, with installation terms unanswered and a
bundling claim unresolved, would mean building a cart around products that cannot be priced.

The higher-value move is to clear A01–A07 and V05 — seven short factual answers and one commercial
decision — then finish the catalogue. If those answers are not available soon, Sprint 8 or 9 is a
better use of the time than a shop with nothing settled to sell.

---

**STOPPING HERE FOR REVIEW.**
