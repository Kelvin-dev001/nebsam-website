# ADR-0008 — Cards and glass, and where they are not used

**Status:** Accepted for the first slice — Kelvin asked for "cards and glassmorphism around the site
where you deem possible … a very clean premium feel" and approved this slice on 29 September 2026
("proceed with the design slice as described"). Extending it to further surfaces waits on his
review of this one.
**Date:** 29 September 2026
**Deciders:** Client (Kelvin) asked for the direction; this ADR decides where it applies.
**Amends:** ADR-0002 (visual direction), which shipped without cards or glass.
**Branch:** `sprint/12j-cards-and-glass`, cut from `develop`

---

## Context

Brief 6.6 prohibits "uniform rounded-card grids" and "glass on everything", and PART 25 lists
"uniform rounded cards … glass everywhere" among the ways this project fails. The same brief asks for
cards in three named places: download "item cards" (9.4), "branch cards" carrying full contact details
(9.5), and featured products in the Shop band (9.1). Its accessibility section anticipates glass, by
requiring contrast to be checked "on dark and glass sections specifically".

So the question was never whether to use cards and glass, but where they earn their place. Two
observations decided most of it:

- **The catalogue, blog, hardware lists, spec tables and FAQs are lists meant to be compared.** None of
  them has photography yet. Nineteen text-only cards in a grid is precisely the prohibited pattern,
  and a ruled list compares prices better than a grid does.
- **Glass only reads as glass where content passes behind it.** Over flat navy it is a slightly
  lighter box. The site's only surfaces with content behind them are the header (once sticky) and
  the overlays.

## Decision

**Cards** — one `Card` primitive (`components/ui/card.tsx`), a Server Component, `tone` following the
ground: `light` (white, hairline, soft shadow) or `dark` (raised navy, hairline, 1px top highlight,
no outer shadow, because on navy a shadow reads as smudge). Radius is `panel`, 10px. Used for:

- **Branch cards** on `/about/coverage`, `/contact` and the home coverage band.
- **The product buy box**: price, renewal, installation terms and the action, as one dark card
  beside the summary from 1024px and below it on smaller screens.
- Download cards, when there are documents (none yet).

**Glass** — `.glass-header` and `.glass-sheet` in `components/ui/surfaces.css`:

- **The header** becomes sticky. From 1024px it is 85% navy with `blur(14px) saturate(140%)`; below
  that it is 96% navy with no blur.
- **The mobile menu sheet** is glass from 640px, where it is a 384px panel with the dimmed page beside
  it; narrower, it covers the screen and stays solid.
- `prefers-reduced-transparency: reduce` gets solid navy everywhere; no `backdrop-filter` support gets
  the solid fallback by default.

**Not used:** the product catalogue, blog index, solution hardware lists, specification tables, FAQs,
the solutions overview ("deliberately composed, not a uniform card grid", brief 9.1), forms, the
footer, and the cookie notice (see below).

## How the numbers were chosen

**Glass opacity is set by contrast, not taste.** Blur only averages what is behind, so the worst case
is the header crossing a white section. Composited over white:

| Glass | White text | `text-secondary-inverse` | Focus ring `#3D8BFF` (needs 3:1) | `border-strong-inverse` (needs 3:1) |
|---|---|---|---|---|
| navy 72% | 7.68 | 4.88 | **2.32 fail** | 1.45 fail |
| **navy 85%** (desktop) | 12.32 | 7.82 | **3.72** | 2.33 fail |
| **navy 96%** (below 1024px) | 17.07 | 10.84 | 5.15 | **3.22** |

That table decided three things. 85% is the lowest opacity at which the focus ring stays legal. Below
1024px the menu button is visible and its outline is `border-strong-inverse`, which only clears 3:1 at
96%, so the header is near-solid there (which also spares a mid-range phone the blur). The cookie
notice's Decline button has the same outline over content, so **the notice stays solid**.

**The header at rest.** A sticky header sits in normal flow, so at the top of a page what is behind it
is the page itself, which is white. At 85% it read as a slate band above every navy hero, which was
seen in a screenshot, not predicted. `.site-shell` (in the site layout) paints navy in exactly the top
header-height strip; at rest the header matches the hero, and once the page scrolls, real content is
behind the glass.

**The header height is a token**, `--header-h` (69px: 44px controls, 12px each side, a 1px rule).
The pinned stage (ADR-0006) offsets by it, and anchor jumps pad by it plus 1rem. Without the 1rem, a
target at a fractional offset tucked 0.48px under the header's rule (measured).

## Constraints recorded where someone will see them

- **`backdrop-filter` makes the header the containing block for `fixed` descendants.** The mobile menu
  overlay is rendered inside the header and would shrink to 69px tall if both were active. They never
  are: the blur starts at 1024px and the menu is `lg:hidden` from 1024px. Keep those breakpoints
  together, or move the menu out of the header. (Noted in `surfaces.css`.)
- **No colour is defined in `tailwind.config.ts`.** The shadow and the navy channels are tokens in
  `app/globals.css`; the rules are in `surfaces.css`, imported into the one global stylesheet (V77).

## Consequences

- The header is always reachable while scrolling, at the cost of 69px of vertical space on every
  screen size.
- `Card` exists now. The rule is in its file comment: a card is for a discrete thing the reader acts
  on, not for a list meant to be compared.
- A future glass surface must be checked against a white backdrop, not against navy, and must keep any
  3:1 control boundary legal at its opacity.

## Result — 29 September 2026

**Verified on the production build** (19 checks, zero console errors):

- The header is sticky and stays at `top: 0` after a 2,400px scroll at 360, 768 and 1280px: 96% with
  no blur at 360 and 768, 85% with `blur(14px) saturate(1.4)` at 1280.
- The pinned stage sits at `top: 69px` with a height of 831 of 900px.
- There are three branch cards (10px radius, shadow, white) on Coverage and on Contact. Anchor
  `#nakuru` lands 85px down, below the header.
- The buy box is beside the summary at 1280 and 1920px and below it at 360 and 768px. It holds both
  price states (priced and Request price), with no horizontal scroll at any width.
- The skip link is first and shows above the header. The header focus ring is `#3D8BFF` 2px with a
  2px offset; the ring on a branch-card link is `#1857C4` with its offset.
- The menu sheet is glass at 768px and solid at 360px.
- Reduced transparency (emulated through CDP) gives solid navy with no blur.
- Found and fixed along the way:
  - the slate band at rest (site shell);
  - a pre-existing blue sliver above the logo on every page, which was the skip link's antialiased
    edge, parked 4px higher;
  - the V87 sprint line on `/products`.

**Performance, Lighthouse mobile, median of five runs each:**

| Page | Before: perf · TBT · LCP | After: perf · TBT · LCP |
|---|---|---|
| `/` | 96 · 47ms · 2,715ms | 96 · 38ms · 2,714ms |
| `/products/inrico-t-521` | 97 · 43ms · 2,566ms | 97 · 38ms · 2,567ms |
| `/about/coverage` | 97 · 42ms · **2,568ms** | 96 · 41ms · **2,714ms** |

Scores, TBT and CLS (0 throughout) are unchanged within noise. Single runs of 86–88, with TBT around
400ms, occurred on both builds, so they are noise from a loaded machine and were not caused by the
slice. Shared JavaScript is unchanged at 103 kB: `Card` is a Server Component and the glass is CSS.

**Open: Coverage's simulated LCP rose about 150ms.** The LCP element is the same hero paragraph at the
same position, and its observed render delay is unchanged (191–252ms against 206ms). The simulated
value moved to 2,714ms, which is Home's number and is font-bound. Removing the site-shell wrapper did
not change it (tested: 2,716ms). Home and Coverage were both already over the 2.5s budget before this
slice; that is register V47, where this belongs.
