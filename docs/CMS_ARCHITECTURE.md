# CMS ARCHITECTURE

Admin information architecture, roles and editor workflows.

**A non-technical staff member must run this site without a developer.** That is a design
requirement, not an afterthought. Brief PART 25 names "an admin a non-technical person quietly
abandons, killing the blog" as a project-failure mode — the admin's quality determines whether the
weekly blog cadence actually happens.

The Sprint 9 gate is literal: **a non-technical user publishes a post unaided.** Not "is shown how
to". Unaided.

---

## 1. Information architecture

```
/admin
  Dashboard            what needs attention today
  Content
    Solutions · Products · Industries · FAQs
    Blog  → Posts · Categories · Authors
    Downloads
    Homepage featured slots
  Shop
    Products (same records as Content → Products, commercial view)
    Categories · Prices · Availability
  Orders
    Pipeline · Detail · Export
  Inbox
    Contact · Quote · Demo · Installation · Suggestions
  Trust
    Testimonials · Certifications · Client logos · Partners
  Operations
    Installation certificates (CSV import) · Branches · Coverage locations
  Media library
  Settings
    Users & roles · Site settings · Audit log
```

**Products appear in two places and are one record.** Content → Products is the editorial view
(specs, features, body); Shop → Products is the commercial view (price, availability, featured). The
pages are merged (`SHOP_ARCHITECTURE.md` §1) and so is the data — two views of one row, never two
rows. A staff member editing a price must never wonder whether there is another copy.

### 1.1 The dashboard earns its place or it goes

It shows only things requiring action:

- Submissions awaiting response, oldest first
- Orders in `new` or `contacted`
- **Certifications expiring within 90 days** — three are already expired (V27–V29), and this is the
  mechanism that stops that recurring
- Content in `in_review`
- Scheduled posts due in the next 7 days
- **Verification attempt spikes** — an enumeration attack looks like traffic unless something counts
- Downloads uploaded but **not cleared for publication**

---

## 2. Roles

| Role | Can |
|---|---|
| `admin` | Everything, including users, settings and the audit log |
| `editor` | Content and shop. **No** settings, no users |
| `sales` | Inbox and orders only |
| `viewer` | Read-only |

**Enforced in Supabase RLS, not merely hidden in the UI.** A hidden button is not a permission —
policies are the boundary and the UI reflects them. Role separation is verified per role in Sprint
12, against the policies rather than the screens.

Admin routes are `noindex, nofollow` and excluded from the sitemap.

---

## 3. Editor experience requirements

These are brief 11.2, and each maps to a specific way a CMS loses its users.

| Requirement | The failure it prevents |
|---|---|
| **Rich text with a constrained toolbar** — no arbitrary HTML, no font or colour pickers | A well-meaning editor breaking the design system one post at a time |
| **Image upload with drag-drop, auto-resize, auto-format, mandatory alt text** | 1.9 MB hero images and empty alt attributes |
| **SEO panel per item** — title, meta description, slug, social image, with **live character counts** | Titles truncating at 60 chars in the SERP, discovered months later |
| **Draft → in review → published**, plus scheduled publishing and unpublish | Half-written posts going live |
| **Preview as it will appear publicly**, before publishing | Publishing to find out what it looks like |
| **Autosave and revision history** | A staff member losing 40 minutes of writing and never returning |
| **Validation with helpful messages**, never a raw database error | `duplicate key value violates unique constraint` shown to a salesperson |
| **Mobile-usable for approvals** | Approvals blocked on someone being at a desk |

Autosave and revision history are not optional polish. Losing work once is usually enough to lose
the user permanently, and the blog dies quietly after that.

### 3.1 Slug discipline

Slugs are permanent. The editor:

- Auto-generates from the title on first save, then **locks**.
- Changing a locked slug requires an explicit action, shows a warning, and **creates a 301
  automatically** — the redirect is not left to someone remembering.
- Warns on collision before save, not after.

### 3.2 The `excl. VAT` and recurring-fee fields

Price entry states clearly that the figure is **VAT-exclusive**. The recurring fee fields
(`recurring_fee_kes`, `_period`, `_note`) sit directly beneath the price, not in a collapsed advanced
section — brief 10.2 requires recurring costs on the product page, and a field nobody sees is a
field nobody fills.

---

## 4. Publishing workflow

```
draft ──▶ in_review ──▶ published
  ▲            │             │
  └────────────┴─── unpublish ┘

scheduled: published_at in the future → goes live automatically
```

Publishing triggers **on-demand revalidation** of the affected routes plus the relevant index and
sitemap. The editor publishes, refreshes, and it is there — no deploy, no waiting out an ISR window.
That immediacy is most of what makes a CMS feel real to a non-technical user.

`llms.txt` regenerates on any change to routes, product names or company facts.

---

## 5. Media library

- Upload with automatic optimisation to AVIF/WebP, resized to the dimensions actually used.
- **Alt text is a required field, `NOT NULL` at the database level.** A nullable column with a
  "required" form field is a rule that lasts until the first hurried upload.
- Dimensions, bytes and MIME recorded on upload; the delivered-size ceiling
  (`PERFORMANCE_BUDGETS.md`) is checked at upload, not at audit.
- **Private bucket, signed URLs.** Extension allowlist and MIME sniffing; extension alone is not a
  check.
- Usage tracking: which content references an asset, so nothing is deleted out from under a page.
- **A privacy prompt on upload** — plates, faces, names, coordinates and device IDs. Brief 3.6
  requires treating every supplied screenshot as suspect until checked, and the upload moment is the
  only point where that check reliably happens.

---

## 6. Operations tooling

### 6.1 Installation certificates — CSV import

The only bulk-data path in the admin, and it touches the most sensitive table on the project.

- CSV maps to plate, registered phone, certificate number, installed date, expiry date.
- **The plate is normalised and HMAC-hashed at import. Plaintext plates are never written to
  `installation_certificates`** (`SECURITY_REQUIREMENTS.md` §1.5).
- Dry-run preview showing row counts, duplicates and malformed rows **before** any write.
- Import is transactional — partial imports do not happen.
- Every import written to `audit_log` with row counts, never row contents.
- Format and source still open — **V04**. The legacy specimen shows a serial format of
  `P051510924U/2007` and a one-year validity, which is the starting assumption.

### 6.2 Certifications

Each record carries `reference_number`, `effective_on`, `expires_on` and a **required**
`scope_note`. The scope field is required because the KEBS permit is **product-scoped, not
company-scoped**, and that scope must appear on the face of the page — brief 3.5 names presenting it
as company-wide as one of three accuracy traps.

Expiry drives both the dashboard reminder and public filtering, so the site cannot display a lapsed
permit even if someone forgets.

### 6.3 Downloads

`cleared_for_publication` defaults **false** and can only be set by a human, with `cleared_by` and
`cleared_at` recorded. Uploading a file does not make it downloadable.

All four prepared PDFs are currently **not cleared** — retired addresses, the unpublished phone
number, retired product names, unsubstantiated claims, third-party branding, undated documents. The
admin must make that state visible rather than letting an uploaded file quietly appear on the site.

### 6.4 Trust records

`testimonials.permission_confirmed` and `client_logos.permission_confirmed` both default false. The
aggregate "70+ corporate clients" claim is approved; naming or logo-ing an individual client is not,
until that client confirms (V12, V15). The public query filters on the flag, so an unconfirmed logo
cannot be displayed by accident.

---

## 7. Inbox

Contact, quote, demo, installation and suggestion submissions in one queue with status, assignment
and internal notes.

- Suggestion attachments are served **only** through short-lived signed URLs to admins, never from a
  public path.
- The anonymous option on suggestions is honoured — anonymous submissions display no contact fields
  and are not linkable to a person.
- Export for follow-up. No PII in any analytics event fired from this surface.

---

## 8. Audit log

Every admin create, update and delete: actor, action, entity, entity id, diff, timestamp.

**Append-only.** No update or delete policy exists for anyone, including admin. A log an
administrator can edit is not a log.

---

## 9. Sprint 9 and 12 gates

**Sprint 9 — the real test.** A non-technical staff member, without assistance, writes and publishes
a blog post with an image and alt text, sets its SEO fields, previews it, and sees it live. If they
need help at any step, that step is redesigned.

**Sprint 12 — staff walkthrough.** A staff member adds a product, changes a price, uploads a
brochure, imports certificates and reads the enquiry inbox. Unaided. Role separation verified per
role against RLS, not the UI.
