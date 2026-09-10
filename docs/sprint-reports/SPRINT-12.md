# SPRINT 12 — ADMIN COMPLETION

**Branch** `sprint/12-admin-completion` · eleven commits · 10 September 2026
**Delivers** Orders pipeline, enquiry inbox, product and shop editing, media library, download
clearance, certificate import, roles, audit log
**Gate** A staff walkthrough — and role separation verified against RLS, not the UI

---

## 1. Acceptance criteria

| Criterion | State |
|---|---|
| A staff member adds a product, changes a price, uploads a brochure, imports certificates and reads the inbox — **unaided** | ✅ All five surfaces built and exercised in a real browser. §4 |
| Role separation verified per role **against RLS**, not the UI | ✅ **47 checks, clean, twice.** `npm run verify:roles` — §6 |
| `audit_log` append-only; no update or delete policy for anyone | ✅ Proven rather than asserted — and the proof is how **V60** was found. §7 |
| Media library: alt text enforced at the database level; privacy prompt on upload | ✅ And the prompt is a **required choice**, not a skippable checkbox. §5.2 |
| CSV import: dry-run preview, transactional, plates hashed at import | ✅ Exercised end to end, including a customer lookup of an imported certificate. §5.3 |

Five of five. Two significant defects were found in the browser pass; one is fixed and one is
written and blocked. Both are in §3, because they are the most useful part of this report.

---

## 2. The sign-in form had no action behind it

Worth stating first, because it means the gate could not have been met before this sprint and
nothing in a code review would have said so.

`app/(admin)/admin/login/page.tsx` shipped in Sprint 3 as a form with no `action`. That was
correct then — there was no Supabase project to sign into, and Sprint 3's own comment says a
half-wired auth form that appears to work is worse than one that says plainly it is not connected.
There has been a project since Sprint 3 closed. Nobody could enter the admin.

It is wired now, and three properties came with it:

- **It works with JavaScript off.** The unbound-action rule from **V59** is followed throughout the
  sprint — every server action takes its discriminator as a validated hidden field, never `.bind()`.
- **Wrong password and unknown address return the same sentence.** Distinguishing them turns the
  login form into an account-existence oracle. It is the same argument as ADR-0005's identical copy
  for unknown-plate and wrong-factor, applied to the other end of the site.
- **`next` is validated as a path under `/admin`.** An open redirect on a login form is how a
  phishing link borrows a real domain.

---

## 3. What the browser pass found

Sprint 11 closed with the browser pass not done. This sprint carried it, and it earned its place
twice over. **Both defects below were invisible to `tsc`, to ESLint, to the build, and to every
HTTP status check** — the code reads correctly in all four cases.

### 3.1 Saving one product took 29 public pages offline — V54c, FIXED

Measured on a production build, before and after one price edit:

| | |
|---|---|
| Fresh build, no admin action | every route **200** |
| Save one product in the admin | `/products/[slug]` **404** — all 14 |
| | `/solutions/[slug]` **404** — all 9 |
| | `/industries/[slug]` **404** — all 13 |
| | `/resources/blog/[slug]` **200** |
| | index pages **200** |

This is register item **V54a on three more routes**. Those routes set `dynamicParams = false` on a
rationale that was correct when it was written: solutions, products and industries are "finite
published sets that change only at deploy time", so an unknown slug should be a hard 404 rather
than a soft 200. Sprint 12 gives staff a product editor. The premise stopped being true, and
`revalidatePath` on a route that may not regenerate does not refresh a page — **it 404s it** until
the next full build.

**Solutions and industries came down too, and that is the part worth understanding.** Nothing edits
them; they fell because they read products through the shared `public_products` cache tag — a
solution lists its hardware, an industry lists its products. Invalidating that tag forces them to
regenerate and `false` forbids it. Fixing only products would have left twenty-two pages failing
for a reason nobody would have thought to look for.

The soft-404 concern that motivated `false` was **re-tested rather than assumed away**, and every
property holds after the change:

```
/products/does-not-exist          -> 404   (not a soft 200)
/solutions/does-not-exist         -> 404
/industries/does-not-exist        -> 404
/solutions/school-bus-management  -> 404   (the draft gate still holds)
save a product, then every page   -> 200
the new price on the live page    -> present immediately
```

### 3.2 A staff member who has made any change can never be deleted — V60, WRITTEN

Found by trying to delete the throwaway admin account the browser pass had just used:

```
DELETE /rest/v1/profiles?email=eq...
400  {"code":"P0001","message":"audit_log is append-only"}
```

Migration 0007 declares `actor_id uuid references profiles (id) on delete set null` and, in the
same file, a before-update trigger that raises on any update. **Those cannot both hold.**
`ON DELETE SET NULL` is implemented as an UPDATE, so the trigger fires and the profile delete
fails. Deleting the Supabase Auth user fails identically, because it cascades to `profiles`.
Offboarding a staff member is impossible.

It was latent until now only because nothing wrote to `audit_log`. Sprint 12 makes every admin
action write one, so from this sprint it applies to every account.

**Migration 0043 drops the foreign key rather than relaxing the trigger.** Relaxing it is the
obvious repair and it is the wrong one: it would restore deletion while leaving the real behaviour
intact — deleting an account would still erase that person's name from every change they ever made.
An audit log exists to answer "who did this", and one that forgets the actor the moment the actor
leaves answers it for exactly the people still around to ask in person, and goes blank for the one
case anybody actually investigates.

The append-only triggers are untouched.

**`downloads.cleared_by` has the same shape** — `on delete set null` against 0004's
`clearance_is_attributable` CHECK, which would be violated and block the delete the same way. It is
deliberately **not** fixed in passing and is raised as **V60a**: unlike the audit log it is a live
constraint doing compliance work, and the right answer is a decision rather than a repair.

### 3.3 Two smaller things, and one that was not ours

- **The admin header pushed its own sign-out button off the screen.** A long email in a flex row
  with the default `min-width: auto` refuses to shrink and takes the space from its siblings. Fixed
  with `min-w-0` and `truncate`. Visible in one screenshot; invisible in the source.
- **`check-migrations` failed the BUILD on a schema-qualified policy target.** `create policy … on
  storage.objects` in 0042 parsed as a table called "storage". Qualified targets are now skipped —
  that check exists to catch a policy naming a table one of these migrations forgot to create, and a
  qualified name is by definition another namespace.
- **`check:redirects` and `check:sitemap` default to port 3000.** Both reported failures until they
  were pointed at 3100 — see the next item. Run them as
  `npm run check:redirects -- http://localhost:<port>`.
- **Port 3000 belongs to a different project.** The first round of HTTP checks in this sprint was
  answered by `C:\Projects\sss`, not this repository — `npm start` had failed with `EADDRINUSE` and
  the 200s looked fine. Everything was re-run on port 3100. Recorded because "the server answered"
  is not the same as "our server answered", and the difference cost half an hour.

---

## 4. The walkthrough gate, act by act

Every step below was performed in a real browser against a production build, signed in as a real
staff account.

| Act | Result |
|---|---|
| **Adds a product** | `/admin/products/new` — one editor for create and edit, so the two cannot drift |
| **Changes a price** | Anti-Jammer Tracker, null → 24,500. The live VAT figure updated as it was typed: *"Stored as KES 24,500 excl. VAT. The customer is shown KES 28,420 including VAT at 16%."* Audited as `product.price` with `price_was: null, price_now: 24500`. The public page showed the new figure immediately. **Reverted afterwards** — no price for this product is client-confirmed |
| **Uploads a brochure** | Media library, private bucket, byte-level type check, required alt text, required privacy answer |
| **Imports certificates** | §5.3 |
| **Reads the inbox** | One queue for all four public forms, rendered through the field spec |

### 4.1 What the dashboard actually showed

Not a demo. On first load, against the real database:

- **3 registrations expired or expiring within 90 days** — CAK expired **438 days ago**, both ODPC
  registrations **107 days ago**. Those are V27–V30, now carrying day counts.
- **4 downloads uploaded but not cleared** — the four prepared PDFs, still blocked on content.

Every other signal was at zero and therefore absent. `docs/CMS_ARCHITECTURE.md` §1.1 says this
screen earns its place or it goes; nothing is rendered at zero, so an empty dashboard means there is
nothing to do rather than that the software has nothing to say.

---

## 5. What was built

**Fourteen routes**, all new except two: `/admin` (replaced), `/admin/login` (wired),
`/admin/signout`, `/admin/inbox`, `/admin/inbox/[id]`, `/admin/inbox/export`, `/admin/orders`,
`/admin/orders/[id]`, `/admin/orders/export`, `/admin/products`, `/admin/products/[id]`,
`/admin/media`, `/admin/media/[id]/file`, `/admin/downloads`, `/admin/certificates`,
`/admin/certifications`, `/admin/security`, `/admin/audit`, and one public route
`/api/downloads/[slug]`.

### 5.1 The inbox and the orders pipeline

The inbox renders `submissions.payload` **through `SUBMISSION_FIELDS`** rather than by iterating the
jsonb. Iterating prints internal keys as though the enquirer typed them, and labels every field with
its column name — a salesperson reading "preferred" instead of "Preferred day or time". Reading
through the spec shows exactly what was asked, in the order it was asked, and anything absent from
the spec is not shown at all, which is the safe default for a jsonb column.

Anonymity is surfaced rather than worked around. An anonymous suggestion has no name, phone or email
**stored** — the fields are dropped before the row is written — so the detail view says so in a
sentence instead of showing empty rows a salesperson would read as a broken record.

The order pipeline reads **snapshots only**. Nothing on the detail page is joined to `products`.
Following from that there is deliberately no way to edit a line, a quantity, a price or the VAT rate:
an admin that could rewrite a snapshot would destroy the only property those columns exist to hold,
in the record both sides refer back to in a dispute. Where the stored subtotal and the line items
disagree the page shows **both** and says so, rather than reconciling.

`whatsapp_sent_at` gets its own column and its own warning. Brief 10.2 calls "an order row exists
before WhatsApp opens" the single most important detail in the shop, and this is the screen where
that pays off: a `new` order whose chat never opened now says **ring them**.

Both exports are the one place bulk PII leaves the database, so each checks its role here rather
than trusting the middleware — the routes run under the service role and bypass RLS — audits the row
count, sets `attachment` and `no-store`, and defuses formula injection. A message field beginning
`=` is executed by Excel on a salesperson's machine.

### 5.2 The media library

Everything lands in a **private** bucket. `npm run storage:init` creates it, reapplies the 8 MB cap
and the MIME allowlist, then **reads the bucket back and fails if it reports itself public**.

Uploads are validated from their **bytes**, not their names. Every allowed format has a fixed
signature in its first 32 bytes; a file whose signature disagrees with its extension is refused and
told which format it actually is. The extension and the browser's `Content-Type` are both chosen by
the uploader, so neither is a check — `payload.svg` renamed `.png` passes both. Only the head is
read, so rejecting a large file does not first load it into memory.

**SVG is deliberately excluded.** An SVG is a document that can carry scripts and is served with a
MIME type browsers execute; allowing one into a media library is stored cross-site scripting with
extra steps.

The privacy prompt is a **required choice**, not a checkbox. Brief 3.6 treats every supplied image as
suspect until checked for plates, faces, names, coordinates and device IDs, and §5 says the upload
moment is the only point where that reliably happens. An unchecked checkbox gets skipped; two radios
with no default cannot be. "Not checked yet" is a legitimate answer and puts the file on the
dashboard until somebody looks.

Deletion **refuses** while any product, solution, industry, post, download or certification still
references the path, and names them. A confirm dialogue invites a reflex click; a refusal listing the
three pages tells someone what to do instead.

### 5.3 Certificate import — the only bulk path, on the most sensitive table

**V04 was answered on 10 September**: build to the legacy specimen. The screen **states that
assumption on its own face** rather than leaving it in a source comment, because whoever imports the
first real export is the person who can correct it.

Three properties the code exists to hold, all verified:

1. **No plaintext plate reaches `installation_certificates`.** Verified by query after a real
   import — the table held only HMAC digests and a four-character certificate suffix. The plaintext
   went to `installation_plates_restricted`, which the lookup never touches and which is the only
   thing making a key rotation recoverable.
2. **The dry run and the import share one code path.** A preview computed by different code from the
   import is a preview that can pass while the import does something else.
3. **The audit entry records counts, never contents** — `{rows: 2, inserted: 2, updated: 0,
   restricted_written: 2}`. A list of imported plates in the audit log would be the plaintext plate
   list this entire subsystem exists to prevent.

An 8-row file with deliberate faults was rejected row by row, each with a sentence a person can act
on:

```
line 6  XY         "XY" reduces to "XY", which is too short to be a plate.
line 7  KDE 111E   No phone number. It is the second factor and a certificate
                   cannot be written without one.
line 8  KDF 222F   Installed date "2025-02-30" is not a real day.
line 9  KDG 333G   The expiry date is before the installation date.
line 5  KD0 789C   The same plate already appears on line 4.
```

That last one is the O/zero fold catching a duplicate the operator could not have seen. The commit
form **did not exist** while any row was unreadable — the rule is structural, not a warning.

**The strongest single result in this sprint:** a clean file was imported, and the certificate was
then found through the **public customer endpoint** by typing `kda 123a` — lowercase, different
spacing — with the last four phone digits. *"Installation confirmed."* That proves the importer and
the customer lookup normalise and hash identically, which is the failure `lib/verification/hashing.ts`
warns about at length: a seeder that normalised differently would write certificates that can never
be found, and the failure would look exactly like customers mistyping their own plates.

**All test data was removed afterwards.** `installation_certificates`,
`installation_plates_restricted`, `verification_attempts`, `submissions`, `orders` and `media` are
all at zero rows.

---

## 6. Role separation, proved against the policies

`npm run verify:roles` — **47 checks, clean, twice.**

Clicking around the admin could not have proved this, and the reason matters. The admin runs
entirely under the service-role key, which bypasses RLS; what gates the UI is `requireStaff()`.
There are two boundaries protecting different things — `requireStaff` protects the admin, RLS
protects the database from anything holding an anon key and a session. A UI test proves the first
and says nothing about the second, which is the one that matters if a later sprint reaches for
`publicClient()` by mistake.

**The subtlety the script exists to get right:** PostgREST answers a policy denial on SELECT with
`200` and an **empty array**. An empty result is therefore not proof of denial, and a naive test
passes on every table that happens to be empty — the same class of mistake Sprint 11 recorded in its
penetration test, a section passing for the wrong reason. `readWithRows` seeds a row with the
service role first, so "saw nothing" means something.

What is proved:

| | |
|---|---|
| Content | every staff role reads; only `editor`+ writes |
| Commerce | `sales`+ reads and writes orders and submissions; `viewer` neither |
| Trust | every staff role reads; only `admin` writes |
| **The clearance gate** | an editor can edit a download and **cannot** set `cleared_for_publication`; an admin can |
| Verification | **no session may read `installation_certificates` — not viewer, not admin**, matching 0008's deliberate absence of any select policy |
| Audit | nobody can INSERT; only `admin` can read |
| Profiles | each role sees only its own row; **a viewer cannot promote itself to admin** |
| Anon | reads none of the five customer-bearing tables |

The clearance gate is the check worth having most, because the UI *also* hides that control and a UI
test would have passed either way.

---

## 7. Deviations and judgement calls

**The verification script wrote to the append-only log, once.** Its first version seeded `audit_log`
to test admin's read and then deleted the row — except 0007's before-delete trigger raises, and a
trigger applies to the service role too. It left two permanent `rls.probe.read` entries in the
tamper-proof log it was verifying. Fixed: it now reads the existing count and reports the test as
**skipped** on an empty log rather than passing it, since "admin saw nothing" and "admin was denied"
are the same response. **The two entries are still there and cannot be removed.** They are the
append-only property working, and they are left as evidence rather than hidden.

**`scripts/apply-migration.mjs` is new.** Migrations 0001–0040 were applied by pasting into the
dashboard SQL editor, which leaves no record of which file was pasted and no way to notice a partial
paste of a security migration. It keeps a ledger and refuses to re-run an applied file. It is a
one-line justification for a script rather than a dependency: no package was added.

**The storage bucket is created by a script, not a migration.** `DATABASE_ARCHITECTURE.md` says
schema is never mutated outside a migration and a bucket is a row in `storage.buckets`, so a
migration would be the consistent choice. Two reasons it is not: the bucket's privacy is enforced by
flags the Storage API validates and raw inserts do not, and it needs the service-role key that every
environment has rather than a personal token only a developer's machine has. Recorded as a candidate
to move into a migration once the configuration stops changing.

**Three deviations from `CMS_ARCHITECTURE.md` §5 and §3, argued rather than skipped:**

- **No image re-encoding on upload (V62).** §5 asks for automatic AVIF/WebP conversion. What ships is
  a hard 250 KB ceiling checked at upload, which enforces the budget but refuses a 3 MB phone
  photograph rather than converting it. An image pipeline inside a server action on a multi-megabyte
  upload is a memory decision, not a one-liner.
- **No drag-and-drop, and no public delivery path for uploaded images (V63).** A drop zone is a
  keyboard and screen-reader liability unless built alongside a working file input, which is what
  ships. The second half is more significant and is §8.
- **Specs and features are edited as text, not with a repeater (V64).** A raw JSON textarea is what
  §3 exists to prevent; a repeater is several hundred lines of client JavaScript against a 180 KB
  route budget. What ships is one convention per field, parsed on the server, with **the parsed
  result shown back on the same screen** so a staff member can see what the site received rather
  than trusting the convention.

**Eleven admin sections are not built**, and are listed in `CMS_ARCHITECTURE.md` rather than left to
be discovered: solutions, industries, FAQs, blog categories and authors, homepage featured slots,
branches, coverage locations, testimonials, client logos, users and roles, site settings. Each is a
screen over a table that already exists. Products, blog and downloads are the three content types
staff touch weekly, and they are the three this sprint chose.

**`/admin/certificates` deliberately has no list.** That would be a list of customers' vehicles, and
0008 has no SELECT policy on that table for anyone — "not for admin, not for anyone". A browsable
index would route around a decision made deliberately in the schema.

**`/admin/certifications` was added and belongs to no sprint.** The dashboard's expiry signal needed
somewhere to point, and pointing it at `/admin/certificates` — a different table and a different
problem, one letter apart — was the first thing that went wrong. It is where a lapsed registration
stays visible after the public page has correctly stopped showing it. Dates are **not** editable
there: renewing is an operations act with a document behind it, and a field where a date can be
typed forward is a field where a lapsed permit is made current in four keystrokes.

---

## 8. The one architectural question this sprint could not answer

`SECURITY_REQUIREMENTS.md` §3 says uploads are served "only through short-lived signed URLs to
admins. Never from a public path", and that it "applies to suggestion attachments and the media
library".

That is exactly right for documents, attachments and anything uncleared. **It cannot be how a hero
image reaches a visitor.** A signed URL baked into prerendered HTML expires, and the page then shows
a broken image — which is not a security win, it is a defect.

So Sprint 12 ships the private half **in full** — upload, sniffing, size cap, alt text, privacy
check, admin viewing through a 60-second signed URL, and public delivery of a *cleared* download
through a 300-second one — and **does not** wire uploaded images into public pages.

**Nothing is blocked by leaving it.** Every image on the site today lives in `public/`. This is
**V63(b)**, and the decision is yours:

- **(a)** A second, public bucket holding only privacy-checked, deliberately promoted images. The
  private bucket stays the intake; promotion is a human act, exactly like `cleared_for_publication`.
  Needs a `public_path` column.
- **(b)** A caching delivery route in front of the private bucket. No schema change, but every image
  request pays a redirect and the CDN story is worse.

(a) is the recommendation: it is the same two-stage pattern the rest of this project already uses,
and it makes `media.privacy_checked` do real work instead of only flagging.

---

## 9. Files

**New** — `lib/admin/{audit,nav,session,dashboard,product-fields,uploads,upload-limits,certificate-import}.ts` ·
`components/admin/{admin-chrome,login-form,primitives,submission-controls,order-controls,product-editor,product-commercial,seo-panel,media-upload,media-controls,download-controls,certificate-import}.tsx` ·
fourteen admin `page.tsx` + `actions.ts` · `app/(admin)/admin/{signout,media/[id]/file,inbox/export,orders/export}/route.ts` ·
`app/api/downloads/[slug]/route.ts` · `scripts/{apply-migration,ensure-storage,verify-roles}.mjs` ·
`supabase/migrations/00{41,42,43}_*.sql`

**Changed** — `app/(admin)/layout.tsx` · `app/(admin)/admin/{page,login/page}.tsx` ·
`app/(site)/{products,solutions,industries}/[slug]/page.tsx` (V54c) ·
`app/(site)/resources/downloads/page.tsx` · `components/ui/field.tsx` · `lib/constants.ts` ·
`lib/format.ts` · `scripts/check-migrations.mjs` · `package.json` · `CLAUDE.md` ·
`docs/{SPRINT_PLAN,CMS_ARCHITECTURE,DATABASE_ARCHITECTURE,NEEDS_VERIFICATION}.md`

**No dependency was added.** Every new capability — CSV parsing, MIME sniffing, PNG and JPEG
dimension reading, the storage client, the migration runner — uses what is already here.

---

## 10. Database changes

| Migration | What | State |
|---|---|---|
| `0041_submission_attempts` | The `submission_attempts` table (**V58**, approved before it was written) | **WRITTEN, NOT APPLIED** |
| `0042_download_count_and_storage_policies` | `increment_download_count()`; a staff read policy on `storage.objects` | **WRITTEN, NOT APPLIED** |
| `0043_audit_actor_survives_deletion` | Drops the `audit_log.actor_id` foreign key (**V60**) | **WRITTEN, NOT APPLIED** |

All three are blocked by **V61**: the project's `SUPABASE_ACCESS_TOKEN` returns **401** from
`api.supabase.com`, so neither `npm run db:apply` nor `npm run db:types` can run. The service-role
key is unaffected — the app, the Storage API and every verification script in this sprint worked
against the live database.

**What this costs while it stands:**

- The four enquiry forms keep the Sprint 11 jsonb rate-limit counter. It works; it is the wrong
  shape, and an anonymous suggestion is still rate limited by Turnstile alone.
- `downloads.download_count` does not increment, and **says so in the server log on every download**
  rather than silently reading zero.
- A staff account cannot be deleted. The browser-pass account could not be removed and has been
  **demoted to `viewer`, banned for 100 years and had its password rotated** to a value nobody
  holds. Deleting it is the first thing to do once 0043 lands.

**`npm run check:migrations`** clean — RLS on all 32 tables, 17 views granted to anon, no base table
exposed. **`npm run verify:db`** clean — 31/31 tables, 0 readable by anon, 31/31 refused an anon
write.

---

## 11. Verification actually run

| | |
|---|---|
| `tsc --noEmit` | ✅ |
| `eslint .` | ✅ |
| `npm run build` | ✅ · retired-string check clean over **394 artefacts** |
| `npm run check:migrations` | ✅ 32 tables |
| `npm run verify:db` | ✅ |
| `npm run check:redirects` | ✅ 13 redirects + 4 direct routes |
| `npm run check:sitemap` | ✅ **59 URLs, every one 200** — an independent confirmation the §3.1 fix holds |
| **`npm run verify:roles`** | ✅ **47/47, twice** |
| All 18 admin routes | ✅ 200 signed in, **307 to login signed out** |
| **Browser pass** | ✅ **DONE** — the thing Sprint 11 could not do |
| Zero console errors on the new routes | ✅ — the only two console entries came from a different project on port 3000 |
| Exactly one `<h1>` per admin route | ✅ 10/10 checked |
| Every form control has an accessible name | ✅ 58 controls audited across 10 routes, **0 missing** |
| Touch targets ≥ 44 px | ✅ 0 under |
| Keyboard-only to the primary action | ✅ 14 Tabs to "Create product", **focus ring visible** |
| Images without `alt` | ✅ 0 |
| Live regions present from first paint | ✅ on every action surface |
| Horizontal overflow at 360 px | ✅ none — §12 on how this was measured |
| Price change end to end | ✅ saved, audited with both figures, live on the public page, reverted |
| Certificate import end to end | ✅ rejected, imported, **verified through the public endpoint**, removed |
| Test data remaining | ✅ **zero rows** in every customer-bearing table |

### 11.1 Performance

Measured on the production build.

| | Budget | Worst route |
|---|---|---|
| Route JS, admin | ≤ 180 KB | **112 KB** — `/admin/products/[id]` |
| Route JS, public | ≤ 180 KB | **131 KB** — the four enquiry-form routes, unchanged |
| Shared first-load JS | — | 103 KB |

The heaviest new screen is the product editor at 112 KB, which is the one with the most client state
— the live VAT figure, the SEO counters, the slug suggestion. Every other admin route is 103–110 KB.
No public route changed weight.

**LCP, CLS and Lighthouse were not re-measured**, and should not be read as met or missed here. V53
is explicit that no budget decision should be taken on this machine's numbers, and the admin is
`noindex` and behind auth, so it is not the surface those budgets are about.

---

## 12. What I could not verify

**Device-width responsive emulation.** The browser window would not resize — `resize_window`
reported success and `window.innerWidth` never moved off 1164, and the fallbacks failed for
instructive reasons: an iframe probe was refused by **our own `frame-ancestors` header** (correct
behaviour), and `window.open` was blocked.

What was measured instead, and what it does and does not prove: the content column was forced to
360 px and its `scrollWidth` stayed at exactly 360 with no offending descendant. That catches
intrinsic-width overflow — a long unbreakable string, a fixed-width table — which is the actual
failure mode. **It does not exercise the media queries**, so the mobile drawer and the sidebar
collapse are unverified at their breakpoints.

`components/admin/admin-chrome.tsx` follows the pattern already proven in
`components/layout/mobile-nav.tsx`, which was verified in a real browser in Sprint 2 — but that is
inheritance, not verification, and it is recorded as such.

**Also not done:** contrast measurement on the new surfaces (the admin is entirely light-ground and
reuses existing tokens, so no new combination was introduced), `prefers-reduced-motion` (no
animation was added), and Lighthouse.

---

## 13. Decisions needed from you

1. **V61 — the Supabase access token.** One minute of your time unblocks three written migrations.
   Create a new token at `supabase.com/dashboard/account/tokens`, replace it in `.env.local`, then
   `npm run db:apply -- --pending` and `npm run db:types`.
2. **V63(b)** — how uploaded images reach public pages. §8. Recommendation: a second public bucket.
3. **V60a** — `downloads.cleared_by` blocks staff deletion the same way `audit_log` did, with a
   CHECK constraint attached. Keep the id and drop the FK, or record the clearer's name as text?
4. **V04a** — is the certificate number sequential? If it is, it needs enumeration hardening of its
   own alongside the plate.
5. **V03** — Option A (built) or Option B (OTP)? Still provisional in ADR-0005.
6. **Sprint 11 is unmerged.** This branch was cut from `sprint/11-trust-support`, not from
   `develop`, because Sprint 12 builds on Sprint 11's routes and Sprint 11 stopped for review.
   Merging both is your call.

### Still open and still client-owned

**V25** — the Search Console cross-check. The old sitemap was *proven* incomplete in Sprint 0, so it
cannot be trusted as the URL inventory, and any indexed URL missing from the 301 map is lost
permanently at cutover.

**V28a** — the ODPC renewal confirmation. `/admin/certifications` now shows both registrations as
**expired 107 days ago**, and `CANONICAL_DESCRIPTION` still asserts the registration in prose on
every page of the site.

Also unchanged: **V15** (testimonials), **V12** (which clients), **V13** (platform screenshots),
**V09** (author bio and photo), **V37** (logo variants), **V45** (a real 1200×630 OG image),
**V27–V30** (the renewals), **V56** (Turnstile keys), **V39** and **V40** (named approver, launch
date), and the six routes still linked from the nav and footer that 404 — `/platform`,
`/about/team`, `/about/partners` and the three legal pages.

---

## 14. Recommended next step

**Fix V61 first** — it is the cheapest item on this list and it unblocks three migrations, the V58
rate-limit switchover and staff offboarding. Then re-run `npm run db:apply -- --pending`,
`npm run db:types`, and delete the browser-pass account.

Then **Sprint 13 — SEO / LLM Audit**, whose gate is a clean crawl. Note that §3.1 is directly
relevant to it: a CMS that 404s twenty-nine pages on a save would have produced a crawl report full
of dead URLs with no obvious cause, and the audit would have been the sprint that found it — long
after staff had started editing.

---

## 15. Merged into `develop`, 10 September 2026

Both sprints merged on the client's instruction, in order, each with its own merge commit so the
sprint boundaries stay visible in history:

```
Merge sprint/11-trust-support   into develop
Merge sprint/12-admin-completion into develop
```

Sprint 12 was cut from Sprint 11 rather than from `develop`, so the second merge is a
fast-forward's worth of content on top of the first. Nothing conflicted.

**Verified on the merged tree, not assumed from the branches:**

| | |
|---|---|
| `tsc --noEmit` | ✅ |
| `eslint .` | ✅ |
| `npm run build` | ✅ · **43 migrations · 32 tables · 17 views** · retired-string check clean over 394 artefacts |
| `npm run check:redirects` | ✅ 13 redirects + 4 direct routes |
| `npm run check:sitemap` | ✅ every sitemap URL 200 — the §3.1 fix holds after the merge |
| `npm run verify:roles` | ✅ **47/47** |
| `npm run verify:db` | ✅ no base table readable by anon, no table writable by anon |
| Admin routes signed out | ✅ 307 to the login page |

`develop` is **not pushed**. `main` remains frozen and Vercel production stays pinned to it until
Sprint 15, per the branch model.

The two `profiles` rows are the client's account and the browser-pass account that **cannot be
deleted until 0043 is applied** (§3.2). It is demoted to `viewer`, banned, and its password rotated
to a value nobody holds.

---

**STOPPING HERE FOR REVIEW.**
