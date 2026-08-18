# CONTENT ARCHITECTURE

The content model, and the complete source-document → page mapping.

**This file supersedes the manifest in `content-source/README.md`**, which is stale — it lists
`radios/` as empty and two write-ups as stubs when all are populated. That manifest cannot be
corrected in place because `.claude/settings.json` denies writes to `content-source/**`, correctly.
This document is the accurate index.

Use the **`nebsam-content`** skill for every migration. `content-source/` is read-only: rewrite
*out of* it, never *into* it.

---

## 1. Content model

Five content types, one relationship rule.

| Type | Purpose | Owns |
|---|---|---|
| **Solution** | Problem and outcome. The primary SEO surface | An intent — "fuel monitoring Kenya" |
| **Product** | Hardware, specification, price, buy. **Merged spec + commerce page** | A device |
| **Industry** | Sector entry point | A buyer's self-identification |
| **Article** | Acquisition and definitional depth | A question |
| **Trust** | Certifications, testimonials, clients, coverage | Evidence |

**Relationship rule — no orphan pages.** Every solution links to its products, its industries and at
least one article. Every product links to its solutions, its industries and its shop entry. Every
industry links to relevant solutions and products. Every article links to at least one solution. A
page with no inbound internal link does not exist.

### 1.1 Solution page model — eleven sections, in this order

1. What it is — one paragraph a non-specialist understands
2. The problem it solves — in Kenyan operational terms
3. Who it is for — industries, fleet sizes, vehicle types
4. How it works — 4–6 concrete steps
5. What you get — features grouped and explained, not bulleted flatly
6. Hardware options — the actual products that deliver it
7. Installation and support — what happens, where, how long
8. Coverage — where Nebsam can install and support it
9. FAQs — 6–10 real questions, marked up as `FAQPage`
10. Related — solutions, products, industries, articles
11. Conversion block — WhatsApp / quote / call

Written for a fleet manager who is technical about vehicles and not about software.

### 1.2 Product page model — merged, two readers

`/products/[slug]` is canonical and carries everything: specification, features, use cases,
compatibility, installation, price and add-to-cart. There is no separate commercial page.

It serves a fleet manager researching capability **and** a buyer ready to pay, without becoming a
mess: decision-useful summary and price above the fold, deep specification below it. **The
specification is never in a client-only tab** — that is the crawlability failure this rebuild exists
to fix.

Where no price is confirmed the page shows **"Request price"** with a WhatsApp CTA in place of
add-to-cart. Same page, different action. Never a placeholder number.

---

## 2. Source-document → page mapping

Status key: **Final** = ready to migrate · **Enrich** = usable, needs the noted addition ·
**Derive** = no source document, assembled from the products listed · **Blocked** = cannot be built
until a register item closes.

### 2.1 Solutions

| # | Page | Source | Status | Notes |
|---|---|---|---|---|
| S1 | `/solutions/vehicle-tracking` | **none** — derive from the 7 tracker write-ups | **Derive** | The #1 target intent and the 301 target for `/services/car-tracking`. Strong derivation: 7 write-ups, 247–297 lines each |
| S2 | `/solutions/vehicle-security` | **none** — derive from the 5 car-alarm write-ups + anti-jammer tracker | **Derive** | 301 target for `/services/car-alarms`. Strong derivation: 354–652 lines each |
| S3 | `/solutions/vehicle-recovery` | **none** — derive from `trackers/recovery-tracker` | **Derive** | Hardware story is solid. **The recovery *service* is undocumented** — no response procedure, no team, no response time. Tokenise; never invent a response time |
| S4 | `/solutions/fuel-monitoring` | `01-solutions/fuel-monitoring/write-up.md` (737 lines) | **Enrich** | Enrich from the 2023 proposal. Do **not** carry the "90% reduction" vendor claim (C01). Bill of materials unconfirmed (C02, C03) |
| S5 | `/solutions/ai-video-telematics` | `01-solutions/ai-video-telematics/write-up.md` (681 lines) | **Enrich** | Correct "KEBS accredited" → Permit to Use the Standardization Mark (B01). Do **not** reintroduce the NTSA transmission claim (B02, V01). Hardware spec is client-supplied and unverified (B03) |
| S6 | `/solutions/school-bus-management` | `01-solutions/school-bus-management/write-up.md` (483 lines) | **Blocked** | Highest legal sensitivity on the site. 8 open items (V17–V24). Delete the SOURCE NOTES block before publication. Legal review before launch |
| S7 | `/solutions/speed-governors` | `01-solutions/speed-governors/write-up.md` (498 lines) | **Blocked** | IRMS wording pending (V02). Write without IRMS rather than guess |
| S8 | `/solutions/container-e-seal` | `01-solutions/container-e-seal/write-up.md` (525 lines) | **Final** | **Receives the ECTS 301.** Title and H1 must carry "Electronic Cargo Tracking System (ECTS)" — see `ROUTE_MAP.md` |
| S9 | `/solutions/radio-communication` | `01-solutions/radio-communication/write-up.md` (564 lines) | **Final** | Hedge "unlimited range" as bounded by network coverage. Per-model specs live on the product pages |
| S10 | `/solutions/vehicle-key-programming` | `01-solutions/vehicle-key-programming/write-up.md` (559 lines) | **Final** | Service delivered in branch |
| — | `/solutions/fleet-management` | **none** | **Deferred past launch** | No source describes the Nebsam platform as a product. Also blocked on V13 (platform screenshots) — the same evidence `/platform` needs |
| — | `/solutions/asset-tracking` | **none** | **Deferred past launch** | Recovery Tracker names containers, machinery, generators, agricultural and heavy equipment, so the hardware fits, but the operational context is absent |

**Ten solutions at launch.** The two deferred are recorded as post-launch scope in
`docs/SPRINT_PLAN.md`, not dropped.

### 2.2 Products — trackers

| Page | Source | Status | Notes |
|---|---|---|---|
| `/products/standard-tracker` | `trackers/standard-tracker` (294 ln) | **Final** | **Confirmed name.** The brochure's "Basic Tracker" is retired. Local + international variants. Brochure claims "Mobile App" and "No credit top up" not in the write-up (A04, A05) |
| `/products/bluetooth-tracker` | `trackers/bluetooth-tracker` (276 ln) | **Final** | Anti-jamming + Smart Bluetooth ignition |
| `/products/anti-jammer-tracker` | `trackers/anti-jammer-tracker` (247 ln) | **Final** | Optional microphone integration |
| `/products/hybrid-tracker` | `trackers/hybrid-tracker` (281 ln) | **Final** | 4 security layers. Brochure adds "Mobile App", "Global Tracking", "No Credit Top up" — none in the write-up (A01–A03). **A02 is material**: international operation would be a significant selling point |
| `/products/hybrid-pro-tracker` | `trackers/hybrid-pro-tracker` (275 ln) | **Final** | 5 security layers |
| `/products/hybrid-pro-max-tracker` | `trackers/hybrid-pro-max-tracker` (290 ln) | **Final** | 6 security layers, KIPI registered — describe as an **intellectual property registration**, never "KIPI certified". Strip the unpublishable superlatives |
| `/products/recovery-tracker` | `trackers/recovery-tracker` (297 ln) | **Final** | Magnetic, portable, IP65, up to 3 years at one fix/day. Brochure claims "Playback" (A06) — clarify what it means on a once-daily device |

### 2.3 Products — car alarms

| Page | Source | Status | Notes |
|---|---|---|---|
| `/products/hybrid-car-alarm` | `car-alarms/hybrid-car-alarm` (354 ln) | **Final** | **Confirmed name** — not "Hybrid Alarm". Brochure claims an optional Hybrid Tracker bundle (A07) — **a pricing and bundling claim**, must resolve before Sprint 7 |
| `/products/hybrid-plus-car-alarm` | `car-alarms/hybrid-plus-car-alarm` (514 ln) | **Final** | Alarm + GPS |
| `/products/hybrid-pro-plus-car-alarm` | `car-alarms/hybrid-pro-plus-car-alarm` (559 ln) | **Final** | Alarm + anti-jammer GPS |
| `/products/hybrid-promax-car-alarm` | `car-alarms/hybrid-promax-car-alarm` (495 ln) | **Final** | Vibrating key remote |
| `/products/hybrid-promax-plus-car-alarm` | `car-alarms/hybrid-promax-plus-car-alarm` (652 ln) | **Final** | Vibrating key remote + Anti-Jammer GPS. **H1 corrected at source** — the document's heading read "ProMax", its body describes the Plus |

### 2.4 Products — video and systems

| Page | Source | Status | Notes |
|---|---|---|---|
| `/products/hybrid-dashcam` | `video/hybrid-dashcam` (183 ln) | **Enrich** | 4G dual-lens unit. **Distinct product from AI Vehicle Video Telematics** — cross-link the two and answer "which one do I need?", which is a real buying question that will rank. ~18 open spec tokens |
| `/products/ai-video-telematics` | `01-solutions/ai-video-telematics` | **Enrich** | 3-camera Streamax ADAS/DMS system, covered by the KEBS permit. Spec is client-supplied, unverified (B03) |
| `/products/fuel-monitoring-system` | `systems/fuel-monitoring-system` (171 ln) | **Enrich** | Hardware page for sensor + flow meter, distinct from the solution page. ~14 open spec tokens (C02, C03) |
| `/products/speed-governor` | `01-solutions/speed-governors` | **Blocked** | IRMS wording (V02) |
| `/products/container-e-seal` | `01-solutions/container-e-seal` | **Final** | |

### 2.5 Products — radios

Eleven write-ups exist, 119–150 lines each. **~120 of the 190 open verification tokens are here** —
channels, bands, battery capacity, transmit power, IP rating, speaker, display, talk time.

**Launch scope:** the four models with confirmed 2025 prices become full product pages. The other
seven are held as a single "other models — request price" section on
`/solutions/radio-communication` until specifications and prices arrive.

| Model | Price (excl. VAT) | Launch | Notes |
|---|---|---|---|
| Inrico T-521 | **KES 22,000** | **Full page** | + KES 3,000/yr CAK renewal |
| Inrico S-100 | **KES 30,000** | **Full page** | + KES 3,000/yr |
| Inrico S-200 | **KES 30,000** | **Full page** | + KES 3,000/yr |
| Inrico TM-7 | **KES 30,000** | **Full page** | Mobile/base unit. + KES 3,000/yr |
| Inrico T-290 | Request price | Held | **Absent from the 2025 price list** — confirm whether still sold before building at all |
| Inrico DR10 gateway | Request price | Held | PoC + LMR convergence. Whether the KES 3,000 renewal applies is unconfirmed |
| Baofeng BF-888s, UV-5R, UV-9R Plus, UV-82 | Request price | Held | Short-range. **CAK licensing obligation and cost unknown for all five** — a compliance question for the customer, not just a pricing gap |
| Kenwood TK-3000 | Request price | Held | Also: authorised dealer status unconfirmed |

Every priced page must show the **KES 3,000 per device per year CAK renewal next to the price**, not
at checkout. Brief 10.2: an undisclosed recurring cost discovered after purchase destroys the trust
the rest of the site is built to earn.

### 2.6 School Bus — a composite, not a product

Modelled as a **solution with a bill of materials referencing existing products**, so the hardware
pages stay single-sourced: video telematics unit + RFID/biometric attendance terminal + alcohol
breath sensor + twin panic buttons + three software modules.

It never becomes a standalone product page. Whether it appears in the shop at all depends on the
pricing model (V24).

### 2.7 Industries

Derived **only** from industries the source documents actually name — no invented sectors:

logistics & transport · public service vehicles (PSV/matatu) · school transport · car hire & rental ·
construction & heavy equipment · mining · agriculture · fuel & hazardous transport · security
companies · government & institutions · NGOs & humanitarian · corporate fleets · cross-border
transport

Each is a thin-risk page by nature. An industry page earns its place only if it says something
specific about that sector's operations; otherwise it is a link hub and should be honest about it.

### 2.8 Company, trust and pricing — the empty folders

| Folder | State | Needed for | Blocked by |
|---|---|---|---|
| `03-company/` | **empty** | `/about`, `/about/team`, `/about/coverage` | Client must supply about copy, branch descriptions, team names and roles |
| `04-testimonials/` | **empty** | homepage proof, `/about`, solution pages | V15 — the 6 real testimonials with attribution and permission |
| `08-pricing/` | **empty** except the 4 radio prices | every product page | V05 — installation and delivery terms per category |
| `05-certifications/` | README complete | `/about/certifications` | V27–V31 — three registrations expired |
| `06-downloads/` | 4 PDFs prepared | `/resources/downloads` | **All four blocked on content grounds** |

**The download centre has nothing to publish yet.** The four cleaned PDFs are prepared artefacts
awaiting clearance, not a ready set. The recommended path is to **regenerate them from
`content-source/`** rather than redact the Canva originals — the write-ups already have the retired
names corrected, the unpublishable claims removed and the hedging preserved, so re-laying-out a
corrected document is less work than redacting to the same standard and leaves no artefacts.

---

## 3. Migration rules

Applied to every page, enforced by the `nebsam-content` skill checklist:

1. **Never paste a source document verbatim.** They are deck-style, ALL-CAPS and repetitive.
   Sentence case headings; the shouting does not transfer.
2. **Preserve every hedge word for word** — *"according to the configured security logic"*,
   *"subject to network and GPS availability"*, *"where supported by the vehicle"*, *"within the
   supported remote range"*. Rewrite the sentence around the hedge.
3. **Delete every `SOURCE NOTES — NOT FOR PUBLICATION` block** from anything rendered. 19 files in
   `content-source/` carry one.
4. **Never carry a retired name, address, phone number or email** out of a source document.
5. **Never carry an unpublishable claim.** The full list is in `CLAUDE.md` §5.
6. **Every gap becomes a token and a register row.** No plausible text in place of a fact.
7. **Answer-shaped first paragraph** under every question heading.
8. **Every page states who Nebsam is and where it operates** — an assistant may retrieve one page
   with no site context.

## 4. Content operations after launch

Weekly blog cadence, published by non-technical staff, categories mapped to solutions. Seed 8–10
articles in Sprint 9, each linking to its solution and product.

Author profiles carry a real name, role and photo — anonymous "admin" bylines weaken both E-E-A-T and
how an assistant assesses the source (V09).

Definitional content is a deliberate content type, not a by-product: telematics, geofencing,
immobilisation, anti-jamming, fuel siphoning detection, PoC radio, e-seal. Definitions get cited.
