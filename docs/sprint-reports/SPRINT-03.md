# Sprint 3 — Data & Content Layer

**Branch** `sprint/03-data-content-layer` → `develop`
**Report date** 2 September 2026
**Format** Brief PART 21.2

---

## 1. Completed

| Sprint 3 acceptance criterion | State |
|---|---|
| Migrations 0001–0010 per `DATABASE_ARCHITECTURE.md` §8 | ✅ written **and applied** |
| RLS on every table, reviewed table by table; anon key confirmed unable to write | ✅ verified live, 30/30 |
| Types generated, not hand-written | ❌ **blocked — V46** |
| Every query in `lib/content/`; no component calls Supabase directly | ✅ verified |
| Seed contains no real customer data | ✅ verified live |
| Certificate tables built to Option A; plate stored as HMAC only | ✅ verified live |
| V04 resolved **or the import deferred** | ✅ discharged by **deferral** to Sprint 11 |

Six of seven met. The seventh needs a credential only the client can issue.

**Schema.** Ten migrations covering 30 tables and 17 public read-only views: profiles and roles,
content core, editorial, trust and operations, commerce, verification, media and audit, then the
policies (0008) and views (0009) applied last so they can reference everything, and reference seed
(0010).

**Access layer.** `lib/content/index.ts` is the single door to the database — 16 typed query
functions, each returning a `Result` with a fallback so a page renders rather than throws when the
database is unreachable. No page or component imports Supabase.

**Admin.** Route group, auth gate and shell. Middleware redirects unauthenticated traffic; it uses
`getUser()` rather than `getSession()` so the session is revalidated against the auth server instead
of trusting a cookie that could be forged.

---

## 2. Deviations from plan

**A restricted plaintext table was added, which the design did not have.**
`installation_plates_restricted` holds `plate_plaintext` and `phone_plaintext` for operations. Without
it, rotating `CERT_PLATE_HMAC_SECRET` would be unrecoverable — there would be nothing left to re-hash
from. It is written to only by the service role and is unreadable by `anon`, verified live. Recorded
in `DATABASE_ARCHITECTURE.md`.

**Two defects were found and fixed that were not Sprint 3 scope.** Both were caught by verification
rather than by review, and both would have compounded across later sprints. See §5.

**A live verification script was added.** `scripts/verify-db.mjs`, run as `npm run verify:db`. The
static check could not have caught a policy that is wider than intended, because that depends on how
Postgres composes every policy on a table.

---

## 3. Files

**Added**
```
supabase/migrations/0001…0010.sql     schema, RLS, views, reference seed
lib/supabase/{server,browser}.ts      clients
lib/content/index.ts                  the only door to the database
types/database.ts                     PLACEHOLDER — see V46
app/(admin)/…                         admin group, login, shell
app/(site)/layout.tsx                 public chrome split into its own group
middleware.ts                         admin auth gate
scripts/check-migrations.mjs          static schema gate, wired into build
scripts/verify-db.mjs                 live database gate, run by hand
docs/sprint-reports/SPRINT-03.md      this report
```

**Changed**
```
lib/seo/metadata.ts                   title no longer doubles the brand suffix
app/(admin)/admin/login/page.tsx      no longer fights Shell for its width
components/layout/section.tsx         Shell's className collision documented
package.json                          verify:db script
.gitignore                            supabase/.temp/
docs/DATABASE_ARCHITECTURE.md         status recorded against the live database
docs/NEEDS_VERIFICATION.md            V46 narrowed, V04 deferral recorded
```

---

## 4. Database changes

Thirty tables, seventeen views, RLS on every table. Verified against the live database, not the SQL:

| Check | Result |
|---|---|
| Tables present (service role) | 30 / 30 |
| Public views readable by `anon` | 17 / 17 |
| Base tables readable by `anon` | **0** |
| Tables refusing an `anon` write | **30 / 30** |

Seed landed: 3 branches (Nairobi, Mombasa, Nakuru — no fourth office implied), 16 coverage towns,
5 product categories, 8 blog categories. Every customer-bearing table is empty: `orders`,
`order_items`, `submissions`, `installation_certificates`, `installation_plates_restricted`,
`testimonials`, `client_logos`, `payments`, `profiles`.

Certificate shape confirmed **Option A** by reading the live PostgREST schema.
`installation_certificates` carries `plate_hash`, `phone_last4_hash`, `certificate_number_last4` and
no plaintext. The only plaintext plate column in the whole schema is
`installation_plates_restricted.plate_plaintext`, unreadable by `anon`.

---

## 5. Defects found and fixed

**Every page title carried the brand twice.** `buildMetadata()` appended `" | Nebsam"` and the root
layout's `title.template` then applied it again, because Next.js applies a parent template to any
child setting `title` as a plain string. The homepage rendered
`"… in Kenya | Nebsam | Nebsam"`, over the 60-character budget. This was **systemic** — every page
built through the helper, so all of Sprints 4–15 would have inherited it. Fixed with
`title: { absolute }`. The length guard measured the pre-template string and so could never have
caught it; that is now accurate too. Now 52 characters.

**The sign-in form rendered at 1248px instead of 448px.** `Shell` hard-codes `max-w-shell` and
concatenates `className` rather than merging it, so passing `max-w-md` put both utilities on one
element and Tailwind's source order — not the caller — picked the winner. A silent failure: the
markup reads correctly and the layout is wrong. Sign-in now carries its own gutter. The collision is
documented on `Shell` itself because every caller in the coming sprints can hit it. A real merge
would need `tailwind-merge`; that is a dependency decision, flagged in §10 rather than taken quietly.

---

## 6. Dependencies added

**None.** `@supabase/supabase-js` and `@supabase/ssr` were added in the previous commit range and are
already recorded. `supabase` CLI 2.116.0 is invoked through `npx` and is not a project dependency.

---

## 7. Verification actually run

| | |
|---|---|
| `tsc --noEmit` | pass |
| `eslint .` | pass |
| `npm run build` | pass, incl. `check-migrations` and `check-retired-strings` (100 artefacts, 0 violations) |
| `npm run verify:db` | pass against the live project |
| Browser | production build, real Chrome, `/`, `/admin`, `/admin/login` |
| Console | **zero** messages on `/` and `/admin/login` |
| Admin gate | `/admin` → `307 → /admin/login?next=%2Fadmin`; no `reason=unconfigured` |
| Keyboard | full tab order — skip link → email → password → submit; nothing trapped |

---

## 8. Performance — measured

Measured on the **production build**, gzipped over the wire.

| Metric | Measured | Budget | |
|---|---|---|---|
| Total homepage weight | **267.6 KB** | ≤ 1500 KB | ✅ |
| Initial JS, homepage (first load) | **105 KB** | ≤ 180 KB | ✅ |
| Web font files delivered | **2** | ≤ 3 | ✅ |
| CSS | 5.4 KB | — | |
| Document (HTML) | 10.6 KB | — | |

Breakdown: document 10.6 · JS 153.8 (all chunks fetched) · CSS 5.4 · fonts 97.8.

**Eight `@font-face` files are declared, two are fetched.** The other six are `next/font`
unicode-range subsets — cyrillic, greek, latin-ext — that a latin-script visitor never downloads. The
delivered count is what the budget governs, so this passes, but the declared count is worth knowing
before anyone counts files in the build output and panics.

**Not measured this sprint: LCP, INP, CLS, Lighthouse.** Deliberately, not by omission. These are
budgeted against *throttled 4G on a mid-tier Android*, and localhost on desktop hardware would
produce numbers that flatter the build and mean nothing. Sprint 3 changed no public rendering path
other than the `<title>` string. **Sprint 4 must measure them properly** — it is the heaviest page on
the site and the budget gate is real there.

---

## 9. Accessibility

Checked on `/admin/login`, the sprint's only new interactive surface.

| | |
|---|---|
| Focus ring | `outline: 2px solid var(--brand-signal-ink)`, `offset: 2px`; `--brand-signal` on dark, per §6 |
| Ring contrast | **5.96 : 1** on raised surface — needs 3 : 1 |
| Button label | **6.56 : 1** white on `#1857C4` — matches the §6 table exactly |
| Touch targets | 44 / 44 / 52 / 50 px — all ≥ 44 |
| Fields | labelled, `required`, correct `autocomplete` |
| Skip link | present, first in tab order |
| Horizontal overflow | none |

The ring computes to 1.6px rather than 2px. This is **not** a defect: a declared 100px width computes
to 100px on the same page, so it is not zoom — it is Chrome snapping outline width to whole device
pixels at DPR 1.25 (2 × 1.25 = 2.5 → 2 device px = 1.6 CSS px). It renders 2px on integer-DPR
displays and is clearly visible either way.

**Not completed: 360 px and ultrawide renders.** The machine's screen is 1536 px and a docked panel
held the viewport at 568 px, so neither could be rendered honestly. 360 px was verified
*structurally* instead — zero elements carry a fixed or minimum width above 360 px, the container is
`min-width: 0` with `border-box` and fluid gutters, and there is no horizontal overflow — but that is
CSS analysis, not a render. **Both should be eyeballed on real hardware before this sprint is signed
off.**

---

## 10. Decisions needed from the human

1. **Supabase access token or database password.** The only thing standing between this sprint and a
   complete pass. `supabase gen types` authenticates with neither the anon nor the service-role key.
   Either run `npx supabase login`, or issue a personal access token, or supply the database password.
2. **`tailwind-merge`?** `Shell` concatenates rather than merges `className`, and the failure is
   silent. The caller is fixed and the hazard documented, but every future caller can still hit it.
   Adding `tailwind-merge` would remove the class entirely, at the cost of a dependency. Not taken
   unilaterally, per CLAUDE.md §3.5.
3. **`_to_delete/` and `nebsam-scaffold.zip`** are untracked and both exceed the §12 raw-media limit.
   Confirm they can be removed.

---

## 11. Known issues and open register items

| Item | Effect |
|---|---|
| **V46** | `types/database.ts` is a hand-written placeholder, which brief PART 7.2 forbids. Every `lib/content/` return type is asserted rather than derived, so **schema drift would be silent**. Sprint 4 builds directly on this |
| **V25** | Search Console URL cross-check. **Sprint 2 still cannot formally close** |
| **V28a** | The ODPC registration claim ships verbatim from `lib/company.ts` to footer, About, `llms.txt` and every page's `Organization` schema. Renewal reported in hand 18 Aug 2026, **still unconfirmed** |
| **V04** | Certificate source and format. Sprint 3 obligation discharged by deferring the import to Sprint 11; the question must be answered before then, because a sequential certificate number needs enumeration hardening alongside the plate |
| **V41** | Fonts still not preloaded — re-confirmed this sprint. The HTML head carries `preload` for an image and a script, and **none `as="font"`**. Costs LCP on exactly the connection profile the audience is on |
| **V45** | OG share image is 225×225, not 1200×630 |
| **`CERT_PLATE_HMAC_SECRET`** | Empty in `.env.local`. Must be set before any certificate data is hashed or imported |

**No new `[[NEEDS_VERIFICATION]]` tokens were created this sprint.**

---

## 12. Security note

Real Supabase credentials — including the **service-role key**, which bypasses RLS — were found
pasted into `.env.example`, a tracked file. Confirmed by `git log -S` across all branches that they
**never reached a commit**; the exposure was working-tree only, so no history rewrite was needed.
Moved to `.env.local` (gitignored, verified), and `.env.example` restored to placeholders. Rotation is
not strictly required since the values never left the machine — that is the client's call.

Worth fixing at the source: `.env.example` documents variables with *aligned trailing comments*, so
pasting a value produces `KEY=value        # project URL` and the comment becomes part of the value.
That is what happened. `.env.local` has been normalised to bare `KEY=value`.

---

## 13. Recommended next step

Supply the access token, generate the types, and this sprint passes cleanly. Starting Sprint 4
against an unapplied type placeholder means the first genuine schema contact happens under Sprint 4's
performance gate rather than Sprint 3's schema-review gate — which is the wrong place to find out the
types were wrong.

---

**STOPPING HERE FOR REVIEW.**
