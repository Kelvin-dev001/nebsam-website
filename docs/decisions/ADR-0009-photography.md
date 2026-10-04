# ADR-0009 — Photography, and what it may show

**Status:** Accepted. Kelvin asked on 4 October 2026 for the site to be "generally beautiful and
visually appealing … now that I have provided photos". He approved the plan
(`docs/design/S12N_VISUAL_PASS_PLAN.md`, "go with recommendations") and decided the three questions
the photographs raised (§4).
**Date:** 4 October 2026
**Deciders:** Client (Kelvin) chose the direction and the hero; this ADR records the rules.
**Amends:** ADR-0002 (visual direction), which had no photography and cut its one photographic band.
**Branch:** `sprint/12n-visual-pass`, cut from `develop`

---

## Context

ADR-0002 rejected the market default (a navy hero, a truck photograph, a glowing map), and it cut
the one photographic band because at 30% opacity it was barely visible and cost 185 KB. Both calls
were right while the only images were the old site's stock-like assets. Brief 9.1 still asks for
"real cinematic vehicle/fleet photography, telemetry overlay" on the homepage, and Home was missing
five of its thirteen sections.

On 4 October 2026 Kelvin supplied 56 images. Reviewed one by one:

- **3 are photographs of real premises:** the Nairobi head office, the Nakuru shopfront, and a second
  Nairobi composite. The old site's Mombasa set is also real.
- **7 product images are genuine:** the manufacturers' radio shots.
- **11 product images show retail boxes,** which Kelvin confirmed are Nebsam's real packaging.
- **Almost everything else is AI-generated:** two files are named `ChatGPT Image …`, one carries
  Gemini's watermark, and most use the generators' standard sizes.

## Decision

**1. Photography is part of the visual direction.** It carries the place; type and the telemetry
language still carry the argument. The signature remains ADR-0002's jamming readout. Each photo is
large and about one idea, never a thumbnail in a card grid.

**2. What a photo may show** (brief 3.6 and PART 18, applied):

| Kind | May be used for | Never |
|---|---|---|
| Photograph of Nebsam's premises, people or work | Anything, with consent for identifiable people | — |
| Manufacturer or packaging shot | The product it shows | Another product |
| AI-generated scene | Filling a gap: a sector, an article, the hero's road | Nebsam staff (including a Nebsam-branded uniform), Nebsam premises, Nebsam vehicles, the platform; anything that implies a relationship Nebsam cannot document (police, customs, a named company, a real-looking plate) |

Every photo is registered in `lib/media/<group>.ts` (one module per group, so a page bundles only
the photos it imports), with alt text that describes the picture and never
claims an event happened. Each is also listed in `assets/photos/manifest.json` with its origin and
its review. The privacy gate applies to everything: no identifiable person without consent, no
readable plate, no children, no customer data on a screen.

**3. One pipeline.** `scripts/images/prepare-photos.py` cuts every photo from the manifest:
focal-point crops per breakpoint, blur for plates, a masked heal for drawn-on lines, and EXIF and
GPS stripped. Files are deterministic and committed under `assets/photos/`, then statically
imported, so next/image knows real dimensions (CLS 0) and has a blur placeholder. A revision ships
under a new name.

**4. Art direction by breakpoint, for the budget.** The Home hero is one `<picture>`: 4:5 on phones
and 16:9 from 640 px. Below `lg` it sits under the text, so the headline stays the LCP element on the
throttled mobile profile the budget is measured on. From `lg` it fills the hero behind a navy scrim
that is solid under the text, and the text column is capped to end inside it (`.hero-copy`). So the
hero's contrast is the plain navy ratios, not a guess about pixels. The photo is lazy, because an
eager image is fetched before first paint and Lighthouse charges about 8 ms of LCP per KB of that
(PERFORMANCE_BASELINE §14).

**5. Motion stays Level 1.** Hover zoom (12m), plus a scroll-tied settle of 108% to 100% on entering
photos (`.photo-reveal`). It moves the `scale` property only, never opacity, so it hides nothing.
It runs where scroll-driven animations exist and never under reduced motion.

## The three decisions the photographs needed (Kelvin, 4 October 2026)

1. **Product packaging:** "These are our real boxes". Used as supplied. Printed text and marks are
   the packaging's own; the site's product names stay canonical.
2. **Seven solution images:** "Leave them out". These were the AI technicians in Nebsam-branded
   uniforms (fuel monitoring, vehicle security), the AI workshop technician (key programming), the
   "Kenya Police Service Recovery Yard" (recovery), traffic police with a realistic plate and a
   "Mombasa Express" livery (speed limiters), customs officers with a UASC container (cargo), and an
   invented control room (AI video telematics).
3. **Hero:** option 2, the dusk highway.

## Also not used, and why

- The telematics cover carries Gemini's watermark, an invented "Nairobi Freight Logistics" livery and
  a control room. The coastal-highway hero option can stand in when that article gets its cover.
- `reception.jpeg` (old site, Mombasa) shows a customer through the glass.

## Consequences

- Home grows from seven sections to eleven (§5 Solutions, §7 Shop, §8 Industries, §12 Resources).
  Platform (V13) and Customer proof (V15) are still absent, not filled.
- About 3 MB of photo sources sit in git for this sprint; the full set will be about 15–18 MB (plan D4).
- Staff cannot change a page photo without a deploy. A public CMS bucket for blog covers is a
  separate, later security change.
