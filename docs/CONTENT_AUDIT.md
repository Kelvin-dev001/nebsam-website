# CONTENT AUDIT

> **THIS ENTIRE DOCUMENT IS INTERNAL — NOT FOR PUBLICATION.**
> It necessarily quotes the claims, phone numbers and addresses that must never reach a public page,
> because a register of things not to publish has to name them. No part of this file may be rewritten
> into the application. It is the project team's working record only.

Register of conflicts, unverifiable claims and source-document defects found in the supplied
Nebsam material. Per brief section 4.2: **verify each with the human, do not silently pick a side.**

Nothing in this register has been merged into `content-source/`. Each row records what the source
says, what the existing write-up says, and what still needs deciding.

Status: `OPEN` · `RESOLVED` · `CLOSED` (resolved and applied in the app layer)

**Sprint 0 update (18 Aug 2026):** sections A–D re-verified against the repository; section **E**
added with defects found in the *live application* rather than the source documents.

---

## A. Brochure vs existing product write-ups

Source: `_inbox/hybrid tracker, hybrid alarm, hybrid dashcam, basic tracker, recovery tracker.pdf`
(2 pages, Canva, undated in body; PDF creation date 2026-05-26).

The brochure lists features for five products. Seven of those features do not appear in the
corresponding `content-source/` write-ups, which were extracted from the longer per-product source
documents. Neither source has been assumed correct.

| # | Product | Brochure claims | Existing write-up | Why it matters | Status |
|---|---|---|---|---|---|
| A01 | Hybrid Tracker | "Mobile App" | Not mentioned | Every other tracker documents app access; its absence here is more likely an extraction gap than a product difference, but it must be confirmed rather than assumed | OPEN |
| A02 | Hybrid Tracker | "Global Tracking" | Not mentioned — only the Standard Tracker documents local vs international operation | If the Hybrid Tracker also works internationally, that is a significant selling point currently missing from its page. If it does not, the brochure is wrong and is being handed to customers | OPEN |
| A03 | Hybrid Tracker | "No Credit Top up" | Not mentioned | A recurring-cost statement. Brief PART 10.2 requires recurring costs to be disclosed on the product page. If airtime top-up is genuinely not required, say so; if it is, that cost must be published | OPEN |
| A04 | Standard Tracker (brochure: "Basic Tracker") | "Mobile App" | Not mentioned | As A01 | OPEN |
| A05 | Standard Tracker (brochure: "Basic Tracker") | "No credit top up" | Not mentioned | As A03 | OPEN |
| A06 | Recovery Tracker | "Playback" | Not mentioned — the write-up documents live tracking, configurable intervals and tracking modes, but not route playback | On a device sending one location per day, "playback" may mean something materially different from playback on a live tracker. Clarify before publishing the word | OPEN |
| A07 | Hybrid Car Alarm (brochure: "Hybrid Alarm") | "Comes complete with Hybrid Tracker package (optional)" | Not mentioned | A **bundling and pricing claim**, not a feature. It implies a package that the shop must be able to sell and price, and may require a bundle or kit concept in the data model. Resolve before Sprint 6 and before commerce goes on the pages in Sprint 7 | OPEN |

### Retired names used in the brochure

| # | Brochure wording | Canonical | Reference | Status |
|---|---|---|---|---|
| A08 | "Basic Tracker" | **Standard Tracker** | Brief PART 1.5 #1 | OPEN — brochure must be corrected before it is offered as a download |
| A09 | "Hybrid Alarm" | **Hybrid Car Alarm** | Brief PART 1.5 #3 | OPEN — as above |

### Other brochure defects

| # | Finding | Action | Status |
|---|---|---|---|
| A10 | Tagline rendered as "We Are The Solutions" | Canonical tagline is **"We are the solution."** (brief 3.1). **Sprint 0 note:** the same wrong form appears in the live `public/index.html` — see E05 | OPEN |
| A11 | PDF metadata declares `containsAiGeneratedContent: Yes` | Establish which images are AI-generated before reuse. Brief PART 18 forbids AI imagery depicting Nebsam staff, premises, vehicles or the platform | OPEN |
| A12 | PDF metadata Title "Blue Professional Consulting Service Brochure", Author "trapp lord" | Stripped in the cleaned copy at `content-source/06-downloads/`. Original untouched | RESOLVED — metadata stripped |
| A13 | Typo: "Get instant alerts when someone touches your vehicle!!1" | Fix in any rewrite | OPEN |

---

## B. AI Vehicle Video Telematics

| # | Finding | Detail | Status |
|---|---|---|---|
| B01 | **"KEBS accredited" wording** | `content-source/01-solutions/ai-video-telematics/write-up.md` carries a section headed "# KEBS ACCREDITED" stating the product "is **KEBS accredited**". The verified instrument is a **Permit to Use the Standardization Mark**, product-scoped to vehicle cameras for video telematics under the STREAMAX brand. "Accredited" overstates it and implies company-wide scope. Brief sections 3.5 and 4.2 item 1 apply. The correct wording is recorded in the appended enrichment section of the same file and in `content-source/05-certifications/README.md`. **The original section has deliberately not been edited** — `content-source/` is authoritative and read-only. Reconcile in the app layer | OPEN |
| B02 | **NTSA data transmission** | The 2025 video telematics proposal claims traffic sign recognition "transmits this data directly to NTSA servers". Unverified — register item V01. The claim is **absent** from both the existing write-up and the appended enrichment section, and was deliberately not hedged. Do not reintroduce it | OPEN — do not publish |
| B03 | **Hardware specification provenance** | `Video_Telematics_Proposal_2025.pdf` is **not present in the repository**. The hardware specifications recorded in the enrichment section (720p lenses, 110°/130° viewing angles, Android 8.1, 2GB RAM + 32GB, microSD to 256GB, 4G, WiFi, two-way talk, voice recorder) and the ADAS/DMS/DBA lists were **supplied by the client directly**, not extracted from a document in the repository. Confirm against the proposal when it is available | OPEN |
| B04 | KEBS permit and lab report details | Independently corroborated by brief PART 3.5. Recorded in `content-source/05-certifications/README.md` | RESOLVED — corroborated |

---

## C. Fuel monitoring

Source: `_inbox/FUEL MONITORING SOLUTION PROPOSAL.pdf` (9 pages, dated **2023**).

| # | Finding | Detail | Status |
|---|---|---|---|
| C01 | **"Decrease fuel thefts by 90%"** | The proposal states fleet owners "are usually able to decrease fuel thefts in their fleets by 90%". A third-party vendor claim with no methodology, sample or source. **Not publishable** (brief 4.2 item 4). Excluded from the enrichment section | CLOSED — not publishable |
| C02 | **Hardware naming** | The proposal describes the hardware only as "IoT-based sensors attached to the tanker's surface", plus an IoT gateway, a cloud server and a GPS tracker. It never uses the terms **"fuel level sensor"** or **"DFM fuel flow meter"** — those come from brief PART 4.3 and `content-source/README.md`. Confirm the actual bill of materials | OPEN |
| C03 | **"attached to the tanker's surface"** | Surface attachment is an unusual description for fuel level measurement, which is normally in-tank. Either the proposal is imprecise or the sensing method is not what the canonical naming implies. **Clarify before writing installation copy** | OPEN |
| C04 | **Unpublished phone number in source** | The proposal carries the unpublished number twice, in the header and footer. That number must not be published anywhere (brief PART 1.5 #8, PART 3.2). It has not been carried into any write-up body | OPEN — redact before the proposal is offered as a download |
| C05 | **Retired addresses in source** | The proposal gives two retired Mombasa address forms. Both retired; canonical Mombasa address is **Makupa Roundabout, next to Mass Petrol Station** (brief PART 1.5 #7). Not carried into any write-up body | OPEN — redact before download |
| C06 | **Document age** | Dated 2023. Brief 4.2 item 5: do not treat a 2023 proposal as current fact. Specifications, screenshots and any pricing may be stale | OPEN |
| C07 | **Client list** | The proposal names approximately 70 corporate clients. This substantiates "70+ corporate clients" (brief PART 1.5, approved). Naming or logo-ing any individual client still requires that client's permission — see `docs/CLIENT_PERMISSIONS.md` and register item V12 | OPEN |
| C08 | **Third-party platform branding** | Brief 3.6 records that the fuel proposal's dashboard screenshots carry third-party telematics branding rather than Nebsam's. Not usable as "the Nebsam platform" — register item V13 | OPEN |
| C09 | PDF metadata | Title "Copy of Blue and Purple Casual Corporate App Development Startup Marketing Proposal", Author "trapp lord", Producer Canva | RESOLVED — stripped in the cleaned copy |

---

## D. Closed by client decision

Recorded so the audit trail exists. See brief PART 1.5 — do not reopen.

| # | Conflict | Resolution |
|---|---|---|
| D01 | ProMax naming | **Hybrid ProMax Car Alarm** (vibrating key remote) and **Hybrid ProMax Plus Car Alarm** (vibrating key remote + Anti-Jammer GPS) |
| D02 | Basic vs Standard Tracker | **Standard Tracker** |
| D03 | Hybrid Alarm vs Hybrid Car Alarm | **Hybrid Car Alarm** |
| D04 | Dashcam vs AI Video Telematics | **Two separate products**, not a naming conflict |
| D05 | Branch addresses | Kiambu Road/Ridgeways and Makupa Roundabout |
| D06 | Legal name | **Nebsam Digital Solutions (K) Ltd** — plural |
| D07 | KEBS test report usage | Quotable in marketing |
| D08 | Radio licence fee | Annual CAK renewal, KES 3,000 per device |
| D09 | "Over 10 years" | Approved |
| D10 | "70+ corporate clients" | Substantiated by the named client list |

---

## E. Defects in the live application — added Sprint 0

Sections A–D audit the *source documents*. This section audits the *running site*, which had not
previously been read for content defects. All line references are to `chore/00-project-scaffold`
@ `1057ee5`.

| # | Finding | Detail | Status |
|---|---|---|---|
| **E01** | **An unpublishable claim is live, including inside structured data** | `src/components/AboutUs.js` publishes "Trusted by 50,000+ clients across Africa" (`:173`), "over 50,000 satisfied clients across the continent" (`:196`), and — worse — the same claim inside the `Organization` JSON-LD `description` (`:138`). Schema is what search engines and assistants ingest as fact about the entity. The claim is on the never-publish list | OPEN — **hotfix proposed, awaiting authorisation.** `src/` deliberately not touched in Sprint 0 |
| **E02** | **Unverified founding year published** | `src/components/Footer.js:16` — "helping businesses protect their assets since 2015". No founding year appears in the brief or anywhere in `content-source/`. "Over 10 years" is approved; the specific year is not evidenced | OPEN — register **V36** |
| **E03** | **Two wrong-domain email addresses live** | `src/components/ContactUs.js:194–195` publishes `info@nebsam.com` and `support@nebsam.com` — the domain is `nebsam.com`, not `nebsamdigital.com`. `:245` also publishes `support@nebsamdigital.com`, which brief 3.3 does not list among verified addresses | OPEN — register **V35** |
| **E04** | **`Organization.logo` points at a file that does not exist** | `src/components/ServiceDetail.js` emits `https://nebsamdigital.com/images/logo.png` on every service page. Verified by listing: `public/images/logo.png` is absent. Every service page advertises a 404 logo to crawlers | OPEN — fixed by construction in the rebuild |
| **E05** | **Wrong tagline and a malformed meta tag in the served HTML** | `public/index.html` carries `<meta name="Nebsam" content="We Are The Solution">`. It is not a valid metadata tag, and the canonical tagline is **"We are the solution."** Same wrong form as A10 | OPEN — fixed by construction |
| **E06** | **`<title>` is "Nebsam" on every page; no meta description** | `public/index.html` ships an empty shell. Every real title and description is injected post-hydration by `react-helmet`. This is the core rebuild rationale, recorded here as an audit fact | OPEN — fixed by construction |
| **E07** | **Incomplete NAP on the live site** | `Footer.js:65` gives the location as "Nairobi & Mombasa, Kenya" — **Nakuru is omitted entirely**. `ContactUs.js:263` embeds a Google Map centred on generic "Nairobi, Kenya" coordinates rather than the Kiambu Road branch. Not wrong, but incomplete, and NAP consistency drives local SEO and entity resolution | OPEN — fixed by `lib/company.ts` |
| **E08** | **A live route absent from every URL inventory** | `/services/electronic-cargo-tracking-system` — full page, own canonical, `Service` schema, OG image, ~20 images, in the primary nav. Absent from `public/sitemap.xml`, `content-source/07-legacy-site/indexed-urls.txt` and brief PART 7.0 | **RESOLVED** — 301 to `/solutions/container-e-seal` recorded in `docs/ROUTE_MAP.md` §2.2. Register **V34a** |
| **E09** | **Two navigation links with no route** | `Navbar.js:58` links to `/team` and `:63` to `/clients`. Neither has a route in `App.js`; in a `react-router` SPA an unmatched path renders chrome with an empty `<main>` — a soft 404 returning HTTP 200. If indexed, they are indexed as blank pages | OPEN — proposed 301s to `/about/team` and `/about/partners` in `ROUTE_MAP.md` §2.3; confirm against Search Console (V25) |

**What is clean.** A full sweep of `src/` and `public/` for the unpublished phone number, the
administrative email and every retired address string returned **zero matches**. The retired-string
problem lives in the source PDFs and the KEBS permit scan, not in the current codebase.

---

## F. Manifest drift — added Sprint 0

| # | Finding | Detail | Status |
|---|---|---|---|
| **F01** | **`content-source/README.md` is stale** | It lists `radios/` as empty, `hybrid-dashcam` and `fuel-monitoring-system` as stubs, and `05-certifications` and `06-downloads` as empty. All are populated — 11 radio write-ups (119–150 lines each), a 183-line dashcam write-up, a 171-line fuel system write-up, a complete certifications record and four cleaned PDFs. **It cannot be corrected in place**: `.claude/settings.json` denies writes to `content-source/**`, correctly | RESOLVED — accurate index now lives in `docs/CONTENT_ARCHITECTURE.md` §2 |
| **F02** | **The verification register under-counted by ~156** | `content-source/` carries **190 unique** `[[NEEDS_VERIFICATION]]` tokens across 219 occurrences; the register had 34 rows, against its own stated rule of one row per token | RESOLVED — register restructured into decision items plus a grouped specification annexe |
| **F03** | **Five of twelve solutions have no source document** | `vehicle-tracking`, `fleet-management`, `vehicle-security`, `asset-tracking`, `vehicle-recovery`. Includes the #1 target intent and both high-value 301 destinations | RESOLVED — three derived from product write-ups; `fleet-management` and `asset-tracking` **deferred past launch**. `docs/SPRINT_PLAN.md` |
| **F04** | **`03-company`, `04-testimonials` and `08-pricing` are empty** | No About copy, no branch or team descriptions, no testimonials, no pricing beyond the four radio models | OPEN — client to supply. V15 covers testimonials, V05 pricing terms |
