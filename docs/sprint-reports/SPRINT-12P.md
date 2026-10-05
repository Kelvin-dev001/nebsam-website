# SPRINT 12p — INDUSTRIES, ARTICLE COVERS, SHARE IMAGES, ABOUT

**Branch:** `sprint/12p-industries-articles`, cut from `develop` at `ff7ee63`. Not merged.
**Plan:** `docs/design/S12N_VISUAL_PASS_PLAN.md` §6, the last of three sprints. **Record:** ADR-0009.

## COMPLETED

- **Industry pages:** a photo band on all 13, after "What applies to this sector".
- **List thumbnails:** a small photo opens each row on /industries and /resources/blog. Both stay
  ruled lists; the alt is empty because the link already names the page.
- **Article covers:** all 7 articles have one, in the reading column after the second paragraph.
  Each article also has its own 1200×630 share image and an Article schema image.
- **Site share image** (V45 closed): the hero with the logo plaque, 1200×630. The Twitter card is
  now chosen per image, so every page gets the large card.
- **About:** the Nairobi reception interior.
- **Pipeline and components:** the photo pipeline gained per-crop output paths and size caps, a
  logo stamp, and a per-region blur radius. `SolutionPhoto` became the general `PhotoBand`.

## PHOTO REVIEW

- **Car hire:** a mock "Fleet Online / Location Tracking / Geofence" panel is cut away.
- **Anti-jamming:** the laptop's mock app screen is blurred.
- **Geofencing:** a fleet dashboard, a phone and realistic Kenyan-format plates (KBL 345X,
  KCN 902Z) are cut away.
- **Immobilisation:** the phone is cut away and the mock panel blurred. The panel also claimed
  "Recovery support", which the article does not.
- **Telematics:** the supplied cover (Gemini watermark, an invented livery, a control room) is
  replaced by the unused coastal-highway hero.
- **About:** the half of the reception photo with a visible face is not used.
- **Cross-border:** this industry uses a border post with officials as context for the sector.
  Kelvin may prefer to drop it, as he dropped the customs scene on the cargo solution page.

## DEVIATIONS

- **Placement.** The plan put the industry band and the article cover directly under the title.
  The band instead sits after the Solutions list, and the cover after the second paragraph, so
  both stay below the fold (PERFORMANCE_BASELINE §17).

## FILES

- **New:** `components/ui/photo-band.tsx`, `lib/media/about.ts`, `public/og/` (8 share images),
  7 industry photo pairs, 4 covers, the About pair.
- **Changed:** the industry, industries-index, blog, article and About pages;
  `components/solution/solution-photo.tsx`; `lib/media/{types,industries,articles,solutions}.ts`;
  `lib/seo/metadata.ts`; `scripts/images/prepare-photos.py`; the manifest.

## DATABASE CHANGES / DEPENDENCIES

None. None.

## VERIFICATION

- Typecheck, lint, Prettier, and a build with 0 database read failures; the build checks are clean.
- In the built HTML: `og:image`, its width and height, and `twitter:card` for the site default and
  for two articles.
- Playwright on the touched pages: no console errors, no sideways scroll, and every photo below
  the fold at 412×823.

## PERFORMANCE

All templates are inside the budget (PERFORMANCE_BASELINE §17).

## NEEDS_VERIFICATION

- V45 is closed.
- V89, V90, V93 and V94 are still open.

## KNOWN ISSUES

- V94 (font-swap shift).
- V88 (Coverage, 12 px at 768 px).
- The cookie notice is the LCP element on /industries, as it was before this sprint.

## DECISIONS NEEDED

Answered by Kelvin, 5 Oct 2026:
- The cross-border image: **keep it**.
- Merge into `develop`: **yes**.
- Also answered: V89 closed (the Nakuru sign stays as it is), V93 accepted for now, and V90 (the
  seven dropped solution photos) is to be reused. That last one is Sprint 12q.

**STOPPING HERE FOR REVIEW.**
