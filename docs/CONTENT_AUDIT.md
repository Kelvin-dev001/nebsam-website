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
| A07 | Hybrid Car Alarm (brochure: "Hybrid Alarm") | "Comes complete with Hybrid Tracker package (optional)" | Not mentioned | A **bundling and pricing claim**, not a feature. It implies a package that the shop must be able to sell and price. Resolve before the product pages are built in Sprint 6 and before commerce goes on them in Sprint 7 | OPEN |

### Retired names used in the brochure

| # | Brochure wording | Canonical | Reference | Status |
|---|---|---|---|---|
| A08 | "Basic Tracker" | **Standard Tracker** | Brief PART 1.5 #1 | OPEN — brochure must be corrected before it is offered as a download |
| A09 | "Hybrid Alarm" | **Hybrid Car Alarm** | Brief PART 1.5 #3 | OPEN — as above |

### Other brochure defects

| # | Finding | Action | Status |
|---|---|---|---|
| A10 | Tagline rendered as "We Are The Solutions" | Canonical tagline is **"We are the solution."** (brief 3.1) | OPEN |
| A11 | PDF metadata declares `containsAiGeneratedContent: Yes` | Establish which images are AI-generated before reuse. Brief PART 18 forbids AI imagery depicting Nebsam staff, premises, vehicles or the platform | OPEN |
| A12 | PDF metadata Title "Blue Professional Consulting Service Brochure", Author "trapp lord" | Strip metadata before publication to the download centre (brief 4.2 item 6) | OPEN |
| A13 | Typo: "Get instant alerts when someone touches your vehicle!!1" | Fix in any rewrite | OPEN |

---

## B. AI Vehicle Video Telematics

| # | Finding | Detail | Status |
|---|---|---|---|
| B01 | **"KEBS accredited" wording** | `content-source/01-solutions/ai-video-telematics/write-up.md` carries a section headed "# KEBS ACCREDITED" stating the product "is **KEBS accredited**". The verified instrument is a **Permit to Use the Standardization Mark**, product-scoped to vehicle cameras for video telematics under the STREAMAX brand. "Accredited" overstates it and implies company-wide scope. Brief section 3.5 and 4.2 item 1 apply. The correct wording is recorded in the appended enrichment section of the same file and in `content-source/05-certifications/README.md`. **The original section has deliberately not been edited** — `content-source/` is authoritative and read-only. Reconcile in the app layer | OPEN |
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
| C03 | **"attached to the tanker's surface"** | Surface attachment is an unusual description for fuel level measurement, which is normally in-tank. Either the proposal is imprecise or the sensing method is not what the canonical naming implies. Clarify before writing installation copy | OPEN |
| C04 | **Unpublished phone number in source** | The proposal carries **+254 727 727 461** twice, in the header and footer. That number must not be published anywhere (brief PART 1.5 #8, PART 3.2). It has not been carried into any file | OPEN — redact before the proposal is offered as a download |
| C05 | **Retired addresses in source** | The proposal gives "Kenyatta Ave Near Saba Saba" and "Mombasa Along Kenyatta Avenue". Both retired; canonical Mombasa address is **Makupa Roundabout, next to Mass Petrol Station** (brief PART 1.5 #7). Not carried into any file | OPEN — redact before download |
| C06 | **Document age** | Dated 2023. Brief 4.2 item 5: do not treat a 2023 proposal as current fact. Specifications, screenshots and any pricing may be stale | OPEN |
| C07 | **Client list** | The proposal names approximately 70 corporate clients. This substantiates "70+ corporate clients" (brief PART 1.5, approved). Naming or logo-ing any individual client still requires that client's permission — see `docs/CLIENT_PERMISSIONS.md` and register item V12 | OPEN |
| C08 | **Third-party platform branding** | Brief 3.6 records that the fuel proposal's dashboard screenshots carry third-party telematics branding rather than Nebsam's. Not usable as "the Nebsam platform" — register item V13 | OPEN |
| C09 | PDF metadata | Title "Copy of Blue and Purple Casual Corporate App Development Startup Marketing Proposal", Author "trapp lord", Producer Canva. Strip before publication | OPEN |

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
