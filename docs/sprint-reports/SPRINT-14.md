# SPRINT 14 — PERFORMANCE & ACCESSIBILITY

**Branch:** `sprint/14-perf-a11y`, cut from `develop` at `058c4c2` (Sprint 13 merged). Not merged.
**Gate:** all budgets green (`docs/SPRINT_PLAN.md`).

## THE GATE

| Criterion | State |
|---|---|
| Every budget in `PERFORMANCE_BUDGETS.md` §2 green on **every** template | ✅ on 24 of 26. **`/cart`** is 7 ms over in its one clean run and was otherwise unmeasurable while Supabase was unreachable (V102). The **404** page cannot be run in Lighthouse; its weight (192 KB) is in budget |
| The legacy `public/` fully audited; nothing unconverted promoted | ✅ 107 unused files moved out of `public/` |
| NVDA + iOS VoiceOver on the critical paths | ❌ **needs a person** (V101). Scripted |
| Keyboard-only end-to-end; 200% zoom and 400% reflow; forced colours | ✅ |
| CSP enforced | ✅ (`'unsafe-inline'` kept: V100) |

**Three of five, and nearly a fourth.** The cart needs a measurement this connection could not
make, or a decision (V102). The screen readers need a person.

## WHAT CHANGED

**Performance: four templates were over the LCP budget and are now inside it.**
- **Legal pages (V99).** The last public pages on `next/link`, whose prefetching doubled the
  main-thread work of a comparable page. Now plain anchors: `/legal/cookies` went from 2,506 to
  2,394 ms.
- **Form pages.** Zod shipped to the browser on every form page (an 81 KB chunk, about 20 KB
  compressed) only to read labels. The schemas now live in a `server-only` module, and the browser
  gets field specs only: the form pages' JS fell from 132–139 kB to 108–115.
- **Three form pages were `force-dynamic` with no recorded reason**, which also streamed their
  metadata into `<body>` (Lighthouse SEO 92). Now static.
- Result: `/contact` 2,531 to 2,239 ms, `/quote` 2,541 to 2,383, booking 2,542 to 2,399, suggestions
  2,623 to 2,389.

**Security: the CSP is enforced.** Everything the browser loads from another origin was traced
first. Two breakages that report-only mode had hidden were fixed:
- The admin thumbnails redirect to Supabase storage, so that origin is allowed in `img-src`.
- The Zod `eval` probe tripped the policy on the four form pages.

`upgrade-insecure-requests` is back. Kept: `'unsafe-inline'`, because nonces would make every page
dynamic (V100).

**Accessibility.** axe found nothing on 69 pages at two widths after these fixes:
- **The cookie bar covered the open phone menu.** The menu's z-index only counted inside the sticky
  header's stacking context. The bar is now below the header (WCAG 2.4.11).
- **Home's pinned-sequence links were 2.78:1 when dimmed.** The design table had checked body text
  and missed links. They are now white and underlined, at 7.07:1.
- **`/about/coverage` scrolled sideways at 768px (V88).** The text column was 96px, narrower than one
  word of its heading. It now has two columns from 1024px.

**Housekeeping.**
- `public/` went from 129 files to 22, all in use. 107 legacy files (about 22 MB), including the old
  product photos and client logos without recorded permission, moved to
  `source-assets/legacy-public/`, kept in git and never served.
- The seven inline `formatKes` copies became one (V65).

## DEVIATIONS

- **Screen readers not run (V101).** This machine has no NVDA and no iPhone. The script for a person
  is in `ACCESSIBILITY_PLAN.md`, checked against the real menu and forms.
- **The cart not changed (V102).** Its per-request rendering is a recorded correctness decision. The
  alternative is safe (admin edits already invalidate the catalogue, and totals are recomputed on the
  server), but it is Kelvin's call.
- **Measured under memory pressure** (1.2–3.0 GB free, logged per run), on mains power. That only
  slows runs, so the passes are conservative.
- **V62 (re-encoding uploads) stays recorded**, not built: it is a memory decision inside a server
  action, and nothing in this sprint's gate needs it.

## FILES

- **Performance:**
  - `app/(site)/legal/*/page.tsx` (plain anchors).
  - `lib/submissions/schemas.ts` (new, server-only), `types.ts`, `actions.ts`.
  - `app/(site)/{quote,support/book-installation,support/suggestions}/page.tsx` (static).
- **Security:** `next.config.mjs`.
- **Accessibility and layout:**
  - `components/consent/cookie-notice.tsx` and `components/layout/mobile-nav.tsx` (stacking).
  - `components/home/one-vehicle.tsx` (contrast).
  - `app/(site)/about/coverage/page.tsx` (V88).
- **Housekeeping:**
  - `public/` to `source-assets/legacy-public/` (107 renames), `lib/geo.ts`, the photo manifest.
  - Seven files for V65.
- **Docs:**
  - CLAUDE.md (the CSP and LCP rules), NEEDS_VERIFICATION (V65, V88, V99 closed; V100–V102).
  - ACCESSIBILITY_PLAN (the screen-reader script), DESIGN_SYSTEM §3.5, ASSET_MAP,
    `source-assets/README.md`, PERFORMANCE_BASELINE §20.

## DATABASE CHANGES / DEPENDENCIES

None. None: axe-core and Lighthouse ran from the local npx cache and are not in `package.json`.

## VERIFICATION

- **Checks on every commit:** `tsc --noEmit`, ESLint and Prettier. Each build (71 pages, fetch cache
  moved aside first) passed the migration check and the retired-strings check (413 artefacts).
- **The enforced header, read from the built site:** `Content-Security-Policy` (no report-only
  copy), carrying the Supabase origin and `upgrade-insecure-requests`.
- **The full sweep** (Playwright, 69 pages; production build after the stacking, contrast, V88 and
  Zod fixes):
  - no CSP violations;
  - no axe violations (WCAG 2.0/2.1/2.2 A and AA) at 360 and 1440px;
  - no sideways scroll at 320, 360, 640, 768, 1024 or 1440px;
  - no console errors other than the 404 page's own 404.
- **Keyboard:**
  - The skip link moves the next Tab into the content.
  - Every Tab stop on Home, the cart and the four forms shows a visible focus indicator, and they
    do in forced colours too.
  - Add to cart works from the keyboard and announces "Added — view cart". The cart reaches
    Quantity, Remove and "Send order on WhatsApp", which was not pressed.
  - Each form submitted empty stops in the browser on its first missing field.
- **Phone menu:** it is on top of the cookie bar, and 40 Tab steps through it found no hidden focus.
- **The four forms on the final build,** with JavaScript on and off, as static pages, with no console
  errors and no database writes:
  - letters in the phone field are refused by the server's Zod with the right message, and the value
    is kept;
  - with the honeypot filled, the form reaches the success view with a reference.
- **The re-sweep of the final build was stopped by the system for low memory** (0.3–0.7 GB free).
  The pages changed after the full sweep, the legal and form pages, were checked on their own builds
  instead: Lighthouse Accessibility, Best Practices and SEO 100, no console errors, and the forms test
  above. The only CSP violation the full sweep ever found, Zod's `eval` probe, cannot recur on them:
  no client chunk contains Zod any more (checked in the build output). Their markup and styles did
  not change, so their layout is as swept.
- **Lighthouse and page weight:** every template (PERFORMANCE section).

## PERFORMANCE

See PERFORMANCE_BASELINE §20 for every template. Summary:
- **LCP:** 2,221–2,425 ms on 24 templates; `/cart` 2,507 in one run (V102).
- **CLS:** 0 everywhere except `/cart` (0.031).
- **Blocking time:** 27–92 ms.
- **Lighthouse:** Performance 92–99. Accessibility and Best Practices 100. SEO 100 everywhere
  indexable.
- **Weight, fully scrolled:** at most 711 KB on Home and 316 KB on any content page.
- **Images and fonts:** the largest image is 56 KB, and every page loads two font files.
- **JS:** at most 115 kB.

## NEEDS_VERIFICATION

- **Closed:** V65, V88, V99.
- **Opened:**
  - V100: keep `'unsafe-inline'`, or switch to nonces?
  - V101: screen readers.
  - V102: the cart.

## KNOWN ISSUES

- **The connection was intermittent.** Supabase was unreachable for over 15 minutes, twice, during
  this sprint, and the build needs it. Nothing was published while it was down.
- **The supplied AI images keep their small artefacts:** a dashed status dot in forced colours, and
  the slightly malformed tablet lettering noted in 12q.

## DECISIONS NEEDED

1. **V102, the cart.** Make it ISR, or measure it on a deployment with environment variables?
2. **V100, CSP nonces.** Keep `'unsafe-inline'`, or go dynamic and measure the cost first?
3. **V101.** Who runs NVDA and iPhone VoiceOver, with the script?
4. **Merge this sprint into `develop`?**

**STOPPING HERE FOR REVIEW.**
