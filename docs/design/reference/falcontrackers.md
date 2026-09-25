> **Reference only, never binding.** Output of `/taste https://falcontrackers.com` (taste-skill 1.1.0
> @ `6dce223`), 25 September 2026, single page at 1440×900, export target Skip. It describes a
> third-party site. Nothing below is a Nebsam token: `docs/design/S12B_T1_TOKEN_PROPOSAL.md` §3 lists
> every value as observed, not adopted. Where this file and `FALCON_REFERENCE_BRIEF.md` differ, the
> brief is authoritative for Falcon's scroll, motion and weight.

# Design Map

## Spacing Scale
- 10px (197 uses), 20px (78), 30px (56), 16px (48), 15px (40), 24px (36), 40px (23), 50px (7), 5px (18)
- No single base: a 5/10 series and an 8/16/24 series coexist; outliers 7.5px, 17px, 39px, 47.9px
- Sections abut: 0px gaps between major sections; separation is by ground change
- Container 1320px max, 0 24px padding

## Font Hierarchy
- Hero slide headline (an h3): 65px / 65px, 700, Cabin
- h1 (about section, the page's only h1): 40px / 54px, 700
- h2 section titles: 40px / 40px, 700
- Journey step titles: 28px, 700
- Card titles: 24px, 600
- h4: 19px / 27px, 600
- Body: 16px (26 uses); most frequent size 14px (35 uses); first paragraph sampled at 13px / 22px
- Nav: 14px, 700
- Every sampled h1–h3 and every CTA: `text-transform: capitalize`
- No modular ratio: 12 / 13 / 14 / 15 / 16 / 19 / 20 / 24 / 28 / 38 / 40 / 42 / 65

## Color Palette
- `#FFFFFF` — ground, 70% of painted area
- `#2F3292` — headings, nav, links, arrow discs
- `#051451` — dark text; footer gradient start
- `#9B9B9B` (pure grey), `#929BA2` (cool grey) — muted and footer text
- `#3BD633` — "Get Started" fill, 1.1% of area; white label on it 1.94:1
- `#4DC247` / `#4DC147` — "Member Login" fill, counter numerals
- Light grounds: `linear-gradient(#E7E2FF, rgba(16,0,94,.17), rgba(239,240,255,.435))` and `linear-gradient(rgba(255,255,255,.18), rgba(204,205,255,.91), rgba(255,255,255,.216))`
- Dark grounds: `linear-gradient(90deg, #020024 0%, #090979 100%)`
- Footer: `linear-gradient(90deg, #051451 0%, #001983 82%)`
- Ground cadence (desktop): white, hero image, white, lavender, indigo, lavender, lavender, lavender, indigo, white, indigo, indigo, white, indigo

## Image Ratios
- Hero slide, full bleed: 1425×545, 2.61:1
- Client logo tile: 183×114, 1.61:1, rendered at 150px
- Blog card thumbnail: ~16:9

## Component Tokens
- Radius: 8px (39 uses) · 50% (27, arrow discs) · 16px (19) · 4px (17, "Get Started") · 10px / 15px (11 each) · 50px (6, pills) · 0px ("Member Login")
- Shadows, all single-layer, untinted: `0 5px 83px rgba(40,40,40,.21)` ×19 · `0 3px 63px rgba(40,40,40,.11)` ×19 · `0 4px 8px rgba(0,0,0,.1)` ×10 · `0 4px 8px rgba(0,0,0,.537)` ×6 · `0 8px 16px rgba(0,0,0,.15)` ×3
- Grid: Bootstrap 12-column flex rows; 0 elements use `display: grid`
- Service card: ~299×390, 8px radius, centred text, a 50% arrow disc in `#2F3292`
- Transitions: `all` · `0.3s ease-in-out` · `0.15s ease-in-out` (colour, background, border) · `0.3s cubic-bezier(0.37, 0.31, 0.31, 0.9)`
- Keyframes: 30+, including `pulse`, `location-pulse`, `dot-travel`, `gpsMove`, `moveDots`, `float`, `satellite-float`, `signal-pulse`
- `scroll-behavior: smooth`; `:focus-visible` rules present; `prefers-reduced-motion` rules present

---

# Taste DNA

### Walls of colour instead of dividers
- **Trigger**: When separating 14 stacked topics on one long scroll
- **Decision**: Full-width hard ground changes (white, lavender gradient, indigo gradient) with 0px gaps, over whitespace-and-rule separation on a single ground
- **Reason**: A reader skimming at speed registers a colour change before a heading, so each switch is a free chapter marker
- **Evidence**: 0px section gaps; 13 ground switches across ~11,250px; lavender three sections in a row and indigo two in a row, which is exactly where the marker stops working

### Conversion green, fenced off
- **Trigger**: When deciding where the second brand colour goes
- **Decision**: Green confined to "Get Started", "Member Login" and the counter numerals, over spreading it across headings, icons or grounds
- **Reason**: A colour that only ever means "act here" is found without reading. The cost they accepted is a white label at 1.94:1 on `#3BD633`
- **Evidence**: `#3BD633` is 1.1% of painted area; `#4DC247` fills 8 elements; `#2F3292` carries headings and nav (39 text uses)

### One typeface, no instrument voice
- **Trigger**: When a vehicle-tracking company chose its type system
- **Decision**: Cabin alone in three weights, over pairing a text face with a monospaced or technical face for data
- **Reason**: One rounded sans reads as approachable to non-technical fleet buyers, at the price of never sounding like instrumentation
- **Evidence**: Cabin on 664 elements; weights 700 ×102, 600 ×50, 400 ×51; 0 monospaced elements, including on the counter and dashboard figures

### Liveness through perpetual motion
- **Trigger**: When the page had to feel live, like the tracking product
- **Decision**: Infinite ambient keyframes and six autoplay carousels, over motion that responds only to the reader
- **Reason**: Constant movement tells a first-time visitor "real-time" in the first second, before any copy is read
- **Evidence**: `pulse`, `location-pulse`, `dot-travel`, `gpsMove`, `moveDots`, `satellite-float` and `signal-pulse` among 30+ keyframes; `transition: all` at 0.3s; `scroll-behavior: smooth` delays programmatic scroll
