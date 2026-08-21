# ADR-0002 — Visual direction and the signature element

**Status:** Accepted
**Date:** 21 August 2026
**Sprint:** 1
**Deciders:** Client (Kelvin), Claude Code
**Related:** ADR-0001 (CRA → Next.js), `docs/DESIGN_SYSTEM.md`, `docs/ANIMATION_SYSTEM.md`

---

## Context

Brief PART 6.4 requires **one** thing the site is remembered by, derived from Nebsam's own world, and
asks for three explorations with one proposed. Brief 6.1 sets the direction as *premium corporate
foundation + futuristic telematics + industrial engineering*, and 6.6 rules out the patterns that
make a site read as templated.

The competitive reality: every telematics site in this market opens with a dark navy hero, a truck
photograph, a glowing map, and a headline asserting "real-time fleet visibility". That is the default
answer, and producing it would fail the brief's own test.

Nebsam has two assets almost no competitor has:

1. **A documented anti-jamming product line.** Kenyan vehicle theft involves GSM jammers; "Anti-Jammer"
   is a real product category here in a way it is not in most markets.
2. **A dated third-party laboratory test report** — KEBS BS202445237, 5 February 2025, result
   "Complies", seven named parameters.

## Decision

**Direction B — "Jamming".** The hero carries a monospace signal readout that runs a four-second
narrative on load: healthy → degrading → **signal jammed** → **anti-jammer armed · alert sent**.

Supporting decisions:

- **Palette** anchored on the logo's actual indigo `#0A0E36` rather than a desaturated corporate
  navy, with the logo's own satellite-arc amber `#E8A33D` promoted to the signature's alarm state.
  Electric blue is *interface*; amber is *signal*. Nothing else gets an accent.
- **Typography** is one superfamily separated by optical width — Archivo `wdth 118` for display,
  `wdth 100` for body — plus IBM Plex Mono for telemetry. Two families, two delivered files.
- **The second section is the laboratory report, verbatim**, opening with the word "Complies." at
  display scale and no marketing heading. Brief 3.5 forbids paraphrasing "Complies" into anything
  stronger; the restraint is the argument.
- **Sequence length: 4s**, chosen after building and sampling both 4s and 6s in the browser.

### Client conditions applied

1. **The headline was rejected as first written.** "It cannot silence this one" is an absolute
   security promise, in the same category as the unpublishable claims in the register. Replaced with
   **"Losing signal is the alarm."** — which describes a *trigger*, not an outcome, and therefore
   promises nothing. The sub-line carries the source hedge verbatim: *"…according to the configured
   security logic."* `ENGINE LOCK AVAILABLE` was cut from the readout for the same reason.
2. **The resolved state is the default rendered DOM**, not something the sequence produces. Verified
   with JS disabled, under reduced motion, and by `curl` against the production build.
3. **This ADR records the framing risk** — see Consequences.

## Alternatives considered

**A — "The Live Strip."** A mono field row that ticks on a fixed cadence: plate, ignition, speed,
heading, fuel, last fix.

*Rejected as a standalone.* It is cheap, on-voice and works at 360px, but a status bar is what every
fleet SaaS already shows. It states "we have telemetry" without arguing anything. **Its vocabulary
was absorbed into B** — B is this strip put through a narrative, so nothing was wasted.

**C — "The Corridor."** A route line drawing itself Mombasa → Nairobi → Nakuru as the reader scrolls,
the real Northern Corridor, with branch nodes resolving as the line arrives and coverage towns as
secondary nodes.

*Rejected for the homepage.* Honest geography and it would have given section transitions a spine,
but an animated map with glowing nodes is **the** telematics cliché — the single most predictable
answer to this brief. It is also the heaviest option, and scroll-linked SVG drawing is where the
frame budget dies on a mid-range Android, against a hard 2.5s LCP target. **Deferred to
`/about/coverage`**, where a map is the content rather than a decoration, and where the
three-branches-plus-sixteen-towns story has to be told anyway.

**D — device-frame platform viewer** (the fourth candidate in brief 6.4) was **not viable**: it
depends on real platform screenshots, and register item **V13** blocks those as possibly
third-party-branded.

## Consequences

**Good.**
- The hero argues instead of listing, which is what brief 9.1 asks the homepage to do.
- The amber accent is derived from the brand rather than imported, so the palette has a warm signal
  colour without inventing one.
- The whole signature is text and CSS — no images, no motion library, no canvas. The route ships at
  110 kB of JS and the page at 216 KB total.
- It is genuinely specific. No generic telematics brief produces a hero that dramatises a jamming
  attack.

**Costs and risks.**

- **Simulating a failure state in a hero is a real risk.** Mitigated: the sequence runs once and
  never loops; the plate is `KXX 000X`; a permanent caption reads "Illustration — not live customer
  data"; and the resolved state is the DOM default so nothing ever looks broken or unresolved.
- **⚠️ B frames Nebsam around ONE product line.** Anti-jamming vehicle security is a fraction of what
  the company sells. The Sprint 1 prototype is a test of the visual language, not the production
  homepage — but **the Sprint 4 production hero must carry the full company**: vehicle tracking,
  fleet telematics, fuel monitoring, school transport, AI video telematics, radio communication and
  cargo security. A homepage that reads as "the anti-jammer company" would misrepresent the
  business and would strand the other nine solution pages.

  **The jamming sequence may migrate to `/solutions/vehicle-security` at that point**, where it is
  exactly on-topic, with the homepage hero carrying a broader thesis and the signature element
  appearing in a form that spans the range.

  **This is not solved here and must not be solved here.** It is recorded so Sprint 4 inherits the
  constraint rather than rediscovering it.

- The `wdth` axis makes the Archivo file 90 KB. Dropping it would roughly halve that, but the width
  axis *is* the display/body distinction — the typographic idea would go with it. Accepted.
- No `Card` primitive exists yet. Deliberate: brief 6.6 prohibits card grids as the default answer,
  so one gets built when a surface genuinely needs it.

## Verification

- Rendered at 360, 768 and 1440 in a real browser; no horizontal overflow at any width.
- Zero console errors or warnings.
- Every button variant and text pairing computed against WCAG — full table in `DESIGN_SYSTEM.md` §3.
- Focus ring verified visible on the dark ground, including the offset that keeps it off the button
  fill (1.98:1 if it landed on the fill).
- CLS measured **0** across 0 layout shifts.
- 4s vs 6s sampled empirically, not assumed — table in `ANIMATION_SYSTEM.md` §3.

## What was removed

Per brief 6.7 — build, screenshot, critique, **remove one thing** — the narrow photographic band at
the base of the hero was cut. It was the only decorative element on the page, it was barely
perceptible at 30% opacity behind a gradient, and it cost a 185 KB image download. Removing it
improved the composition and the budget at the same time.
