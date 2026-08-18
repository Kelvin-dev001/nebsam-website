# NEEDS_VERIFICATION REGISTER

Open questions blocking publication. **No public page may ship carrying an unresolved item from this
register.** Add a row whenever a `[[NEEDS_VERIFICATION]]` token is created; close it only when the
client answers, and record the answer here.

Status: `OPEN` · `ANSWERED` · `CLOSED` (answered and applied in the app)

| # | Question | Why it matters | Owner | Blocks | Status |
|---|---|---|---|---|---|
| V01 | **NTSA data transmission** — what does the video telematics system actually transmit to NTSA, and under what legal obligation? | The 2025 proposal claims traffic sign recognition "transmits data directly to NTSA servers". Publishing an unverified regulatory claim is a credibility and compliance risk. **Page must be written without it until answered.** | Client | Sprint 5 (AI video telematics page) | OPEN |
| V02 | **IRMS** — full expansion and the correct description of Nebsam's relationship to it | Misdescribing a national regulatory system damages credibility with exactly the audience that recognises it | Client | Sprint 5 (speed governors), Sprint 11 (certifications) | OPEN |
| V03 | **Certificate verification second factor** — Option A (plate + last 4 of registered phone) or Option B (plate + OTP)? | Plate-only lookup discloses which vehicles carry an installation and which have **expired** — a target list for thieves. See brief PART 9.2 | Client | Sprint 11 | OPEN |
| V04 | **Certificate data source & format** — CSV import from an existing sheet, manual admin entry, or both? Is the certificate number sequential? | Determines the import tooling and whether enumeration hardening is needed on the number as well as the plate | Client | Sprint 3 (schema), Sprint 11 | OPEN |
| V05 | **Installation & delivery terms per product category** — price inclusive of installation, or quoted separately? | Every product page needs a truthful answer; ambiguity here generates order disputes | Client | Sprint 6 | OPEN |
| V06 | **Current VAT rate** — confirm 16% at build time | Prices are stored excl. VAT; the displayed rate must be right | Client | Sprint 7 | OPEN |
| V07 | **`info@nebsamdigital.com`** — confirm the address is live and monitored | It is published site-wide and in schema | Client | Sprint 2 | OPEN |
| V08 | **Social media URLs** for each active page | Footer links and `sameAs` schema; wrong or missing `sameAs` weakens entity resolution | Client | Sprint 2 | OPEN |
| V09 | **Blog authors** — real names, roles, short bios, photos | Anonymous bylines weaken E-E-A-T and how LLMs assess the source | Client | Sprint 9 | OPEN |
| V10 | **Google properties** — existing GA4 property, Search Console account and Business Profile, or create new? | Conversion tracking and sitemap submission; also NAP consistency with Business Profile | Client | Sprint 2 | OPEN |
| V11 | **Data protection contact** — name/email to publish in the privacy policy | Required given registered data controller/processor status under DPA 2019 | Client | Sprint 11 | OPEN |
| V12 | **Client logo permissions** — see `docs/CLIENT_PERMISSIONS.md` | Cannot display a client logo or name without permission | Client | Sprint 4 (homepage proof band) | OPEN |
| V13 | **Platform screenshots** — which are Nebsam-branded and cleared for publication? | Some existing dashboards carry third-party product branding; using them as "the Nebsam platform" is misleading and a trademark risk | Client | Sprint 4, Sprint 5 | OPEN |
| V14 | **Consent for footage showing faces and plates** | The video telematics proposal contains real customer plates, a fleet name, coordinates and two identifiable faces. Cannot publish without written consent | Client | Sprint 5 | OPEN |
| V15 | **Testimonials** — the 6 real ones with attribution and permission to name | Never invent; nothing publishable until supplied | Client | Sprint 11 | OPEN |
| V16 | **KEBS permit renewal** — diary the 26 Feb 2027 expiry | The site must never display a lapsed permit | Nebsam ops | Sprint 11 | OPEN |
| V17 | **School bus: payment gateway** — which gateways are actually supported? M-Pesa? | Do not imply M-Pesa support unless confirmed | Client | Sprint 5 | OPEN |
| V18 | **School bus: biometric availability** — which of face/fingerprint/iris are deployed and priced today vs roadmap? | Cannot advertise a capability that is not shipping | Client | Sprint 5 | OPEN |
| V19 | **School bus: alcohol sensor spec** — type, threshold, calibration interval; is the reading evidential or indicative? | Must not present a screening device as a legal test | Client | Sprint 5 | OPEN |
| V20 | **School bus: driver facial verification fallback** — what happens on a false negative? | A false negative strands a bus full of children; the page must describe the real procedure | Client | Sprint 5 | OPEN |
| V21 | **School bus: retention periods** for in-bus video, attendance records and biometric templates | Children's biometric data is sensitive personal data under DPA 2019; retention must be stated | Client + legal | Sprint 5, Sprint 11 | OPEN |
| V22 | **School bus: proximity alert timing** — configurable? default? | The proposal gives "approximately five minutes" as an example only | Client | Sprint 5 | OPEN |
| V23 | **School bus: reference schools** for a testimonial or case study | Strongest possible proof for this product | Client | Sprint 5 | OPEN |
| V24 | **School bus: pricing model** — per bus, per student, per term, per module? Is the parent app free? | Determines whether this appears in the shop or as an enquiry-only solution | Client | Sprint 5 | OPEN |
| V25 | **Search Console URL cross-check** — indexed URLs absent from the current sitemap | Missing one from the 301 map loses its ranking permanently | Client | Sprint 2 | OPEN |
| V26 | **Registered legal name** — **four of five government registrations read "SOLUTION" singular** (KEBS permit, both ODPC registrations, PSRA certificate); only the CAK certificate uses "Solutions" | Client has confirmed "Solutions" for site use; legal pages may still need the registered form | Client | Sprint 11 | ANSWERED (use "Solutions"; legal pages pending) |
| V27 | **CAK Compliance Certificate has EXPIRED** — valid to 30 June 2025, lapsed 414 days as at 18 Aug 2026 | Brief 3.5 requires the site never displays a lapsed permit. Renew before the certifications page is built | Nebsam ops | Sprint 11 | OPEN |
| V28 | **ODPC Data Controller registration has EXPIRED** — valid 27/05/2024 to 27/05/2026 | Nebsam's registered data controller status underpins the privacy policy and the whole DPA 2019 posture. A lapsed registration is a compliance problem, not just a display one | Nebsam ops | Sprint 11 | OPEN |
| V29 | **ODPC Data Processor registration has EXPIRED** — valid 27/05/2024 to 27/05/2026 | As V28 | Nebsam ops | Sprint 11 | OPEN |
| V30 | **PSRA registration — is the annual renewal current?** Issued 28/06/2024 for a five-year term "subject to annual license renewal" | The five-year term is conditional. Confirm the annual renewal is paid before publishing the registration | Nebsam ops | Sprint 11 | OPEN |
| V31 | **CAK document is described wrongly in the brief** — it states on its face "this is not a licence but proof of compliance", but brief 3.5 calls it an "Application Service Provider (AS) licence" | Publishing an inaccurate description of a regulatory instrument is exactly the credibility error brief 3.5 exists to prevent | Client | Sprint 11 | OPEN |
| V32 | **Technician name "DENNIS" printed on `public/certificates/installation.jpg`** | A staff member's name on a public-folder asset. Redact or replace before the specimen is displayed | Client | Sprint 11 | OPEN |
| V33 | **Third-party "GPS Vehicle tracker" branding on `installation.jpg`** | Another company's logo on a Nebsam certificate specimen — trademark and accuracy risk | Client | Sprint 11 | OPEN |
| V34 | **KEBS permit image carries a Managing Director signature and an unread QR code** | A published signature image is a forgery risk; the QR contents are unknown. Crop both out | Client | Sprint 11 | OPEN |

## Unpublishable claims — closed, do not reopen
| Claim | Status |
|---|---|
| "Over 10 years of telematics experience" | **APPROVED** — publishable |
| "70+ corporate clients" | **APPROVED** — substantiated by the named client list |
| KEBS laboratory test report may be quoted | **APPROVED** |
| "Trusted by over 50,000 customers across Africa" | **NOT PUBLISHABLE** — unsubstantiated |
| "#1 vehicle theft prevention solution in Kenya" | **NOT PUBLISHABLE** — unsubstantiated superlative |
| "The strongest active vehicle protection system in Kenya" | **NOT PUBLISHABLE** |
| "No way a thief will drive away with your car" | **NOT PUBLISHABLE** — absolute security promise |
| "Decrease fuel theft by 90%" | **NOT PUBLISHABLE** — third-party vendor claim |
| "Unlimited distances without interference" (radio) | **REWRITE** — hedge as network-dependent |
| "Out-of-this-world advantages" | **REWRITE** — replace with a capability statement |
