# 06-downloads — DOWNLOAD CENTRE SOURCE FILES

Cleaned copies of the supplied proposals and brochures, prepared for `/resources/downloads`.

**Preparation done:** all document metadata stripped (DocInfo emptied, XMP removed), images
downsampled to 200 DPI at JPEG quality 88, page count and extractable text verified identical to
the originals. Originals remain untouched in `_inbox/` and are gitignored.

**Preparation NOT done:** content clearance. Metadata stripping and compression are mechanical.
Whether a document may be *published* is a separate decision, and **none of these four has passed
it**. See the blockers column and the detail below.

> **Nothing in this folder may be published until its "Cleared for publication" cell is filled in
> by a human.** Per brief 9.4: never publish a document not supplied, and per PART 2.2 the build
> cannot be marked ready to launch while unresolved items exist.

---

## Manifest

| # | File | Title | Description | Document date | Size before | Size after | Reduction | Blockers | **Cleared for publication** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `nebsam-fuel-monitoring-solution-proposal.pdf` | Nebsam Fuel Monitoring Solution | 9-page proposal: how the system works, functions, dashboard, four report types, five alert types, and the corporate client list | 2023 | 1.29 MB | 0.52 MB | 60% | **NOT CLEARED** — 4 blockers | |
| 2 | `nebsam-vehicle-tracking-and-security-brochure.pdf` | Nebsam Vehicle Tracking & Security Brochure | 2-page product brochure covering the Hybrid Dashcam, Hybrid Car Alarm, Hybrid Tracker, Standard Tracker and Recovery Tracker | Undated (file created 26 May 2026) | 4.82 MB | 0.51 MB | 89% | **NOT CLEARED** — 3 blockers | |
| 3 | `nebsam-radio-communication-proposal.pdf` | Nebsam Radio Communication Proposal | 28-page combined document: 2025 long-range PoC radios with pricing, the Inrico DR10 convergence gateway, and 2024 short-range radios | 2025 / 2024 (two sections) | 4.87 MB | 1.72 MB | 65% | **NOT CLEARED** — 2 blockers | |
| 4 | `nebsam-school-bus-solution.pdf` | Nebsam School Bus Solution | 22-page proposal: admin, parent and driver modules, attendance, driver sobriety verification, route management and transport fee collection | Undated (file created 10 Jun 2026) | 38.67 MB | 3.51 MB | 91% | **NOT CLEARED** — 4 blockers | |

**Totals:** 49.65 MB → 6.26 MB (87% reduction). Every file is under the 5 MB ceiling.

---

## Blockers by file

### 1. Fuel monitoring proposal — NOT CLEARED

| # | Blocker | Reference |
|---|---|---|
| 1 | **The unpublished phone number appears twice**, in the header and footer (string listed in SOURCE NOTES) | Brief PART 1.5 #8, audit C04 |
| 2 | **Retired Mombasa addresses** in the header and footer (strings listed in SOURCE NOTES) | Brief PART 1.5 #7, audit C05 |
| 3 | **Third-party platform branding** in the dashboard screenshots — cannot be presented as the Nebsam platform | `docs/ASSET_MAP.md` confirmed exposure, register **V13**, audit C08 |
| 4 | **"Decrease fuel thefts by 90%"** — unsubstantiated vendor claim printed in the document | Brief 4.2 item 4, audit C01 |

Also: names ~70 corporate clients. The aggregate "70+ corporate clients" claim is approved, but
publishing the list names individual clients — permission required per **V12**.

### 2. Vehicle tracking & security brochure — NOT CLEARED

| # | Blocker | Reference |
|---|---|---|
| 1 | **Retired product names**: "Basic Tracker" (now Standard Tracker) and "Hybrid Alarm" (now Hybrid Car Alarm) printed throughout | Brief PART 1.5 #1 and #3, audit A08/A09 |
| 2 | **Wrong tagline**: "We Are The Solutions" instead of "We are the solution." | Brief 3.1, audit A10 |
| 3 | **Source file declared `containsAiGeneratedContent: Yes`** — establish which images are AI-generated before publication | Brief PART 18, audit A11 |

Also carries seven feature claims that conflict with the product write-ups — audit items A01–A07.

### 3. Radio communication proposal — NOT CLEARED

| # | Blocker | Reference |
|---|---|---|
| 1 | **Retired Nairobi and Mombasa addresses** in every page footer (strings listed in SOURCE NOTES) | Brief PART 1.5 #6 |
| 2 | **"Unlimited distances without interference"** — unpublishable claim printed on page 2 | Brief 4.2, NEEDS_VERIFICATION register |

Also names "Safaricom Base Station" in a network diagram and misspells the Motorola trademark as
"Motorolla" in the DR10 section.

### 4. School bus solution — NOT CLEARED

| # | Blocker | Reference |
|---|---|---|
| 1 | **Highest legal sensitivity on the project.** Processes children's personal data, optionally children's biometric data, and driver biometric and alcohol-screening data. Requires legal review before any public distribution | Brief PART 16.1 |
| 2 | **Eight open verification items** in `content-source/01-solutions/school-bus-management/write-up.md` — including biometric availability, alcohol sensor specification, retention periods and the payment gateway | Register **V17–V24** |
| 3 | **Source file declared `containsAiGeneratedContent: Yes`** | Brief PART 18 |
| 4 | **Undated.** A sales proposal with no date or version cannot be published to a download centre | Brief 4.2 item 5 |

---

## The fifth PDF is missing

`docs/ASSET_MAP.md` and brief 3.6 identify **`Video_Telematics_Proposal_2025.pdf`** as carrying the
most serious privacy exposure of any supplied document:

> customer vehicle registrations **KCK 283C** and **KCK 289C**, a fleet group name, device IDs,
> GPS coordinates, and **two clearly identifiable faces** in a vehicle cab

**That file is not in the repository** and therefore has not been processed. It is register item
**V14**, and it must be treated as **NOT CLEARED** on arrival. Publishing those frames without
written consent would be a data protection failure by a registered data controller.

`[[NEEDS_VERIFICATION: locate Video_Telematics_Proposal_2025.pdf and process it through the same pipeline]]`

---

## Metadata removed

Every source file carried template metadata from Canva, including an unrelated author name on all
four and unrelated internal titles on three.

| File | Original title | Original author | After |
|---|---|---|---|
| Fuel monitoring | "Copy of Blue and Purple Casual Corporate App Development Startup Marketing Proposal" | trapp lord | DocInfo empty, XMP removed |
| Brochure | "Blue Professional Consulting Service Brochure" | trapp lord | DocInfo empty, XMP removed |
| Radio | "nebsam radio call proposal" | trapp lord | DocInfo empty, XMP removed |
| School bus | **"Copy of DVR YA MURKOMEN"** | trapp lord | DocInfo empty, XMP removed |

The school bus title is the one brief 4.2 item 6 flags specifically. All four also carried Canva
design-ID keywords, creation and modification timestamps, and two carried the
`containsAiGeneratedContent` flag — all removed from the cleaned copies.

**Note:** the `containsAiGeneratedContent` flag has been removed from the *file metadata*, but the
fact it recorded remains true of the *content*. Removing the flag does not clear the images; it
only stops the flag travelling. Establish which images are AI-generated before publication.

---

## Compression method

Ghostscript `pdfwrite`, images downsampled bicubic to 200 DPI, JPEG quality 88, duplicate images
detected and merged, fonts subset. Metadata then stripped with pypdf: DocInfo dictionary emptied
and the XMP `/Metadata` stream deleted from the document root.

Verified after processing:

- page counts identical — 9, 2, 28 and 22 respectively
- extractable text **byte-identical** to the originals (text is vector, so compression does not touch it)
- pages rendered and inspected for legibility — body text sharp, product photography and diagrams clear
- originals in `_inbox/` unchanged, byte for byte

200 DPI was the highest quality rung tried and every file cleared 5 MB at it, so no file needed
degrading further. If a document is later found to have illegible detail, re-run at a higher DPI —
there is headroom under the ceiling for all four.

---

# SOURCE NOTES — NOT FOR PUBLICATION

*This block is for the project team and must be deleted before the content is published. Claude Code: read this section, act on it, do not render it.*

## The exact strings these documents contain

Recorded here, inside the non-publishable block, so the body of this file stays clean and the
build-time check in brief section 3.2 has nothing to trip over.

- Fuel proposal, header and footer: the unpublished phone number **+254 727 727 461**, and the
  retired addresses **"Kenyatta Ave Near Saba Saba"** and **"Mombasa Along Kenyatta Avenue"**.
- Radio proposal, every page footer: the retired addresses **"NRB-Ngara Equity, Utawala"** and
  **"MSA-Makupa Round-about"**.

These are what a redaction pass must remove. None of them appears in the body of this file or in
any write-up body in `content-source/`.

## What "cleared for publication" requires

The blank column is deliberate. Filling it in means a human has confirmed, for that document:

1. no unpublished phone number or administrative email appears anywhere in it
2. no retired address or retired product name appears in it
3. no unsubstantiated claim from the register appears in it
4. no customer personal data — plates, faces, names, coordinates, device IDs — appears in it
5. any third-party branding in it is either removed or cleared for use
6. any AI-generated imagery in it is identified and permitted under brief PART 18
7. it carries a date and a version

**A document that fails any one of these is not cleared, however good the compression is.** All four
currently fail at least two.

## The practical consequence

Because all four are blocked on content grounds, the honest position is that **the download centre
has nothing to publish yet**. The cleaned files here are the prepared artefacts waiting on
clearance, not a ready download set.

The realistic path to a publishable download is to **regenerate these documents from
`content-source/`** rather than to redact the originals. The write-ups already have the retired
names corrected, the unpublishable claims removed and the hedging preserved. Redacting a Canva
export to the same standard is more work than re-laying-out a corrected document, and it leaves
artefacts.

## Items requiring verification

1. `[[NEEDS_VERIFICATION: locate Video_Telematics_Proposal_2025.pdf]]` — the fifth file, carrying the worst exposure on the project.
2. `[[NEEDS_VERIFICATION: which images in the brochure and the school bus proposal are AI-generated]]` — both source files declared the flag.
3. `[[NEEDS_VERIFICATION: dates and version numbers for the brochure and the school bus proposal]]` — both undated.
4. `[[NEEDS_VERIFICATION: client permission to publish the ~70-name list in the fuel proposal]]` — register V12.
5. `[[NEEDS_VERIFICATION: whether the download centre should serve these proposals at all, or regenerated equivalents built from content-source/]]` — a decision, not a fact.

## Download centre implementation notes

Brief 9.4 requires each item to carry title, type, size, updated date and thumbnail, with download
counts surfaced in admin. The `downloads` table in PART 12 has the fields. Sizes in the manifest
above are post-compression and can seed that table once clearance is granted.

Brief PART 14 sets a 1.0 MB budget for content pages. Three of these four exceed that as downloads
— which is fine, a download is not a page render, but the download centre listing should show file
size before the click so a visitor on mobile data can choose.
