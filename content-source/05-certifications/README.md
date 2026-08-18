# CERTIFICATIONS AND REGISTRATIONS — SOURCE RECORD

Authoritative record of the registrations and permits Nebsam holds, with the exact wording each
must be described in. **Never edit this to make a claim stronger.**

Brief section 3.5 governs this file. Two rules override everything else here:

1. Describe each instrument as a registration or permit **held** — never as an endorsement of
   product quality, and never with invented scope.
2. Where a certificate document is supplied, display it. Where it is not, do **not** illustrate it
   with a generic badge graphic that implies a document exists.

---

## 1. KEBS PERMIT TO USE THE STANDARDIZATION MARK

The strongest third-party proof available to this business. Present it prominently, and present it
accurately.

| Field | Value |
|---|---|
| Instrument | Permit to Use the Standardization Mark, Standards Act (Cap. 496) |
| Mark number | **SM#84618** |
| Granted to | NEBSAM DIGITAL SOLUTION (K) LIMITED *(as written on the permit — see the naming note below)* |
| Commodity | Vehicle cameras for video telematics |
| Brand | **STREAMAX** |
| Standard | **KNWA 3006:2024** — Video telematics system for motor vehicle: Performance Requirements |
| Effective | **26 February 2025** |
| Expires | **26 February 2027** |

### Scope — the trap to avoid

**The permit is product-scoped, not company-scoped.** It covers vehicle cameras for video
telematics under the STREAMAX brand.

- Never present it as certifying Nebsam as a company.
- Never imply it covers trackers, alarms, speed governors, radios or the Hybrid Dashcam.
- Display it on the AI video telematics pages and on the certifications page, with its actual
  scope stated on the face of the page.
- Never use the word **"accredited"**. A permit to use a standardization mark is not an
  accreditation. Existing source material uses "KEBS accredited"; that wording is wrong and is
  logged as item B01 in `docs/CONTENT_AUDIT.md`.

### Expiry

The permit expires **26 February 2027**. Store the expiry date in the CMS and surface a reminder in
admin so the site never displays a lapsed permit. Register item **V16**.

### Naming note

The permit reads "NEBSAM DIGITAL SOLUTION (K) LIMITED" — singular "SOLUTION". The company's
canonical name is **Nebsam Digital Solutions (K) Ltd**, plural (brief PART 1.5 #5). Reproduce the
permit's singular form verbatim **only** where the permit itself is being quoted, and never as the
site's own name.

### Display hazard

The KEBS permit image carries **the unpublished phone number and the administrative email**
(both strings are listed in the SOURCE NOTES at the end of this file, and in brief PART 3.2 —
they are deliberately not repeated here). Neither may be published (brief PART 1.5 #8, PART 3.2).
Before `public/certificates/kebs.jpg` is displayed anywhere, either redact those fields or display
a cropped extract showing only the permit's substantive terms.

---

## 2. KEBS LABORATORY TEST REPORT

A dated, named, third-party laboratory report stating compliance with a specific Kenyan standard.
Almost no competitor will have one on their site. **Confirmed quotable in marketing**
(brief PART 1.5 #17).

| Field | Value |
|---|---|
| Report reference | **BS202445237** |
| Report UID | 20250205171510-V1 |
| Date | **5 February 2025** |
| Standard tested against | KNWA 3006:2024 |
| Result | **Complies** |

### Parameters tested — all recorded as complying

* ADAS camera detection
* Driver alerts
* DSM camera detection
* G-sensor detection
* Power supply — in-built battery sustaining the system for a minimum of 30 minutes
* System tampering detection
* Ignition-triggered power-on

### How to present it

Present the parameters tested and the result, cite the report reference and date, and link to the
document. **Do not paraphrase "Complies" into anything stronger** — not "passed with excellence",
not "exceeds", not "certified safe". The value of this report is that it is dry, specific and
verifiable.

---

## 3. REGISTRATIONS HELD — EXACT WORDING REQUIRED

Each of the following is a registration or permit **held**. None of them is an endorsement of
product quality.

| Registration | Issuing body | Scan in repo |
|---|---|---|
| Registered **Data Controller** | Office of the Data Protection Commissioner, Kenya | `public/certificates/data-controller.jpg` |
| Registered **Data Processor** | Office of the Data Protection Commissioner, Kenya | `public/certificates/data-processor.jpg` |
| **Application Service Provider (AS) licence** | Communications Authority of Kenya (CAK) | `public/certificates/cak.jpg` |
| **Private Security Provider** registration | — `[[NEEDS_VERIFICATION: issuing body for the Private Security Provider registration]]` | `public/certificates/private-security-provider.jpg` |
| **Permit to Use the Standardization Mark** | KEBS | `public/certificates/kebs.jpg` |
| **Intellectual property registration** | KIPI (Kenya Industrial Property Institute) | `[[NEEDS_VERIFICATION: is a KIPI certificate scan available?]]` |

### KIPI — the second trap

KIPI registers **intellectual property**. It is **not** a safety or quality certification. Never
phrase it as "KIPI certified" in a way that implies product approval. The Hybrid Pro Max Tracker
source material refers to KIPI registration; describe it as an intellectual property registration
and nothing more.

---

## 4. IRMS

Nebsam's speed governor system is associated with **IRMS** (brief PART 1.5 #16). Mention only —
there is no functional or code implication.

Misdescribing a national regulatory system damages credibility with exactly the audience that
recognises it, so nothing is published until this is answered:

`[[NEEDS_VERIFICATION: IRMS full name and the correct description of Nebsam's relationship to it]]`

Register item **V02**. Blocks the speed governor page and this certifications page.

---

## 4A. INSPECTION RESULTS — ALL SIX SCANS EXAMINED

Every scan in `public/certificates/` was opened, viewed and OCR-scanned. **The headline finding is
not a privacy one: three of the six certificates have already expired.**

| File | Instrument | Unpublished phone | Admin email | Status at 18 Aug 2026 |
|---|---|---|---|---|
| `kebs.jpg` | Permit SM#84618 | **PRESENT** `0727727461` | **PRESENT** | Valid to 26 Feb 2027 |
| `cak.jpg` | CAK Compliance Certificate, serial 04-00274-00-09-0372 | no | no | **EXPIRED 30 Jun 2025** |
| `data-controller.jpg` | ODPC registration, serial 05634, ID 693-059B-EEB9 | no | no | **EXPIRED 27 May 2026** |
| `data-processor.jpg` | ODPC registration, serial 05626, same ID | no | no | **EXPIRED 27 May 2026** |
| `private-security-provider.jpg` | PSRA reg. PSRA/NDSKL/19/00, issued 28 Jun 2024 | no | no | 5-year term to 2029, **subject to annual renewal — status unknown** |
| `installation.jpg` | Blank specimen installation certificate | no (field blank) | no | n/a |

**Brief section 3.5 requires that the site never displays a lapsed permit. Three already are.**
Renewal is an operations task that blocks the certifications page.

### `installation.jpg` — cleared of the feared exposure

`docs/ASSET_MAP.md` warned this might be a real certificate exposing a customer name, plate and
phone number. **It is not.** Every field is a blank dotted line — vehicle registration, make, body
type, chassis, IMEI, phone, issued-to, ID number, telephone and both dates. No customer data.

It carries three lesser problems instead: the technician's first name **"DENNIS"** is printed on
it; the header and stamp carry third-party **"GPS Vehicle tracker — Suppliers of GPRS Trackers, Car
Stereo"** branding rather than Nebsam's; and it lists legacy device models (TK 103, 303, TR07,
YB02, OCTO800, OCTO600) that predate the confirmed product names.

Its serial number format is **P051510924U/2007**, and it states the installation is "valid for
1 year" — both directly relevant to register item **V04** and to the certificate-verification
threat model in brief PART 9.2.

### `kebs.jpg` — five exposures, not the two anticipated

Beyond the phone number and email, the permit image also shows the postal address (P.O. Box 82436),
the physical address (Ronald Ngala Street, Plot No. 810/XVI/MI, Mombasa), a **handwritten signature**
of the Managing Director/Authorized Officer, and a **QR code** whose encoded contents have not been
read. A published signature image is a forgery risk that should be weighed on its own.

### Recommendations — no image has been altered

| File | Recommendation |
|---|---|
| `kebs.jpg` | **CROP** to the right-hand column (mark number, effective, expiry, issue date) plus rows 1–4 (mark, commodity, brand, standard). Drop the entire contact block and the signature |
| `cak.jpg` | **EXCLUDE** until renewed |
| `data-controller.jpg` | **EXCLUDE** until renewed, then **REPLACE** with the current certificate |
| `data-processor.jpg` | **EXCLUDE** until renewed, then **REPLACE** |
| `private-security-provider.jpg` | **CROP** to remove the named official and signature; publish only once the annual renewal is confirmed |
| `installation.jpg` | **REDACT** "DENNIS" and resolve the third-party branding — or better, **REPLACE**. The design is dated clip-art and carries another company's logo |

### Two by-products of the inspection

**The PSRA issuing body is now known** — Private Security Regulatory Authority, Ministry of Interior
and National Administration, Office of the President, under Section 28 of the Private Security
Regulation Act No. 13 of 2016. This closes the open question in section 3 above.

**Four of the five government registrations spell the company singular** — "NEBSAM DIGITAL SOLUTION
(K) LIMITED" appears on the KEBS permit, both ODPC registrations and the PSRA certificate. Only the
CAK certificate uses the plural. That is strong evidence for register item **V26** that the
registered legal name is singular, and that legal pages need the singular form even though
marketing uses "Solutions".

**The CAK document is not a licence.** It states on its face: *"Please note that this is not a
licence but proof of compliance."* Brief section 3.5 describes it as an "Application Service
Provider (AS) licence". Correct the description before publication.

---

## 5. CERTIFICATE SCANS — PRIVACY SWEEP REQUIRED

Six scans exist in the repository at `public/certificates/`. **Every one must be inspected before
display**, for the unpublished phone number and the administrative email — both strings are given
in the SOURCE NOTES at the end of this file.

| File | Status |
|---|---|
| `kebs.jpg` | **Known to carry both.** Redact or crop before display |
| `cak.jpg` | Inspect for contact details |
| `data-controller.jpg` | Inspect |
| `data-processor.jpg` | Inspect |
| `private-security-provider.jpg` | Inspect |
| `installation.jpg` | **Highest risk.** If this is a real certificate rather than a blank specimen it may show a customer name, vehicle plate and phone number — and it currently sits in a public folder on a live site. Inspect first |

See `docs/ASSET_MAP.md` for the full privacy sweep.

---

# SOURCE NOTES — NOT FOR PUBLICATION

*Compiled from brief PART 3.5, which records the KEBS permit and laboratory test report as verified
documentation, and from client-supplied detail. This block is for the project team and must be
deleted before the content is published. Claude Code: read this section, act on it, do not render it.*

## Provenance

The permit and laboratory report figures in sections 1 and 2 are corroborated by two independent
sources: the client's own statement of them, and brief PART 3.5, which presents them as verified.
They do not carry the provenance caveat that applies to the AI video telematics hardware
specification (item B03 in `docs/CONTENT_AUDIT.md`).

The underlying documents themselves — the permit and the laboratory report — are **not in the
repository**. Only the KEBS permit scan at `public/certificates/kebs.jpg` is present.

`[[NEEDS_VERIFICATION: obtain the KEBS laboratory test report BS202445237 as a document, for the download centre and for the certifications page link]]`

## The two strings that must never reach a rendered page

Recorded here, inside the non-publishable block, so that the body of this file stays clean and the
build-time check in brief section 3.2 has nothing to trip over:

- Unpublished phone number: **+254 727 727 461** — appears on the KEBS permit and in the fuel
  monitoring proposal. Brief PART 1.5 #8: not published, anywhere, in any form.
- Administrative email: **nebsam3kenya@gmail.com** — brief PART 3.2: administrative only, not for
  publication. The published addresses are `onlinesales@nebsamdigital.com` and
  `info@nebsamdigital.com`.

Both are visible in `public/certificates/kebs.jpg`. Redaction of that image is a prerequisite for
displaying it.

## Items requiring verification

1. `[[NEEDS_VERIFICATION: IRMS full name and relationship]]` — register item V02.
2. `[[NEEDS_VERIFICATION: issuing body for the Private Security Provider registration]]`
3. `[[NEEDS_VERIFICATION: is a KIPI certificate scan available?]]` — if not, do not illustrate it with a badge.
4. `[[NEEDS_VERIFICATION: KEBS laboratory test report as a document]]`
5. `[[NEEDS_VERIFICATION: registration numbers and expiry dates for the data controller, data processor, CAK and private security provider registrations]]` — only the KEBS permit currently has a recorded number and expiry. The others need the same treatment so the CMS can track renewals.
6. `[[NEEDS_VERIFICATION: DPO / data protection contact details]]` — register item V11, required in the privacy policy given the registered data controller and processor status.

## Build-time check

Brief section 3.2 asks for a build-time check that fails the build if the unpublished phone number
or any retired address string appears in rendered output. This page is one of the most likely places
for that regression, because the certificate images themselves contain the number. The check must
cover rendered text; the images need the separate redaction pass described in section 5 above.
