# Sprint 12n plan: photography and the visual pass

**Status: PROPOSED, 4 October 2026. Nothing below is built.** Kelvin's point 6: "now that I have
provided photos, make the site generally beautiful and visually appealing to the user. Employ all
best practices for 2026 website design."

**Blocked on one thing:** the Google Drive pictures folder returns 401. It is not shared as "Anyone
with the link", and the Chrome profile on this machine is signed in to a different Google account.
This plan is written against the shot list. Once the photos are readable, §5 gets filled in with
actual files, and some slots may change if a photo is unusable.

---

## 1. Where the site is today

Surveyed on 4 October 2026 from the production build, at 1440px and 390px, on eight page types.

- **There is no photography anywhere.** The Mombasa branch card is the only exception (12m). Every page
  is a navy title band over ruled lists of text. It is disciplined, fast and accessible: Home's LCP
  element is the H1, at 188ms on a local production build. But it reads as a well-set document rather
  than a company with three branches, a workshop, technicians and hardware you can hold.
- **Home is missing five of the thirteen sections brief 9.1 specifies:** Solutions, Shop, Industries,
  Resources, and (blocked) Platform and Customer proof. Today it runs hero → proof band → the pinned
  "one vehicle" stage → KEBS result → how we work → coverage → close.
- **Product pages have no product image.** A buyer is asked to request a price for a device they cannot
  see. The buy box is the only visual element on the page.
- **Industry, solution and article pages** have the same shape: a navy title band, then text.

**Why it looks like this, so the fix does not undo the reasoning.** ADR-0002 deliberately rejected the
market default ("dark navy hero, a truck photograph, a glowing map"). It also cut the one photographic
band, because at 30% opacity it was barely visible and cost 185 KB. Both calls were right when the only
images were the old site's stock-like assets. Real Nebsam photographs change the premise: a photo of
*Nebsam's* yard is evidence, not decoration. So this is an **amendment** to ADR-0002 (proposed as
ADR-0009), not a reversal. The signature telemetry stays the thing the site is remembered by.

## 2. What "beautiful, 2026" means here

Concrete practices, each checked against the brief rather than taken from a trend list:

1. **Photography carries the place; type and telemetry carry the argument.** Each photo is large and
   about one idea. No thumbnails in a card grid (brief 6.6, ADR-0008).
2. **Art direction per breakpoint.** A 4:5 crop for phones and a 16:9 or 21:9 crop for desktop, served
   through `<picture>` with `getImageProps()`, so a phone never gets a squashed landscape. Every crop
   has a focal point, set by hand.
3. **Images that feel instant.** AVIF first (already configured), a blur placeholder generated from
   each file, explicit dimensions (CLS 0), and `priority` on the hero photo only. Everything else is
   lazy.
4. **Real photo plus illustrative data, in exactly one place:** the Home hero, as brief 9.1 asks
   ("real cinematic vehicle/fleet photography, telemetry overlay"). It uses the existing readout
   language: mono values, illustrative plate `KXX 000X`, and the visible caption "Illustration — not
   live customer data".
5. **Motion that explains or responds, never loops.** Hover zoom is built (12m). Images on scroll get
   a scroll-driven CSS reveal (`animation-timeline: view()`): a short settle in Chromium, with no
   JavaScript and no library. Other browsers and reduced motion get the static image. **No parallax
   on mobile.** The one pinned stage per page (ADR-0006) is untouched.
6. **Section rhythm.** Full-bleed photo bands alternate with the existing light, paper and dark text
   sections, so no two neighbouring sections share a structure (brief 6.6).
7. **Text on photos is measured, not eyeballed.** Text over a photo sits on a navy scrim, and its
   contrast is checked against the photo's lightest region (the same method as the glass in
   DESIGN_SYSTEM §3.6). Results go in the contrast table.
8. **Guardrails unchanged:** no uniform card grids, no gradients, blobs or glass beyond the header,
   sentence-case headings, Archivo + Plex Mono only, every budget in CLAUDE.md §8.

**Considered and left out:** React `<ViewTransition>` page transitions. They are experimental in Next
15, and a transition that delays navigation costs INP on mid-range Android. Also left out: autoplay
carousels (the old site's), a background video in the hero (brief PART 14 forbids it on mobile), and
AI-generated imagery (brief 3.6: gaps only, never premises, staff or vehicles presented as Nebsam's).

## 3. Decisions needed from Kelvin

Each has a recommendation. Nothing in §4–§6 starts until these are answered.

| # | Decision | Recommendation | Trade-off |
|---|---|---|---|
| **D1** | **Home hero:** a full-bleed photo with the telemetry overlay, or keep the text hero and add a photo band below it | **Photo hero.** It is what brief 9.1 asks for, and the photos are now real | The LCP element becomes an image. V47 only just got Home inside 2.5s. The hero must be ≤ ~100 KB at phone size, preloaded, and re-measured on throttled 4G. If it cannot hold 2.5s, fall back to text-first with the photo directly below |
| **D2** | **New Home sections** | Add **Solutions** (one large photo and a ruled list of nine), **Shop** (four featured products with product photos), **Industries** (six sector photos and a link to all thirteen) and **Resources** (the three latest articles with covers). **Platform** waits for screenshots (V13); **Customer proof** waits for the six testimonials (V15). The section is absent, not filled | Home grows by about four screens. Homepage weight is budgeted below |
| **D3** | **Product imagery** | A product photo in the product page's title band, with the 2× loupe. In the catalogue, a small photo at the start of each row: **still a ruled list, not cards**, so ADR-0008 holds | Needs a usable photo per product. A product without one keeps today's layout rather than a placeholder in a buy-decision slot |
| **D4** | **Where the photos live** | **In the repository**, under `assets/photos/`, as static imports. That gives automatic dimensions and blur placeholders, versioning and review. A **public CMS bucket for staff-uploaded blog covers** is a separate, later change | Repo weight, about 50 photos × ~350 KB ≈ 18 MB. Staff cannot swap a page photo without a deploy. A public bucket is a security change (today's only bucket is private, by design), so it needs its own approval |
| **D5** | **Industry and solution pages** | A wide photo band directly under the navy title band (21:9 on desktop, 4:5 on phones), rather than a photo behind the H1 | Text never sits on these photos, so no scrim is needed and the H1 stays the LCP element on content pages |
| **D6** | **Article covers** | 16:9 cover on the article, on the blog index and in Home's Resources, also cut to **1200×630 as each article's social-share image** (V45) | Seven covers now. Staff-written articles need D4's bucket |

## 4. The image pipeline

Built once, like the font build (`scripts/fonts/build-webfonts.py`): a script, never hand-editing.

- **`scripts/images/prepare-photos.py`** (Pillow, already used in this session). It reads
  `media-inbox/drive/**` and writes `assets/photos/<group>/<slug>.jpg`: longest edge at most 2400px,
  sRGB, quality 82, **EXIF and GPS stripped**, plus the 4:5 phone crop from a focal point in a
  manifest. A revision ships under a new filename, as with the fonts.
- **`assets/photos/manifest.json`** records each photo's source file, crop, focal point, alt text and
  a privacy sign-off.
- **`lib/media.ts`** stays the one registry (12m). It moves from `public/` paths to static imports.
- **Privacy gate, per photo, before anything is committed:** recognisable faces (staff need consent,
  customers are excluded), readable plates, children (school transport: never recognisable, brief
  16.1), third-party logos (NGOs: none without permission), screens showing customer data. Every
  rejected photo is listed in the report with the reason.
- **Budgets.** Largest delivered image ≤ 250 KB, with a target of ≤ 120 KB at the phone hero size.
  Home stays ≤ 1.5 MB total with every image scrolled into view; content pages ≤ 1.0 MB. Below-the-fold
  photos lazy-load, so the first-view weight barely moves.

## 5. Page by page

Slots against the shot list from the previous session. **Bold** marks what Home needs first.

| Page | Slot | Shot list | Treatment |
|---|---|---|---|
| Home | **Hero** | Hero photo, cinematic vehicle or fleet, Kenyan road | Full bleed, 4:5 phone crop, navy scrim on the text side, telemetry overlay. `priority` |
| Home | **Solutions** | One solution photo | One large photo beside a ruled list of the nine solutions |
| Home | **Shop** | Four product photos | Four products, photo above name and price. The only four-up on the page, and they are products to act on |
| Home | **Industries** | Six of the thirteen industry photos | A horizontal row that scrolls natively on phones (CSS scroll snap, no carousel script, no autoplay), with a link to all thirteen |
| Home | **Resources** | Three blog covers | The three latest articles |
| Home, Contact, Coverage | Branch cards | Nairobi and Nakuru branch photos | Replace the two placeholders (12m) |
| `/solutions/*` (9) | Band under title | One per solution, if supplied | D5 band |
| `/products/*` (14) | Title band, plus the catalogue row | One per product | D3; loupe on the product page |
| `/industries/*` (13) | Band under title | Industry photos, 2000×1333 | D5 band. School transport: no recognisable children |
| `/resources/blog/*` (7) | Cover and social-share image | Blog covers, 1600×900 | D6 |
| `/about` | Team or premises | Team, technicians (if supplied) | One wide band. Named staff only with consent |
| Every page | Social-share image | 1200×630 | Built from the hero photo and logo (V45) |

## 6. Delivery, as three sprints

Each sprint ends with the PART 21.2 report and a stop. One branch per sprint.

| Sprint | Delivers | Gate |
|---|---|---|
| **12n** | The pipeline, the privacy gate, ADR-0009, the Home hero, the four new Home sections, the remaining branch photos | Home LCP ≤ 2.5s, median of 3 Lighthouse mobile runs. Home ≤ 1.5 MB. CLS ≤ 0.05. Text-on-photo contrast measured |
| **12o** | Product photos on all product pages and in the catalogue, solution bands | Every product template within budget. Loupe keyboard- and touch-safe |
| **12p** | Industry bands (13), article covers and social-share images (7), About, the site social-share image | Every template within budget. Metadata images validated |

**Each sprint, verified the same way:** a production build; screenshots at 360, 768, 1440 and 1920;
reduced motion; keyboard pass; zero console errors; Lighthouse mobile median of 3 on every changed
template; the fetch cache cleared before measuring (V54b).

## 7. Risks

- **LCP on Home** (D1). V47 was closed on 29 Sep by a lossless font cut, and a photo hero spends that
  headroom. The text-first fallback is prepared, not improvised.
- **Photo quality varies.** Some shots may be too small, soft or busy for the slot. A photo that fails
  is replaced by the slot's existing layout, never by stock.
- **Rights.** Every photo must be Nebsam's or licensed. Confirm before publishing; the brief forbids
  stock substituted silently.
- **Repo weight** (D4). If 18 MB is unwelcome, the alternative is Git LFS. That is a tooling change
  needing approval, and Vercel supports it.

## 8. What Kelvin needs to do

1. Share the Drive folder as **Anyone with the link → Viewer**, or download it into
   `media-inbox/drive/`.
2. Answer **D1–D6**, or reply "go with the recommendations".
3. Confirm the photos are Nebsam's to publish, and that anyone recognisable in them agreed to appear.
