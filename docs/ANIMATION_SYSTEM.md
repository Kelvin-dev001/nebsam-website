# ANIMATION SYSTEM

The five levels, with the durations and easings **as implemented**, and the reduced-motion behaviour
for each.

**Intensity: 7/10 — alive and engineered, never restless.**

Values live in `lib/motion.ts` and `app/globals.css`, so this document describes what the code does
rather than what it was meant to do.

The governing test: does this animation communicate hierarchy, state, continuity, or "this is
instrumentation"? If it communicates none of those, it is decoration and it is cut.

---

## 1. Easings — implemented

```ts
// lib/motion.ts
outQuart  cubic-bezier(0.25, 1, 0.5, 1)   entrances, reveals — decisive arrival
outExpo   cubic-bezier(0.16, 1, 0.3, 1)   cinematic, large travel
inOutQuad cubic-bezier(0.45, 0, 0.55, 1)  state changes both ways
linear    linear                          telemetry ticks, signal pulses, counters
```

`linear` for data motion is deliberate. A counter or signal tick that eases looks *performed*;
instrumentation is uniform. That contrast is the point, and it is why the readout's colour and bar
transitions are linear while the button hover is `inOutQuad`.

---

## 2. The five levels — as built

| Level | Duration | Easing | Where it is used today |
|---|---|---|---|
| 1 — Micro | **160ms** | `inOutQuad` | Button hover and press, link colour, field border, signal bar opacity |
| 2 — Reveal | **420ms**, stagger **70ms**, cap **6**, travel **20px** | `outQuart` | `Reveal` on hero and "Complies." blocks |
| 3 — Data | **900ms** | `linear` | Readout status colour, GSM/GPS bar state |
| 4 — Cinematic | not used in Sprint 1 | `outExpo` | reserved — one per page maximum |
| 5 — Transition | not used in Sprint 1 | `outQuart` | reserved — must never delay content paint |

### Level 1 — Micro, 160ms
`transform`, `opacity`, `color`, `border-color`, `background-color` only. Never `width`, `height`,
`top` or `left`.

Press scales via `active:translate-y-px`, disabled under reduced motion. **Focus rings appear
instantly and are never animated in** — a delayed focus ring is a keyboard user watching the
interface catch up.

### Level 2 — Reveal, 420ms
Fires **once**, never on re-scroll. `IntersectionObserver` at 0.15 threshold, disconnected on first
intersection.

**Content is never gated behind it.** This was got wrong first and fixed:

> The obvious implementation starts at `opacity: 0` and fades in on intersection. With SSR that
> produces a visible flash, then the element **hides** after hydration, then fades back. A screenshot
> taken ~300ms after load showed an empty hero. The reader watches content disappear.

The implementation now decides once, in `useLayoutEffect` (before paint):

- **Already in the viewport at load** → never animate. No inline style at all. The element is left
  exactly as the server rendered it.
- **Below the fold** → hide, observe, reveal on intersection. The reader has not seen it yet, so
  nothing disappears.

That keeps the rule literally true for every visitor at every connection speed.

### Level 3 — Data, 900ms
The brand's signature motion. Colour and bar-state transitions in the readout, `linear`.

Counters, when they arrive, count to a **real** number. If a figure is unverified there is no
counter.

### Levels 4 and 5
Reserved, not used in the prototype. Level 4 is capped at one per page and must never affect the LCP
element. Level 5 must never delay content paint — a transition that holds the next page back to look
smooth has traded the LCP budget for a flourish.

---

## 3. The signature sequence — 4s, chosen on evidence

`JAM_SEQUENCE` in `lib/motion.ts`:

```
hold      700ms   healthy — "Link OK"
degrade   900ms   bars collapse — "Signal degrading"
jammed   1100ms   the peak — "Signal jammed"
resolve   700ms   → "Anti-jammer armed · Alert sent"
settle    600ms
```

Both a 4s and a 6s variant were built and sampled in the browser at 400–500ms intervals. Observed:

| Elapsed | 4s variant | 6s variant |
|---|---|---|
| 0.0s | resolved *(SSR state, pre-hydration)* | resolved |
| 0.8–1.1s | Link OK | Link OK |
| 1.8–2.1s | Signal degrading | Signal degrading |
| 2.8s | **Signal jammed** | Signal degrading |
| 3.8s | **Anti-jammer armed** | Signal jammed |
| 4.1–5.1s | (settled) | Signal jammed |
| 6.1s | (settled) | Anti-jammer armed |

**4s wins.** The complete argument — healthy, attacked, defended — lands at **3.8s**. The 6s variant
needs **6.1s** for the same story, and a visitor who gives the hero four seconds sees only two-thirds
of it. At second two both are mid-degradation, so 6s buys nothing at the moment that was the concern.

### 3.1 The progressive-enhancement contract

**The resolved state is the default rendered DOM.** The sequence is layered over it and returns to
it. It is not what produces it.

| Condition | What the visitor gets |
|---|---|
| JS disabled | Resolved state, complete. Verified by `curl` against the production build |
| Slow connection | Resolved state immediately; the sequence plays whenever hydration lands |
| `prefers-reduced-motion` | Resolved state. The sequence never starts |
| Scrolls away at second two | Sequence mid-flight, but the DOM underneath was always correct |
| Crawler / LLM retrieval | Resolved state in the server HTML |

`useState<Phase>('resolved')` is the initial value, so SSR emits it. The effect returns to
`'resolved'` at the end, so the DOM is never left altered.

---

## 4. Reduced motion

`prefers-reduced-motion: reduce` is honoured at **every** level. It is not a degraded experience —
it is a complete one that does not move.

| Level | Reduced-motion behaviour |
|---|---|
| 1 Micro | Colour and border changes retained; `active:translate-y-px` disabled via `motion-reduce:` |
| 2 Reveal | **Content rendered complete, at full opacity, with no inline style.** No transform, no stagger |
| 3 Data | The readout renders the resolved state and never runs the sequence |
| 4 Cinematic | (reserved) static composition, parallax off |
| 5 Transition | (reserved) instant |

**Two mechanisms, deliberately:**

1. **`useReducedMotion()` defaults to `true`.** Anything gated on it therefore renders calm and
   complete during SSR and before the first effect. Motion is opted *into* after confirming it is
   wanted, never opted out of after the fact.
2. **A CSS backstop** in `app/globals.css` neutralises animation and transition durations globally.
   A component that forgets to check the hook still behaves. Verified present in the shipped
   stylesheet.

**Meaning is preserved, never dropped.** The resolved readout says "Anti-jammer armed · Alert sent"
whether or not the sequence ran — the argument survives without the motion.

---

## 5. Hard rules

- Nothing animates purely because it can.
- **Content is never gated behind an animation** (§2, Level 2).
- **No infinite ambient motion.** The sequence runs once and stops. Nothing loops.
- **No scroll-jacking.** The scrollbar always means what it says.
- **Animation never causes layout shift.** Measured CLS on the prototype: **0**, across 0 shifts.
- **GPU-friendly properties only** — `transform` and `opacity`. No `will-change` was needed.
- No layout-thrashing scroll handlers. `IntersectionObserver` only.
- One animation library. Sprint 1 shipped with **none** — every level above is CSS transitions plus
  `setTimeout`, which is why the route costs 110 kB of JS rather than 110 kB plus a motion library.

---

## 6. Accessibility

- Focus is never moved or lost by an animation.
- Focus rings are never animated in and are never swallowed by an animating surface.
- `aria-live="off"` on the readout — a screen reader must not be narrated at by a decorative
  sequence. The resolved status is in the DOM to be read on demand.
- Nothing flashes more than three times per second.
- Motion never conveys information on its own.

---

## 7. Review checklist per surface

- [ ] Every animation maps to a named level
- [ ] Each communicates hierarchy, state, continuity or instrumentation — none is decoration
- [ ] Content present, server-rendered and visible regardless of animation state
- [ ] `transform` / `opacity` only
- [ ] Reveals fire once; stagger capped at 6; travel ≤ 24px
- [ ] At most one Level 4 on the page
- [ ] Nothing loops
- [ ] Reduced motion verified — content complete, meaning intact
- [ ] CLS measured, not assumed
- [ ] Any demonstration telemetry uses an illustrative plate and is labelled
