# DESIGN SYSTEM

Tokens, type scale, spacing, primitives and the verified contrast table.

**Status: implemented in Sprint 1.** Every value below is in the code — CSS variables in
`app/globals.css`, mapped into Tailwind by `tailwind.config.ts`. Tailwind never defines a colour of
its own.

Every colour is sampled from `brand/logo/nebsam_transparent_logo.png` or computed from a sampled
value. Every ratio was calculated to the WCAG relative-luminance formula, not estimated.

Direction record: `docs/decisions/ADR-0002-visual-direction.md`.

---

## 1. What the logo actually contains

The master asset is a 1254×1254 PNG, 625 KB, decoded and pixel-sampled directly:

| Colour | Coverage | Role in the artwork |
|---|---|---|
| `#85A4D2` | **33%** of opaque pixels | the rounded-rectangle **plaque background** |
| `#020189` | 71,574 px | the **NEBSAM** wordmark |
| `#D08833` | 5,244 px | the **satellite signal arcs** — the only warm accent |
| `#FFFFFF` | — | the "Digital Solutions (K) Ltd" lockup |

Three consequences that shape the whole system:

**The plaque fill is part of the artwork.** Despite the filename only the corners are transparent, so
the logo cannot sit on the navy ground. The header gives it a light chip until mono variants exist
(register **V37**). That is a constraint handled honestly, not a flourish.

**`#85A4D2` cannot carry text on white** — 2.55:1. Surfaces and illustration only.

**The logo's own accent is warm.** Brief 6.2 specifies an electric-blue signal accent and that is
what `brand-signal` is. But the mark already contains a colour that exists to depict transmission,
so `#D08833` — lifted to `#E8A33D` for legibility — became `state-warn`, which is what the signature
element turns amber with. The accent is earned from the brand rather than imported.

---

## 2. Colour tokens

Token names are fixed by brief PART 6.2.

### 2.1 Brand

| Token | Value | Role |
|---|---|---|
| `brand-navy` | `#0A0E36` | Ground for dark sections. Derived from the wordmark, kept **chromatic** rather than sanded into a corporate navy |
| `brand-navy-raised` | `#121741` | Raised surfaces on dark — the readout panel |
| `brand-blue` | `#020189` | **Sampled.** The wordmark, unmodified. Display type on paper |
| `brand-blue-light` | `#85A4D2` | **Sampled.** The plaque. **Surfaces and illustration only** |
| `brand-signal` | `#3D8BFF` | Interactive accent **on dark sections only** |
| `brand-signal-ink` | `#1857C4` | Interactive accent on light **and every primary button fill** |

**The signal splits in two because no single blue passes as text on both grounds.** `#3D8BFF` is
5.61:1 on navy and 3.01:1 on paper; `#1857C4` is the reverse. Rather than compromise both, the token
is two values with an explicit rule about which ground each serves.

### 2.2 Surfaces and ink

| Token | Value | Use |
|---|---|---|
| `ink` | `#0F1620` | Near-black with a blue cast — never pure `#000` |
| `surface` | `#FFFFFF` | Light sections |
| `surface-raised` | `#F1F4FA` | "Blueprint paper" — cool, deliberately not cream |
| `surface-inverse` | `#0A0E36` | Dark sections |

### 2.3 Borders — two kinds, two obligations

| Token | Value | Use | Obligation |
|---|---|---|---|
| `border-hairline` | `#DFE5F0` | Decorative rules on light | none |
| `border-strong` | `#7E879B` | Input borders, meaningful boundaries on light | **≥ 3:1** |
| `border-hairline-inverse` | `#1E2450` | Decorative rules on dark | none |
| `border-strong-inverse` | `#5A6B94` | Meaningful boundaries on dark | **≥ 3:1** |

Conflating these is how a design system fails an audit: a 1.26:1 hairline is correct for a divider
and illegal for an input border.

### 2.4 Text

| Token | Value | On |
|---|---|---|
| `text-primary` | `#0F1620` | light |
| `text-secondary` | `#4C5A75` | light |
| `text-inverse` | `#FFFFFF` | dark |
| `text-secondary-inverse` | `#C3CEEA` | dark |

### 2.5 State — telemetry only

**A control is never these colours.** They report status, they do not afford interaction.

| Token | Dark | Light |
|---|---|---|
| `state-ok` | `#3FD79B` | `state-ok-ink` `#0A7350` |
| `state-warn` | `#E8A33D` | `state-warn-ink` `#8A5406` |
| `state-alert` | `#FF7A66` | `state-alert-ink` `#B62D1B` |

**The rule that keeps the palette from turning to mush: electric blue is interface, amber is signal.**

---

## 3. Verified contrast table

Body text needs 4.5:1; large text (≥ 24px, or ≥ 19px bold) and meaningful non-text UI need 3:1.

### 3.1 Text pairings used on the page

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `#FFFFFF` h1/display | `brand-navy` | **18.60** | AAA |
| `#C3CEEA` body-lg, eyebrow | `brand-navy` | **11.81** | AAA |
| `#E8A33D` eyebrow dot | `brand-navy` | **8.62** | AAA |
| `#FFFFFF` readout value | `brand-navy-raised` | **17.15** | AAA |
| `#C3CEEA` readout label | `brand-navy-raised` | **10.89** | AAA |
| `#3FD79B` ok status | `brand-navy-raised` | **9.31** | AAA |
| `#E8A33D` warn status | `brand-navy-raised` | **7.95** | AAA |
| `#020189` "Complies." | `surface-raised` | **13.93** | AAA |
| `#0F1620` body | `surface-raised` | **16.49** | AAA |
| `#4C5A75` body-secondary, badge | `surface-raised` | **6.30** | AA |
| `#0A7350` "Complies" mono | `surface-raised` | **5.32** | AA |

### 3.2 Every button variant

| Variant | Foreground | Background | Ratio | Need | |
|---|---|---|---|---|---|
| primary — label (both grounds) | `#FFFFFF` | `#1857C4` | **6.56** | 4.5 | PASS |
| primary — hover | `#FFFFFF` | `#134AA8` | **8.16** | 4.5 | PASS |
| primary — fill boundary vs paper | `#1857C4` | `#F1F4FA` | **5.96** | 3.0 | PASS |
| primary — hairline boundary vs navy | `#3D8BFF` | `#0A0E36` | **5.61** | 3.0 | PASS |
| secondary on paper — label | `#0F1620` | `#F1F4FA` | **16.49** | 4.5 | PASS |
| secondary on paper — border | `#7E879B` | `#F1F4FA` | **3.27** | 3.0 | PASS |
| secondary on navy — label | `#FFFFFF` | `#0A0E36` | **18.60** | 4.5 | PASS |
| secondary on navy — border | `#5A6B94` | `#0A0E36` | **3.51** | 3.0 | PASS |
| secondary on navy — hover fill | `#FFFFFF` | `#121741` | **17.15** | 4.5 | PASS |
| ghost on paper — label | `#1857C4` | `#F1F4FA` | **5.96** | 4.5 | PASS |
| ghost on navy — label | `#3D8BFF` | `#0A0E36` | **5.61** | 4.5 | PASS |
| **disabled primary (50% opacity)** | `#8BABE2` | `#F1F4FA` | **2.11** | — | **exempt** |

> **The disabled row is a real weak spot, recorded rather than hidden.** WCAG 1.4.3 exempts inactive
> components, so `disabled:opacity-50` is legal. It is still poor. When forms ship in Sprint 2,
> disabled gets explicit tokens instead of an opacity multiplier.

### 3.3 Focus ring

The ring follows the **section**, never the component, and always carries a 2px offset.

| | Ring | On | Ratio |
|---|---|---|---|
| Light sections | `#1857C4` | `#F1F4FA` | **5.96** |
| Light sections | `#1857C4` | `#FFFFFF` | **6.56** |
| Dark sections | `#3D8BFF` | `#0A0E36` | **5.61** |

> `#3D8BFF` sitting **on** a `#1857C4` primary fill is **1.98:1**. The offset is not cosmetic — it is
> what puts the ring on the section background and makes it legal. Verified in the browser.

### 3.4 Combinations that fail — recorded so they are not attempted

| Foreground | Background | Ratio | Rule |
|---|---|---|---|
| `brand-blue-light` `#85A4D2` | white | **2.55** | never text on light |
| `state-warn` `#E8A33D` | white | **2.90** | use `state-warn-ink` on light |
| `brand-signal` `#3D8BFF` | paper | **3.01** | dark sections only |
| `border-hairline` `#DFE5F0` | paper | 1.15 | decorative rules only |
| `border-hairline-inverse` `#1E2450` | navy | 1.26 | decorative rules only |

---

## 4. Typography

**Two families, two files delivered** — against a PART 14 budget of three.

| Role | Face | Cut | Loaded |
|---|---|---|---|
| Display | **Archivo** | `wdth 118`, weight 700, `-0.02em` | variable, 1 file |
| Display-tight | **Archivo** | `wdth 112`, weight 600 | same file |
| Body | **Archivo** | `wdth 100`, weight 400–500 | same file |
| Telemetry | **IBM Plex Mono** | weight 500 | 1 file |

Display and body are the same superfamily separated by **optical width**, not by a second family.
Archivo carries a `wdth` axis, so one variable file gives both cuts. This is the typographic idea of
the site and it is also why the pairing costs one file instead of two.

**The logo's own typeface is not a reference.** The wordmark is a casual rounded face; the site does
not imitate it.

**Measured:** `next/font` emits 8 woff2 files, but they are unicode-range subsets. An English page
fetches exactly **2** — verified in the browser: Archivo 90,096 B and IBM Plex Mono 10,060 B.
`font-display: swap` is set, and Next generates size-adjusted `Archivo Fallback` / `IBM Plex Mono
Fallback` metrics, which is why CLS measured 0.

> **Known issue.** No `<link rel="preload" as="font">` is emitted. The display text is the likely LCP
> element, so preloading should be forced in Sprint 2. Recorded in `docs/NEEDS_VERIFICATION.md`.

### 4.1 Type scale

1.200 mobile / 1.250 desktop. Body never below 16px.

| Step | Mobile | Desktop | Use |
|---|---|---|---|
| `display` | 36 | 60 | Hero and section openers, once each |
| `h1` | 30 | 44 | One per page |
| `h2` | 25 | 34 | Section |
| `h3` | 21 | 26 | Subsection |
| `body-lg` | 18 | 19 | Lead paragraph |
| `body` | 16 | 17 | Default |
| `body-sm` | 14 | 15 | Secondary, captions |
| `mono` | 14 | 15 | Telemetry, specs, order numbers |
| `label` | 12 | 12 | Mono eyebrows, 0.08em, uppercase |

Line height 1.5–1.6 body, 1.02–1.15 display. Measure capped at `max-w-prose` (62ch).

---

## 5. Spacing, radius, elevation

**Spacing** — 4px base: `4 8 12 16 24 32 48 64 96 128`. Section padding `4rem` mobile / `6rem`
desktop (`py-section`, `py-section-lg`).

**Radius — instruments are not rounded.** Revised down from the Sprint 0 draft, which used the
default 4/8/12 scale everyone ships.

| Token | Value | Use |
|---|---|---|
| `radius-data` | **2px** | telemetry surfaces, spec tables, badges |
| `radius-control` | **6px** | buttons, inputs |
| `radius-panel` | **10px** | large panels |

Not `0` — that is the broadsheet default brief 6.3 also warns against.

**Elevation** — dark sections use borders and a raised surface rather than shadow; shadow on navy
reads as smudge. The prototype uses no shadow at all.

---

## 6. Primitives — built in Sprint 1

| Primitive | File | Notes |
|---|---|---|
| `Button` / `ButtonLink` | `components/ui/button.tsx` | primary / secondary / ghost, md / lg, 44px min target |
| `Section` | `components/layout/section.tsx` | light / paper / dark; sets `data-section` |
| `Shell` | same | the measure, `max-w-shell` |
| `Eyebrow` | same | mono structural label |
| `Field` | `components/ui/field.tsx` | visible label, `aria-describedby`, `role="alert"` errors |
| `Badge` | `components/ui/badge.tsx` | factual marker only |
| `Reveal` | `components/motion/reveal.tsx` | Level 2 |
| `useReducedMotion` | `components/motion/use-reduced-motion.ts` | defaults to reduced |
| `SignalReadout` | `components/telemetry/signal-readout.tsx` | the signature element |

**No `Card` was built.** Brief 6.6 prohibits uniform rounded-card grids as the default answer, and
the layout does not need one. A card will be added when a surface genuinely requires it, not
pre-emptively.

### 6.1 `data-section` is the hook the system keys off

`Section` sets `data-section="dark" | "light"`. The focus ring, the secondary button border, the
ghost link colour and the eyebrow colour all read it. A component never has to be told which ground
it is on.

---

## 7. The signature element

**"Jamming"** — `components/telemetry/signal-readout.tsx`. Full rationale in ADR-0002.

The readout runs a four-phase sequence on load: healthy → degrading → jammed → **anti-jammer armed**.

**The resolved state is the default rendered DOM.** It is what the server sends, what a crawler
reads, what renders with JS disabled, what a reduced-motion visitor sees, and where the sequence
ends. Verified by `curl` against the production build.

Hard rules from brief 6.5, all implemented:
- Plate is `KXX 000X` — not a valid Kenyan registration
- A permanent, non-small-print caption reads "Illustration — not live customer data"
- Never described as live customer data or real-time fleet status
- `aria-live="off"` so a screen reader is not narrated at by a decorative sequence

Domain detail that earns its place: a GSM jammer blocks the uplink, not GPS reception, so **GPS stays
healthy while GSM collapses**. That asymmetry is the honest picture.

---

## 8. Prohibited patterns (brief 6.6)

Uniform rounded-card grids · three-column feature blocks as the default answer · purple/blue AI
gradients · abstract blobs · glass on everything · pill buttons everywhere · giant centred headings
in every section · identical section rhythm · decorative icons that carry no meaning · stock
corporate handshakes · stock "African businessman with tablet" · 01/02/03 markers where the content
is not a sequence · motion for its own sake · emoji as UI iconography.

Also: not Inter with a purple gradient, and not the current AI-design cluster — cream with a
high-contrast serif and terracotta; near-black with one acid accent; fake-broadsheet hairline
columns.

---

## 9. Open items

| Item | Register |
|---|---|
| SVG logo plus horizontal, stacked, mono-white, mono-dark and favicon source | **V37** |
| Force `<link rel="preload">` on the two fetched font files | **V41** |
| Mobile navigation — the prototype hides nav below `md` with no menu yet | **V42** |
| Disabled control tokens instead of an opacity multiplier | Sprint 2 |
