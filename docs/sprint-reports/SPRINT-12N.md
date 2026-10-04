# SPRINT 12n — PHOTOGRAPHY AND THE HOME VISUAL PASS

**Branch:** `sprint/12n-visual-pass`, cut from `develop` at `b909b72`. Merged into `develop` on 4 October 2026, with Kelvin's approval.
**Date:** 4 October 2026
**Asked for:** Kelvin's point 6 ("make the site generally beautiful and visually appealing … employ
all best practices for 2026 website design"). Plan: `docs/design/S12N_VISUAL_PASS_PLAN.md`, approved
with "go with recommendations". This is the first of its three sprints (12n, 12o, 12p).
**Decision record:** ADR-0009.

---

## COMPLETED

- **The photo pipeline.** `scripts/images/prepare-photos.py` plus `assets/photos/manifest.json`:
  focal-point crops per breakpoint, plate blur, a masked heal for lines drawn over a picture, and
  EXIF/GPS stripped. Deterministic.
- **A privacy and accuracy review of all 56 supplied images.** Most are AI-generated. Three questions
  went to Kelvin and were answered: the packaging is real; the seven solution images that show
  Nebsam-branded AI staff, police, customs or an invented control room are left out; the hero is
  option 2.
- **The Home hero**, a photo with a telemetry overlay (brief 9.1). It is art-directed: below `lg` the
  photo sits under the text, so the headline stays the LCP element; from `lg` it is full bleed
  behind a solid-then-fading navy scrim, with the text capped inside the solid part.
- **Four new Home sections**, the deferrals from Sprint 4: Solutions, Shop, Industries and Resources.
  Home now has eleven sections.
- **All three branch cards have real photos:** Nairobi HQ, Mombasa entrance and Nakuru shopfront.
- **The photo registry is one module per group** (`lib/media/<group>.ts`), with a scroll-tied photo
  settle (`.photo-reveal`).

## DEVIATIONS FROM PLAN

- **The plan assumed real photographs; most are AI-generated.** The brief permits that for gaps
  only (3.6), so each image was judged against that rule. Seven solution images and the telematics
  cover were not used (ADR-0009). The plan's 12n slots were all still filled.
- **Shop picks four of the six featured products,** one per category in turn, and only products
  that have a photo.
- **`next/link` was replaced by plain anchors in the new sections.** That is the public site's
  convention. With `next/link`, scrolling Home prefetched 216 KB of other pages on mobile data.
- **The registry was split by group,** because one `lib/media.ts` put all 19 photos in every page's
  client chunk (+2.5 kB on Contact).
- **Commit history:** `a14ca76`–`1bfe36e` don't build on their own. A failed `git add` held back
  the photos commit, and it landed on top as `264832c`. The branch was already pushed, so it was not
  rewritten.

## FILES

New: `scripts/images/prepare-photos.py`, `assets/photos/**` (18 generated photos, the moved Mombasa
photo, the manifest), `lib/media/{types,home,branches,industries,products,articles}.ts`,
`components/home/{hero-photo,solutions-preview,shop-preview,industries-preview,resources-preview}.tsx`,
`docs/decisions/ADR-0009-photography.md`.
Changed: `components/home/{hero,telemetry-panel}.tsx`, `components/ui/{media.css,zoom-image.tsx}`,
`components/about/branch-media.tsx`, `app/(site)/page.tsx`, `lib/content/index.ts`.
Removed: `lib/media.ts`, `public/images/branches/` (moved to `assets/photos/branches/`).

## DATABASE CHANGES

None. Home reads five more public views (solutions, featured products, categories, industries, the
three latest posts), in parallel.

## DEPENDENCIES ADDED

None to the project. Pillow runs the pipeline script, as fontTools runs the font build.

## VERIFICATION

- `tsc --noEmit`, ESLint, Prettier (whole repo) and the production build all pass. The build checks
  are clean: migrations, and retired strings over 405 artefacts.
- **Playwright on the production build, at 360, 768, 1440 and 1920 px.** Six routes, 24 loads: all
  200, one H1 each, alt text on every image, no broken image, no console error or warning. The one
  exception is V88's 12 px overflow at 768 px on Coverage, which predates this sprint.
- **Hero text cap** measured at exactly 56% of the viewport at 1024 and 1440 px, which is where the
  solid scrim ends.
- **The pinned stage still pins** (`data-pinned="on"`) at 1024×768, 1280×720, 1440×800, 1440×900
  and 1920×1080.
- **Keyboard:** 19 tab stops through the new sections, in order. Every one has a 2px focus ring with
  a 2px offset, `#1857C4` on light ground and `#3D8BFF` on navy.
- **Reduced motion:** no `photo-settle`, no hover zoom (`transform: none`). Normal motion gives
  `photo-settle` plus `scale(1.05)` on hover. Touch: the hover media query does not match.
- **Every photo was looked at after processing;** crops, blur and heal were checked at full size.

## PERFORMANCE

**Final, paired against `develop`** (PERFORMANCE_BASELINE §15). Lighthouse 12, mobile preset,
simulated throttling, five interleaved pairs per route, each build in its own worktree,
`benchmarkIndex` 2,465–3,430.

| Route | 12n | develop | Budget |
|---|---|---|---|
| `/` | **2,322 ms** | 2,358 ms | ✅ |
| `/contact` | **2,408 ms** | 2,501 ms | ✅ |
| `/about/coverage` | **2,354 ms** | 2,437 ms | ✅ |

- Lighthouse Performance 98–99, Accessibility 100, SEO 100, CLS 0 in every run. Best Practices
  100, except Contact at 96 on both builds (a CSP issue that predates 12n).
- **How:** the first complete build was over budget. A build with the photos switched off showed
  the branch photos cost Contact ~560 ms. Two changes fixed it: those photos and the hero photo now
  render after `load` (`AfterLoad`, no layout shift, `<noscript>` fallback), and the blur
  placeholders are gone (their data shipped twice per photo). Home HTML went from 35.4 to 30.5 KB
  gzipped.
- Transfer weight, phone: Home 244 KB at first view and 712 KB fully scrolled (budget 1.5 MB);
  Contact 292 KB (budget 1.0 MB).
- Largest delivered image: 56 KB (budget 250 KB).
- First-load JS: Home 114 kB, Contact 138 kB, Coverage 109 kB (budget 180 kB).

## ACCESSIBILITY

- **No text on an unscreened photo.** The hero text ends inside the solid scrim (18.60, 11.81). The
  overlay panel is solid (17.15, 10.89, 9.31). New pairings were measured and added to
  DESIGN_SYSTEM §3.6: links 5.61 and 5.96, titles 16.49.
- **The overlay is `aria-hidden`,** with its "Illustration — not live customer data" caption inside
  the panel. Alt text describes each picture and never claims an event happened.
- **Nothing is reachable only by swiping.** Each tile in the industries row is a link.

## NEEDS_VERIFICATION ADDED

- **V89:** the Nakuru shop sign prints 0769 063 333, which is listed as a Mombasa number.
- **V90:** seven solution pages have no photograph (the images left out).
- **V91:** there is a Hybrid Pro Tracker photo and write-up, but no product.

## KNOWN ISSUES / RISKS

- **A `next dev` running in the main checkout since 30 September shares `.next` with production
  builds and corrupts them** (V92). Measurements were taken in separate worktrees.
- **V54b:** a rebuild serves stale database reads (still open).
- **V88:** Coverage overflows by 12 px at 768 px (pre-existing).
- **AI-generated scenes** are used as gap-fill for the hero, industries and covers. They are honest
  about nothing in particular, and the brief prefers real photography when Nebsam can supply it.

## DECISIONS NEEDED FROM THE HUMAN

1. ~~Plug the laptop in~~ Done; re-measured above.
2. **V89:** Kelvin said "okay", read as no change. Which number is right for Nakuru is still open.
3. ~~V91~~ Answered: it is sold. Confirm the name and the slug `hybrid-pro-tracker` before 12o
   mints it.
4. ~~Merge~~ Approved by Kelvin on 4 October 2026.
5. **V92:** stop the old `next dev` server (port 3000).

## RECOMMENDED NEXT STEP

**Sprint 12o**: product photos on all product pages (with
the 2× loupe) and in the catalogue rows, and photo bands on the solutions whose images were kept.

**STOPPING HERE FOR REVIEW.**
