# ANIMATION SYSTEM

Levels, durations, easings and reduced-motion behaviour.

**Intensity: 7/10 — alive and engineered, never restless.**

The governing test: does this animation communicate hierarchy, state, continuity, or "this is
instrumentation"? If it communicates none of those, it is decoration and it is cut. Brief PART 25
names "animation everywhere, meaning nowhere" as a project-failure mode.

---

## 1. Easings

```
ease-out-quart    cubic-bezier(0.25, 1, 0.5, 1)      entrances, reveals — decisive arrival
ease-out-expo     cubic-bezier(0.16, 1, 0.3, 1)      cinematic, large travel
ease-in-out-quad  cubic-bezier(0.45, 0, 0.55, 1)     state changes both ways
ease-linear       linear                              telemetry ticks, progress, signal pulses
ease-spring       spring(stiffness 260, damping 30)   press and drag response only
```

`ease-linear` is deliberate for data motion. A counter or a signal tick that eases looks
*performed*; instrumentation is uniform. That contrast is the point.

---

## 2. The five levels

### Level 1 — Micro · 120–200 ms · `ease-in-out-quad`

Hover, press, focus, icon response, input state.

Properties: `opacity`, `transform`, `border-color`, `background-color`. Never `width`, `height`,
`top` or `left`.

Press uses `ease-spring` and scales to 0.98 — no lower, or a button feels broken rather than
responsive. Focus rings **appear instantly**, never animated in: a delayed focus ring is a keyboard
user watching the interface catch up.

### Level 2 — Reveal · 300–500 ms · `ease-out-quart`

Scroll-triggered entrance. Fires **once**, never on re-scroll.

- Travel: 16–24 px. More than that reads as a slide show.
- Stagger: 60–80 ms between siblings, capped at **6 items** — beyond that the last item arrives late
  enough to feel broken.
- Threshold: 15% of the element visible.
- **Content is never gated behind a reveal.** It is present in the DOM and server-rendered; the
  animation adjusts opacity and transform only. A crawler, a reader with JS disabled, and a reader
  with reduced motion all see everything. This is the same discipline as §7 of the SEO strategy — if
  an animation can hide content from a crawler, it is the crawlability bug wearing a different hat.

### Level 3 — Data · 400–1200 ms · `ease-linear`

**The brand's signature motion.** Counters, telemetry ticks, signal pulses, route lines, map node
resolution.

- Counters count to a **real** number, never a fabricated one. If the figure is unverified, there is
  no counter.
- Signal pulses: 2 s period, opacity 0.4 → 1 → 0.4, maximum **three** concurrent on screen.
- Route lines draw via `stroke-dashoffset`, 800–1200 ms.
- Telemetry values update on a fixed interval, never randomly — random jitter reads as fake, and
  under 6.5 anything mistakable for live data must be labelled an illustration anyway.

**Constraint from 6.5:** demonstration telemetry uses obviously illustrative plates, is labelled as
illustration where it could be mistaken for live data, and is never described as real-time fleet
status.

### Level 4 — Cinematic · 800–1600 ms · `ease-out-expo`

Hero sequence, parallax layers, map resolution. **One per page, maximum.**

Parallax is capped at 12% travel and disabled below 768 px — on a mid-range Android it costs frames
and buys nothing. It never affects the LCP element: the hero image paints immediately at full
opacity, and only the layers behind it move.

### Level 5 — Transition · 200–350 ms · `ease-out-quart`

Page and product transitions. **Must never delay content paint.** A transition that holds the next
page back to look smooth has traded the LCP budget for a flourish; the budget wins.

---

## 3. Hard rules

- Nothing animates purely because it can.
- **Content is never gated behind an animation.**
- **No infinite ambient motion in the reader's peripheral vision.** The signal pulse is the single
  exception, rationed to three concurrent.
- **No scroll-jacking.** The scrollbar always means what it says.
- **Animation never causes layout shift.** CLS budget is 0.05 and animation is the usual way it goes.
- **GPU-friendly properties only** — `transform` and `opacity`. `will-change` applied surgically to
  the element about to animate and removed after, never blanket.
- No layout-thrashing scroll handlers. Scroll-driven work uses `IntersectionObserver` or CSS
  scroll-linked animations, never a `scroll` listener that reads layout.
- One animation library. Motion/Framer Motion is the default; GSAP only where a specific timeline
  genuinely needs it, and **never both on the same page**.

---

## 4. Reduced motion

`prefers-reduced-motion: reduce` is honoured at **every** level. It is not a degraded experience —
it is a complete one that does not move.

| Level | Reduced-motion behaviour |
|---|---|
| Micro | Colour and border changes retained; transforms removed |
| Reveal | **Content appears immediately at full opacity.** No transform, no stagger |
| Data | Counters render the final value instantly. Pulses stop. Route lines render complete |
| Cinematic | Static composition. Parallax off. Hero renders as a still |
| Transition | Instant. No cross-fade |

Implementation: a global reduced-motion context read once, plus a CSS block that neutralises
transitions and animations as a backstop, so a component that forgets to check still behaves.

**Meaning is preserved, never dropped.** If motion was the only thing conveying a state change, that
state must also be conveyed by text, colour or position. A loading state that only spins is a
loading state a reduced-motion user cannot perceive.

---

## 5. Performance

Animation is inside the PART 14 budgets, not exempt from them.

- Motion primitives are dynamically imported where they sit below the fold.
- No animation runs before the LCP element has painted.
- Concurrent animating elements are capped — beyond roughly 12 on screen, a mid-range Android drops
  frames regardless of how well written each one is.
- Every animation is profiled on a throttled mobile profile, not on the development machine.
- If an effect cannot hold 60 fps on a mid-range Android, **the effect is cut**, not optimised
  indefinitely.

---

## 6. Accessibility

Accessibility is never traded for an effect. If an effect cannot be made accessible, it is cut.

- Focus is never lost or moved unexpectedly by an animation.
- Focus rings are never animated in and are never swallowed by an animating surface.
- Auto-advancing carousels do not exist. If a carousel is unavoidable it is user-driven, pausable,
  and keyboard-operable.
- Nothing flashes more than three times per second.
- Motion never conveys information on its own (§4).

---

## 7. Review checklist per surface

- [ ] Every animation maps to a named level
- [ ] Each one communicates hierarchy, state, continuity or instrumentation — none is decoration
- [ ] Content present in the DOM and server-rendered regardless of animation state
- [ ] `transform` / `opacity` only; no layout properties animated
- [ ] Reveals fire once, stagger capped at 6, travel ≤ 24 px
- [ ] At most one Level 4 on the page
- [ ] No infinite ambient motion beyond the rationed signal pulse
- [ ] Reduced motion verified — content complete, meaning intact
- [ ] No CLS introduced, measured
- [ ] 60 fps on a throttled mobile profile, measured
- [ ] Any demonstration telemetry uses illustrative plates and is labelled
