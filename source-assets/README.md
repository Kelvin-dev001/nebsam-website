# source-assets/ — in the repository, never on the web

Files here are **originals that must not be reachable over HTTP**. Anything in `public/` is served
verbatim to anyone who guesses the URL, and a scan of a regulatory instrument is exactly the kind of
file that gets guessed. These are kept in git so they remain auditable and recoverable; they are
kept out of `public/` so they are not published.

Nothing in this folder is imported by the application. A file becomes publishable only by producing
a **cleared derivative** into `public/` — see `certificates/` below for the one that exists.

---

## certificates/

Six scans, moved out of `public/certificates/` in Sprint 11. Every exposure listed here was found by
the inspection recorded in `content-source/05-certifications/README.md` §4A, which opened and
OCR-scanned all six.

| File | Why it is not in `public/` |
|---|---|
| `kebs.jpg` | Carries the **unpublished phone number** and the **administrative email** — both are retired strings under brief PART 3.2 — plus the postal and physical addresses, a handwritten Managing Director signature, and a QR code whose contents have never been read. `scripts/check-retired-strings.mjs` reads rendered output, so it cannot see a retired string baked into a JPEG. Moving the file is what closes that hole |
| `cak.jpg` | CAK Compliance Certificate, **expired 30 June 2025** (V27). Brief 3.5: never display a lapsed instrument |
| `data-controller.jpg` | ODPC registration, **expired 27 May 2026** (V28) |
| `data-processor.jpg` | ODPC registration, **expired 27 May 2026** (V29) |
| `private-security-provider.jpg` | PSRA registration. Five-year term to 2029 but expressly *subject to annual licence renewal*, and that renewal is unconfirmed (V30). Also carries a named official and a signature |
| `installation.jpg` | Blank specimen installation certificate. Prints the technician's first name (**V32**) and carries a third party's *"GPS Vehicle tracker"* branding and logo on a Nebsam document (**V33**). It also lists legacy device models that predate the confirmed product names |

### The one cleared derivative

`public/certificates/kebs-permit-terms.jpg` — built from `kebs.jpg` in Sprint 11 by
**cropping, not redacting**. It is a composite of four extracts: the permit title and Act, the
"permit is granted to" firm line, the right-hand terms column (mark number, effective, expires,
date of issue), and rows 1–4 (mark, commodity, brand, standard).

Everything else is **absent from the file**, not painted over: the postal address, the physical
address, the telephone number, the email address, the QR code, the signature and the authorised
officer block. A redaction box can be removed; a crop cannot.

Regenerating it is a deliberate act — the crop geometry is recorded in the Sprint 11 report, and the
ink positions were measured from the source rather than eyeballed, so the crop clears the last line
of type by 2 px and stops 26 px above the first stroke of the signature.

### Before any other scan is published

1. The instrument must be **current**. `public_certifications` (migration 0009) filters on
   `expires_on > current_date` and treats a null expiry as not displayable, so a lapsed row cannot
   render even if someone sets an image path on it.
2. The named official and signature must be **cropped out**, for the same forgery reason as KEBS.
3. The replacement scan goes in this folder; only the cleared derivative goes in `public/`.

---

## legacy-public/

**Sprint 14 (6 Oct 2026): 107 files moved out of `public/`**, about 22 MB: everything the old CRA
site served that the new site does not use. Paths are kept, so `public/sr-400.jpg` is now
`legacy-public/sr-400.jpg`, and the move is a git rename: history follows each file.

They left `public/` because anything there is served to anyone who knows the URL, and none of
these is a cleared or converted file:
- **The old product photos** (`sr-*`, `xlr-*`, trackers, cameras, alarms). Kelvin, 4 Oct 2026:
  never use them.
- **Client logos** (`clients/`), with no permission recorded per client (V12).
- **Premises photos** (`images/reception.jpeg`, `showroom.jpeg`, `service-bay.jpeg` and
  others). These show the Mombasa branch. The one in use, the entrance, ships from
  `assets/photos/branches/` through the photo pipeline.
- **Hero backgrounds, banners, an organogram and old share images**, at up to 1.9 MB each,
  unconverted.
- **`africa-mappp.svg`**, whose Kenya outline is copied into `lib/geo.ts`, and `africa-map.svg`.

The audit that chose them read every file in `public/` against the code (app, components, lib,
scripts, the photo manifest) **and** against the database: the migrations and every image column
of the published views. Only one legacy-looking file is referenced: the KEBS crop, which stays (see
`certificates/` above).

**To use one again**, do not move it back. Make a reviewed derivative through
`scripts/images/prepare-photos.py` (ADR-0009), so it ships resized, stripped of metadata and through
next/image.
