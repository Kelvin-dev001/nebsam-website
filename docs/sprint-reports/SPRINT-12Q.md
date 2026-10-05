# SPRINT 12q — THE DROPPED SOLUTION PHOTOS, REUSED (V90)

**Branch:** `sprint/12q-solution-photos`, cut from `develop` at `eddcb6f` (12p merged). Not merged.
**Instruction:** Kelvin, 5 Oct 2026: "reuse the seven solutions photos that we dropped".
**Record:** ADR-0009, decision 2 amended.

## COMPLETED

Five of the seven solution pages now have a photo band after "What it is". Each photo was cut until
it complies with brief 3.6 and PART 18:

| Page | What was in the source | What was done |
|---|---|---|
| Fuel monitoring | "nebsam Digital Solutions" on the AI technician's shirt; a tracker labelled "FMB" | Cropped clear of the lettering; the label blurred |
| Vehicle security | The same lettering; a hand holding a key fob | Cropped clear of both |
| Key programming | A blank blue fade made for overlaid text | Cut away |
| Speed governors | A traffic officer, a government sign, plate KDG 742X, a "Mombasa Express" livery, a "Speed governor certified" sticker | Officer and sign cut away; plate and sticker blurred; the livery repainted out with the new `fill` |
| AI video telematics | An invented control room with platform screens and operators; an arc of icons | Truck half only; the ring marking the cab camera stays as a symbol |

**Pipeline:** `fill`, a new option. It repaints a box column by column from the pixel above to the
pixel below, feathered at the sides. It removes lettering from smooth paint, where a blur would
leave a smudge.

## NOT DONE, AND WHY

**Vehicle recovery and container e-seal stay without a photo.** In both, the problem is the scene,
not a corner of it, so no crop leaves a usable photo:
- **Recovery:** a Kenya Police Service yard and crest, an officer, and a man in a "Recovery team"
  jacket. The page says plainly that Nebsam "is not a recovery service" and that the owner and the
  police carry out the recovery. The photo would say the opposite, and use a state crest.
- **Cargo:** customs officers, a customs gate, a real shipping line's container (UASC) and a mock
  status panel. Nothing in the e-seal source documents a customs relationship.

What would work: a regenerated scene for each, or a real photo. Recovery: a parked SUV, or an owner
checking a phone, with no police, no crest and no recovery team. Cargo: container doors with the
seal, no officials and no shipping-line marks.

## DEVIATIONS

- **Two of seven.** The instruction was all seven; the brief outranks it for those two (above).
- **The AI video portrait is only 508×635**, because the source is 941 px tall and the control room
  takes half its width. On a phone it is slightly soft.

## FILES

- **New:** 10 crops in `assets/photos/solutions/`, and this report.
- **Changed:** `assets/photos/manifest.json` (five entries, additions only),
  `scripts/images/prepare-photos.py` (`fill`), `lib/media/solutions.ts`,
  `components/solution/solution-photo.tsx` (comment).
- **Docs:** NEEDS_VERIFICATION (V90 part-closed), ASSET_MAP, ADR-0009, CLAUDE.md (the registry
  list), PERFORMANCE_BASELINE §18.

## DATABASE CHANGES / DEPENDENCIES

None. None.

## VERIFICATION

- Typecheck, lint, Prettier, and a build of 71 pages; the migration and retired-strings checks
  are clean.
- Playwright at 412×823 and 360×740 on all nine solution pages. Every band starts below the fold
  (the nearest is fuel monitoring, 945 px against an 823 px screen). Every photo loaded, with no
  console errors or warnings and no sideways scroll. The two pages without a photo render as
  before.
- Desktop screenshots at 1440 px of the five bands, and every crop reviewed at full size for
  lettering, plates and overlays.
- Lighthouse, with the same-session control (below).

## PERFORMANCE

| Route | LCP median (3 runs) | Page weight | LCP element |
|---|---|---|---|
| `/solutions/fuel-monitoring` | 2,383 ms | 255 KB | the opening paragraph |
| `/solutions/vehicle-security` | 2,382 ms | 260 KB | the opening paragraph |
| `/solutions/vehicle-key-programming` | 2,354 ms | 258 KB | the opening paragraph |
| `/solutions/speed-governors` | 2,359 ms | 250 KB | the opening paragraph |
| `/solutions/ai-video-telematics` | 2,354 ms | 238 KB | the opening paragraph |
| `/solutions/vehicle-recovery` (control, no photo) | 2,366 ms | 217 KB | the opening paragraph |

Lighthouse 12, mobile preset, production build on :3207, on mains power, `benchmarkIndex`
2,181–3,488. Performance 98 on every run; Accessibility, Best Practices and SEO 100; CLS 0.

**The control** is the same template without a photo, measured in the same session. The pages
with a photo land within 17 ms of it either way, so the band costs no LCP. It costs 21–43 KB,
fetched after `load`. The `/solutions/[slug]` route chunk grows from 1.89 to 2.96 kB gzipped:
each static import adds a small record to it (lib/media/solutions.ts). First load: 111 kB.

## NEEDS_VERIFICATION

V90 is part-closed: recovery and cargo are still open. No new items.

## KNOWN ISSUES

- **The speed-governors bonnet:** at 2× zoom the repainted area shows faint vertical tone bands. At
  the size it displays, they read as panel reflection.
- **The key-programming tablet:** its AI lettering is slightly malformed ("Key Programming"), but
  legible and generic.

## DECISIONS NEEDED

1. Recovery and cargo: regenerate both scenes (the briefs are above), or leave them without a photo?
2. Merge this sprint into `develop`?

**STOPPING HERE FOR REVIEW.**
