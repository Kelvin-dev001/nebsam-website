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
