# FALCON REFERENCE BRIEF — falcontrackers.com

**Purpose:** a measured record of how falcontrackers.com (a UAE vehicle tracking company) builds its homepage scroll and motion, and what Nebsam takes from it. **We copy mechanics and feel. We never copy assets, words or numbers.**
**Captured:** 25 September 2026, by Cowork, for Sprint 12b (Motion & Scroll).
**Status:** reference only, never binding. Where this file conflicts with the master brief, an ADR, `DESIGN_SYSTEM.md` or `ANIMATION_SYSTEM.md`, those win.
**Read with:** `docs/design/S12B_MOTION_DECISION_MEMO.md`.

---

## 0. Method, and what it can and cannot support

| Item | Detail |
|---|---|
| Desktop | Chrome through Claude in Chrome. The window was maximised and could not be resized, so the viewport was **1482×774 CSS px at DPR 1.25**, not 1440×900. Section positions were re-measured in a second browser emulating **1440×900**: the sequence and heights are the same. |
| Mobile | The Claude desktop browser emulating **390×844**, DPR 2, with an Android user agent. |
| Screenshots | Desktop: every section (hero, logos, about, video, journey start/mid/end, results, dashboard, services, industries, testimonials, map/counters, news, footer). Mobile: hero only. Below the hero, both browsers returned blank or stale frames after each scroll because the window was hidden. **Mobile behaviour below the hero comes from the DOM and computed styles, not pixels.** The screenshots show third-party imagery, so none were saved into the repo. |
| Timings and easings | Read from computed styles, the CSSOM and the site's own scripts (`/assets/css/ha/script.js`, `/assets/js/functions.js`) and the Owl Carousel instance options. Marked **measured** unless stated. |
| Page weight | `performance` resource entries (`encodedBodySize`), desktop, first load. 31 resources did not report a size, so every figure is a **floor**. This is not a Lighthouse run. |
| Not done | Lighthouse and real-device testing. Our budgets are measured on our own build, never inferred from theirs. |

---

## 1. Page anatomy (desktop, top to bottom)

| # | Section | Ground | Height, desktop (px) | Height at 390 (px) |
|---|---|---|---|---|
| 1 | Top bar and header (logo, 7-item nav, "Member Login") | navy bar, white header | 86 | 80 |
| 2 | Hero slider, 6 slides | dark full-bleed image | 545 | 479 (separate section) |
| 3 | Client-logo strip, 22 logos | white | 114 | 114 |
| 4 | About, containing the only H1 and three **animated-GIF stat tiles** | lavender gradient | 713 | 1,660 |
| 5 | Video promo (poster plus play button to a YouTube overlay) | navy gradient | 511 | 857 |
| 6 | **"Fleet journey": 5 steps with a route line and a moving pin** | lavender gradient | **2,551** | 3,973 |
| 7 | Results: six percentage cards | lavender gradient | 978 | 830 (separate section) |
| 8 | Platform dashboard screenshot | lavender gradient | 1,111 | 494 |
| 9 | Services, a 9-card carousel | navy | 934 | 1,228 |
| 10 | Industries, a 4-image-card carousel | white | 774 | 848 |
| 11 | Testimonials, a 5-card carousel | navy gradient | 703 | 830 |
| 12 | Regional map with two counters | navy | 922 | 1,213 |
| 13 | News, 3 cards | white | 732 | 1,653 |
| 14 | Footer | navy gradient | 447 | 1,201 |

Total height is **about 11,100–11,250 px on desktop** (it depends on the width) and **15,379 px at 390**.

**Correcting the text-crawl hints.** The services "grid" and the industries "cards" are both **autoplay carousels**. The journey is **not pinned** (see §3). The map is a light-blue map image on a navy ground.

---

## 2. Scroll-effect inventory

| Section | Trigger | Behaviour | Duration / easing | Library | Mobile (390) | Purpose |
|---|---|---|---|---|---|---|
| Header | `$(window).scroll` above 100px | Adds `.navbar-fixed`; the header is `position: static` at the top | Class toggle; no transition measured | jQuery | Hamburger menu | Keep nav reachable |
| Hero | Autoplay | 6 slides, loops, **no pause on hover**, arrows and dots. Headlines are **H3 at 65px**; the hero has no H1 | `autoplayTimeout` **5000ms**, `smartSpeed` **5000ms**, `animateOut: fadeOutLeft` at **1s** (animate.css via `.owl-carousel .animated`) | Owl Carousel, animate.css 4.1.1 | **A second hero section** with portrait artwork (`m*.webp`), centred copy and a full-width CTA | Rotating value propositions |
| Client logos | Autoplay | 6 visible, 22 total, loops | **2000ms** interval, **600ms** slide | Owl | 1 visible | Social proof |
| About | IntersectionObserver, threshold 0.1, rootMargin `0 0 -100px 0`, fires once | `opacity 0→1`, `translateY(50px)→0`. **Hidden in CSS before JS runs** | **0.6s ease-out**, on `transition: all` | Vanilla | Same | Entrance |
| About stat tiles | Page load | Three looping GIF icons over "50% / 30% / 10%" claims | GIF loops (1,675 KB for the 3 GIFs) | None | Shown | Proof, by assertion |
| Video | Click | Opens an overlay and appends `autoplay=1` to a YouTube iframe | Not measured | Vanilla | Same | Demo |
| **Fleet journey** | Unthrottled `scroll` listener, **not passive, no rAF** | 5 rows (text 509px left, image 763px right, 400px tall, 50px apart). A dotted S-curve SVG path (`stroke-dasharray: 8px 10px`) runs down the centre. A 90×50 map-pin marker is placed on the path at `progress = (scrollY − sectionTop) / (sectionHeight − innerHeight)` using `getPointAtLength`, **by writing `style.top` and `style.left`** (layout properties) | Scroll-linked, with no duration. The marker fades **0.3s ease** in and out at the section edges | Vanilla (`ha/script.js`) | Rows stack (flex column, 672px each). **The path is `display:none`** and the marker collapses to 0×0, so the effect is off | Carries the reader through the product story |
| Results | Hover | Content fades out while a background photo fades in; the card lifts `translateY(-5px)`; the "Read More" text reveals by width | **0.3s**, on `transition: all` | CSS | **A second section**: a carousel, 2000ms autoplay | Outcome proof |
| Dashboard | Load | A decorative dotted curve behind a 2.4 MB PNG screenshot | `moveDots` **5s linear infinite** (`stroke-dashoffset`) | CSS | Same | "Real platform" |
| Services | Autoplay plus ambient | 4 of 9 cards visible. Ambient pulses and travelling dots in the navy ground | Carousel **2000ms/600ms**. `pulse` 4s infinite, `location-pulse` 3s infinite, `dot-travel` 4s linear infinite, `path-extend` 4s once | Owl, CSS | 1 visible | Range |
| Industries | Autoplay plus hover | 3 of 4 image cards. On hover the description and button slide in by animating **`margin-top` from −200px to 0** plus `visibility` | Carousel 2000ms/600ms. Hover **0.5s ease-in-out** | Owl, CSS | 1 visible, **no hover on touch** | Entry by sector |
| Testimonials | Autoplay plus ambient | 3 of 5 cards. The grid background drifts constantly | Carousel 2000ms/600ms. `gpsMove` **20s linear infinite** (`background-position`). Card hover `translateY(-10px)` 0.3s | Owl, CSS | 1 visible | Trust |
| Map and counters | On view | Numbers count up to 38,000 and 10,000. Green location dots pulse on the map | counterUp: delay 10ms, **1000ms**. `pulse` 4s infinite | jQuery counterUp | Stacked | Scale, by assertion |
| Global | Anchor links | Bootstrap's `:root { scroll-behavior: smooth }`, only under `prefers-reduced-motion: no-preference` | Native | Bootstrap 5.3 | Same | Anchor glide |

**No smooth-scroll or scroll-timeline library is loaded.** GSAP, ScrollTrigger, Lenis, Locomotive, Swiper, Lottie and three.js are all absent. AOS CSS 2.3.4 and the WOW.js global are loaded but used by **zero** elements.

---

## 3. The finding that matters: their "signature" is a route-line progress marker, not a pinned sequence

The journey (§1 row 6) is the only scroll-linked effect on the page, and it is simple. Nothing pins. The rows scroll normally while a pin icon travels a dotted curve beside them, telling the reader how far through the story they are.

Two consequences for Nebsam:

1. **What we liked is a sequence with a progress indicator.** The pinned stage in the sprint brief is our own upgrade, not a copy. Either is valid. The memo, D3 and D4, sets out the choice.
2. **A route line with a moving pin is Direction C, "The Corridor".** ADR-0002 rejected it for the homepage as "**the** telematics cliché" and deferred it to `/about/coverage`. Reusing it on Home would reopen an accepted ADR. A progress rail that reads as instrumentation, a thin scale beside the stage, keeps the mechanic without the map.

Their implementation is also the pattern to avoid. It uses an unthrottled, non-passive scroll handler, writes `top`/`left` (layout on every scroll event), switches the effect off entirely on phones, and ships four other infinite animations on the same page.

---

## 4. Libraries and weight (floor figures)

| | Measured |
|---|---|
| Libraries | jQuery 3.6.0 · Owl Carousel · counterUp · animate.css 4.1.1 · AOS CSS (unused) · WOW.js (unused) · Bootstrap **5.3.3 CSS linked twice** plus 5.3.0 JS · Bootstrap Icons 1.10.5 **and** Font Awesome 5.15.4 · GTM and GA4 · reCAPTCHA (loaded twice) · Cloudflare Turnstile · **two consent platforms** (Enzuzo and Termly) |
| Transfer | **≥ 14.2 MB**: webp 6.2 MB (31) · png 4.0 MB (45) · gif 1.68 MB (3) · jpg 1.44 MB (2) · JS **494 KB** compressed (21 files) · CSS 191 KB |
| Largest files | `demo-dashboard.png` 2,388 KB · `TruckFuel.webp` 1,823 KB (**only seen on hover**) · `Artboard12.jpg` 1,296 KB · `Driver.gif` 1,170 KB |
| Images | 94 on the page, **0 lazy-loaded** |
| DOM | 1,851 nodes. Duplicated desktop/mobile markup for the hero, results, about image and one list |
| Accessibility signals | `maximum-scale=1` blocks zoom · 14 `:focus { outline: none }` rules · **no `prefers-reduced-motion` rule in the site's own CSS** (the 26 found come from vendor CSS) · 6 autoplay carousels with no pause · white on the green CTA is **1.94:1** · muted `#9B9B9B` on white is **2.78:1** |

For scale: our homepage is **255 KB** at the median of nine runs (`PERFORMANCE_BASELINE.md`). Falcon's first load is at least **55×** that.

---

## 5. Theme DNA

**Palette (computed values; share of the page judged from area and frequency)**

| Hex | Role |
|---|---|
| `#FFFFFF` | Dominant ground |
| `#2F3292` | Indigo: headings, nav, secondary buttons, brand (10.5:1 on white) |
| `#051451` → `#001983` | Navy gradient: footer, stat cards |
| `#020024` → `#090979` | Near-black to royal-blue gradient: video, services, testimonials, map |
| `#E7E2FF`, `#CCCDFF` at 0.91 | Lavender gradients: the light grounds |
| `#3BD633` | Primary CTA green ("Get Started") |
| `#4DC247` / `#4DC147` | Secondary green: "Member Login", back-to-top, counters, WhatsApp |
| `#0DFF00` | Neon-green 2px testimonial borders |
| `#565656` | Body text on light grounds (5.8:1 on lavender) |
| `#9B9B9B`, `#929BA2` | Muted text and footer text |
| `#0D6EFD` | Bootstrap default blue, left on some card borders |

**Type.** **Cabin** only (variable, 400–700). Hero H3 65/65 at 700. H2 40/40 at 700. Step H3 28 at 700. Body 16/28 (a 1.75 ratio). Nav 14 at 700. **`text-transform: capitalize` on headings, nav and buttons**, so everything reads in Title Case. Inter, IBM Plex Sans, Roboto and "Super Sans VF" are declared by vendor CSS but never loaded. There are two icon fonts.

**Spacing.** Bootstrap container at 1320px. Section padding follows no scale: **0 / 10 / 48 / 60 / 80 / 100px** across 13 sections.

**Radius, shadow, depth.** Radius 8px dominates (45 uses), then 4px (35), 50% circles (30), 16px (19) and 50px pills (12). Buttons are inconsistent: 0px on "Member Login", 4px on "Get Started". Shadows are very wide and soft (`0 5px 83px rgba(40,40,40,.21)`), and some cards have heavy ones (`0 4px 8px rgba(0,0,0,.54)`). Depth comes from hover lifts of 5–10px on almost every card, plus blur on stacked tabs.

**Imagery and iconography.** Glossy 3D renders of glowing blue road grids, holograms and trucks. Stock control-room photography. Phone-over-truck composites. Looping GIF icons. Outline line icons on white cards. One real dashboard screenshot.

**Section cadence.** Dark, white, lavender, dark, lavender, lavender, lavender, dark, white, dark, dark, white, navy. That is **three lavender sections in a row and two dark ones in a row**, so the rhythm breaks in the middle of the page.

**Light/dark switching.** Hard cuts between grounds, with no transition. Each ground is a gradient rather than a flat colour.

---

## 6. Adopt / Adapt / Reject

| # | Falcon element | Verdict | Reason |
|---|---|---|---|
| 1 | A step-by-step "journey" that pairs one claim with one image per step | **Adopt, as a structure** | This is the right shape for a scroll set piece. Nebsam's steps come only from named source documents (memo D3) |
| 2 | A scroll-linked indicator of how far through the sequence the reader is | **Adapt** | Use a thin progress rail in the telemetry idiom, not a map pin on a route (§3). Drive it with `transform`/`opacity`: CSS scroll-driven animation where supported, IntersectionObserver as the fallback. Never `top`/`left` |
| 3 | Once-only entrance reveal via IntersectionObserver with `unobserve` | **Adapt** | The mechanism is right. Falcon hides content in CSS before JS runs, which breaks our contract. Our existing `Reveal` decides before paint and never hides above-the-fold content |
| 4 | Hard-cut light/dark grounds | **Adapt** | Nebsam already alternates. Keep hard cuts and flat token grounds with no gradients, and never three of the same ground in a row |
| 5 | Poster plus click-to-play video | **Adopt, when real footage exists** | This is what brief PART 14 asks for on mobile. No footage exists yet (memo NV-4) |
| 6 | A real platform screenshot as proof | **Adapt, blocked** | Only Nebsam-branded screenshots, and V13 blocks all current ones. Never a 2.4 MB PNG: `next/image` at ≤ 250 KB |
| 7 | Industry entry points | **Adapt** | `/industries` exists. Use a static composition with visible text, never hover-only content and never a carousel |
| 8 | Floating WhatsApp button | **Already built** | `components/layout/whatsapp-button.tsx`. No change |
| 9 | Their copy, headlines, imagery, logos, icons and client logos | **Reject (mandatory)** | We replicate mechanics and feel only. Their words and assets belong to them |
| 10 | **Every statistic**: 50%, 30%, 10%, 25%, 40%, 60%, 30%, 20%, 35%, "38,000 vehicles", "10,000 businesses" | **Reject (mandatory)** | Nebsam publishes nothing unverified. A stat-driven pattern survives only with a figure traced to our sources ("over 10 years", "70+ corporate clients" subject to memo NV-1, three branches, the named coverage towns, the KEBS report). Otherwise it becomes a non-numeric proof block |
| 11 | `maximum-scale=1` viewport | **Reject (mandatory)** | It blocks pinch zoom, which fails WCAG 1.4.4 |
| 12 | Duplicated desktop/mobile DOM (hero, results, about image) | **Reject (mandatory)** | Crawlers see duplicate content, and the page carries the weight of both. Use one DOM with `next/image` `sizes`/art direction |
| 13 | GIF animation (1.68 MB for three icons) | **Reject (mandatory)** | Too heavy, loops forever, and cannot honour reduced motion |
| 14 | Autoplay hero carousel | **Reject (mandatory)** | It costs LCP (6 full-bleed images, the LCP candidate changes every 5s) and conversion (5 of 6 messages are never seen). The headline is an H3. It has no pause control (WCAG 2.2.2) |
| 15 | Every other autoplay carousel (logos, services, industries, testimonials, mobile results) | **Reject** | WCAG 2.2.2. Content that moves on its own is content nobody reads. It also adds jQuery-era JS |
| 16 | Infinite ambient animation (`moveDots`, `pulse`, `location-pulse`, `dot-travel`, `gpsMove`) | **Reject** | `ANIMATION_SYSTEM.md` §5: no infinite ambient motion |
| 17 | Positioning the marker with `top`/`left` in an unthrottled scroll handler | **Reject** | Layout on every scroll event. Our rule is `transform`/`opacity` and IntersectionObserver |
| 18 | Content hidden until hover (industries, results) | **Reject** | Unreachable by keyboard and touch. The margin animation is a layout property |
| 19 | `transition: all` and hover lifts on every card | **Reject** | Emil's escalation trigger, and brief 6.6 "motion for its own sake" |
| 20 | Title Case headings (`text-transform: capitalize`) | **Reject** | Nebsam headings are sentence case (brief 5.3) |
| 21 | Indigo plus two greens plus neon-green accents | **Reject** | ADR-0002: electric blue is interface, amber is signal, and nothing else gets an accent. White on their green CTA is 1.94:1 |
| 22 | Cabin, soft 83px shadows, 8–16px radii, 50px pills | **Reject** | Nebsam uses Archivo at two optical widths plus IBM Plex Mono, radii of 2/6/10, and no shadow on dark grounds |
| 23 | Glowing 3D road-grid renders, holograms, stock control rooms | **Reject** | Brief 6.6 and PART 18: the generic telematics aesthetic, and imagery that is not Nebsam's |
| 24 | A superlative hero headline ("Leading … in the UAE") | **Reject** | The Nebsam equivalent is unpublishable (brief PART 1.5). The previously rejected jammer headline stays retired in every form |
| 25 | Two consent platforms, reCAPTCHA twice, Bootstrap CSS twice, two icon fonts | **Reject** | Weight and third-party risk. Nebsam already runs one consent notice and Turnstile |

---

## 7. For T1 (reconciling `/taste` output)

`/taste` captures static tokens from one viewport and the full-page DOM. It records at most a few transitions and **cannot see scroll behaviour** (verified in the skill's `extract.js`). Treat its output as a cross-check on §5 only. **This file is authoritative for §2–§4.** Any `/taste` token that contradicts a Nebsam token goes in the T1 report as "observed, not adopted". It is never a proposed change.
