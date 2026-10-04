# SPRINT 12o — PRODUCT AND SOLUTION PHOTOGRAPHY

**Branch:** `sprint/12o-product-photos`, cut from `develop` at `f7609fa`. Merged into `develop` on
4 October 2026, with Kelvin's instruction ("commit merge and push").
**Plan:** `docs/design/S12N_VISUAL_PASS_PLAN.md` §6, the second of three sprints. **Record:** ADR-0009.

## COMPLETED

- **A photo on every product page (18 of 18).** On desktop it takes the title band's left column,
  with the 2x loupe and a "Hover to magnify" hint shown only to hover-capable pointers. On a phone
  it comes after the name, summary and buy box. It loads after the page, and Product schema now
  carries the image.
- **Catalogue thumbnails.** A small photo opens each row; it's still a ruled list, not cards. The
  alt is empty because the row's link already names the product.
- **The Hybrid Pro Tracker** (migration 0049; name and slug confirmed by Kelvin). Its copy is
  rewritten out of the source write-up, with the hedge kept word for word. Request price, the KES
  3,000 annual renewal and installation included. Linked to two solutions and two industries.
- **Solution photo bands** for Vehicle Tracking and Radio Communication, placed after "What it is"
  so they sit below the fold on phones. The radio band's laptop screen is blurred.

## DEVIATIONS

- **Band placement.** The plan put the solution band under the title band; it sits one section
  lower instead, for LCP.
- **Band shape.** It's 3:2 and contained to 56rem rather than a 21:9 strip, because the sources
  are only 900–1,500 px wide.

## FILES

New: `supabase/migrations/0049_seed_product_hybrid_pro_tracker.sql`,
`components/product/{product-hero,product-photo}.tsx`, `components/solution/solution-photo.tsx`,
`lib/media/solutions.ts`, 18 product and 4 solution photos.
Changed: the product page (band extracted to `ProductHero`), the catalogue,
`components/solution/prose-sections.tsx` (an `afterIntro` slot), the solution page,
`lib/media/products.ts`, `components/ui/media.css` (`.hover-only`), `CLAUDE.md` (product name).

## DATABASE CHANGES

**0049** adds the Hybrid Pro Tracker. It has been applied to the dev database.

## DEPENDENCIES ADDED

None.

## VERIFICATION

- Typecheck, lint, Prettier and production builds all pass; build checks are clean.
- Every route touched returns 200.
- Screenshots: product page at 1440 and on a phone, the catalogue, and both bands.

## PERFORMANCE

All five templates are inside the 2.5 s LCP budget, paired against `develop` (PERFORMANCE_BASELINE
§16). JS: catalogue 110 kB, product pages 112 kB (budget 180 kB).

## NEEDS_VERIFICATION ADDED

- **V93:** the Hybrid Pro Plus photo's box reads "Hybrid Pro".
- **V94:** a font-swap shift on display headings (predates 12o).
- **V91 and V92:** closed.

## KNOWN ISSUES

- **V94:** CLS reaches 0.124 on `/products/hybrid-pro-tracker`.
- **V88:** Coverage overflows by 12 px at 768 px.

## DECISIONS NEEDED

- **V93:** is the box right for the Hybrid Pro Plus?
- **V90:** the seven solution photos still to come.

**STOPPING HERE FOR REVIEW.**
