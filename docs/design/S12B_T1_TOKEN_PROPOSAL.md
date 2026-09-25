# S12B T1 — Falcon reconciliation and token proposal

**Sprint:** 12b, task T1 · **Date:** 25 September 2026 · **Decision in force:** D1 = A (Option B stays
whole; Falcon contributes mechanics only)
**Status:** proposal. **Nothing in this file is implemented.** T2 implements only the rows Kelvin
approves in §4.
**Read with:** `FALCON_REFERENCE_BRIEF.md` (authoritative for Falcon's §2–§4) and
`reference/falcontrackers.md` / `.json` (the `/taste` output this file reconciles).

---

## 1. What was run

| Item | Detail |
|---|---|
| Tool | `/taste` (senlindesign/taste-skill 1.1.0 @ `6dce223`), export target **Skip**, crawl scope **single page** |
| Browser | Playwright MCP, isolated Chromium, **1440×900** |
| Captured | Viewport, mid-page and footer screenshots; the skill's DOM extractor; one extra computed-style read of every section's `background-image` (the extractor samples `background-color` only, so it cannot see Falcon's gradient grounds); two targeted screenshots of the services and map sections |
| Output | `reference/falcontrackers.md` and `reference/falcontrackers.json`, renamed from the skill's `falcontrackers.com.*` to the names the prompt uses. Anti-slop grep **0**, both sections present, JSON valid |
| `CLAUDE.md` | `git diff CLAUDE.md` **empty** |
| Third-party imagery | Screenshots stay in `.playwright-mcp/`, which is gitignored. None enters the repo |

---

## 2. Reconciliation with `FALCON_REFERENCE_BRIEF.md` §5

### 2.1 Where they agree — confirmed to the value

| Item | Brief §5 | `/taste` |
|---|---|---|
| Dominant ground | `#FFFFFF` | `#FFFFFF`, 70% of painted area |
| Indigo | `#2F3292` headings, nav, buttons | `#2F3292`, 39 text uses, plus arrow discs |
| Footer gradient | `#051451 → #001983` | `90deg #051451 0% → #001983 82%` |
| Dark grounds | `#020024 → #090979` | identical, computed on video and testimonials |
| Lavender grounds | `#E7E2FF`, `#CCCDFF` at 0.91 | identical, computed on about, journey, results and dashboard |
| CTA greens | `#3BD633`; `#4DC247` / `#4DC147` | all three observed; `#3BD633` is 1.1% of area |
| Muted text | `#9B9B9B`, `#929BA2` | both, in the top six text colours |
| Type | Cabin only; hero H3 65/65 700; H2 40/40 700; step H3 28 700 | identical; the page's single H1 is 40px in the about section |
| Case | `capitalize` on headings, nav and buttons | 8 of 8 sampled headings, every CTA |
| Container | 1320px | 1320px, `0 24px` padding |
| Button radii | 0px "Member Login", 4px "Get Started" | identical |
| Shadows | `0 5px 83px rgba(40,40,40,.21)`; `0 4px 8px rgba(0,0,0,.54)` | both (`.537`) |
| Ground cadence | dark, white, lavender, dark, lavender ×3, dark, white, dark, dark, white, navy | identical once read from pixels (see §2.3, item 7) |
| Hard cuts | no transition between grounds | 0px gaps between sections |

### 2.2 Where they conflict

**Nothing material.** Three differences, all explained by method rather than by the site:

- **Radius counts differ** (brief: 8px ×45, 4px ×35, 50% ×30; `/taste`: 8px ×39, 50% ×27, 4px ×17).
  `/taste` counts only rendered elements, and six carousels keep hidden clones. The ranking, 8px
  first, is the same.
- **Body size.** The brief records body at 16/28. The extractor's first sampled paragraph is 13/22,
  and 16px appears 26 times. Both sizes exist; the brief's figure is the body-copy measurement.
- **Colours the brief lists that `/taste` did not surface** (`#565656`, `#0DFF00`, `#0D6EFD`). The
  extractor keeps only the top six text colours. Not contradicted, just not re-confirmed.

### 2.3 What the brief missed

1. **Spacing has no base unit.** 10px is the most used value (×197), beside a separate 8/16/24 series
   and outliers of 7.5, 17, 39 and 47.9px.
2. **A third wide shadow**, `0 3px 63px rgba(40,40,40,.11)` ×19. Every shadow is single-layer and
   untinted.
3. **Two more easings** alongside `transition: all`: a custom `cubic-bezier(0.37, 0.31, 0.31, 0.9)`
   at 0.3s, and Bootstrap's 0.15s `ease-in-out` on colour, background and border.
4. **30+ keyframes are declared** (`float`, `satellite-float`, `signal-pulse`, `circle-pulse`,
   `floatIcon`, `moveBg` and the `slide*` / `pop*` families) beyond the six the brief found running.
   Declared is not running: the brief stays authoritative for what animates.
5. **Zero CSS grid.** Layout is Bootstrap flex rows throughout.
6. **Zero monospaced elements**, including on the counter numerals and the dashboard figures. This is
   the widest gap between the two systems, and it is already on Nebsam's side: Plex Mono for
   telemetry is how Nebsam sounds like an instrument. Nothing needs adding.
7. **A DOM-only reading gets Falcon's cadence wrong.** The services and map sections compute as
   **white** at section level; an inner element paints the navy. The brief, working from pixels, is
   right. Worth knowing because `/taste` and any similar tool would report a false light run.
8. **Smooth scroll delays programmatic scrolling.** Straight after `scrollTo(0, 6610)` the page still
   reported `scrollY = 0`. Nebsam sets no global smooth scroll (memo D4), but the T3 harness should
   scroll with `behavior: 'instant'` so a future change cannot silently shift its frames.
9. **Two further family names** in computed styles, `carousel` (×283) and `energia` (×24). Neither is
   a text face we could identify. Probably theme artefacts; not investigated further.

---

## 3. Observed, not adopted

Per `FALCON_REFERENCE_BRIEF.md` §7, every `/taste` value that contradicts a Nebsam token is recorded
here and **never proposed as a change**.

| Falcon | Nebsam keeps | Why |
|---|---|---|
| Indigo `#2F3292` | `brand-blue` `#020189`, `brand-navy` `#0A0E36` | Nebsam's blues are sampled from its own logo |
| Greens `#3BD633`, `#4DC247`, neon `#0DFF00` | `brand-signal-ink` `#1857C4` primary fill; amber `state-warn` as the only signal | ADR-0002: nothing else gets an accent. White on `#3BD633` is **1.94:1** |
| Lavender and indigo **gradient** grounds | Flat token grounds, hard cuts | Brief 6.6 rules out blue AI gradients; the flat ground is the cadence tool |
| Cabin, one family | Archivo `wdth 118` / `100` plus IBM Plex Mono | ADR-0002; a new face would also be a third delivered file |
| `text-transform: capitalize` | Sentence case, typed | Brief 5.3 |
| Radii 8 / 16 / 50px / 50% | `data 2px`, `control 6px`, `panel 10px` | "Instruments are not rounded" |
| Shadows at 63–83px blur | No shadow on dark; borders and a raised surface instead | `DESIGN_SYSTEM.md` §5 |
| 10px spacing base | 4px scale `4 8 12 16 24 32 48 64 96 128` | Already a system |
| `transition: all`; 0.3s custom bezier | `lib/motion.ts` names and values, unchanged | Memo D1 |
| Global `scroll-behavior: smooth` | None | Memo D4 |
| 30+ ambient keyframes | Nothing loops | `ANIMATION_SYSTEM.md` §5 |

---

## 4. Proposed token additions — for approval

Three rows. No colour, no typeface, no radius, no shadow and no spacing value is proposed.

| # | Name | Value | Use | Contrast | Reason |
|---|---|---|---|---|---|
| 1 | `DURATION.press` in `lib/motion.ts`; `--dur-press` in `globals.css`; `duration-press` in `tailwind.config.ts` (mapping only) | **120ms** | Press feedback on `Button` and the WhatsApp CTA, **only if T5 adds `transform` to their transition**. Today the press is instant: `transition-colors` does not cover the `translate-y-px` | n/a | Memo D1 names it. Brief PART 17 Level 1 is 120–200ms, and the prompt §4 gives high-frequency actions minimal motion |
| 2 | `STAGE.inactiveOpacity` in `lib/motion.ts`; `--stage-inactive` in `globals.css` | **0.6** | Opacity of the inactive steps in the T3 pinned stage (prompt §6: inactive steps use opacity only) | On `brand-navy`: `#FFFFFF` **7.07**, `#C3CEEA` **4.86**, both AA. Would fail: `state-warn` **3.71**; on paper `#4C5A75` **2.65** (needs ≥ 0.86); `#0F1620` **4.61** passes | A dimmed step is still content, so it must keep 4.5:1. 0.6 is the lowest round value that holds for body text on the dark ground (minimum 0.58) |
| 3 | `PIN_QUERY` in `lib/motion.ts` | `(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)` | The single place the T3 enhancer decides whether to set `data-pinned="on"` | n/a | D2 mobile policy, written once rather than re-typed per component. CSS keys off `data-pinned` only (prompt §6), so no Tailwind screen is needed |

**Rules that come with row 2** (recorded in `ANIMATION_SYSTEM.md` in T2, not tokens):

- The pinned set piece sits on the **dark** ground. On a light ground `text-secondary` cannot be
  dimmed at all, so the dim would be unusable there.
- Inactive steps may contain only `text-inverse` and `text-secondary-inverse`. **State colours
  appear only in the active step.** Amber is the alarm, and the only amber in the sequence belongs
  to its peak.
- The progress rail track is `border-hairline-inverse` (1.26, decorative); its fill is
  `text-secondary-inverse` (**11.81**), which reads as an instrument scale. **Not** `brand-signal`,
  which means "interactive", and not amber, which means "alarm".

### 4.1 Considered and not proposed

| Candidate | Why not |
|---|---|
| Any colour | Rail and step states are covered by existing tokens (above). ADR-0002 forbids a new accent |
| Any font file | ADR-0002, and the ≤ 3 files budget |
| A Level 4 duration (`DURATION.stage`) | Step crossfades can use `DURATION.reveal` with `EASE.outQuart`. A second name for 420ms would fork the tokens, which Emil's `animate` rule also warns against. Level 4 is defined by scroll position, not by a duration |
| Spring presets | Only if D4 adopted Motion. D4 is native, so none |
| A header-offset token for `top` / `scroll-margin-top` | The header is **not sticky** (`components/layout/header.tsx`), so the stage sticks at `top: 0`. If the header is ever made sticky, `--header-h` becomes the first addition |
| A Tailwind mapping for the existing `--dur-data` | No T2–T4 component needs it yet |

---

## 5. Noted for later tasks (not T1 scope, nothing changed)

- **T5, `whatsapp-button.tsx`**: it transitions `bottom`, a layout property, and declares two
  competing `transition-property` utilities (`transition-[bottom]` and `transition-colors`), so only
  one of them applies. Its hover uses a raw `#134aa8`, the primary-hover value from
  `DESIGN_SYSTEM.md` §3.2, with no token behind it.
- **Outside T5's file list**: `transition-all` on links in `cookie-notice.tsx` and `footer.tsx`.
- **T2 docs pass**: `DESIGN_SYSTEM.md` §4 still describes `next/font`, while `app/globals.css`
  records the Sprint 4 move to self-hosted font files.
- **T3**: the harness should scroll with `behavior: 'instant'` (§2.3, item 8).
