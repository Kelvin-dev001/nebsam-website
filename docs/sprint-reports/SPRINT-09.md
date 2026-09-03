# Sprint 9 — Blog & CMS

**Branch** `sprint/09-blog-cms` → `develop`
**Report date** 3 September 2026
**Format** Brief PART 21.2

---

## 1. Completed — and what could not be

**The gate was not met, and could not be.** It reads *"A non-technical user publishes a post
unaided."* Nothing can be published: **V09 is unanswered**, so no author records exist, and the
criterion below it forbids anonymous bylines. There is also no staff account to sign in with, so the
editor UI has not been exercised by anyone. See §5 — this is the honest limit of what was verified.

| Sprint 9 acceptance criterion | State |
|---|---|
| Draft → in review → published, scheduling, unpublish | ✅ built |
| Autosave and revision history working | ✅ built — **UI not exercised** |
| SEO panel with live character counts | ✅ built — **UI not exercised** |
| Preview before publish | ✅ built — **UI not exercised** |
| Slug locks after first save; changing one creates a 301 automatically | ✅ **proven end to end** |
| On-demand revalidation — publish, refresh, it is live | ✅ built |
| Real author profiles (V09); no anonymous bylines | ❌ **V09 open — no authors exist** |
| Every article links to at least one solution | ❌ **no articles** |
| 8–10 seeded articles | ❌ **none** — no source content, and no byline to publish under |

Four built and one proven; three cannot be done without V09; the gate needs a human.

---

## 2. Deviations from plan

**No articles were written.** `content-source/` contains no blog or article material, and every post
needs a real byline. Writing eight articles under an invented author would have satisfied the count
and broken the two rules that matter most — never invent staff names, and no anonymous bylines. An
empty blog index that says the first articles are being written is the honest state.

**No rich text editor.** The body is a plain textarea, split into paragraphs on blank lines.
CMS_ARCHITECTURE §3 asks for "rich text with a constrained toolbar — no arbitrary HTML", precisely so
an editor cannot break the design system one post at a time. A textarea is the strictest possible
reading of that, it adds nothing to the bundle, and it can be upgraded without changing the stored
format.

**A `redirects` table was added** (0030). The criterion requires a slug rename to create a 301, and
the static map in `next.config.mjs` is compiled at build time — it cannot carry a redirect an editor
creates on a Tuesday afternoon.

**`zod` added as a dependency.** Justification: CLAUDE.md §2 names it in the stack, and these actions
run with the service role, which bypasses RLS. The database will not catch a malformed write.

---

## 3. Files

**Added**
```
app/(site)/resources/blog/page.tsx          public index
app/(site)/resources/blog/[slug]/page.tsx   public post
app/(admin)/admin/blog/page.tsx             post list
app/(admin)/admin/blog/[id]/page.tsx        editor route
app/(admin)/admin/blog/actions.ts           server actions, Zod, audit, 301s
components/admin/post-editor.tsx            the editor
lib/admin/actor.ts                          session-derived actor
supabase/migrations/0030_redirects.sql
supabase/migrations/0031_revoke_anon_on_new_tables.sql
docs/sprint-reports/SPRINT-09.md            this report
```

**Changed**
```
middleware.ts        serves CMS redirects; early return for non-admin paths
app/sitemap.ts       blog index added
scripts/verify-db.mjs  redirects added to the checked tables
package.json         zod
docs/NEEDS_VERIFICATION.md  V50 raised
```

---

## 4. Defects found and fixed

**A regression this sprint introduced, caught by verification.** Adding content paths to the
middleware matcher made `/solutions`, `/products` and `/industries` answer **307 to a login page** —
`:path*` matches the bare index path, so those requests fell through into the admin auth gate. Three
index pages silently redirecting to a login screen is the kind of fault that reaches production
looking like a routing problem. An early return for non-admin paths fixes it, and all content routes
were re-verified at 200.

**A systemic grant gap.** Migration 0008 ends with `revoke all on all tables in schema public from
anon`, which is a **one-time statement**. `redirects` was the first table created after it and
therefore kept Supabase's default SELECT grant. Not a leak — RLS returned zero rows and writes were
refused with 42501, both verified — but every other table answers `anon` with permission denied, and
this one answered with an empty set.

The fix has two parts and the second is the one that matters: revoke again, **and**
`ALTER DEFAULT PRIVILEGES` so a table created by a future migration is born without the grant.
Without that, the same gap reopens on the next `create table`, and the next person to notice would be
whoever adds a table holding something that matters.

Found by `npm run verify:db` the moment `redirects` was added to its table list — the check written
in Sprint 3 precisely because a static read of the SQL cannot see a grant the platform adds.

---

## 5. Verification actually run — and its limits

| | |
|---|---|
| `tsc --noEmit`, `eslint .`, `npm run build` | pass |
| `npm run verify:db` | pass — **31/31 tables**, none anon-readable, none anon-writable |
| `npm run check:sitemap` | pass — every URL 200 |
| Content routes after the middleware change | all 200, re-verified |
| Admin routes | still gated; `/admin/blog` → 307 to login |
| **CMS 301** | **proven end to end** — a seeded row produced a real 301 with the correct `Location`, and stopped serving once removed |

**What was NOT verified, and why.** The editor UI — autosave, live counts, preview, the status
workflow — has not been exercised by anyone. It sits behind the admin auth gate, there are **zero
staff accounts**, and creating an account is not something I do on the client's behalf. The
components compile and the actions typecheck against the real schema, but that is not the same as
someone having used them.

**To close this:** create an admin user in Supabase Auth, sign in at `/admin/blog`, and run the
gate — a non-technical person creating, saving, previewing and publishing a post unaided. Publishing
additionally needs V09.

---

## 6. Security notes

**Every mutation validates with Zod on the server**, and the actor is read from the session rather
than the form. A server action is a public HTTP endpoint: an `actorId` field would let one staff
member attribute an edit to another, and `audit_log` would faithfully record the lie.

**`audit_log` is written for every create, update and unpublish**, after the change succeeds, so the
log records what happened rather than what was attempted.

**The slug lock is a courtesy, not a control.** Disabling the input prevents an accident and nothing
else — the request can be replayed with any value. The server compares the incoming slug against the
stored one and writes the 301 itself.

**V50 raised: three HIGH severity CVEs in `sharp`/libvips**, shipped transitively with Next.js for
image optimisation. The only offered fix is `npm audit fix --force`, which installs `next@16.3.4` — a
breaking major upgrade, and a stack decision under §3.5 rather than something to do mid-sprint. It
must be resolved before Sprint 12 ships uploads and before Sprint 15 goes to production.

---

## 7. Performance

Not measured. The public blog routes are server-rendered with no new client JS and are structurally
identical to routes measured at Performance 94–95 in Sprint 5. The admin editor is the first
substantial client component on the project (3.38 kB route JS), but `/admin` is noindex, staff-only
and explicitly outside the public route budget.

---

## 8. Decisions needed from the human

1. **V09 — author names, roles, short bios, photos.** Blocks all publishing. Nothing else in this
   sprint can be signed off without it.
2. **An admin account**, so the CMS can actually be used and the gate run. I do not create accounts.
3. **V50 — the `sharp` CVEs.** Upgrade Next in a dedicated sprint, pin a patched `sharp`, or accept
   the risk while production still serves the CRA site. Must be settled before Sprint 12.
4. **Blog subject matter.** No source articles exist. The solution pages carry the substance and
   several would make good definitional articles — jamming, fuel accountability, what a speed limiter
   must report — but the topics and the author are the client's call.

---

## 9. Known issues and open register items

| Item | Effect |
|---|---|
| **V09** | No authors. Nothing publishable; the sprint gate cannot run |
| **V50** | Three HIGH CVEs in sharp/libvips. Blocks Sprint 12 uploads and Sprint 15 |
| **V49** | Sprint 7 (Commerce) deferred. Blocks revenue; must land before Sprint 15 |
| **A01–A07** | Four products still drafts; A07 blocks Sprint 7 pricing |
| **V05** | Installation terms unstated on every product |
| **V17–V24** | School bus solution still a draft; legal review outstanding |
| **V48** | Whether a recovery *service* exists |
| **V47** | LCP 2.878 s against ≤ 2.5 s. Accepted |
| **V13** | Platform screenshots; `/platform` unbuilt |
| **V25** | Search Console cross-check. **Sprint 2 still cannot formally close** |
| **V28a** | ODPC claim, live across the site |
| **V12 / V45** | Client logos; OG image 225×225 |
| `CERT_PLATE_HMAC_SECRET` | Empty; required before certificate import |
| CMS UI | Never exercised — no staff account |
| Unbuilt routes | platform, resources hub, downloads, faqs, about and children, support, contact, quote, legal |
| Prettier | 43 existing files unformatted |
| Housekeeping | `_to_delete/`, `nebsam-scaffold.zip`; removal approved but denied at the prompt |
| Ultrawide | Never rendered on real hardware |

---

## 10. Recommended next step

**Clear the backlog, as agreed.** Nine register items now block work across four sprints, and three
of them — V09, V05 and A01–A07 — are short factual answers rather than decisions. Between them they
hold back all publishing, four product pages, every installation term, and the whole commerce sprint.

Nothing built in Sprints 6, 8 or 9 has reduced that list. It has grown.

---

**STOPPING HERE FOR REVIEW.**
