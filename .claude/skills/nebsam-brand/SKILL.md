---
name: nebsam-brand
description: "Nebsam design tokens, typography, motion levels and prohibited patterns. Use whenever building or restyling any Nebsam UI."
---

# Nebsam brand system

Implemented in Sprint 1. Tokens live in `app/globals.css`; Tailwind maps onto them in
`tailwind.config.ts` and **never defines a colour of its own**.

Full reference: `docs/DESIGN_SYSTEM.md`. Motion: `docs/ANIMATION_SYSTEM.md`. Direction: ADR-0002.

## 1. Colour tokens

```
brand-navy        #0A0E36   ground for dark sections
brand-navy-raised #121741   raised surface on dark
brand-blue        #020189   SAMPLED wordmark — display type on paper
brand-blue-light  #85A4D2   SAMPLED plaque — SURFACES/ILLUSTRATION ONLY (2.55:1 on white)
brand-signal      #3D8BFF   interactive accent, DARK sections only
brand-signal-ink  #1857C4   interactive accent on light + EVERY primary button fill

ink               #0F1620
surface           #FFFFFF
surface-raised    #F1F4FA   "blueprint paper" — cool, never cream
surface-inverse   #0A0E36

border-hairline         #DFE5F0   decorative, no ratio required
border-strong           #7E879B   functional on light — 3.27
border-hairline-inverse #1E2450   decorative
border-strong-inverse   #5A6B94   functional on dark — 3.51

text-primary            #0F1620
text-secondary          #4C5A75
text-inverse            #FFFFFF
text-secondary-inverse  #C3CEEA

state-ok    #3FD79B / ink #0A7350
state-warn  #E8A33D / ink #8A5406      ← the logo's satellite signal arcs
state-alert #FF7A66 / ink #B62D1B
```

**Two rules that hold the palette together:**

1. **Electric blue is interface, amber is signal.** A control is never a state colour. A telemetry
   state is never blue.
2. **The signal splits by ground.** `#3D8BFF` passes on navy (5.61) and fails on paper (3.01);
   `#1857C4` is the reverse. Use the right one, or use `data-section` and let the system pick.

## 2. Contrast requirements

Body text 4.5:1 · large text (≥24px, or ≥19px bold) and meaningful non-text UI 3:1.

**Primary button is `#1857C4` with a white label on both grounds — 6.56:1.** On dark it gains a
1px `#3D8BFF` hairline so the control boundary is identifiable (5.61:1).

**Focus ring follows the section, 2px with 2px offset.** `#1857C4` on light, `#3D8BFF` on dark.
The offset is mandatory: a `#3D8BFF` ring sitting *on* the `#1857C4` fill is **1.98:1**.

**Never:** `#85A4D2` as text on light (2.55) · `#E8A33D` as text on light (2.90, use the ink value)
· `#3D8BFF` as text on paper (3.01) · a decorative hairline as an input border.

Add a row to the `DESIGN_SYSTEM.md` contrast table for every new pairing. No colour ships unmeasured.

## 3. Typography

```
Display        Archivo, wdth 118, weight 700, tracking -0.02em   .font-display
Display-tight  Archivo, wdth 112, weight 600                     .font-display-tight
Body           Archivo, wdth 100, weight 400–500                 font-sans
Telemetry      IBM Plex Mono 500                                 font-mono
```

Display and body are **one superfamily separated by optical width**, not two families. Two families,
**two delivered files** — budget is ≤3. Never add a third without removing one.

Scale — 1.200 mobile / 1.250 desktop, body never below 16px:

```
display 36/60 · h1 30/44 · h2 25/34 · h3 21/26
body-lg 18/19 · body 16/17 · body-sm 14/15 · mono 14/15 · label 12/12 (0.08em, uppercase)
```

Sentence case headings, always. The source documents' ALL-CAPS does not transfer. Measure capped at
`max-w-prose` (62ch). The logo's own casual rounded face is **not** a type reference.

## 4. Spacing, radius

4px base: `4 8 12 16 24 32 48 64 96 128`. Sections `py-section` (4rem) / `py-section-lg` (6rem).

**Instruments are not rounded:**
```
radius-data    2px   telemetry surfaces, spec tables, badges
radius-control 6px   buttons, inputs
radius-panel  10px   large panels
```
Never 0 — that is the broadsheet default the brief warns against.

## 5. Motion levels

```
1 Micro      160ms  inOutQuad   hover, press, focus, field state
2 Reveal     420ms  outQuart    stagger 70ms, cap 6, travel 20px, fires ONCE
3 Data       900ms  linear      telemetry — linear on purpose; eased data looks performed
4 Cinematic 800–1600ms outExpo  one per page maximum
5 Transition 200–350ms outQuart never delays content paint
```

**Content is never gated behind an animation.** `Reveal` decides in `useLayoutEffect`: already in the
viewport at load → never animate, no inline style. Below the fold → hide, observe, reveal once. The
naive opacity-0 version makes content *disappear* after hydration — that bug has already been fixed
once, do not reintroduce it.

**Reduced motion:** `useReducedMotion()` defaults to `true`, so everything renders calm and complete
before the first effect. A CSS backstop in `globals.css` neutralises durations globally. Meaning must
survive without motion.

Nothing loops. No scroll-jacking. `transform` and `opacity` only. No animation library is installed —
CSS transitions and `setTimeout` cover levels 1–3.

## 6. The signature element

`components/telemetry/signal-readout.tsx` — "Jamming". A 4s sequence: healthy → degrading → signal
jammed → **anti-jammer armed · alert sent**.

**The resolved state is the default rendered DOM.** The sequence layers over it and returns to it. It
must hold with JS disabled, under reduced motion, on a slow connection, and for a visitor who leaves
at second two.

**Simulated telemetry — hard rules (brief 6.5):**
- Illustrative plate only — `KXX 000X`, never a real registration
- A visible caption: "Illustration — not live customer data". Not small print, not optional
- Never described as live customer data or real-time fleet status
- `aria-live="off"` — a screen reader is not narrated at by a decorative sequence

**Spend boldness in one place.** Everything around the signature stays quiet and disciplined.

## 7. Prohibited patterns

Uniform rounded-card grids · three-column feature blocks as the default answer · purple/blue AI
gradients · abstract blobs · glass on everything · pill buttons everywhere · giant centred headings
in every section · identical section rhythm · decorative icons carrying no meaning · stock corporate
handshakes · stock "African businessman with tablet" · 01/02/03 markers where the content is not a
sequence · motion for its own sake · emoji as UI iconography.

Not Inter with a purple gradient. Not the AI-design cluster: cream + high-contrast serif +
terracotta; near-black + one acid accent; fake-broadsheet hairline columns.

**No `Card` primitive exists yet, deliberately.** Build one when a surface genuinely needs it, not
pre-emptively.

## 8. Before you finish a surface

- [ ] `data-section` set on every section so focus/border/link colours resolve correctly
- [ ] Every new colour pairing measured and added to the `DESIGN_SYSTEM.md` table
- [ ] Focus visible on the ground it sits on, with offset
- [ ] Touch targets ≥ 44px
- [ ] Content present and server-rendered regardless of animation state
- [ ] Reduced motion: complete, meaning intact
- [ ] Sentence case headings; mono only for telemetry and labels
- [ ] Screenshot it, critique it, remove one thing
