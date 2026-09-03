# NEEDS_VERIFICATION REGISTER

Open questions blocking publication. **No public page may ship carrying an unresolved item from this
register.** Add a row whenever a `[[NEEDS_VERIFICATION]]` token is created; close it only when the
client answers, and record the answer here.

Status: `OPEN` · `ANSWERED` · `CLOSED` (answered and applied in the app)

---

## How this register is structured

Sprint 0 reconciled the register against `content-source/` and found **190 unique
`[[NEEDS_VERIFICATION]]` tokens across 219 occurrences**, against 34 rows. Listing 190 rows would
make the register unusable, so it is split in two:

- **Part A — decision and compliance items.** Things only the client, operations or legal can
  answer. Each blocks a named sprint. **This is the part to work through.**
- **Part B — specification gaps.** Hardware facts, grouped by product, answerable in one sitting
  from a supplier datasheet or a stock check. High volume, low individual complexity.

Both must be empty of blockers before launch. Part A is where the risk is.

---

# PART A — DECISION AND COMPLIANCE ITEMS

| # | Question | Why it matters | Owner | Blocks | Status |
|---|---|---|---|---|---|
| V01 | **NTSA data transmission** — what does the video telematics system actually transmit to NTSA, and under what legal obligation? | The 2025 proposal claims traffic sign recognition "transmits data directly to NTSA servers". Publishing an unverified regulatory claim is a credibility and compliance risk. **Page must be written without it until answered.** | Client | Sprint 5 | OPEN |
| V02 | **IRMS** — full expansion and the correct description of Nebsam's relationship to it | Misdescribing a national regulatory system damages credibility with exactly the audience that recognises it | Client | Sprint 5, Sprint 11 | OPEN |
| V03 | **Certificate verification second factor** — Option A (plate + last 4 of registered phone) or Option B (plate + OTP)? | Plate-only lookup discloses which vehicles carry an installation and which have **expired** — a target list for thieves. Brief PART 9.2 | Client | Sprint 11 | OPEN — **built to Option A; ADR-0002 written on answer** |
| V04 | **Certificate data source & format** — CSV import, manual entry, or both? Is the certificate number sequential? | Determines import tooling and whether enumeration hardening is needed on the number as well as the plate. The legacy specimen shows format `P051510924U/2007` and 1-year validity | Client | Sprint 3, Sprint 11 | Sprint 3 **discharged by deferral**, Sprint 11 | OPEN — *import formally deferred to Sprint 11 (2 Sep 2026).* Sprint 3 builds no certificate import tooling, so the schema does not depend on the answer: `installation_certificates` stores `plate_hash` and `certificate_number_last4` regardless of whether numbers arrive by CSV or by hand. The **question stays open** and must be answered before Sprint 11, because whether the certificate number is sequential decides if it needs enumeration hardening alongside the plate |
| V05 | **Installation & delivery terms per product category** — price inclusive of installation, or quoted separately? | Every product page needs a truthful answer; ambiguity generates order disputes | Client | Sprint 6 | OPEN |
| V06 | **Current VAT rate** — confirm 16% at build time | Prices are stored excl. VAT; the displayed rate must be right | Client | Sprint 7 | OPEN |
| V07 | **`info@nebsamdigital.com`** — confirm the address is live and monitored | It is published site-wide and in schema | Client | Sprint 2 | OPEN |
| V08 | **Social media URLs** for each active page | Footer links and `sameAs` schema. **An absent `sameAs` is better than a wrong one** — the field is omitted until supplied, never guessed | Client | Sprint 2 | OPEN |
| V09 | **Blog authors** — real names, roles, short bios, photos | Anonymous bylines weaken E-E-A-T and how LLMs assess the source | Client | Sprint 9 | OPEN |
| V10 | **Google properties** — existing GA4, Search Console and Business Profile, or create new? | Conversion tracking, sitemap submission, and NAP consistency with Business Profile | Client | Sprint 2 | OPEN |
| V11 | **Data protection contact** — name/email to publish in the privacy policy | Required given registered data controller/processor status under DPA 2019 | Client | Sprint 11 | OPEN |
| V12 | **Client logo permissions** — see `docs/CLIENT_PERMISSIONS.md` | Cannot display a client logo or name without permission. **If none are confirmed by Sprint 4, the proof band shows registrations instead of logos** | Client | Sprint 4 | OPEN |
| V13 | **Platform screenshots** — which are Nebsam-branded and cleared for publication? | Some dashboards carry third-party branding; using them as "the Nebsam platform" is misleading and a trademark risk. **Also blocks `/platform` and the deferred `/solutions/fleet-management`** | Client | Sprint 4, Sprint 5 | OPEN |
| V14 | **Consent for footage showing faces and plates** | `Video_Telematics_Proposal_2025.pdf` contains real customer plates, a fleet name, coordinates and two identifiable faces. **The file is not in the repository** — treat as NOT CLEARED on arrival | Client | Sprint 5 | OPEN |
| V15 | **Testimonials** — the 6 real ones with attribution and permission to name | Never invent; nothing publishable until supplied. If unsupplied, the section is absent, not filled | Client | Sprint 11 | OPEN |
| V16 | **KEBS permit renewal** — diary the 26 Feb 2027 expiry | The site must never display a lapsed permit | Nebsam ops | Sprint 11 | OPEN |
| V17 | **School bus: payment gateway** — which gateways are actually supported? M-Pesa? | Do not imply M-Pesa support unless confirmed | Client | Sprint 5 | OPEN |
| V18 | **School bus: biometric availability** — which of face/fingerprint/iris are deployed and priced today vs roadmap? | Cannot advertise a capability that is not shipping | Client | Sprint 5 | OPEN |
| V19 | **School bus: alcohol sensor spec** — type, threshold, calibration interval; evidential or indicative? | Must not present a screening device as a legal test | Client | Sprint 5 | OPEN |
| V20 | **School bus: driver facial verification fallback** — what happens on a false negative? | A false negative strands a bus full of children; the page must describe the real procedure | Client | Sprint 5 | OPEN |
| V21 | **School bus: retention periods** for in-bus video, attendance records and biometric templates | Children's biometric data is sensitive personal data under DPA 2019; retention must be stated | Client + legal | Sprint 5, Sprint 11 | OPEN |
| V22 | **School bus: proximity alert timing** — configurable? default? | The proposal gives "approximately five minutes" as an example only | Client | Sprint 5 | OPEN |
| V23 | **School bus: reference schools** for a testimonial or case study | Strongest possible proof for this product | Client | Sprint 5 | OPEN |
| V24 | **School bus: pricing model** — per bus, per student, per term, per module? Is the parent app free? | Determines whether this appears in the shop or is enquiry-only | Client | Sprint 5 | OPEN |
| V25 | **Search Console URL cross-check** — indexed URLs absent from the current sitemap | Missing one from the 301 map loses its ranking permanently. **Sprint 0 proved the sitemap incomplete by at least one live route** (see V34a), so it cannot be trusted as the full inventory | Client | **Sprint 2 cannot close** | OPEN |
| V26 | **Registered legal name** — four of five government registrations read "SOLUTION" singular; only CAK uses "Solutions" | Client confirmed "Solutions" for site use; legal pages may still need the registered form | Client | Sprint 11 | ANSWERED (use "Solutions"; legal pages pending) |
| V27 | **CAK Compliance Certificate has EXPIRED** — valid to 30 June 2025 | Brief 3.5 requires the site never displays a lapsed permit | Nebsam ops | Sprint 11 | OPEN |
| V28 | **ODPC Data Controller registration has EXPIRED** — valid 27/05/2024 to 27/05/2026 | Registered data controller status underpins the privacy policy and the whole DPA 2019 posture. A lapsed registration is a compliance problem, not just a display one | Nebsam ops | Sprint 11 | OPEN |
| **V28a** | **The canonical company description asserts ODPC registration — and ships in Sprint 2** | *Raised Sprint 0.* The description in `lib/company.ts` states Nebsam "is a registered Data Controller and Data Processor". It is published verbatim to the footer, About, `llms.txt` and every page's `Organization` schema **from Sprint 2** — six sprints before the certifications page. **Client has confirmed renewal is in hand and the sentence ships.** Because it lives in exactly one constant, if renewal slips the correction is one line rather than a rewrite across every page | Nebsam ops | **Sprint 2 cannot close** | OPEN — client decision recorded 18 Aug 2026 |
| V29 | **ODPC Data Processor registration has EXPIRED** — valid 27/05/2024 to 27/05/2026 | As V28 | Nebsam ops | Sprint 11 | OPEN |
| V30 | **PSRA registration — is the annual renewal current?** Issued 28/06/2024 for a five-year term "subject to annual license renewal" | The five-year term is conditional | Nebsam ops | Sprint 11 | OPEN |
| V31 | **CAK document is described wrongly in the brief** — it states on its face "this is not a licence but proof of compliance", but brief 3.5 calls it an "Application Service Provider (AS) licence" | Publishing an inaccurate description of a regulatory instrument is exactly the credibility error brief 3.5 exists to prevent | Client | Sprint 11 | OPEN |
| V32 | **Technician name "DENNIS" printed on `public/certificates/installation.jpg`** | A staff member's name on a public-folder asset | Client | Sprint 11 | OPEN |
| V33 | **Third-party "GPS Vehicle tracker" branding on `installation.jpg`** | Another company's logo on a Nebsam certificate specimen — trademark and accuracy risk | Client | Sprint 11 | OPEN |
| V34 | **KEBS permit image carries a Managing Director signature and an unread QR code** | A published signature image is a forgery risk; the QR contents are unknown. Crop both out | Client | Sprint 11 | OPEN |

### New items raised in Sprint 0

| # | Question | Why it matters | Owner | Blocks | Status |
|---|---|---|---|---|---|
| **V34a** | **`/services/electronic-cargo-tracking-system` was missing from every URL inventory** | A live route with its own canonical, `Service` schema, OG image and ~20 images, absent from `public/sitemap.xml`, `content-source/07-legacy-site/indexed-urls.txt` and brief PART 7.0. **Resolved:** 301 → `/solutions/container-e-seal`, with "ECTS" carried into the destination title and H1. Recorded so the near-miss is not forgotten — and as the reason V25 is mandatory | — | Sprint 2 | **CLOSED** — 301 added to `ROUTE_MAP.md` §2.2 |
| **V35** | **Two wrong-domain email addresses are live** — `info@nebsam.com` and `support@nebsam.com` (`ContactUs.js:194–195`), plus `support@nebsamdigital.com` (`:245`) which brief 3.3 does not list | Brief 3.3 verifies only `onlinesales@` and `info@nebsamdigital.com`. Two live addresses are on a domain Nebsam does not appear to control and are collecting nothing. **Is `support@nebsamdigital.com` real and monitored?** | Client | Sprint 2 | OPEN |
| **V36** | **Founding year** — `Footer.js:16` says "since 2015"; no founding year appears in the brief or anywhere in `content-source/` | "Over 10 years" is approved, but the specific year is unverified and the About page will want it. Never publish a specific year that cannot be evidenced | Client | Sprint 4 | OPEN |
| **V37** | **Logo variants and an SVG** — the master asset is a 625 KB PNG with the plaque background baked into the artwork | Only the corners are transparent. **The logo cannot be placed on a dark surface** until a mono/transparent variant exists, which constrains the header design. Needs: SVG, horizontal, stacked, mono white, mono dark, favicon source | Client | Sprint 1 | OPEN |
| **V38** | **Off-machine backup of `_inbox/`** | `_inbox/` and `media-source/` are gitignored, as are the cleaned download PDFs. Every original source `.txt` and all four original PDFs (49.6 MB) exist **only on this machine, in no commit**. The extracted write-ups would survive a drive failure; the raw originals would not | Client | — (standing risk) | OPEN |
| **V39** | **Named sprint approver** | Every gate in `docs/SPRINT_PLAN.md` says "human approves" without naming who | Client | Every gate | OPEN |
| **V40** | **Target launch date** | No date exists against which to flag an at-risk sprint | Client | Sequencing | OPEN |

### Raised in Sprint 1

| # | Item | Why it matters | Owner | Blocks | Status |
|---|---|---|---|---|---|
| **V41** | **Fonts are still not preloaded** | Two woff2 files are fetched (Archivo 90 KB, IBM Plex Mono 10 KB) and the display headline is the likely LCP element. **Sprint 2 finding: setting `preload: true` explicitly on both `next/font` calls did NOT emit a preload link.** The fonts are reached only through CSS `@font-face`, so they are discovered after CSS parses. Likely needs a manual `<link rel="preload" as="font" crossorigin>` in the layout head against the hashed filename, which is awkward because the hash changes per build. Costs LCP on exactly the connection profile the audience is on | Claude | Sprint 14 | OPEN |
| **V42** | **No mobile navigation** | Built in Sprint 2. Focus-trapped panel, Escape to close, focus restored to the trigger, `aria-expanded`/`aria-controls`, background scroll locked, 44px targets. Verified in the browser | Claude | — | **CLOSED** |
| **V43** | **Next.js transitive advisories remain** — `postcss` inside Next's own tree, and `sharp` <0.35 | The critical RCE was cleared by moving to 15.5.23. The two remaining highs only clear via **Next 16**, a breaking major that PART 2.5 says is not taken unilaterally. Decide whether to schedule the Next 16 upgrade before launch | Client | Sprint 14 | OPEN |
| **V46** | ~~Database types hand-written~~ **CLOSED 2 Sep 2026** | *Raised Sprint 3.* Resolved in full. Migrations applied; `types/database.ts` is now genuine `supabase gen types` output (2,207 lines, 30 tables, 17 views, 7 enums) regenerated by `npm run db:types`. Derived aliases moved to `types/content.ts` so regeneration never clobbers them. **A gap found while closing this:** neither Supabase client was parameterised with `Database`, so every query returned `any` and the row types were unchecked casts — the generated types would have been decorative. Both clients now take the generic, proven by a negative test: `tsc` rejects a query against a non-existent table. `SUPABASE_ACCESS_TOKEN` is local-dev only and documented in `.env.example` | Client | — | **CLOSED** |
| **V48** | **Does Nebsam operate a stolen-vehicle recovery service, and on what terms?** | *Raised Sprint 5.* The slug `vehicle-recovery` invites the reading that Nebsam recovers stolen vehicles. `content-source/02-products/trackers/recovery-tracker` describes only the HARDWARE — a portable magnetic tracker for stolen vehicle recovery and asset protection. Whether a recovery **service** exists, who attends, how it is escalated, whether police coordination is included, what hours it runs and what it costs are all unestablished. **The page is written to say plainly that the tracker supports a recovery rather than performing one**, and that sentence must not be softened into an implied promise by a later edit. This is the highest-consequence gap on the site after the school bus: a customer would rely on the answer at the worst moment of their year. Needed before any recovery service is described anywhere | Client | Sprint 5 shipped without it; blocks any recovery-service claim | OPEN |
| **V47** | **Homepage LCP misses the mobile budget by 378 ms** — 2.878 s against ≤ 2.5 s | *Raised Sprint 4.* Everything else in the budget passes: Lighthouse mobile 95 / 100 / 96 / 100, CLS 0.012, TBT 80 ms, page weight 274 KB. **The trace records observed LCP at 237 ms, identical to FCP** — the largest element paints immediately and there is no real late paint. The 2.878 s is Lighthouse's simulated mobile model (1.6 Mbps, 562 ms latency, 4x CPU) charging for the whole critical path: **105 KB JS + 100 KB fonts**. That is why LCP tracked TTI exactly and did not move across four separate interventions. Closing it needs critical-path bytes removed, and both routes are decisions rather than fixes: (a) the **90 KB Archivo variable font**, whose width axis is ADR-0002's "one superfamily separated by optical width" — static instances would cut bytes but reopen that decision, and with four weight/width combinations in use may not actually be smaller; (b) the **105 KB JS**, largely the React/Next floor plus four client components. **Client accepted the miss and directed that Sprint 4 proceed** (2 Sep 2026). Note the hero currently ships with no photography — adding it moves this further out, so the decision should be taken together with the hero asset | Client + Claude | Sprint 14 | OPEN — accepted for Sprint 4 |
| **V45** | **The OG share image is 225×225, not 1200×630** | *Raised Sprint 2.* `public/images/site-og-image.png` is a 6.6 KB square, verified by decoding it. The metadata now declares the **actual** dimensions rather than the intended ones, because declaring 1200×630 for a 225×225 file is metadata contradicting the asset. Consequence: the Twitter card degrades to `summary` because the image is below the 300×157 minimum for a large card. Supply a real 1200×630 image (already on the `ASSET_MAP.md` shot list) and the card type flips back automatically | Client | Sprint 4 | OPEN |
| **V44** | **Disabled control styling uses an opacity multiplier** — 2.11:1 | WCAG 1.4.3 exempts inactive components so this is legal, but it is poor. Give disabled explicit tokens when forms ship | Claude | Sprint 2 | OPEN |

---

# PART B — SPECIFICATION GAPS

**190 unique tokens, 219 occurrences.** These are hardware facts, not decisions. Most are answerable
from a supplier datasheet, a stock check or a single conversation with the technical team.

Grouped by source file, with the unique-token count in each. Full text of every token is in the
`SOURCE NOTES` block of the file named.

## B1 — Radios (126 tokens across 11 files)

The largest cluster by far, and the reason the launch radio catalogue is limited to four models.

| Model | File | Tokens | Nature of the gaps |
|---|---|---|---|
| Inrico DR10 gateway | `02-products/radios/inrico-dr10-gateway/` | 15 | Android version, RAM/ROM, channels, LMR bands and DMR tiers, power supply, IP rating, speaker, supported cameras, **price**, whether the KES 3,000 renewal applies |
| Inrico S-100 | `02-products/radios/inrico-s-100/` | 14 | Android version, RAM/ROM, screen, camera resolution, channels, cellular bands, speaker, standby/talk time |
| Inrico T-521 | `02-products/radios/inrico-t-521/` | 13 | OS version, RAM/ROM, screen, camera, channels, cellular bands, IP rating, speaker, standby/talk time, installation terms |
| Baofeng UV-82 | `02-products/radios/baofeng-uv-82/` | 12 | Frequency range, transmit power, battery, standby/talk time, speaker, IP rating, display, operating range, **price** |
| Baofeng UV-9R Plus | `02-products/radios/baofeng-uv-9r-plus/` | 12 | Channels, battery, transmit power, standby/talk time, speaker, display, emergency alert behaviour, operating range, **price** |
| Inrico TM-7 | `02-products/radios/inrico-tm-7/` | 12 | Channels, screen, cellular bands, optional camera spec and price, backup battery, installation and antenna fitting |
| Kenwood TK-3000 | `02-products/radios/kenwood-tk-3000/` | 12 | Battery, standby/talk time, IP rating, speaker, display, operating range, VHF variant, **price**, **authorised dealer status** |
| Baofeng BF-888s | `02-products/radios/baofeng-bf-888s/` | 11 | Transmit power, battery, standby/talk time, IP rating, speaker, operating range, **price**, **CAK licensing for short-range** |
| Baofeng UV-5R | `02-products/radios/baofeng-uv-5r/` | 10 | Frequency range, battery, standby/talk time, IP rating, speaker, LCD, **price** |
| Inrico T-290 | `02-products/radios/inrico-t-290/` | 9 | Channels, screen, cellular bands, talk time, **price — and whether the model is still sold at all** |
| Inrico S-200 | `02-products/radios/inrico-s-200/` | 6 | Channels, cellular bands |

**Three of these are more than specification gaps:**

- **CAK licensing for the five short-range models.** The KES 3,000 annual renewal is documented only
  under PoC pricing. Whether frequency radios carry their own licensing obligation, and at what
  cost, is a **compliance question for the customer**, not just a pricing gap. It must be resolved
  before any short-range page is published.
- **The Inrico T-290 is absent from the 2025 price list**, which lists only the T-521, S-100, S-200
  and TM-7. Confirm whether it is still sold. If discontinued, the page should not be built at all —
  but do not infer end-of-life from the omission alone.
- **Kenwood authorised dealer status.** Reselling is fine; implying an authorised dealership that
  does not exist is not.

## B2 — Fuel monitoring (28 tokens across 2 files)

| File | Tokens | Nature of the gaps |
|---|---|---|
| `02-products/systems/fuel-monitoring-system/` | 20 | Sensor model and measurement method, accuracy tolerance, calibration procedure and interval, DFM flow meter model and range, **whether the DFM is standard or optional**, IoT gateway model, supply voltage, IP rating, supported tank shapes/depths/types, sampling interval, installation duration and vehicle downtime, **which Nebsam tracker is supplied with the system** |
| `01-solutions/fuel-monitoring/` | 8 | Bill of materials, installation and calibration cost per vehicle, SMS alert costs, recurring platform subscription |

**Audit item C03 sits under this cluster:** the 2023 proposal describes sensors "attached to the
tanker's surface", which is an unusual description for fuel level measurement, normally done
in-tank. Either the proposal is imprecise or the sensing method is not what the canonical naming
implies. **Clarify before any installation copy is written.**

## B3 — Hybrid Dashcam (19 tokens)

`02-products/video/hybrid-dashcam/` — recording resolution per lens, lens orientation and which two
directions are covered, field of view, low-light and infrared, memory card support and maximum,
supply voltage, power draw, parking-mode battery cut-off, IP rating, dimensions and weight,
**price and recurring cost**, **cloud storage retention and whether it is subscription-based**,
**cabin recording and privacy**, installation terms.

Two are not merely specifications. **Cloud retention** and **cabin recording privacy** are data
protection statements: the page describes what happens to recorded footage of identifiable people,
and under the DPA 2019 that description becomes a public commitment.

## B4 — AI video telematics (9 tokens)

`01-solutions/ai-video-telematics/` — cloud video retention, DMS retention and access, two-way talk
and voice recorder consent and notification, Google Maps integration, guard patrol function.

**Audit item B03 governs this whole file:** `Video_Telematics_Proposal_2025.pdf` is **not in the
repository**, so the recorded hardware specification (720p lenses, 110°/130° viewing angles, Android
8.1, 2GB/32GB, microSD to 256GB, 4G, WiFi, two-way talk, voice recorder) and the ADAS/DMS/DBA lists
were **supplied verbally by the client** and are corroborated by no document. Confirm against the
proposal when it is available.

## B5 — School bus (8 tokens)

`01-solutions/school-bus-management/` — fully mirrored as **V17–V24** in Part A, because every one of
them is a decision or a legal exposure rather than a datasheet lookup. Includes one not obvious from
the V-numbers: **smoking detection** — the admin feature is headed "Alcohol and Smoking Monitoring"
but the body describes only alcohol. Confirm whether smoking detection exists (it is a DMS camera
feature on the video telematics product) and describe it accurately or drop it.

## B6 — Certifications and downloads (14 tokens across 2 files)

| Item | Status |
|---|---|
| IRMS full name and relationship | **V02** |
| Issuing body for the Private Security Provider registration | **CLOSED by inspection** — Private Security Regulatory Authority, Ministry of Interior and National Administration, under s.28 of the Private Security Regulation Act No. 13 of 2016 |
| Is a KIPI certificate scan available? | OPEN — if not, do **not** illustrate it with a badge implying a document exists |
| KEBS laboratory test report BS202445237 as a document | OPEN — needed for the download centre and the certifications page link |
| Registration numbers and expiry dates for the data controller, data processor, CAK and PSRA registrations | OPEN — only the KEBS permit has a recorded number and expiry; the others need the same so the CMS can track renewals |
| DPO / data protection contact | **V11** |
| Which images in the brochure and school bus proposal are AI-generated | OPEN — both source files declared the flag |
| Dates and version numbers for the brochure and school bus proposal | OPEN — both undated; a sales proposal with no date cannot go in a download centre |
| Locate `Video_Telematics_Proposal_2025.pdf` | **V14** |
| Client permission to publish the ~70-name list | **V12** |
| Whether the download centre should serve these proposals at all, or regenerated equivalents built from `content-source/` | OPEN — **a decision, not a fact.** Recommendation is to regenerate |

---

## Unpublishable claims — closed, do not reopen

| Claim | Status |
|---|---|
| "Over 10 years of telematics experience" | **APPROVED** — publishable |
| "70+ corporate clients" | **APPROVED** — substantiated by the named client list |
| KEBS laboratory test report may be quoted | **APPROVED** — never paraphrase "Complies" into anything stronger |
| "Trusted by over 50,000 customers across Africa" | **NOT PUBLISHABLE** — unsubstantiated. ⚠️ **Currently live** on `AboutUs.js:138, :173, :196`, including inside `Organization` schema. Hotfix proposed, awaiting authorisation |
| "#1 vehicle theft prevention solution in Kenya" | **NOT PUBLISHABLE** — unsubstantiated superlative |
| "The strongest active vehicle protection system in Kenya" | **NOT PUBLISHABLE** |
| "No way a thief will drive away with your car" | **NOT PUBLISHABLE** — absolute security promise |
| "Decrease fuel theft by 90%" | **NOT PUBLISHABLE** — third-party vendor claim |
| "KEBS accredited" | **NOT PUBLISHABLE** — it is a Permit to Use the Standardization Mark, product-scoped to STREAMAX video telematics cameras |
| Traffic sign recognition "transmits data directly to NTSA servers" | **NOT PUBLISHABLE** — write the section without it, absent rather than hedged |
| "Unlimited distances without interference" (radio) | **REWRITE** — hedge as bounded by network coverage |
| "Out-of-this-world advantages" | **REWRITE** — replace with a capability statement |
