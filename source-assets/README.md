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
