# SPRINT 16 — UI POLISH (POST-LAUNCH)

**Branch:** `sprint/16-ui-polish`, cut from `develop` at `216aa3e` (Sprint 15 signed off).
**Gate:** human review. Not merged, not deployed.

**The brief.** Kelvin picked five items from the UI ideas on 6 October 2026, with one condition:
"dont do anything you'd say no to". So none of these went in:
- marquees, looping or auto-moving rows, auto carousels;
- video, 3D, Lottie, parallax, an animation library;
- glass on content cards, or a card grid for a list meant to be compared.

## WHAT WAS BUILT

1. **Page transitions.** A 240ms crossfade between pages, done with CSS cross-document View
   Transitions (`@view-transition`). No JavaScript, no library, no extra request.
   - It runs only under `prefers-reduced-motion: no-preference`, so under reduced motion no
     transition ever starts.
   - It never holds the next page back. A browser without support just navigates.
   - It is the new Level 5 in ANIMATION_SYSTEM.

2. **"Find your setup" on Home.** A section headed "What are you protecting?", placed right after
   the proof band. Four choices:
   - a private car;
   - a matatu or PSV;
   - trucks and a fleet;
   - cargo and containers.

   Each choice is a `Card` and holds:
   - a small photo, loaded after the page;
   - one sentence on what fits;
   - links to the right solutions and industry;
   - a WhatsApp message written for that reader.

   These are four different readers each picking one, not a list to compare, so they are cards
   (ADR-0008). Server-rendered.

3. **A sticky buy bar on product pages, on phones.** Once the buy box has scrolled above the
   screen, a bar slides up from the bottom. It carries the product name, the price and the buy box's
   own action:
   - "Add to cart", which turns into "View cart" and is announced to screen readers;
   - or "Price on WhatsApp" where no price is published.

   It leaves as soon as the buy box is back in view. It steps aside for the cookie bar. The floating
   WhatsApp button hides where the bar's action is already WhatsApp, and lifts above the bar where
   the action is the cart. Not shown from 768px.

4. **"On this page" contents.** Jump links, server-rendered, with no JavaScript.
   - **Solution pages:** one row under the hero, listing only the sections that page has.
   - **Legal pages, on phones:** a closed `<details>` above the text.
   - **Legal pages, from 1024px:** a sticky column beside the text, first in both reading order and
     tab order.

5. **The client logo row.** Built and empty.
   - It shows a static row in the proof band once one client has confirmed in writing, and nothing
     before. Today nobody has, so nothing shows.
   - No marquee, no cards. Only files under `/clients/`, and only rows with `permission_confirmed`.
   - `docs/CLIENT_PERMISSIONS.md` now says exactly how a logo goes live, and how it comes down.

## DEVIATIONS

- **The "current section" highlight in "On this page" was built, measured and cut.** It needed a
  small script to mark the section being read. On the legal pages that one extra request cost about
  150 ms of LCP:
  - `/legal/cookies`: 2,394 → 2,507 ms;
  - `/legal/privacy-policy`: 2,402 → 2,506 ms.

  Both went over the 2.5 s budget. Everything else works without it, so it went. The component ships
  no JavaScript.
- **The header is not held still by the page transition.** Naming it would make it a "backdrop
  root", and the phone menu's glass sheet inside it would stop blurring the page. It already looks
  still, since two identical headers crossfade into the same pixels. Tried and reverted.
- **The buy bar has no blur.** It is 96% navy with a hairline top edge, like the header below
  1024px. A blurred fixed layer is redrawn on every scrolled frame, and the bar exists only on
  phones, which pay for that in jank.

## FILES

- **New:**
  - `components/home/setup-chooser.tsx`
  - `components/product/sticky-buy-bar.tsx`
  - `components/layout/on-this-page.tsx`
  - this report
- **Changed:**
  - Home: `app/(site)/page.tsx`, `components/home/proof-band.tsx`, `components/home/coverage.tsx`
    (an optional `id`).
  - Products: `app/(site)/products/[slug]/page.tsx`, `components/product/product-hero.tsx`
    (`id="buy-box"`), `components/product/product-price.tsx` (`priceRequestUrl`, shared by the buy
    box and the bar).
  - Solutions: `app/(site)/solutions/[slug]/page.tsx`, plus section ids in
    `components/solution/{prose-sections,solution-faqs,solution-hardware,solution-industries}.tsx`.
  - Legal: `components/legal/legal-page.tsx`.
  - Styles and motion: `app/globals.css` (the transition), `lib/motion.ts` (`DURATION.transition`),
    `components/motion/micro-interactions.css` (the bar), `components/ui/surfaces.css`
    (`.glass-bar`).
  - Docs: CLAUDE.md, ANIMATION_SYSTEM (Level 5), DESIGN_SYSTEM (§3.6 bar contrast, §6 components),
    PERFORMANCE_BASELINE §21, ASSET_MAP, CLIENT_PERMISSIONS, SPRINT_PLAN.

## DATABASE CHANGES / DEPENDENCIES

None. None. The logo row reads the existing `public_client_logos` view.

## VERIFICATION

All of it on the production build (`next build && next start`), never on `next dev`.

- **Gates:** typecheck, lint and Prettier on the whole repository; the build, with the
  retired-strings check clean.
- **The sweep, 31 affected pages at 320–1440px:** 0 console errors or warnings, 0 CSP violations,
  0 axe violations, 0 sideways scroll. axe is also clean with the buy bar open and with the phone
  contents list open.
- **Ultrawide, 8 affected pages at 1920 and 2560:**
  - 0 sideways scroll, 0 console errors;
  - the buy bar stays hidden;
  - the legal list stays sticky.
- **Page transitions,** in real Chrome. Playwright's headless shell does not draw view transitions,
  so a check there proves nothing. Under `no-preference` the crossfade ran on every navigation.
  Under `reduce` none started.
- **"Find your setup":**
  - four cards;
  - every internal link returns 200;
  - all four thumbnails load, after the page.
- **The buy bar, on both kinds of product:**
  - **Opening and closing:** closed at the top of the page; open once the buy box is above the
    screen; closed again when it returns. Closed means out of the tab order.
  - **The floating WhatsApp button:** hidden or lifted, as intended.
  - **Add to cart:** becomes "View cart", and the status message is read out.
  - **Not shown** at 1024px.
- **Keyboard, with the bar open, on both products.** No focused element ends up under the bar:
  25 Tab stops forward from just past the buy box, and the footer's 26 stops backward from the last
  link. Two fixes were needed:
  - Chrome does not scroll an element that is already partly on screen, so a small focus handler
    scrolls it clear. It only acts while the bar is open.
  - Terms and Privacy, the footer's last row, had no room left to scroll. Pages with a bar keep a
    bar's height of navy under the footer, there from the first paint, so it never shifts anything.
- **"On this page":**
  - every link's target exists, on five pages;
  - on a phone it starts closed and opens;
  - from 1024px it stays in view while you scroll.
- **The logo row** is absent, as it should be: no row is confirmed. Its populated state cannot be
  checked until a real, permitted logo exists.

**Screenshots** (kept out of the repository):
- the chooser at 1440 and 2560;
- the buy bar, both kinds, at 360;
- the solution and legal contents at 1440, the legal contents at 360 and 2560.

## PERFORMANCE

PERFORMANCE_BASELINE §21. Lighthouse mobile, 3 runs per page. Every budget holds.

| Page | LCP | Sprint 14 | CLS | Perf | A11y / BP / SEO |
|---|---|---|---|---|---|
| `/` | 2,335 ms | 2,424 | 0 | 98 | 100 / 100 / 100 |
| `/products/hybrid-pro-tracker` | 2,217 | 2,237 | 0 | 99 | 100 / 100 / 100 |
| `/products/baofeng-uv-5r` | 2,293 | 2,304 | 0 | 98 | 100 / 100 / 100 |
| `/solutions/vehicle-tracking` | 2,343 | 2,391 | 0 | 98 | 100 / 100 / 100 |
| `/legal/cookies` | 2,375 | 2,394 | 0 | 98–99 | 100 / 100 / 100 |
| `/legal/privacy-policy` | 2,410–2,448 | 2,402 | 0 | 95–97 | 100 / 100 / 100 |
| `/legal/terms` | 2,386 | 2,355 | 0 | 93–98 | 100 / 100 / 100 |

**About the legal rows:**
- Two runs were left out, because the machine's CPU was starved at the time (`benchmarkIndex` 1,519
  and 1,838, against 2,197–3,460 for every other run).
- Run again on the same build, those pages gave 97–99.

**Initial JS:**
- Home 119 kB, up 1 kB: the solution photo registry, which the chooser imports.
- Products 113, unchanged: the bar fits in the existing chunk.
- Solutions 111, unchanged.
- Legal 103, unchanged, with no page code at all.

Budget 180. The chooser's four thumbnails are 27 KB together, all after load.

## ACCESSIBILITY

- **The bar's contrast** over the worst backdrop, white: name 17.12, price 10.87, focus ring and
  button hairline 5.16, top edge 3.23 (DESIGN_SYSTEM §3.6).
- **Touch targets:** every new control and link is at least 44px tall.
- **Landmarks:** the bar is a labelled region ("Order <product>"). Each contents list is a `nav`
  labelled "On this page".
- **Focus ring:** follows the ground, dark on the bar.
- **Reduced motion:** no page transition; the bar appears and leaves instantly.
- **Screen readers** were not run on the new parts. They are part of V101, which needs a person
  with NVDA and VoiceOver.

## NEEDS_VERIFICATION

None opened. No new token anywhere.

## KNOWN ISSUES

- **The logo row's populated state is untested** until the first client confirms in writing (V12).
- **Browsers without cross-document View Transitions** navigate with no crossfade, which is the
  intended fallback. Chrome, Android Chrome and Safari 18.2+ have them.
- **Copy to review:** the four chooser sentences, which solutions each choice links to, and the
  WhatsApp messages. They were written from the existing solution pages, not from new facts.

## DECISIONS NEEDED

1. **Review the chooser's wording and groupings**: car → security and tracking; matatu or PSV →
   speed limiters and video telematics; trucks → tracking and fuel; cargo → container e-seal.
2. **Merge `sprint/16-ui-polish` into `develop`?**
3. **Deploy to production?** That is `develop` → `main`, which needs your explicit go-ahead.
   Before it, the Vercel Production variables are re-checked, because the live forms still have
   no rate-limit secret.

**STOPPING HERE FOR REVIEW.**
