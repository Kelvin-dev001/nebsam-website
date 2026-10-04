# CLAUDE.md — Nebsam Digital Solutions website

Read this every session. It governs all work in this repository.

> **The contract is `docs/brief/00-MASTER-BRIEF.md` (v1.2).** It is authoritative and it outranks
> this file, any conversation, and any instinct to be helpful. This file is the working subset —
> when the two disagree, the brief wins, and this file gets corrected. Never rely on conversation
> memory for project rules; re-read the brief.

---

## 1. What this is

A complete rebuild of `nebsamdigital.com` as a telematics knowledge, trust and commerce platform
for Kenya and East Africa. The visitor's conclusion within ten seconds must be *"these are the most
technologically advanced vehicle tracking and fleet intelligence people in Kenya"* — **earned by the
artefact**, not asserted in a headline.

Three commercial objectives, in priority order. Every design and engineering decision traces to one:

1. **Generate qualified enquiries** — WhatsApp first, then call, quote, installation booking.
2. **Be found** — by Google *and* by LLM assistants, for telematics intent in Kenya/East Africa.
3. **Sell products** — a real shop with WhatsApp checkout, run by non-technical staff.

## 2. Stack

| | |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS, Nebsam tokens (§6) |
| Motion | Motion / Framer Motion. GSAP only for a timeline that genuinely needs it, never both on a page |
| Data | Supabase — Postgres, Auth, Storage, **RLS on every table** |
| Hosting | Vercel; preview deployment per branch |
| Images | `next/image`, AVIF/WebP, explicit dimensions |
| Forms | Server actions + **Zod validated on the server** |
| UI kit | Selective shadcn/ui primitives only, restyled to Nebsam tokens — the site must not read as a shadcn template |

**The current repository is still Create React App and is being migrated, not refactored.** See
`docs/decisions/ADR-0001-cra-to-nextjs.md`. Almost nothing in `src/` transfers. Do not bolt SSR onto
the SPA and do not run both.

Server Components by default. `"use client"` only where interaction requires it, and justified.

## 3. Non-negotiable rules (brief PART 2)

1. **Inspect before you change.** Read the file, map its dependents, state its purpose, then make
   the smallest coherent change.
2. **Never invent facts.** See §5 — this is the rule that carries legal risk, not just quality risk.
3. **Preserve source hedging verbatim.** *"according to the configured security logic"*, *"subject
   to network and GPS availability"*, *"where supported by the vehicle"*. These are accuracy, not
   padding.
4. **Stop at sprint boundaries.** Every sprint ends with a report and a full stop. Never roll into
   the next sprint unprompted.
5. **Ask rather than assume on architecture.** Any change to stack, data model, routing or
   dependencies is proposed and approved first, in writing, with the trade-off named.
6. **Verify, don't claim.** "Implemented" means you ran it — loaded the page in a browser,
   screenshotted it, checked the console, tested the interaction. Never report a feature working
   because the code looks correct.
7. **One branch per sprint, small commits.** §12.
8. **Secrets never enter the repo.** `.env.example` documents every variable with a comment. Real
   values never appear in code, commits, docs or logs. Service-role keys are server-side only.

## 4. Source of truth for company data

`content-source/` is **authoritative and read-only** — rewrite *out of* it, never *into* it.
`.claude/settings.json` denies writes to that path.

Company facts (name, branches, phones, emails, hours, the canonical description) live in **one
place**: `lib/company.ts`. Never hard-code a phone number, address or company name in a component.
NAP consistency drives local SEO and LLM entity resolution.

**Three branches only** — Nairobi, Mombasa, Nakuru. Everywhere else is agents and technicians. Never
imply an office where there is none; never state a count of agents or technicians.

**Retired strings that must never reach rendered output** are listed in brief PART 3.2 and in the
`SOURCE NOTES` blocks in `content-source/`: one unpublished phone number, one administrative email,
and the retired Nairobi and Mombasa addresses. They are deliberately not repeated here so this file
stays clean for the build-time check. That check ships in Sprint 2 and **fails the build** if any of
them appears in rendered output.

## 5. Content and anti-fabrication

You may **never** invent: statistics · customer counts · years in business · uptime figures ·
prices · warranty terms · technical specifications · certifications · partnerships · client names ·
testimonials · awards · superlatives · locations · staff names · response times.

Missing fact → write the token and log it in `docs/NEEDS_VERIFICATION.md` with page, line and
question:

```
[[NEEDS_VERIFICATION: exactly what is needed]]
```

**No public page ships carrying an unresolved token.**

**Confirmed product names — build against these, never re-decide:** Standard Tracker (never "Basic
Tracker") · Hybrid Car Alarm (never "Hybrid Alarm") · Hybrid ProMax Car Alarm (vibrating key remote)
· Hybrid ProMax Plus Car Alarm (vibrating remote + Anti-Jammer GPS) · Hybrid Dashcam **and** AI
Vehicle Video Telematics are **two separate products** · Nebsam Digital Solutions (K) Ltd, plural.

**Never publish:** "50,000 customers" · "#1 … in Kenya" · "strongest active vehicle protection
system in Kenya" · "no way a thief will drive away with your car" · "decrease fuel theft by 90%" ·
"out-of-this-world advantages" · traffic sign recognition "transmits data directly to NTSA servers"
(write the section **without** it — absent, not hedged) · "KEBS accredited" (it is a **Permit to Use
the Standardization Mark**, product-scoped to STREAMAX video telematics cameras).
Hedge "unlimited distances without interference" as bounded by network coverage.

**Approved:** "over 10 years" · "70+ corporate clients" · the KEBS laboratory test report
(ref BS202445237, 5 Feb 2025, result "Complies" — never paraphrase into anything stronger).

Writing standards: sentence case headings, short paragraphs, specific over clever, Kenyan English
with local nouns where they are the right nouns (matatu, PSV, NTSA, boda boda, ICD, Makupa). Every
page states plainly who Nebsam is and where it operates — LLMs quote what is explicit.

Use the **`nebsam-content`** skill for any content migration or page copy.

## 6. Design tokens and typography

**Implemented in Sprint 1.** Use the **`nebsam-brand`** skill when building or restyling any UI.
Full system and verified contrast table: `docs/DESIGN_SYSTEM.md`. Direction: ADR-0002.

Tokens live in `app/globals.css`; `tailwind.config.ts` maps onto them and never defines a colour.

```
brand-navy #0A0E36   brand-navy-raised #121741   brand-blue #020189   brand-blue-light #85A4D2
brand-signal #3D8BFF (dark only)    brand-signal-ink #1857C4 (light + every primary fill)
ink #0F1620          surface #FFFFFF   surface-raised #F1F4FA   surface-inverse #0A0E36
border-hairline #DFE5F0   border-strong #7E879B
border-hairline-inverse #1E2450   border-strong-inverse #5A6B94
text-primary #0F1620 text-secondary #4C5A75  text-inverse #FFFFFF  text-secondary-inverse #C3CEEA
state-ok #3FD79B/#0A7350   state-warn #E8A33D/#8A5406   state-alert #FF7A66/#B62D1B
```

**Two rules that hold the palette together.** Electric blue is *interface*, amber is *signal* — a
control is never a state colour. And the signal splits by ground: `#3D8BFF` passes on navy (5.61) and
fails on paper (3.01); `#1857C4` is the reverse.

**Primary button is `#1857C4` with a white label on both grounds** (6.56), plus a `#3D8BFF` hairline
on dark. **Focus ring follows the section, 2px with 2px offset** — a `#3D8BFF` ring *on* the
`#1857C4` fill is 1.98:1, so the offset is what makes it legal.

**Typography — Archivo + IBM Plex Mono. Two families, two delivered files** (budget ≤3). Display and
body are one superfamily separated by **optical width** (`wdth 118` vs `wdth 100`), not two families.
Mono is telemetry only. Sentence case headings, always. **The font files are built, not edited**:
`scripts/fonts/build-webfonts.py` (V47) cuts Archivo's unused condensed widths and splits each latin
face into a preloaded core and an on-demand rest file, pixel-identically. A revision ships under a new
filename, because `/fonts` is served immutable.

**Radius: instruments are not rounded** — `data 2px`, `control 6px`, `panel 10px`. Never 0.

Light and dark **sections** composed as a rhythm across the page. **No user-facing theme toggle.**
Never redraw or recolour the logo — and note it is a *plaque*, not a free-standing mark, so it
cannot sit on the navy ground until mono variants exist (V37).

**Prohibited patterns (brief 6.6).** Uniform rounded-card grids · three-column feature blocks as the
default answer · purple/blue AI gradients · abstract blobs · glass on everything · pill buttons
everywhere · giant centred headings in every section · identical section rhythm · decorative icons
that carry no meaning · stock corporate handshakes · stock "African businessman with tablet" ·
01/02/03 markers where the content is not a sequence · motion for its own sake · emoji as UI
iconography. Also: do not default to Inter + a purple gradient, and do not default to the current
AI-design cluster (cream + high-contrast serif + terracotta; near-black + one acid accent;
fake-broadsheet hairline columns). Those are defaults, not decisions.

**Simulated telemetry** is encouraged as visual language, but must use obviously illustrative
registration plates, be labelled as illustration where it could be mistaken for live data, and never
be described as real customer data.

**Motion (Sprint 12b).** Tokens in `lib/motion.ts`, mirrored as CSS variables; system in
`docs/ANIMATION_SYSTEM.md`. At most one pinned stage per page, Tier A only (ADR-0006). Reduced motion
is complete and static. **Shared motion CSS goes into the one global stylesheet** by an `@import` at
the top of `app/globals.css` (`pinned-sequence.css`, `micro-interactions.css`) — **never a CSS
module**: on Home a module became a second render-blocking stylesheet (V77).

**Photographs (4 Oct 2026).** Every shipped photo is registered in `lib/media.ts` (alt text, real
dimensions) and rendered through `ZoomImage` (`components/ui/zoom-image.tsx`): `whole` eases the photo
in on hover (CSS only), `area` is a 2× loupe for documents and devices. Hover-capable pointers only;
reduced motion drops the whole-image zoom. Styles in `components/ui/media.css`, @imported like the
motion CSS. A missing photo is an `ImagePlaceholder` (brief PART 18), never stock. **Never the old
site's product photos** (Kelvin); its premises photos are the **Mombasa** branch.

**Cards and glass (ADR-0008).** One `Card` (`components/ui/card.tsx`, light/dark by ground) for a
discrete thing the reader acts on: branch cards, the product buy box, download cards. Never for a
list meant to be compared (catalogue, blog, specs, FAQs) — that is the prohibited card grid. Glass is
the sticky header (85% navy + blur from 1024px, 96% below) and the menu sheet (from 640px), **opacity
set by contrast over a WHITE backdrop**, never by eye: an outlined control needs 96%, which is why the
cookie notice stays solid. Surface CSS is `components/ui/surfaces.css`, @imported like the motion CSS.
The header height is `--header-h`; anything sticky or anchored offsets by it.

## 7. SEO / LLM checklist per page type

Use the **`nebsam-seo`** skill. Full plan: `docs/SEO_LLM_STRATEGY.md`.

- Unique `<title>` (50–60 chars) · unique meta description (140–155) · **exactly one H1** ·
  self-referencing canonical · breadcrumbs visible **and** `BreadcrumbList` · OG/Twitter with a real
  1200×630 image · alt text on every image · links in **and** out.
- Schema: `Organization` + `WebSite` globally · `LocalBusiness` ×3 on branches · `Service` on
  solutions · `Product` (+ `Offer` **only** where a real price is published) on products · `Article`
  on posts · `FAQPage` on FAQ blocks. **Never** `Review`/`AggregateRating` without genuine collected
  reviews. Never markup that contradicts the visible page.
- **Content that matters is server-rendered.** Specs must not sit in a client-only tab — that is the
  exact failure this rebuild exists to fix.
- Answer-shaped: a short direct answer paragraph immediately under each question heading.
- The canonical company description is written **once** in `lib/company.ts` and reused verbatim in
  the footer, About, `llms.txt` and `Organization` schema. Never reword it per page.
- `llms.txt` is updated **in the same commit** as any change to routes, product names or company
  facts.
- Slugs are permanent. Confirm naming before minting a URL; a later change costs a 301.

## 8. Performance budgets — a sprint does not close if these are breached

| Metric | Budget |
|---|---|
| LCP (mobile, throttled 4G, mid-tier Android) | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| Initial JS per route (gzipped) | ≤ 180 KB |
| Total page weight — homepage | ≤ 1.5 MB |
| Total page weight — content pages | ≤ 1.0 MB |
| Largest single delivered image | ≤ 250 KB |
| Lighthouse mobile Performance | ≥ 90 |
| Lighthouse A11y / Best Practices / SEO | ≥ 95 |
| Web fonts | ≤ 3 files total |

Most visitors arrive on a mid-range Android on mobile data they pay for by the megabyte. **A
cinematic 8 MB site is a failure however good it looks on a MacBook on office fibre.** Measure on a
throttled mobile profile; record the numbers in every sprint report. Details:
`docs/PERFORMANCE_BUDGETS.md`.

## 9. Accessibility bar — WCAG 2.2 AA

Semantic HTML first, ARIA only where semantics fall short · visible focus ring on every interactive
element (a glass surface must not swallow it) · full keyboard operability including mega menu, cart,
carousels, modals · skip-to-content · 4.5:1 text contrast (3:1 large), **verified on dark and glass
sections specifically** · required alt text · labelled fields with inline specific errors ·
`prefers-reduced-motion` honoured · touch targets ≥ 44 px.

**Accessibility is never traded for a visual effect. If an effect cannot be made accessible, the
effect is cut.** Details: `docs/ACCESSIBILITY_PLAN.md`.

## 10. Security and privacy

Nebsam is a registered data controller and processor under Kenya's **Data Protection Act 2019**. The
site must not undermine that posture.

- **RLS on every table.** Anon key read-only against public views; service-role key server-side only.
- Admin protected by middleware **and** RLS. No client-side-only guards.
- Server-side Zod on every mutation. **Never trust client input or client prices** — recompute every
  total server-side from the database at order creation.
- Rate limiting on all public POST endpoints.
- Bot protection (honeypot + Turnstile) that never blocks keyboard-only users. **No Turnstile widget
  is rendered yet (V78): do not set the Turnstile keys until one is, or every enquiry is rejected.**
- Uploads: extension **and** MIME allowlist, size cap, private bucket, short-lived signed URLs.
- Security headers: CSP (report-only, then enforced), HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `frame-ancestors`.
- **No PII in logs, analytics, URLs or error messages. No customer data in seed files.**
- GA4 does not fire before cookie consent.
- `audit_log` written for every admin create/update/delete.

**Certificate verification was removed (ADR-0007, 28 September 2026)** at Kelvin's decision; brief
PART 9.2 still describes it until he amends the brief. If anything like it returns, the rule stands:
a vehicle plate is public information, so a plate-only lookup that reveals validity or expiry is a
target list for thieves. Never ship one.

**The School Bus Solution is the highest legal-sensitivity content on the site** — children's
personal data and optionally children's biometric data. Draft conservatively, state that biometric
attendance is optional with RFID or manual alternatives, never promise absolute safety, never
present alcohol screening as a legal or evidential test. Flag for legal review before launch.

## 11. Commands

The Next.js app landed in Sprint 1. The legacy CRA app was removed from `develop` and remains
recoverable on `main` and `chore/00-project-scaffold`.

```bash
npm run dev          # Next dev server
npm run build        # production build
npm start            # serve the production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # test suite                         (from Sprint 9)
npx supabase migration new <name>   # new migration       (from Sprint 3)
npx supabase db push                # apply migrations    (from Sprint 3)

MOTION_PLAYGROUND=1 npm run build   # a production build WITH the /dev/motion playground  (Sprint 12b)

npm run verify:roles                # the Sprint 12 gate — 38 RLS checks, per role (47 before ADR-0007)
npm run db:apply -- --status        # which migrations are applied, which are pending
npm run db:apply -- 0045_name.sql   # apply ONE migration by name
npm run db:apply -- --pending       # apply every pending migration, in order (safe since V80)
npm run storage:init                # create/repair the PRIVATE uploads bucket, and assert it is private
npm run format:check                # formatting, whole repo (.prettierignore says what is left out)
npm run format                      # apply it
```

**Test fixtures are a script, never a migration.** Migrations run everywhere in order, including
against production at cutover, so a migration that inserted test records would put them in the live
database.

**`npm run db:apply` and `npm run db:types` need `SUPABASE_ACCESS_TOKEN`**, a personal access token
that is local-development only. It was renewed on 28 September 2026 (V61 resolved), and 0041–0044
were applied that day, one at a time by name.

**The migration ledger is complete (V80, reconciled 28 September 2026).** 0001–0040 had been pasted
into the dashboard SQL editor before `apply-migration.mjs` existed, so its `schema_migrations` table
had never heard of them and `--pending` would have re-run all forty. They were recorded after
read-only checks of their effects; `--status` now reads 44 applied, 0 pending. **Anything applied
outside this script must be recorded in the ledger the same day**, or the trap comes back.

**`npm run verify:roles` creates four throwaway auth accounts, runs the matrix and deletes them.**
It asserts against the POLICIES, not the screens — the admin runs under the service-role key and
bypasses RLS entirely, so clicking around the admin proves nothing about the database boundary.

**Measure on the production build (`npm run build && npm start`), never on `next dev`** — dev builds
are not production builds and the budget numbers will lie. **Never measure a `MOTION_PLAYGROUND=1`
build either**: development-only pages are `page.dev.tsx`, built only in `next dev` or a flagged
build, and a built dev route changes how public routes are chunked (PERFORMANCE_BASELINE §11).

**Vercel previews.** `vercel.json` on `develop` and the branches cut from it builds them as Next.js
(V76); `main` does not carry it and keeps serving the CRA site until the Sprint 15 cutover. Previews
have no environment variables and sit behind Vercel Authentication.

**ESLint + Prettier + `tsc --noEmit` must pass before any commit.** Line endings are LF in every
working copy (`.gitattributes`), whatever a machine's `core.autocrlf` says: a CRLF checkout made
Prettier report every file as unformatted. `.prettierignore` leaves out `content-source/`, markdown
and generated files. Prettier is pinned at 3.9.9 in `package.json` (V84): use the npm scripts, and
change the version only on purpose, since a new Prettier can reformat unchanged files.

## 12. Files, naming and git

`kebab-case` files and folders · `PascalCase` components · `camelCase` functions · one component per
file · **no component over ~200 lines** — split it · route groups `app/(site)`, `app/(shop)`,
`app/(admin)`, `app/api` · shared types in `types/` · database types **generated** from Supabase,
never hand-written · no magic strings — routes, event names and statuses live in `lib/constants.ts`.

A dependency is added only with a one-line justification in the sprint report.

Branches: `main` (production, currently serving the live CRA site) ← `develop` (integration) ←
`sprint/NN-name` (work). Conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `perf:`,
`chore:`). Small, single-purpose commits — never a 60-file "sprint 4" commit. Never commit secrets,
raw media over ~2 MB, or generated output. Never force-push a shared branch. PR per sprint with the
sprint report as the description.

**Vercel production stays pinned to `main` until Sprint 15**, so the live site keeps serving while
the rebuild proceeds on `develop`.

## 13. Definition of Done — every sprint

- [ ] `tsc --noEmit`, lint and build all pass
- [ ] Rendered and interacted with in a real browser; screenshots captured
- [ ] Zero console errors or warnings on affected routes
- [ ] Mobile (360 px), tablet, desktop and ultrawide verified
- [ ] Keyboard-only pass on new interactive elements
- [ ] Contrast checked on any new dark or glass surface
- [ ] Perf budgets **measured, not assumed**
- [ ] Metadata + schema present and validated on new pages
- [ ] `reduced-motion` verified on any new animation
- [ ] No new `[[NEEDS_VERIFICATION]]` left unlogged
- [ ] No secrets, no PII, no fabricated content
- [ ] Docs updated (`CLAUDE.md`, `ASSET_MAP.md`, relevant architecture doc)
- [ ] Committed on the sprint branch in clean, scoped commits

## 14. Sprint methodology and the stop rule

Sprints 0–15 are listed with acceptance criteria in `docs/SPRINT_PLAN.md`. **Sprint 0 has no code.
Sprint 1 has no content migration. Do not merge sprints.**

Every sprint ends with the PART 21.2 report — completed, deviations, files, database changes,
dependencies added, verification actually run, performance numbers, accessibility, new
`NEEDS_VERIFICATION`, known issues, decisions needed from the human, recommended next step — and
then:

> **STOPPING HERE FOR REVIEW.**

## 15. What would make this project fail

Read at the start of every sprint. Building before understanding · inventing facts · a beautiful
8 MB site unusable on Kenyan mobile data · generic AI-template aesthetics · animation everywhere
meaning nowhere · an admin a non-technical person quietly abandons, killing the blog · content
copy-pasted from source documents with the caps lock still on · URLs minted before naming is settled
· a dropped WhatsApp chat losing an order because nothing was persisted · an endpoint that leaks
customer data or can be enumerated · client-only rendering that repeats the current
site's central failure · rolling sprints together and delivering 15,000 unreviewed lines.
