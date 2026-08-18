# DESIGN SYSTEM

Tokens, type scale, spacing, primitives and the verified contrast table.

**Every colour below is either sampled from `brand/logo/nebsam_transparent_logo.png` or computed
from a sampled value. None is invented.** Contrast ratios are calculated to the WCAG 2.x relative
luminance formula, not estimated.

Sprint 0 defines this system. **Sprint 1 implements it** and produces the homepage prototype that
proves it.

---

## 1. What the logo actually contains

The master asset is a 1254×1254 PNG, 625 KB. Decoded and pixel-sampled directly:

| Colour | Coverage | Role in the artwork |
|---|---|---|
| `#85A4D2` | **33%** of opaque pixels | the rounded-rectangle **plaque background** |
| `#020189` | 71,574 px | the **NEBSAM** wordmark |
| `#D08833` (approx.) | 5,244 px | the **satellite signal arcs** — the only warm accent |
| `#FFFFFF` | — | the "Digital Solutions (K) Ltd" lockup |

Three consequences that shape everything below.

**The plaque fill is part of the artwork.** Despite the filename, this is not a free-standing
transparent mark — only the corners are transparent. Placed on a dark navy header it renders a pale
blue rectangle. Until an SVG and mono variants exist (`brand/README.md`, register **V37**), the logo
can only be placed on light surfaces, and the header design must accommodate that.

**`#85A4D2` cannot carry text on white.** It measures **2.55:1** — below every WCAG threshold. It is
a surface and illustration colour, never a text or UI colour on a light ground. On navy it measures
7.21:1 and is safe.

**The logo's own accent is warm, not electric blue.** Brief 6.2 specifies "a disciplined
electric-blue signal accent", and that is what `brand-signal` is. But the mark already contains a
warm colour that exists precisely to depict transmission — the signal arcs between satellite and
earth. Rather than discard a genuinely brand-derived value, `#D08833` becomes the anchor for
`state-warn`, where warmth carries meaning. This is recorded, not silently decided: if Sprint 1
review prefers the logo orange as the signature accent instead, the value is already measured and
the swap is one token.

---

## 2. Colour tokens

Required names are set by brief 6.2. Values are ours.

### 2.1 Brand

| Token | Value | Derivation |
|---|---|---|
| `brand-navy` | `#071233` | Derived from the wordmark `#020189` — pulled off the purple axis toward true blue and darkened, to give dark sections a ground that reads as navy rather than indigo |
| `brand-navy-raised` | `#0F2A6B` | Lifted navy for raised surfaces on dark sections |
| `brand-blue` | `#020189` | **Sampled** — the NEBSAM wordmark, unmodified |
| `brand-blue-light` | `#85A4D2` | **Sampled** — the plaque fill. **Surfaces and illustration only** |
| `brand-signal` | `#2E7BF6` | The disciplined electric-blue accent required by 6.2 |
| `brand-signal-ink` | `#1C64D8` | Darkened signal, for signal-coloured **text on light** |

### 2.2 Surfaces and ink

| Token | Value | Use |
|---|---|---|
| `ink` | `#0F1620` | Near-black with a blue cast — never pure `#000` |
| `surface` | `#FFFFFF` | Light sections |
| `surface-raised` | `#F4F7FB` | Cards and panels on light sections |
| `surface-inverse` | `#071233` | Dark sections |

### 2.3 Borders — two kinds, deliberately

| Token | Value | Use | Obligation |
|---|---|---|---|
| `border-hairline` | `#DCE3ED` | Decorative dividers on light | None — decorative |
| `border-strong` | `#848DA0` | Input borders, focus targets, meaningful boundaries on light | **≥ 3:1** |
| `border-hairline-inverse` | `#1E2A44` | Decorative dividers on dark | None |
| `border-strong-inverse` | `#5F6F94` | Meaningful boundaries on dark | **≥ 3:1** |

Conflating these is the usual way a design system fails an audit: a 1.29:1 hairline is correct for a
decorative rule and illegal for an input border. Two tokens, two rules.

### 2.4 Text

| Token | Value | On |
|---|---|---|
| `text-primary` | `#0F1620` | light |
| `text-secondary` | `#51607A` | light |
| `text-inverse` | `#FFFFFF` | dark |
| `text-secondary-inverse` | `#A8BBDC` | dark |

### 2.5 State

| Token | Light | Dark | Note |
|---|---|---|---|
| `state-ok` | `#0B7A53` | `#2FBE8B` | |
| `state-warn` | `#8A5406` | `#D08833` | **The dark value is the sampled logo orange.** The light value is it darkened to pass on white |
| `state-alert` | `#C4321F` | `#FF6B57` | |

### 2.6 Focus

`focus-ring` = `brand-signal` `#2E7BF6`, minimum 2 px, with a 2 px offset so it never sits flush
against the component edge. It measures 3.98:1 on white and 4.62:1 on navy — above the 3:1
non-text requirement on both.

**A glass or dark surface must never swallow the focus ring.** This is checked on every interactive
element in every sprint, not once at the end.

---

## 3. Verified contrast table

Computed, not estimated. Body text needs 4.5:1; large text (≥ 24 px, or ≥ 19 px bold) and meaningful
non-text UI need 3:1.

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `text-primary` `#0F1620` | `surface` `#FFFFFF` | **18.17** | AAA |
| `text-primary` `#0F1620` | `surface-raised` `#F4F7FB` | **16.91** | AAA |
| `text-secondary` `#51607A` | `surface` `#FFFFFF` | **6.36** | AA |
| `text-secondary` `#51607A` | `surface-raised` `#F4F7FB` | **5.92** | AA |
| `brand-blue` `#020189` | `surface` `#FFFFFF` | **15.35** | AAA |
| `brand-blue` `#020189` | `surface-raised` `#F4F7FB` | **14.28** | AAA |
| `brand-signal-ink` `#1C64D8` | `surface` `#FFFFFF` | **5.44** | AA |
| `brand-signal-ink` `#1C64D8` | `surface-raised` `#F4F7FB` | **5.06** | AA |
| `text-inverse` `#FFFFFF` | `brand-navy` `#071233` | **18.37** | AAA |
| `text-secondary-inverse` `#A8BBDC` | `brand-navy` `#071233` | **9.45** | AAA |
| `brand-signal` `#2E7BF6` | `brand-navy` `#071233` | **4.62** | AA |
| `brand-blue-light` `#85A4D2` | `brand-navy` `#071233` | **7.21** | AAA |
| `state-ok` `#0B7A53` | `#FFFFFF` | **5.35** | AA |
| `state-ok` `#0B7A53` | `#F4F7FB` | **4.98** | AA |
| `state-ok-inverse` `#2FBE8B` | `brand-navy` | **7.75** | AAA |
| `state-warn` `#8A5406` | `#FFFFFF` | **6.27** | AA |
| `state-warn-inverse` `#D08833` | `brand-navy` | **6.34** | AA |
| `state-alert` `#C4321F` | `#FFFFFF` | **5.49** | AA |
| `state-alert-inverse` `#FF6B57` | `brand-navy` | **6.55** | AA |
| `border-strong` `#848DA0` | `#FFFFFF` | **3.33** | AA (non-text) |
| `border-strong` `#848DA0` | `#F4F7FB` | **3.10** | AA (non-text) |
| `border-strong-inverse` `#5F6F94` | `brand-navy` | **3.66** | AA (non-text) |
| `focus-ring` `#2E7BF6` | `#FFFFFF` | **3.98** | AA (non-text) |
| `focus-ring` `#2E7BF6` | `brand-navy` | **4.62** | AA (non-text) |

### 3.1 Combinations that fail — recorded so they are not tried

| Foreground | Background | Ratio | Rule |
|---|---|---|---|
| `brand-blue-light` `#85A4D2` | `#FFFFFF` | **2.55** | **Never text on light.** Surfaces and illustration only |
| `state-warn-inverse` `#D08833` | `#FFFFFF` | **2.90** | Use `state-warn` `#8A5406` on light |
| `brand-signal` `#2E7BF6` | `#FFFFFF` | **3.98** | **Large text and non-text only.** Body text on light uses `brand-signal-ink` |
| `border-hairline` `#DCE3ED` | `#FFFFFF` | 1.29 | Decorative only — never an input border |

---

## 4. Typography

Brief 6.3 asks for a characterful display face, a highly legible body face, and a mono/utility face
for telemetry and technical labels. **Mono is part of the brand voice** — it is how the site signals
instrumentation rather than brochure.

Explicitly ruled out by 6.3: Inter with a purple gradient, and the current AI-design cluster.

**The logo's own typeface is not a reference.** The wordmark is set in a casual rounded face; the
site must not imitate it. The logo is legacy artwork to be respected, not a type specimen.

| Role | Requirement | Candidates for Sprint 1 |
|---|---|---|
| Display | Characterful, engineered rather than friendly, strong at large sizes | Space Grotesk · Archivo · Chivo |
| Body | Highly legible at 16 px on a mid-range Android | Source Sans 3 · IBM Plex Sans |
| Mono | Telemetry, specs, order numbers, plates | IBM Plex Mono · JetBrains Mono |

**Final selection is a Sprint 1 decision** made against real rendered specimens, not chosen from a
list in a document.

Hard constraints from PART 14: **maximum 3 font files total.** Load only the weights actually used,
`font-display: swap`, self-hosted or via `next/font` — no render-blocking font request. Three files
across three families means one weight each, plus synthesised or variable weights.

### 4.1 Type scale

1.200 (minor third) on mobile, 1.250 (major third) from `md` up. Body stays 16 px minimum
everywhere — never smaller on mobile.

| Step | Mobile | Desktop | Use |
|---|---|---|---|
| `display` | 36 | 60 | Hero only, once per page |
| `h1` | 30 | 44 | One per page |
| `h2` | 25 | 34 | Section |
| `h3` | 21 | 26 | Subsection |
| `body-lg` | 18 | 19 | Lead paragraph |
| `body` | 16 | 17 | Default |
| `body-sm` | 14 | 15 | Secondary, captions |
| `mono` | 14 | 15 | Telemetry, specs, order numbers |
| `label` | 12 | 12 | Uppercase labels, ≥ 0.08em tracking |

Line height 1.5 for body, 1.15–1.25 for display and headings. Measure 60–75 characters for prose.

---

## 5. Spacing, radius, elevation

**Spacing** — 4 px base: `4 8 12 16 24 32 48 64 96 128`. Section padding `64` mobile / `96–128`
desktop.

**Radius** — `sm 4` · `md 8` · `lg 12` · `full 9999` (avatars and true pills only).
**Not** a uniform radius on everything: 6.6 prohibits uniform rounded-card grids and pill buttons
everywhere. Buttons and inputs use `md`; panels use `lg`; data surfaces and telemetry use `sm`,
because instrumentation reads as precise, not soft.

**Elevation** — four levels, restrained. Dark sections use borders and a lifted surface rather than
shadow; shadow on navy reads as smudge.

```
e0  none                                    flat on surface
e1  0 1px 2px   rgb(15 22 32 / 0.06)        resting card
e2  0 4px 12px  rgb(15 22 32 / 0.08)        raised / hover
e3  0 12px 32px rgb(15 22 32 / 0.12)        overlay, dialog
```

**Glass is rationed.** 6.6 prohibits glass on everything. Where it appears it must be verified for
text contrast *on the glass* and must not swallow the focus ring — the two ways glass usually fails.

---

## 6. Section rhythm

Light and dark **sections** composed as a rhythm across the page. **No user-facing theme toggle.**

The failure mode 6.6 names is identical section rhythm — every section the same height, the same
padding, the same centred heading. The counter is deliberate variation: dark sections are heavier
and more spacious than light ones, one section per page breaks the container to full bleed, and
section headings are not all centred.

Anti-pattern reminder for every surface: uniform rounded-card grids · three-column feature blocks as
the default answer · purple/blue AI gradients · abstract blobs · giant centred headings everywhere ·
decorative icons carrying no meaning · 01/02/03 markers where the content is not a sequence · emoji
as UI iconography.

---

## 7. Primitives — Sprint 1 scope

`Button` (primary / secondary / ghost / destructive; the primary action on a page is unmistakable,
per the conversion hierarchy) · `Link` · `Field` (label, hint, inline specific error) · `Select` ·
`Checkbox` / `Radio` · `Disclosure` · `Dialog` (focus-trapped, `Esc`, restores focus) · `Tabs`
(**server-rendered content only** — never the place specifications live) · `Badge` · `Card` ·
`Breadcrumbs` · `Table` (specification tables, horizontally scrollable on mobile) · `Prose` ·
`ImagePlaceholder` · `PriceTag` (**always renders the `excl. VAT` label** — never optional) ·
`TelemetryStrip` (the signature element).

`PriceTag` deserves the note: brief 10.2 makes the VAT label mandatory on the product page, in the
cart, in the total and inside the generated WhatsApp message. Making it a property of the component
rather than a thing each caller remembers is what stops it being forgotten in one of those four
places.

---

## 8. The signature element

Brief 6.4 requires **one** thing the site is remembered by, derived from Nebsam's own world. Three
directions to prototype in Sprint 1, **one to be proposed**:

1. **Live-feeling telemetry strip** — reads as a real vehicle status feed. Strongest fit with the
   mono type role and the "instrumentation" voice.
2. **Animated Kenya network map** — branches and coverage towns resolving as signal nodes. Directly
   serves the 3-branches-plus-16-towns story that `/about/coverage` has to tell anyway.
3. **Route line that draws itself on scroll** — carries section transitions.

A fourth, the device-frame platform viewer, is **not viable at launch**: it depends on real platform
screenshots, and those are blocked by **V13**.

**Hard rule (6.5).** Demonstration telemetry must use obviously illustrative registration plates,
never a real customer's; must be labelled as an illustration wherever a reasonable person could
mistake it for live data; and must never be described as live customer data or real-time fleet
status.

**Spend boldness in one place.** Everything around the signature stays quiet and disciplined.

---

## 9. Process — mandatory per major surface

Brief 6.7, two passes:

1. **Plan** — token subset, type roles, layout concept in prose plus an ASCII wireframe, and the
   signature element. Present it.
2. **Critique before code** — ask whether any part is what would be produced for any generic
   telematics brief. Revise what is, and say what changed and why.

Then build, screenshot, critique the screenshot, **remove one thing**.

Use the **frontend-design** skill for this.

---

## 10. Open items

| Item | Register |
|---|---|
| SVG logo, plus horizontal, stacked, mono-white and mono-dark variants — the current asset is a 625 KB PNG with the plaque baked in and cannot be placed on dark surfaces | **V37** |
| Final typeface selection against rendered specimens | Sprint 1 |
| Signature element — three prototyped, one proposed | Sprint 1 |
| Whether the logo's warm accent `#D08833` should carry the signature instead of `brand-signal` | Sprint 1 review |
| Licensed font files, if any typeface is already owned | `brand/README.md` |
