# DISCOVERY REPORT — Sprint 0

**Date of audit:** 18 August 2026
**Branch audited:** `chore/00-project-scaffold` @ `1057ee5`
**Method:** direct inspection of every tracked file, the full `content-source/` tree, `src/`,
`public/`, `_inbox/`, `brand/`, `.claude/` and git history. Nothing in this report is inferred from
the brief — PART 7.0's findings were re-verified independently and are marked where they agree.

> **Internal document.** It quotes claims and contact details that must never reach a public page.
> No part of it is to be rewritten into the application.

---

## 1. Executive summary

The rebuild's central premise holds. The current site is a client-rendered Create React App SPA with
`react-helmet` metadata written after hydration, a `<title>` of `Nebsam`, and no meta description in
the served HTML shell. Its content is largely invisible to crawlers that do not execute JavaScript
and to LLM retrieval. That is architectural, and a migration is the correct response.

Three things are better than expected, and four are worse.

**Better.** The `content-source/` extraction is genuinely high quality — 32 write-ups, every
confirmed product name applied, every price matching the brief to the shilling, source hedging
preserved, and every banned string quarantined inside `SOURCE NOTES — NOT FOR PUBLICATION` blocks.
There is far more reusable real photography in `public/` than the shot list assumed. And the two
project skills are accurate and usable as written.

**Worse.**
1. A **live, indexed-candidate URL is missing from the 301 map** (§3.2).
2. **Five of twelve solutions have no source document at all** (§4.2), including the site's number-one
   target intent.
3. The verification register **under-counts open items by roughly 156** (§4.4).
4. The live site is **currently publishing a claim that the brief forbids**, inside its own
   `Organization` schema (§3.5).

None of the four is a reason to change the plan. All four are recorded with owners below.

---

## 2. Current stack — PART 7.0 re-verified

Every figure below was measured, not taken from the brief. All agree with PART 7.0.

| | Found | Brief PART 7.0 |
|---|---|---|
| Framework | `react-scripts` 5.0.1 | agrees |
| React | 19.0.0 | agrees |
| Routing | `react-router-dom` 7.3.0 | agrees |
| Styling | Tailwind 3.4.17 + PostCSS 8.5.3 + Autoprefixer 10.4.21 | agrees |
| Animation | `framer-motion` 12.7.4 | agrees |
| Icons | FontAwesome + `lucide-react` 0.509 + `react-icons` 5.5 — **three libraries** | agrees |
| Metadata | `react-helmet` 6.1.0, client-side only | agrees |
| Other | `react-type-animation` 3.2, `web-vitals` 2.1.4, Testing Library (unused) | agrees |
| Backend | **none** — no API, no database, no auth, no env config | agrees |
| Source files | 23 in `src/`, 9 components | agrees |
| `public/` | **28 MB across 120 files** | agrees |

**Tailwind config is effectively empty** — `tailwind.config.js` extends only `primary: #1E40AF` and
`secondary: #FFFFFF`. There is no token system to migrate; it is rebuilt from scratch in Sprint 1.

### 2.1 The crawlability failure, evidenced

`public/index.html` ships as an empty shell: `<div id="root"></div>`, `<title>Nebsam</title>`, no
meta description, and a stray `<meta name="Nebsam" content="We Are The Solution">` which is not a
valid metadata tag and carries the wrong tagline (canonical is *"We are the solution."*).

Every route's real `<title>`, description and JSON-LD is injected by `react-helmet` inside
`ServiceDetail.js` **after hydration**. There is no server render and no static prerender.

### 2.2 Existing structured data — present but broken

`src/components/ServiceDetail.js` does emit `Organization` and `Service` JSON-LD per service page.
Two defects:

- `Organization.logo` is `https://nebsamdigital.com/images/logo.png`. **That file does not exist** in
  `public/images/` — verified by direct listing. Every service page therefore advertises a 404 logo.
- The `Organization.description` on the About page carries an unpublishable claim (§3.5).

---

## 3. The live site — routes, URLs and content defects

### 3.1 Actual routes

`src/App.js` defines five routes only:

| Route | Component |
|---|---|
| `/` | `Home` |
| `/about` | `AboutUs` |
| `/contact` | `ContactPage` |
| `/services` | `Services` |
| `/services/:serviceName` | `ServiceDetail` |

`ServiceDetail` resolves **seven** service slugs from its `serviceMeta` map.

### 3.2 A live URL missing from the 301 map — highest-priority finding

**`/services/electronic-cargo-tracking-system`** is a fully built page:

- served by the dynamic route `/services/:serviceName` — `src/App.js:24` — and resolved from the
  `serviceMeta` map in `ServiceDetail.js`
- linked from the primary navigation — `src/components/Navbar.js:22`
- own canonical — `src/components/ServiceDetail.js:36`
- own `Service` schema — `ServiceDetail.js:56`
- own OG image — `ServiceDetail.js:37` (`/ects-og.jpg`)
- roughly 20 dedicated images under `public/images/ects/`
- built out across the two most recent pre-scaffold commits (`dcd15b5`, `7bd63f5`)

It is **absent** from all three inventories: `public/sitemap.xml`,
`content-source/07-legacy-site/indexed-urls.txt`, and the brief's PART 7.0 301 map.

Brief PART 7.0 names losing `/services/*` equity as "the one irreversible mistake available on this
project". This URL is the one most likely to be lost, because every inventory the project relies on
omits it.

**Resolved this sprint:** 301 to `/solutions/container-e-seal`, with "Electronic Cargo Tracking
System (ECTS)" carried into the destination page's `<title>` and H1 so the ranking term survives the
slug change. Recorded in `docs/ROUTE_MAP.md`.

### 3.3 Dead navigation links

`Navbar.js` links to `/team` (`:58`) and `/clients` (`:63`). **Neither has a route in `App.js`.** In
a `react-router` SPA an unmatched path renders the chrome with an empty `<main>` — a soft 404 that
returns HTTP 200. If either has been indexed it is indexed as a blank page. Both need a real
destination in the new IA (`/about/team` and a client/partners surface) and both belong in the 301
map. Cross-check against Search Console under register item V25.

### 3.4 Contact details that conflict with brief 3.3

`src/components/ContactUs.js` publishes:

| Line | Value | Problem |
|---|---|---|
| `:194` | `info@nebsam.com` | **wrong domain** — `nebsam.com`, not `nebsamdigital.com` |
| `:195` | `support@nebsam.com` | **wrong domain** |
| `:245` | `support@nebsamdigital.com` | not among the addresses verified in brief 3.3 |

Brief 3.3 verifies only `onlinesales@nebsamdigital.com` and `info@nebsamdigital.com` (the latter
still pending confirmation under V07). Two wrong-domain addresses are live and collecting nothing.
New register item **V35**.

`ContactUs.js:263` also embeds a Google Map centred on generic "Nairobi, Kenya" coordinates rather
than the Kiambu Road branch, and `Footer.js:65` gives the location as "Nairobi & Mombasa, Kenya" —
**omitting Nakuru entirely**. NAP is incomplete rather than wrong.

### 3.5 An unpublishable claim is live right now

`src/components/AboutUs.js` publishes, today:

| Line | Content |
|---|---|
| `:173` | hero subtitle — "Trusted by 50,000+ clients across Africa" |
| `:196` | body — "over 50,000 satisfied clients across the continent" |
| `:138` | **inside `Organization` JSON-LD `description`** — "serving 50,000+ clients across Africa" |

"Trusted by over 50,000 customers across Africa" is on the never-publish list (brief PART 1.5,
register "Unpublishable claims"). Its presence *inside structured data* is the worse half: schema is
what search engines and assistants ingest as fact about the entity.

Sprint 0 writes no code and `src/` was not touched. A one-line hotfix on its own branch is
**recommended and awaiting authorisation** — leaving a knowingly unsubstantiated claim live for the
length of the rebuild is a decision worth taking deliberately rather than by default.

`src/components/Footer.js:16` also states Nebsam has been "helping businesses protect their assets
since 2015". No founding year appears in the brief or anywhere in `content-source/`. "Over 10 years"
is approved, but the specific year is unverified. New register item **V36**.

### 3.6 What is clean

A full sweep of `src/` and `public/` for the unpublished phone number, the administrative email, and
every retired address string returned **zero matches**. The retired-string problem lives in the
source PDFs and the KEBS permit scan, not in the current codebase.

---

## 4. Content inventory

### 4.1 What `content-source/` actually contains

32 write-ups, 119–737 lines each, plus four cleaned PDFs and three README manifests.

| Group | Count | State |
|---|---|---|
| `01-solutions/` | 7 | complete |
| `02-products/trackers/` | 7 | complete |
| `02-products/car-alarms/` | 5 | complete |
| `02-products/radios/` | 11 | complete |
| `02-products/video/hybrid-dashcam/` | 1 | complete (183 lines) |
| `02-products/systems/fuel-monitoring-system/` | 1 | complete (171 lines) |
| `05-certifications/` | README | complete, with full scan inspection |
| `06-downloads/` | 4 PDFs + README | prepared, **none cleared for publication** |
| `07-legacy-site/` | URL inventory | incomplete — see §3.2 |
| `03-company/`, `04-testimonials/`, `08-pricing/` | — | **empty directories** |

**The manifest at `content-source/README.md` is stale.** It still lists `radios/` as empty,
`hybrid-dashcam` and `fuel-monitoring-system` as stubs, and `05-certifications` and `06-downloads`
as empty. All are populated. The manifest **cannot be corrected in place** — `.claude/settings.json`
denies writes to `content-source/**`, correctly. The corrected state is recorded in
`docs/CONTENT_ARCHITECTURE.md` instead, which is now the accurate index.

### 4.2 Five of twelve solutions have no source document

| Solution | Route | Source | Derivable from |
|---|---|---|---|
| Vehicle Tracking | `/solutions/vehicle-tracking` | **none** | 7 tracker write-ups, 247–297 lines each — strong |
| Vehicle Security & Anti-Theft | `/solutions/vehicle-security` | **none** | 5 car-alarm write-ups, 354–652 lines, plus anti-jammer and immobilisation layers — strong |
| Vehicle Recovery | `/solutions/vehicle-recovery` | **none** | Recovery Tracker write-up — hardware strong, **service undocumented** |
| Fleet Management | `/solutions/fleet-management` | **none** | scattered only — **no source describes the Nebsam platform as a product** |
| Asset & Equipment Tracking | `/solutions/asset-tracking` | **none** | Recovery Tracker names containers, machinery, generators, agricultural and heavy equipment — hardware fits, operational context absent |

This matters disproportionately: `/solutions/vehicle-tracking` is both the number-one target intent
("vehicle tracking Kenya") and the 301 destination for `/services/car-tracking`, and
`/solutions/vehicle-security` is the destination for `/services/car-alarms`.

`fleet-management` carries a second dependency. It needs evidence of the fleet platform, which is
the same evidence `/platform` needs under brief 9.6 — and that evidence is blocked by register item
**V13**, because some existing dashboard screenshots carry third-party product branding.

**Resolved this sprint:** launch with **ten** solutions. `vehicle-tracking`, `vehicle-security` and
`vehicle-recovery` are derived from the existing product write-ups, with recovery's service
specifics tokenised. `fleet-management` and `asset-tracking` are **deferred past launch** pending
real source material and cleared platform screenshots. Recorded in `docs/SPRINT_PLAN.md`.

### 4.3 `content-source/` is consistent with PART 1.5 — verified

Checked directly rather than assumed:

- **Radio prices match the brief exactly.** Inrico T-521 KES 22,000; S-100 KES 30,000; S-200
  KES 30,000; TM-7 KES 30,000 — every one labelled *(excl. VAT)* and carrying the KES 3,000 per
  device per year CAK renewal on the same line.
- **The seven unpriced models correctly show "Request price"** rather than a placeholder number,
  which is what brief 10.2 requires.
- **The ProMax / ProMax Plus correction is applied**, with the reasoning recorded as an HTML comment
  at the top of `hybrid-promax-plus-car-alarm/write-up.md`.
- **No retired product name appears in any publishable body.** The only occurrence is inside a
  `SOURCE NOTES` block in `hybrid-dashcam/write-up.md:175`, describing the brochure's error.
- **Every banned string is quarantined.** The unpublished phone number, the administrative email and
  all four retired address forms appear only inside `SOURCE NOTES` blocks or in the internal
  registers under `docs/`. None is in a publishable body.

This is the part of the setup that most needed to be right, and it is.

### 4.4 The verification register under-counts by roughly 156

`content-source/` carries **190 unique `[[NEEDS_VERIFICATION]]` tokens** across **219 occurrences**.
`docs/NEEDS_VERIFICATION.md` has **34 rows**. The register's own stated rule is one row per token.

Breakdown of the ~156 unregistered:

| Cluster | Approx. count | Character |
|---|---|---|
| Radio hardware specs (11 models) | ~120 | channels, bands, battery, transmit power, IP rating, speaker, display, talk time |
| Hybrid Dashcam specs | ~18 | resolution, lens orientation, field of view, power draw, retention, price |
| Fuel monitoring hardware | ~14 | sensor model, DFM flow range, accuracy, calibration, tank types, gateway |
| School bus | 8 | already mirrored as V17–V24 |
| Certifications and downloads | ~6 | partially mirrored |

Dumping 156 rows into the register would make it unusable, so it is **restructured** rather than
simply extended: the existing decision and compliance items stay as the primary table, and the
specification gaps become a grouped annexe organised by product, so they can be answered in one
sitting with a supplier datasheet rather than one at a time. See `docs/NEEDS_VERIFICATION.md`.

### 4.5 Download centre — prepared, nothing publishable

Four PDFs are metadata-stripped and compressed (49.65 MB → 6.26 MB, 87%), page counts and
extractable text verified identical to source. **All four are blocked on content grounds** — retired
addresses, the unpublished phone number, retired product names, unsubstantiated claims, third-party
platform branding, undated documents, and two files that declared `containsAiGeneratedContent`.

The honest position is that **the download centre has nothing to publish yet**. The
`06-downloads/README.md` recommendation — regenerate the documents from `content-source/` rather
than redact the Canva originals — is sound, and is carried into `docs/SPRINT_PLAN.md` as Sprint 10
scope.

A fifth document, `Video_Telematics_Proposal_2025.pdf`, **is not in the repository** and carries the
worst privacy exposure on the project (register **V14**). It also means the AI video telematics
hardware specification in `content-source/` was supplied verbally by the client and is unverified
against any document — audit item **B03**.

---

## 5. Certifications — three have already expired

`content-source/05-certifications/README.md` records a full inspection of all six scans in
`public/certificates/`. The headline is not a privacy finding.

| Scan | Instrument | Status at 18 Aug 2026 |
|---|---|---|
| `cak.jpg` | CAK Compliance Certificate | **EXPIRED 30 Jun 2025** |
| `data-controller.jpg` | ODPC registration | **EXPIRED 27 May 2026** |
| `data-processor.jpg` | ODPC registration | **EXPIRED 27 May 2026** |
| `private-security-provider.jpg` | PSRA, 5-year term | to 2029, **annual renewal status unknown** |
| `kebs.jpg` | Permit SM#84618 | valid to 26 Feb 2027 |
| `installation.jpg` | blank specimen | n/a |

Brief 3.5 requires the site never displays a lapsed permit. Three already are. Renewal is an
operations task that blocks the certifications page (V27–V30).

**This has an earlier consequence than the certifications page.** The canonical company description
drafted in `.claude/skills/nebsam-seo/SKILL.md` §5 asserts that Nebsam "is a registered Data
Controller and Data Processor with the Office of the Data Protection Commissioner". That sentence is
destined for `lib/company.ts`, the footer, About, `llms.txt` and `Organization` schema **from Sprint
2** — six sprints before the certifications page is built.

**Client decision this sprint:** the sentence ships; renewal is in hand. It is written in exactly one
place so that if renewal slips, the correction is one constant rather than a rewrite across every
page. Tracked as **V28a** with a hard Sprint 2 gate.

Two further corrections the inspection produced, both already logged:

- The **CAK document is not a licence.** It states on its face *"this is not a licence but proof of
  compliance."* Brief 3.5 calls it an "Application Service Provider (AS) licence" — that description
  must be corrected before publication (**V31**).
- **Four of five government registrations spell the company singular** — "NEBSAM DIGITAL SOLUTION (K)
  LIMITED" on the KEBS permit, both ODPC registrations and the PSRA certificate; only CAK uses the
  plural. Marketing uses "Solutions" per PART 1.5 #5, but legal pages may need the registered form
  (**V26**).

---

## 6. Assets

`public/` is **28 MB across 120 files**, and per `docs/ASSET_MAP.md` **not one file is web-ready at
its current size**. Eight files exceed 700 KB; `about-team.jpg` is 3600×2400.

Genuinely reusable, and more than the shot list assumed: six certificate scans, six client logos,
tracker and camera product shots, `fuel-sensor`, premises photography (`showroom`, `reception`,
`main-entrance`, `service-bay`, `office-hero`, `customer-parking`, `customer-care`), `mobile-app`
and `web-platform` screenshots, and a substantial ECTS image set.

Known defects carried into `docs/ASSET_MAP.md`: `public/images/tracking-hero-bg (2).jpg` has a space
and parenthesis in its filename that will break shell operations and Next.js image paths; duplicates
exist (`africa-map.svg` / `africa-mappp.svg`, `logo192.jpg` / `logo192.png`, `showroom.jpeg` in both
`public/images/` and `src/images/`); and `sr-100`…`sr-600` plus `xlr-1000`…`xlr-4000` do not map to
any confirmed product name.

### 6.1 The logo is a plaque, not a mark

`brand/logo/nebsam_transparent_logo.png` is a 1254×1254 PNG, 625 KB. Decoded and sampled directly:

| Colour | Share | Role in the artwork |
|---|---|---|
| `#85A4D2` | 33% of opaque pixels | the rounded-rectangle **plaque background** |
| `#020189` | 71,574 px | the **NEBSAM** wordmark |
| `#D08833` (approx.) | 5,244 px | the **satellite signal arcs** — the only warm accent |
| `#FFFFFF` | — | "Digital Solutions (K) Ltd" lockup |

Two practical consequences. The plaque fill is **part of the artwork**, so despite the filename this
is not a free-standing transparent mark — placed on a dark navy header it will show a pale blue
rectangle. And the wordmark is set in a casual rounded face; the site's typography must not imitate
it. `brand/README.md` already requests an SVG and mono variants, and this confirms why. Recorded as
**V37**.

---

## 7. Repository hygiene

- **`_inbox/` and `media-source/` are gitignored**, as are `content-source/06-downloads/*.pdf`.
  `media-source/` is empty. Every original source `.txt` and all four original PDFs (49.6 MB) exist
  **only on this machine, in no commit**. If this drive fails, the extracted write-ups survive and
  the raw originals do not. Recorded as **V38**.
- **Untracked clutter at the repository root:** `_to_delete/` (git lock files, a `nebsam.bundle`, two
  stray PNGs, and superseded copies of `ASSET_MAP.md` and `NEEDS_VERIFICATION.md`) and
  `nebsam-scaffold.zip` (783 KB). Neither is referenced by anything. Recommended for removal, not
  removed here — deletion is out of Sprint 0 scope.
- **`README.md` is still Create React App boilerplate** and describes commands that will not survive
  the migration. It is replaced in Sprint 1 alongside the new `package.json`.
- **`.env.example` is in good shape** — every variable commented and grouped, server-only keys
  marked, and the certificate-verification secrets already anticipated.
- **Branch state:** `develop` and `sprint/00-discovery` created this sprint from the scaffold HEAD.
  `main` is untouched and continues to serve production.

---

## 8. Keep / rebuild / discard

| Keep | Rebuild | Discard |
|---|---|---|
| `content-source/` entirely | Every route, as Next.js App Router | All 9 CRA components |
| `public/certificates/` (redact/crop first) | The token system — `tailwind.config.js` has nothing usable | `react-router-dom`, `react-helmet`, `react-scripts` |
| `public/clients/` (permission first) | Metadata and schema, server-rendered | Two of the three icon libraries |
| Product and premises photography (compress) | `sitemap.xml` — hand-maintained, must be generated | `react-type-animation` |
| ECTS image set | `robots.txt` — currently correct, regenerate with the app | CRA test scaffolding |
| `brand/logo/` (pending SVG + variants) | `README.md` | `_to_delete/`, `nebsam-scaffold.zip` |

---

## 9. Risks

| # | Risk | Impact | Owner | Mitigation |
|---|---|---|---|---|
| R1 | ECTS URL lost at cutover | Permanent loss of the site's cargo-tracking ranking | Claude | 301 added to `ROUTE_MAP.md`; implemented Sprint 2, not Sprint 15 |
| R2 | Search Console never cross-checked | Unknown indexed URLs lost permanently | Client (V25) | Blocks Sprint 2 close |
| R3 | ODPC renewal slips past Sprint 2 | A false regulatory claim published site-wide and in schema | Nebsam ops (V28a) | Description written once in `lib/company.ts`; one-constant rollback |
| R4 | Platform screenshots never cleared | `/platform` and `/solutions/fleet-management` have no evidence base | Client (V13) | `fleet-management` already deferred past launch |
| R5 | 190 open tokens at launch | Brief PART 2.2 forbids launching with unresolved tokens on public pages | Client | Restructured register; spec annexe answerable from datasheets |
| R6 | `_inbox/` lost with this machine | Raw sources unrecoverable | Client (V38) | Confirm off-machine backup |
| R7 | Download centre ships a blocked PDF | Republishes retired addresses and the unpublished number | Claude | Every file gated on a human "cleared for publication" cell |
| R8 | 28 MB of unoptimised media carried over | Blows the entire homepage budget with one hero image | Claude | Sprint 14 budget gate; no raw asset promoted without conversion |

---

## 10. What Sprint 0 could not determine

Stated rather than filled with plausible text, per brief 23.3:

- Which URLs Google actually has indexed — needs Search Console access (V25).
- Whether `info@nebsamdigital.com` is live and monitored (V07), and whether
  `support@nebsamdigital.com` is real (V35).
- The company's founding year (V36).
- Which platform screenshots are Nebsam-branded and cleared (V13).
- Real specifications for 11 radio models, the Hybrid Dashcam and the fuel monitoring hardware
  (~152 tokens).
- Whether any GA4 property, Search Console account or Google Business Profile already exists (V10).
- The named sprint approver and the target launch date (V39, V40).
