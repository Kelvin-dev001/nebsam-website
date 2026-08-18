# ASSET MAP

Inventory of image assets in the existing repository, plus the shot list of what is still missing.
Generated during setup. Re-run and update at each sprint that touches media.

## Summary
- **Existing:** 120 files, **26.9 MB** in `public/`
- **Verdict:** a meaningful amount of usable real photography already exists — certificates, six
  client logos, product shots, premises shots. **Inventory this before commissioning a photographer.**
- **Every single file needs optimisation.** Nothing here is web-ready at current sizes.

## Priority actions
1. **Convert everything to AVIF/WebP** and resize to actual display dimensions. Several files are
   1.4–1.9 MB. On Kenyan mobile data a single 1.9 MB hero image blows the entire 1.5 MB homepage
   budget (brief PART 14) by itself.
2. **Rename `public/images/tracking-hero-bg (2).jpg`** — the space and parenthesis will break shell
   operations and Next.js image paths. → `tracking-hero-bg-alt.jpg`
3. **Resolve duplicates:** `africa-map.svg` / `africa-mappp.svg`; `logo192.jpg` / `logo192.png`;
   `showroom.jpeg` exists in both `public/images/` and `src/images/`.
4. **`public/images/about-team.jpg` is 3600×2400** — far larger than any display use. Resize.

## PRIVACY SWEEP — REQUIRES YOUR DECISION

### Confirmed exposures (from source documents, not yet in the repo)
| Source | What is exposed | Recommendation |
|---|---|---|
| `Video_Telematics_Proposal_2025.pdf` — "Sample Footages" pages | Customer vehicle registrations **KCK 283C** and **KCK 289C**, fleet group name, device IDs, GPS coordinates, and **two clearly identifiable faces** in a vehicle cab | **Do not publish.** Blur plates and faces, or replace with consented footage, or exclude entirely. Blocked by V14. |
| `FUEL_MONITORING_SOLUTION_PROPOSAL.pdf` — dashboard screenshots | Interfaces branded to **third-party telematics platforms**, not Nebsam | **Not usable as "the Nebsam platform".** Blocked by V13. |

### Requires inspection — certificates in the repo
The six certificate scans must be checked for the **unpublished** phone number `+254 727 727 461`
and the administrative email `nebsam3kenya@gmail.com` before display. The KEBS permit is known to
carry both. Either redact those fields or display a cropped extract showing only the substantive terms.

| File | Size | Action |
|---|---|---|
| `public/certificates/kebs.jpg` | 249 KB | **Inspect and redact** — known to carry the unpublished number and email |
| `public/certificates/cak.jpg` | 861 KB | Inspect for contact details; compress |
| `public/certificates/data-controller.jpg` | 1,389 KB | Inspect; compress heavily |
| `public/certificates/data-processor.jpg` | 1,390 KB | Inspect; compress heavily |
| `public/certificates/private-security-provider.jpg` | 1,115 KB | Inspect; compress |
| `public/certificates/installation.jpg` | — | Inspect — a specimen installation certificate may show real customer details |

**`installation.jpg` deserves particular attention.** If it is a real certificate rather than a
blank specimen, it may show a customer name, plate and phone number — and it is currently in a
public folder on a live site.

### Client logos in the repo
`armytex.png` · `buscar.jpg` · `ismax-security.png` · `kensalt.jpeg` · `muthukinjo.jpeg` ·
`ngongveg.png` — permission status tracked in `docs/CLIENT_PERMISSIONS.md` (V12). Note that four of
these six do **not** appear on the fuel proposal's client list; confirm those relationships.

## What already exists and is reusable
**Products:** `2-wire-tracker` · `magnetic-tracker` · `obd-tracker` · `fingerprint-tracker` ·
`fuel-tracker` · `fuel-sensor` · `sr-100` through `sr-600` · `xlr-3000` · `car-alarm-main` ·
`shock-sensor` · `engine-immobilizer` · `front-camera` · `rear-camera` · `cabin-camera`
**Premises:** `showroom` · `reception` · `main-entrance` · `service-bay` · `office-hero`
**Platform:** `mobile-app` · `web-platform` (verify branding — V13)
**Concept:** `anti-hijack` · `theft-prevention` · `driver-safety` · `accident-prevention` ·
`fleet-optimization` · `compliance-management` · `smartphone-integration` · `kenya-map` ·
`fuel-monitoring-diagram` · `fuel-monitoring-benefits`
**Hero:** `hero-image.webp` · `tracking-hero-bg` · `car-alarms-hero` · `radio-hero-bg1` ·
`speed-governor-heroo` · `ects-hero1` · `site-og-image.png`

Match each against the shot list below before requesting anything new. Several existing product
images may not correspond to the **confirmed** product names — map `sr-100`…`sr-600` and `xlr-3000`
to real product names or retire them. `[[NEEDS_VERIFICATION: which physical device each existing
product image shows]]`

## SHOT LIST — still needed
| Page | Asset | Spec | Priority |
|---|---|---|---|
| Homepage hero | Cinematic fleet/vehicle photography, Kenyan road context | 2400×1350, landscape, room for text overlay left or lower-third | **HIGH** |
| Homepage platform section | Nebsam-branded platform screenshots: fleet map, vehicle list, alerts, reports | 1920 wide, no customer data | **HIGH** |
| Coverage | Branch exteriors — Nairobi (Kiambu Rd), Mombasa (Makupa), Nakuru (Lower Bedi Rd) | 2000×1333 each | **HIGH** |
| Trust band | Technicians at work — installation in progress, uniformed, real vehicle | 3–4 shots, 1600×1067 | **HIGH** |
| About / team | Team group shot + 4–6 individual portraits for leadership and blog authors | 1200×1200 portraits | MEDIUM |
| Products | One clean studio shot per confirmed product, consistent background and lighting | 1600×1600, square, transparent or neutral | **HIGH** — the merged product pages sell from these |
| Radios | 11 model shots (Inrico T-521, S-100, S-200, T-290, TM-7, DR10; Baofeng 888s, UV-5R, UV-9R+, UV-82; Kenwood TK-3000) | 1600×1600 | MEDIUM |
| School bus | RFID/biometric terminal at a bus entrance, alcohol sensor in cab, bus interior — **no identifiable children without written parental consent** | 1600×1067 | MEDIUM |
| Container e-seal | E-seal fitted to a container door, port or ICD context | 1600×1067 | MEDIUM |
| Speed governor | Unit installed, plus a PSV/matatu context shot | 1600×1067 | MEDIUM |
| Key programming | Diagnostic equipment connected to a vehicle | 1600×1067 | LOW |
| Certifications | Clean, redacted scans of all six certificates | 1500 wide, legible | **HIGH** |
| OG image | Branded social share image, per template | 1200×630 | MEDIUM |

## Full file inventory
TOTAL: 26.9 MB across 120 files

| File | Size | Dimensions | Flag |
|---|---|---|---|
| `public/about-us-image-1.jpg` | 1,914 KB | 1024x1024 | **OVERSIZE** · convert to AVIF/WebP |
| `public/about-us-image-2.jpg` | 1,545 KB | 1024x1024 | **OVERSIZE** · convert to AVIF/WebP |
| `public/about-us-image-3.jpg` | 1,469 KB | 1024x1024 | **OVERSIZE** · convert to AVIF/WebP |
| `public/certificates/data-processor.jpg` | 1,390 KB | 1275x1650 | **OVERSIZE** · convert to AVIF/WebP |
| `public/certificates/data-controller.jpg` | 1,389 KB | 1275x1650 | **OVERSIZE** · convert to AVIF/WebP |
| `public/certificates/private-security-provider.jpg` | 1,115 KB | 1500x1046 | **OVERSIZE** · convert to AVIF/WebP |
| `public/certificates/cak.jpg` | 861 KB | 1754x1240 | **OVERSIZE** · convert to AVIF/WebP |
| `public/images/about-team.jpg` | 801 KB | 3600x2400 | **OVERSIZE** · convert to AVIF/WebP |
| `public/sr-400.jpg` | 789 KB | 1600x1600 | **OVERSIZE** · convert to AVIF/WebP |
| `public/certificates/kebs.jpg` | 725 KB | 1240x1755 | **OVERSIZE** · convert to AVIF/WebP |
| `public/images/ects/products/product-2.jpg` | 704 KB | 1932x1092 | **OVERSIZE** · convert to AVIF/WebP |
| `public/africa-map.svg` | 674 KB | — | **OVERSIZE** |
| `public/sr-300.jpg` | 630 KB | 1600x1600 | **OVERSIZE** · convert to AVIF/WebP |
| `public/images/ects/products/product-1.jpg` | 538 KB | 788x631 | **OVERSIZE** · convert to AVIF/WebP |
| `public/images/ects/usecases/usecase-2.jpg` | 474 KB | 1200x1200 | convert to AVIF/WebP |
| `public/2-wire-tracker.jpg` | 426 KB | 850x998 | convert to AVIF/WebP |
| `public/images/ects/products/product-4.jpg` | 381 KB | 1568x689 | convert to AVIF/WebP |
| `public/clients/ismax-security.png` | 372 KB | 832x728 | convert to AVIF/WebP |
| `public/images/ects/usecases/usecase-3.jpg` | 345 KB | 1200x1200 | convert to AVIF/WebP |
| `public/images/ects/usecases/usecase-1.jpg` | 337 KB | 1200x1200 | convert to AVIF/WebP |
| `public/hero-image.webp` | 333 KB | 1792x1024 | — |
| `public/images/ects/problem-4.jpg` | 315 KB | 1384x1040 | convert to AVIF/WebP |
| `public/images/ects/problem-2.jpg` | 300 KB | 1384x1040 | convert to AVIF/WebP |
| `public/images/speed-governor-main.jpg` | 284 KB | 2048x2048 | convert to AVIF/WebP |
| `public/images/ects/problem-1.jpg` | 274 KB | 1384x1040 | convert to AVIF/WebP |
| `public/images/ects/usecases/usecase-4.jpg` | 273 KB | 1200x1200 | convert to AVIF/WebP |
| `public/certificates/installation.jpg` | 264 KB | 2000x1414 | convert to AVIF/WebP |
| `public/images/ects/solution-2.jpg` | 248 KB | 1696x848 | — |
| `public/images/ects-hero1.jpg` | 242 KB | 1600x896 | — |
| `public/images/ects-hero-bg.jpg` | 233 KB | 1600x896 | — |
| `public/images/ects-og.jpg` | 232 KB | 1600x896 | — |
| `public/images/ects/solution-1.jpg` | 230 KB | 1696x848 | — |
| `public/anti-hijack.jpg` | 225 KB | 1400x1400 | — |
| `public/xlr-4000.jpg` | 221 KB | 1000x1000 | — |
| `public/tracking-hero-bg (2).jpg` | 215 KB | 1472x832 | **BAD FILENAME** |
| `public/images/ects/solution-4.jpg` | 205 KB | 1696x848 | — |
| `public/fuel-monitoring-benefits.jpg` | 188 KB | 1200x627 | — |
| `public/favicon.ico` | 187 KB | 16x1624x2432x3248x4864x6472x7296x96128x128256x256 | — |
| `public/images/organogram.jpg` | 187 KB | 1755x1241 | — |
| `public/video-telematics-features.jpg` | 186 KB | 1920x1080 | — |
| `public/images/tracking-hero-bg.jpg` | 185 KB | 1472x832 | — |
| `public/images/car-tracking-hero1.jpg` | 180 KB | 1472x832 | — |
| `public/engine-immobilizer.jpg` | 176 KB | 626x417 | — |
| `public/images/fuel-hero-bg.jpg` | 172 KB | 1600x896 | — |
| `public/images/video-telematics-hero.jpg` | 172 KB | 1472x832 | — |
| `public/images/ects/solution-3.jpg` | 169 KB | 1696x848 | — |
| `public/xlr-2000.jpg` | 162 KB | 1000x1000 | — |
| `public/images/speed-governor-heroo.jpg` | 160 KB | 1472x832 | — |
| `public/magnetic-tracker.jpg` | 157 KB | 1024x1024 | — |
| `public/images/speed-governor-hero.jpg` | 151 KB | 1472x832 | — |
| `public/images/fuel-hero-bg1.jpg` | 146 KB | 1472x832 | — |
| `public/africa-mappp.svg` | 143 KB | — | — |
| `public/images/video-telematics-hero1.jpg` | 141 KB | 1472x832 | — |
| `public/images/radio-hero-bg1.jpg` | 139 KB | 1472x832 | — |
| `public/images/ects/models/model-c.jpg` | 139 KB | 800x800 | — |
| `public/obd-tracker.jpg` | 135 KB | 500x500 | — |
| `public/images/speed-governor-hero1.jpg` | 133 KB | 1472x832 | — |
| `public/theft-prevention.jpeg` | 133 KB | 1440x810 | — |
| `public/images/main-entrance.jpeg` | 132 KB | 1280x720 | — |
| `public/images/showroom.jpeg` | 127 KB | 1280x720 | — |
| `public/images/radio-hero-bg.jpg` | 122 KB | 1472x832 | — |
| `public/images/reception.jpeg` | 119 KB | 1280x720 | — |
| `public/images/customer-parking.jpeg` | 119 KB | 1280x720 | — |
| `public/images/service-bay.jpeg` | 112 KB | 1280x720 | — |
| `public/images/customer-care.jpeg` | 109 KB | 1280x720 | — |
| `public/images/car-alarms-hero.jpg` | 107 KB | 1472x832 | — |
| `public/shock-sensor.jpg` | 100 KB | 1080x1080 | — |
| `public/images/fuellll-hero-bg.jpg` | 99 KB | 1472x832 | — |
| `public/xlr-1000.jpg` | 97 KB | 1000x1000 | — |
| `public/images/contact-hero-bg.jpg` | 95 KB | 1472x832 | — |
| `public/images/new-product-banner.png` | 87 KB | 350x250 | — |
| `public/images/car-alarms-hero1.jpg` | 73 KB | 1472x832 | — |
| `public/mobile-app.jpg` | 71 KB | 1080x1080 | — |
| `public/sr-500.jpg` | 71 KB | 720x720 | — |
| `public/images.jpg` | 71 KB | 750x528 | — |
| `public/engine-immobilizer-1.jpg` | 66 KB | 1080x1080 | — |
| `public/images/ects/products/product-6.jpg` | 64 KB | 400x300 | — |
| `public/compliance-management.webp` | 63 KB | 1365x905 | — |
| `public/kenya-map.jpg` | 60 KB | 540x360 | — |
| `public/fingerprint-tracker.jpg` | 60 KB | 960x1280 | — |
| `public/images/ects/products/product-7.jpg` | 60 KB | 550x418 | — |
| `public/web-platform.jpg` | 58 KB | 1080x1080 | — |
| `public/images/ects/models/model-a.jpg` | 54 KB | 724x730 | — |
| `public/images/ects/models/model-b.jpg` | 52 KB | 800x800 | — |
| `public/fuel-tracker.jpg` | 52 KB | 1500x1500 | — |
| `public/two-way-communication.jpg` | 50 KB | 1080x1080 | — |
| `public/images/ects/products/product-3.jpg` | 47 KB | 758x512 | — |
| `public/images/ects/products/product-5.jpg` | 46 KB | 685x604 | — |
| `public/fleet-optimization.jpg` | 45 KB | 500x500 | — |
| `public/accident-prevention.jpg` | 44 KB | 500x500 | — |
| `public/images/ects/problem-3.jpg` | 39 KB | 557x679 | — |
| `public/video-evidence.webp` | 35 KB | 500x500 | — |
| `public/sr-600.jpg` | 32 KB | 800x800 | — |
| `public/fuel-sensor.jpg` | 32 KB | 618x346 | — |
| `public/car-alarm-main.jpg` | 31 KB | 376x246 | — |
| `public/driver-safety.jpg` | 30 KB | 500x500 | — |
| `public/shock-sensor-2.jpg` | 28 KB | 612x408 | — |
| `public/cabin-camera.jpg` | 25 KB | 500x500 | — |
| `public/front-camera.jpg` | 25 KB | 500x500 | — |
| `public/clients/buscar.jpg` | 25 KB | 640x480 | — |
| `public/rear-camera.jpg` | 21 KB | 500x500 | — |
| `public/video-telematics-main.webp` | 19 KB | 800x600 | — |
| `public/clients/armytex.png` | 14 KB | 209x241 | — |
| `public/images/ects/products/product-8.jpg` | 11 KB | 350x350 | — |
| `public/smartphone-integration.jpg` | 10 KB | 300x145 | — |
| `public/xlr-3000.jpg` | 9 KB | 225x225 | — |
| `public/clients/kensalt.jpeg` | 8 KB | 210x240 | — |
| `public/logo192.png` | 7 KB | 225x225 | — |
| `public/logo512.png` | 7 KB | 225x225 | — |
| `public/images/site-og-image.png` | 7 KB | 225x225 | — |
| `public/fuel-monitoring-diagram.jpg` | 6 KB | 263x191 | — |
| `public/logo192.jpg` | 6 KB | 225x225 | — |
| `public/sr-100.jpg` | 6 KB | 225x225 | — |
| `public/clients/muthukinjo.jpeg` | 6 KB | 225x225 | — |
| `public/clients/ngongveg.png` | 4 KB | 225x225 | — |
| `public/sr-200.jpg` | 2 KB | 225x225 | — |
| `public/index.html` | 2 KB | — | — |
| `public/sitemap.xml` | 2 KB | — | — |
| `public/manifest.json` | 0 KB | — | — |
| `public/robots.txt` | 0 KB | — | — |
