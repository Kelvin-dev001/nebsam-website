# ADR-0006 — Native sticky pinning for one scroll set piece per page

**Status:** Accepted
**Date:** 25 September 2026
**Sprint:** 12b (Motion & Scroll)
**Deciders:** Client (Kelvin) — D7 = A in the Sprint 12b decisions block; Claude Code
**Related:** ADR-0002 (visual direction), ADR-0004 (performance budget), `docs/ANIMATION_SYSTEM.md`,
`docs/design/S12B_MOTION_DECISION_MEMO.md` (D2, D4, D7), `docs/design/S12B_T1_TOKEN_PROPOSAL.md`
**Amends:** `ANIMATION_SYSTEM.md` §5 ("No scroll-jacking", "IntersectionObserver only")

---

## Context

Sprint 12b builds one signature scroll set piece on the homepage (memo D3, H1 "One vehicle,
instrumented"): a visual stage that stays in view while five steps scroll past it, one of them
the peak.

The motion rules written in Sprint 1 did not anticipate this. `ANIMATION_SYSTEM.md` §5 says **"No
scroll-jacking"** and **"No layout-thrashing scroll handlers. `IntersectionObserver` only."** Brief
PART 17 says "no scroll-jacking"; PART 14 says "no layout-thrashing scroll handlers". A pinned stage
has to be reconciled with both, in writing, before it is built.

The reference that prompted the sprint does not settle it. Falcon's "journey" is **not pinned**: a map
pin travels a dotted route beside rows that scroll normally, positioned by writing `top`/`left` from an
unthrottled, non-passive scroll listener (`FALCON_REFERENCE_BRIEF.md` §3). The pin is Nebsam's own
upgrade, and Falcon's implementation is the pattern to avoid.

## Decision

**Native CSS `position: sticky` pinning is permitted, for one set piece per page, under the conditions
below.** Sticky is a layout mode, not a scroll mechanism: the browser scrolls natively and the stage
simply stays in view while its container passes. Scroll-jacking is the page taking control of scroll
input or decoupling scroll distance from what moves. Sticky does neither, so PART 17 holds as written.

**Conditions: every one binds.**

1. **Scroll maps 1:1 to progress.** The scrollbar always means what it says. Still banned: wheel,
   touch or key interception; scroll smoothing (no Lenis, no global `scroll-behavior: smooth`); forced
   snapping (`scroll-snap-type: … mandatory`); JS `scroll` event handlers; and scroll-linked layout
   properties (`top`, `left`, `width`, `height`, margins).
2. **The server HTML is complete.** Every step renders as an ordinary ordered list in normal flow, fully
   visible without JavaScript. Hidden start states apply only after hydration, and only through the
   `data-pinned` attribute the enhancer sets, never through a stylesheet that runs before JS.
3. **One per page, and it is the page's Level 4.** At most one pinned sequence, with one engineered
   peak. Nothing else on that page may be Level 4.
4. **It pins only when `PIN_QUERY` matches** (`lib/motion.ts`): ≥ 768px, a fine pointer, and no
   reduced-motion preference. Otherwise the same markup renders as stacked flow with Level 2 reveals.
   The enhancer evaluates that one query; CSS keys off `data-pinned`, never a media query of its own.
5. **State comes from observers, not scroll events.** Step state comes from `IntersectionObserver`
   sentinels. The progress rail uses CSS scroll-driven animation (`animation-timeline: view()`) behind
   `@supports`, with `IntersectionObserver` as the fallback. `transform` and `opacity` only.
6. **Inactive steps dim with opacity only**, at `STAGE.inactiveOpacity` (0.6). Never `display: none`,
   `visibility: hidden`, `content-visibility`, `inert` or `aria-hidden`: find-in-page, screen readers
   and keyboard users reach every step. Focus inside a step activates it. The stage sits on the
   **dark** ground, and state colours appear **only in the active step**, because the 0.6 dim keeps
   AA there and nowhere else (`DESIGN_SYSTEM.md` §3.5).
7. **Its JavaScript never costs LCP.** Dynamically imported per route, loaded once its section is
   within about one viewport, never in the shared initial bundle. The bundle delta is reported per task.
8. **Tier A pages only:** Home, `/solutions/vehicle-security`, `/solutions/fuel-monitoring` (memo D2).
   Sprint 12b builds Home only.

## Alternatives considered

**B — no pin.** The set piece becomes a stepped reveal, which is closer to what Falcon actually does.
*Not chosen as the desktop behaviour*, but it is not discarded: it is exactly what renders below 768px,
on touch devices and under reduced motion, so the pin is an enhancement over B, not a replacement.

**GSAP + ScrollTrigger pinning.** 45.1 KB gzipped, and "never both on a page" with Motion. It pins by
transforming or fixing the element from scroll listeners. Rejected on weight and on condition 5.

**Motion `useScroll` / `useTransform`.** 8.6 KB, and a dependency change under brief 2.5. Rejected
under D4: native sticky plus observers costs an estimated 2–4 KB of our own code and no dependency.

**The scroll-craft engine, wrapped** (memo D4 option i). Its stylesheet hides `[data-sc-cue]`
content **before JS runs** (condition 2), sets global focus, selection and `scroll-behavior: smooth`
(condition 1 and the verified focus rings), reads `window` at evaluation (server bundles), and keeps
fades under reduced motion. Rejected; its process and verification harness are adopted instead, with
this implementation emitting the harness's markup contract.

## Consequences

**Good.**
- No dependency, no scroll handler, and content that is complete for crawlers, no-JS visitors and
  reduced-motion visitors. The rebuild's central requirement (server-rendered, crawlable content) is
  untouched.
- Keyboard scrolling, Page Down, Space, anchor links and find-in-page all behave natively.

**Costs and risks, each with its guard.**
- **Sticky silently fails inside an `overflow` ancestor.** Any `overflow: hidden/auto` between the stage
  and the scroller disables it. Checked when the primitive is built (T3), and on the page it lands on.
- **A pinned span adds scroll length.** Spans are set per step with the peak given the largest, and
  the total is recorded in the set-piece brief. A span that exists only to look cinematic is cut.
- **Viewport units on desktop.** The stage height uses a unit that survives browser UI changes. Pins
  never engage on touch devices, where collapsing URL bars would make this worse.
- **Dimmed steps are still content.** 0.6 is the floor on the dark ground; a stage on paper would need
  a different design, not a lower contrast.

## Verification required before the set piece ships (T3, T4)

- `curl` of the production HTML contains every step's text exactly once.
- Reduced motion: complete and static, no inline hide styles, `data-pinned` stays `off`.
- Keyboard: visible focus, focus never lands in an invisible step, anchors land correctly.
- The scroll-craft harness at 1440×900, at 390×844 and with `--reduced-motion`, contrast graded.
- Lighthouse mobile, paired against the T0 baseline (`PERFORMANCE_BASELINE.md` §9).

**Primitive verified in T3 (26 September 2026), on `/dev/motion` with placeholder content:** server
HTML complete with `data-pinned="off"` and each step once; pins at 1440 and releases after its
travel, stage held at `top: 0` throughout; rail mapped 1:1 to travel by the browser's scroll
timeline; active step and frame advance 1 → 5; focus inside a step activates it; an act on screen
at load stays unpinned (anchor landing checked: no layout shift from the act); stacked with reveals
at 390; complete and still under reduced motion, enhancer never fetched; enhancer loaded only once
the act approached; CLS 0.0011 across load plus a full scroll; zero console errors or warnings.
Harness: no dead scroll in all three passes; contrast clean at 1440 and 390, and one known false
positive under reduced motion (`ANIMATION_SYSTEM.md`, Level 4). **Still to verify on the homepage
set piece in T4:** all of the above with real copy, and Lighthouse paired against T0.
