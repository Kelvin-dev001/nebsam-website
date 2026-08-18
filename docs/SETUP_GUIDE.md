# NEBSAM PROJECT — CLAUDE CODE SETUP GUIDE

Companion to `NEBSAM_MASTER_PROMPT.md`. Do all of this **before** your first Claude Code session.
Roughly 60–90 minutes of preparation that will save you several days of rework.

---

## 1. WHY FOLDER STRUCTURE MATTERS MORE THAN USUAL HERE

Claude Code reads your repository to decide what to do. Three failure modes are entirely caused by
messy inputs:

- **Ambiguous sources** — if brochure text, notes, and the live site's copy sit in one folder,
  Claude cannot tell which is authoritative, and it will guess.
- **Editable sources** — if source documents live where Claude also writes, it will "improve" them,
  and you lose your originals.
- **Heavy media in git** — hundreds of megabytes of photos make every operation slow and can
  break the Vercel build.

The structure below solves all three: one read-only source-of-truth tree, one drop zone, one
build tree, media kept out of git.

---

## 2. TARGET REPOSITORY STRUCTURE

```
nebsam-web/
├── CLAUDE.md                     ← Claude generates this in Sprint 0
├── README.md
├── .env.example                  ← every variable, commented, no real values
├── .gitignore
│
├── .claude/
│   ├── settings.json             ← shared project settings (committed)
│   ├── settings.local.json       ← your personal overrides (gitignored)
│   ├── skills/                   ← project-specific skills (see §5.3)
│   │   ├── nebsam-brand/SKILL.md
│   │   ├── nebsam-content/SKILL.md
│   │   └── nebsam-seo/SKILL.md
│   └── commands/                 ← reusable slash commands (see §6.3)
│       ├── sprint-start.md
│       ├── sprint-close.md
│       └── content-migrate.md
│
├── docs/
│   ├── brief/
│   │   └── 00-MASTER-BRIEF.md    ← paste NEBSAM_MASTER_PROMPT.md here FIRST
│   ├── decisions/                ← ADR-0001-*.md, one per architectural decision
│   └── (Claude writes the rest of the Sprint 0 docs here)
│
├── content-source/               ← READ-ONLY SOURCE OF TRUTH. Claude never edits.
│   ├── README.md                 ← "Authoritative. Do not modify. Rewrite into app content."
│   ├── 01-solutions/
│   │   ├── fuel-monitoring/
│   │   │   ├── write-up.md
│   │   │   └── notes.md
│   │   ├── ai-video-telematics/
│   │   ├── speed-governor/
│   │   ├── container-e-seal/
│   │   ├── radio-communication/
│   │   └── vehicle-key-programming/
│   ├── 02-products/
│   │   ├── trackers/
│   │   │   ├── standard-tracker/write-up.md
│   │   │   ├── bluetooth-tracker/write-up.md
│   │   │   ├── anti-jammer-tracker/write-up.md
│   │   │   ├── hybrid-tracker/write-up.md
│   │   │   ├── hybrid-pro-tracker/write-up.md
│   │   │   ├── hybrid-pro-max-tracker/write-up.md
│   │   │   └── recovery-tracker/write-up.md
│   │   └── car-alarms/
│   │       ├── hybrid-car-alarm/write-up.md
│   │       ├── hybrid-plus-car-alarm/write-up.md
│   │       ├── hybrid-pro-plus/write-up.md
│   │       ├── hybrid-promax/write-up.md
│   │       └── hybrid-promax-plus/write-up.md
│   ├── 03-company/
│   │   ├── about.md
│   │   ├── branches.md
│   │   ├── coverage.md
│   │   ├── team.md
│   │   └── company-profile.pdf
│   ├── 04-testimonials/testimonials.md          ← the 6 real ones, attributed
│   ├── 05-certifications/                        ← certificate scans + a README naming each
│   ├── 06-downloads/                             ← brochures, catalogues, datasheets (final PDFs)
│   ├── 07-legacy-site/                           ← exported copy from the current site
│   │   ├── page-copy/
│   │   └── indexed-urls.txt                      ← for the 301 map (see §3.4)
│   └── 08-pricing/price-list.md                  ← if prices are to be published
│
├── brand/
│   ├── logo/                     ← every logo variant: transparent, mono, favicon source
│   ├── colors.md                 ← any existing brand values you already use
│   └── fonts/                     ← licensed font files, if any
│
├── media-source/                 ← RAW originals. GITIGNORED. Never committed.
│   ├── team/
│   ├── technicians/
│   ├── vehicles/
│   ├── offices/
│   ├── devices/
│   ├── products/
│   ├── platform-screenshots/
│   └── client-logos/
│
├── _inbox/                       ← your drop zone for anything new, any format
│
├── public/                       ← optimised, web-ready assets only
├── app/ · components/ · lib/ · types/ · content/
├── supabase/migrations/
└── package.json
```

### Non-negotiables in this structure
1. **`content-source/` is read-only.** Say so in its README and in `CLAUDE.md`.
2. **`media-source/` and `_inbox/` are gitignored.** Claude reads them locally, produces optimised
   derivatives into `public/` or uploads to Supabase Storage/Cloudinary, and records everything in
   `docs/ASSET_MAP.md`.
3. **Numeric prefixes** (`01-`, `02-`) so folder order communicates priority.
4. **`kebab-case` everywhere.** Spaces, `&`, and capitals in filenames cause shell-quoting bugs
   during automated work. Rename `HYBRID PROMAX  PLUS CAR ALARM.txt` →
   `hybrid-promax-plus/write-up.md` *before* you start.
5. **One concern per file.** Split a document that covers three products into three.

---

## 3. PREPARATION CHECKLIST

### 3.1 Content (highest leverage — do this properly)
- [ ] Move each product/solution write-up into its own folder as `write-up.md`
- [ ] Fix the ProMax naming conflict: two documents currently both title themselves
      "Hybrid ProMax Car Alarm" (one is the vibrating-remote alarm, one adds Anti-Jammer GPS).
      Decide the final names now — slugs are permanent, and renaming later costs 301s.
- [ ] Add `content-source/README.md` with one line per file: what it is, whether it is final
- [ ] Write `content-source/04-testimonials/testimonials.md`: quote, name, company, industry,
      and whether the name may be published
- [ ] Name each certificate scan by what it is (`kebs-standardization-mark-permit-2025.pdf`)
- [ ] Decide which marketing claims you can substantiate. The source documents contain
      "50,000 customers", "70+ corporate clients", "over 10 years", "#1 in Kenya". If you cannot
      evidence them, they should not be published — instruct Claude to reframe them.

### 3.2 Media
- [ ] Drop originals (full resolution, no compression) into `media-source/`, foldered as above
- [ ] Rename descriptively: `mombasa-branch-exterior-01.jpg`, not `IMG_4471.jpg`
- [ ] Platform screenshots: capture at high resolution, and **blur or replace any real customer
      registration plates, names and phone numbers** before they enter the repo
- [ ] Put the logo variants in `brand/logo/`

### 3.3 Accounts and access
- [ ] GitHub repo ready, you are the owner
- [ ] Supabase project created (note the region — choose the closest available to East Africa)
- [ ] Vercel project connected to the repo
- [ ] Google Analytics 4 property + Search Console access
- [ ] `.env.local` populated locally (never committed)
- [ ] Node.js LTS, `git`, and Claude Code installed and updated

### 3.4 The old site — mostly done
The live URL inventory is already captured from the repo's `public/sitemap.xml` and the proposed
301 map is written into PART 7.0 of the brief. Two things left:
- [ ] Cross-check **Search Console → Pages** for indexed URLs that are *not* in that sitemap, and add
      them to `content-source/07-legacy-site/indexed-urls.txt`
- [ ] Note anything currently ranking that must not disappear

---

## 4. `.gitignore` AND `.claude/settings.json`

Add to `.gitignore`:
```
media-source/
_inbox/
.env*.local
.claude/settings.local.json
.next/
node_modules/
*.log
```

`.claude/settings.json` (committed — shared with anyone else on the project):
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npx tsc --noEmit)",
      "Bash(npx next *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Read(//content-source/**)",
      "Read(//media-source/**)"
    ],
    "deny": [
      "Write(//content-source/**)",
      "Read(//.env*)",
      "Bash(git push --force*)",
      "Bash(rm -rf *)"
    ]
  }
}
```

Denying writes to `content-source/` and reads of `.env*` is the cheapest protection you can buy.
Do **not** run Claude Code with permissions fully bypassed on a project with production
credentials and a live deployment.

---

## 5. SKILLS AND PLUGINS

Claude Code's official marketplace (`claude-plugins-official`) is added automatically. If it isn't,
add it manually:

```
/plugin marketplace add anthropics/claude-plugins-official
```

Then browse with `/plugin` (Discover tab) or at claude.com/plugins. The catalogue changes, so
verify names there — the commands below are correct as of now.

### 5.1 Install these (in priority order)

| Plugin | Command | Why for this project |
|---|---|---|
| **frontend-design** | `/plugin install frontend-design@claude-plugins-official` | **The most important one.** This is Anthropic's own skill for producing distinctive, non-templated UI. It explicitly pushes toward deliberate typography, a signature element, and away from the AI-design clichés — exactly your "not AI-generated" requirement. |
| **webapp-testing** | `/plugin marketplace add anthropics/skills` then `/plugin install example-skills@anthropic-agent-skills` | Drives a real browser with Playwright: loads pages, screenshots them, reads console errors. This converts "Claude says it built it" into "Claude showed me it works". Essential given how much visual work this project involves. |
| **security-guidance** | `/plugin install security-guidance@claude-plugins-official` | Reviews each change for vulnerabilities as it is written. You are building auth, file upload, a public verification endpoint and an admin panel on a registered data-processor's site — this pays for itself. |
| **typescript-lsp** | `/plugin install typescript-lsp@claude-plugins-official` + `npm i -g typescript-language-server typescript` | Gives Claude real type diagnostics after every edit and proper go-to-definition. On a large TypeScript codebase this materially reduces broken builds. Requires the binary to be on your `PATH`. |
| **supabase** | `/plugin install supabase@claude-plugins-official` | Direct Supabase context — schema, migrations, policies — instead of Claude guessing at your database. |
| **vercel** | `/plugin install vercel@claude-plugins-official` | Deployment status and build logs, so Claude can diagnose its own failed builds. |
| **commit-commands** | `/plugin install commit-commands@claude-plugins-official` | Clean, scoped conventional commits. Directly supports the git discipline in PART 22 of the brief. |
| **pr-review-toolkit** | `/plugin install pr-review-toolkit@claude-plugins-official` | Independent review of each sprint PR before you merge — a second opinion on Claude's own work. |
| **github** | `/plugin install github@claude-plugins-official` | Issues and PRs from inside the session. Useful for tracking the `NEEDS_VERIFICATION` register. |

### 5.2 Consider, but do not install everything
- **figma** — only if you produce Figma references
- **document-skills** (`/plugin install document-skills@anthropic-agent-skills`) — pdf/docx/xlsx
  handling. Useful when your brochures and company profile are PDFs Claude must read, or when you
  want generated product datasheets
- **skill-creator** — for writing the project skills in §5.3
- **claude-md-management**, **code-simplifier**, **feature-dev** — helpful, but add context cost

**Restraint matters.** Every installed plugin consumes context on every turn, and context is the
scarce resource on a project this size. Start with the first four in §5.1 and add the rest as the
need appears. The `/plugin` detail view shows each plugin's context cost before you install.

### 5.3 Write three project-specific skills (this is the real differentiator)

Generic skills make Claude a better developer. Project skills make it a better *Nebsam* developer.
Put these in `.claude/skills/` and Claude loads them automatically when relevant. Use
`skill-creator`, or write them by hand — a `SKILL.md` is just YAML frontmatter plus markdown.

**`nebsam-brand/SKILL.md`** — triggers on any UI work.
Frontmatter description: *"Nebsam design tokens, typography, motion levels and prohibited
patterns. Use whenever building or restyling any Nebsam UI."*
Contents: the final hex tokens, type scale, spacing scale, the prohibited-patterns list, the
signature element rules, animation levels with durations, contrast requirements. Once this exists,
every session produces on-brand work without you re-explaining the brand.

**`nebsam-content/SKILL.md`** — triggers on content migration.
Frontmatter description: *"Convert a Nebsam source document into a website page. Use when
migrating anything from content-source/."*
Contents: the 11-part solution page model, the writing standards, the rule that hedging language
is preserved verbatim, the anti-fabrication rules, the `[[NEEDS_VERIFICATION]]` convention, and a
worked before/after example using one real product document. The worked example is what makes it
work — show it once, get it right fifteen times.

**`nebsam-seo/SKILL.md`** — triggers on any new page.
Frontmatter description: *"SEO and LLM-discoverability checklist for every Nebsam page. Use when
creating or editing any route."*
Contents: metadata rules with character limits, which schema type each template gets, internal
linking requirements, the answer-shaped-content rule, the canonical company description, and the
`llms.txt` update rule.

Write them at the end of Sprint 0, once the real values are decided — then they govern Sprints
1–15 automatically.

---

## 6. WORKING WITH CLAUDE CODE ON THIS PROJECT

### 6.1 Session zero
```bash
cd nebsam-web
git checkout -b sprint/00-discovery
claude
```
Then:
1. `/plugin` — install the §5.1 set, `/reload-plugins` if prompted
2. Press **Shift+Tab** to cycle into **Plan Mode** — Claude analyses and proposes without editing.
   This is exactly the posture Sprint 0 requires.
3. Paste the kickoff block from PART 0 of the brief.
4. Answer its clarifying questions in one message.
5. Read the Sprint 0 documents properly. This is the highest-leverage hour of the whole project —
   an approved architecture you disagree with becomes fifteen sprints of the wrong website.

### 6.2 The per-sprint rhythm
```bash
git checkout develop && git pull
git checkout -b sprint/04-homepage
claude
```
Start each sprint with a fresh context (`/clear`) and a prompt shaped like this:

```
Read CLAUDE.md and docs/brief/00-MASTER-BRIEF.md.

We are executing SPRINT 4 — Homepage (production) only.
Sprint 3 is complete and merged; do not revisit it.

Before coding: restate the sprint scope, list the files you expect to create or change,
and flag anything in the sprint that depends on a decision I have not yet made.

Rules that apply: PART 2 (operating rules), PART 6 (design), PART 14 (performance budgets),
PART 21 (definition of done).

Verify your work in the browser and screenshot it. Then produce the sprint report and stop.
```

Naming the specific PARTs is what keeps a long brief effective — it tells Claude what to re-read
rather than hoping it remembers.

### 6.3 Custom slash commands
Put reusable prompts in `.claude/commands/` as markdown files; each becomes a slash command.

`.claude/commands/sprint-close.md`:
```
Close the current sprint:
1. Run typecheck, lint and build. Fix what fails.
2. Load each changed route in the browser; screenshot; report console errors.
3. Measure LCP, INP, CLS, initial JS and total page weight on a throttled mobile profile.
   Compare against PART 14 budgets and state pass/fail per metric.
4. Validate metadata and structured data on new pages.
5. Keyboard-only pass on new interactive elements.
6. Update CLAUDE.md, ASSET_MAP.md and NEEDS_VERIFICATION.md.
7. Commit in small scoped commits, push the branch, open a PR with the sprint report
   as the description.
8. Output the sprint report in the PART 21 format, then stop.
```

`.claude/commands/content-migrate.md`:
```
Migrate the source document at $ARGUMENTS into the site.
Apply the nebsam-content skill. Do not edit the source file.
Preserve every hedging phrase. Log gaps as [[NEEDS_VERIFICATION]].
Produce the page, its metadata, its schema, its FAQs and its cross-links.
Show me a diff summary and the rendered screenshot before committing.
```

### 6.4 Context management
Context is your bottleneck. A few habits:
- `/clear` between sprints; `/compact` mid-sprint when the session gets long
- `/context` to see what is consuming the window
- Keep `CLAUDE.md` tight — it loads every session. Detail belongs in `docs/`, which Claude reads
  on demand
- Use `#` to append a durable instruction to `CLAUDE.md` mid-session when you correct something
  you would otherwise correct again
- Ask for subagents on wide read-only work ("audit every solution page for missing schema") so
  the findings, not the whole crawl, come back into your context

### 6.5 Review checkpoints where you must not rubber-stamp
1. **End of Sprint 0** — architecture, taxonomy, product naming, URL scheme. Everything downstream
   inherits these.
2. **End of Sprint 1** — the visual language. If it looks templated, say so bluntly and ask for
   two alternative directions. Fixing this in Sprint 1 costs a day; in Sprint 10 it costs a month.
3. **End of Sprint 3** — the schema and RLS policies.
4. **End of Sprint 9** — sit a non-technical colleague in front of the CMS and have them publish a
   post with no help. If they get stuck, the blog will not happen weekly, and the SEO strategy
   dies quietly.
5. **End of Sprint 14** — the performance budgets, measured on a real mid-range Android phone on
   mobile data, not in a desktop browser.

---

## 7. TWO WEEK-ONE HABITS THAT PREVENT MOST PROBLEMS

**Ask for the plan before the code.** "Show me the plan, wait for approval" costs one message and
routinely saves a full sprint of misdirected work.

**Make it prove things, don't let it assert them.** "Screenshot it", "run the typecheck", "show me
the Lighthouse numbers", "load it at 360px". Verification is the difference between a project that
converges and one that accumulates plausible-looking debt.

---

## 8. STATUS — WHAT IS SETTLED AND WHAT REMAINS

### Settled (recorded in PART 1.5 of the brief — do not let Claude Code re-litigate these)
Product naming across all families · company name "Solutions" · Nairobi = Kiambu Road/Ridgeways ·
Mombasa = Makupa · +254 727 727 461 not published · radio prices current and publishable ·
prices exclusive of VAT · all WhatsApp orders to 0759 000 111 · certificate lookup by number plate ·
products and shop merged into one page type · "over 10 years" approved · KEBS test report quotable ·
KES 3,000/year is a CAK annual licence renewal · IRMS to be mentioned on the speed governor pages.

### Also now settled by inspecting the repo
The current stack is **Create React App**, not Next.js — so this is a migration, not a refactor.
The existing sitemap gave us the full live URL inventory, so the 301 map is written and moves to
Sprint 2. Existing certificate scans, six client logos, and a large amount of real product and
premises photography are already in `public/` and should be inventoried before commissioning new
photography.

### Remaining — yours to answer, none of them blocking for Sprint 0
1. **Certificate verification second factor.** Plate-only lookup would tell anyone which vehicles
   carry a Nebsam installation and which have **expired** — a targeting list. Pick: plate + last 4
   digits of the registered phone (recommended, no SMS cost), or plate + OTP. Printed-certificate QR
   codes bypass the second factor via a signed link, so the legitimate path stays one tap.
2. **NTSA transmission.** What the video telematics system actually sends to NTSA, and under what
   obligation. Unanswered, so the claim stays off the site.
3. **IRMS.** Full expansion and the correct way to describe Nebsam's relationship to it.
4. **Installation and delivery terms** per product category — included in the price or quoted?
5. **Social media URLs** for the footer and `sameAs` schema.
6. **Blog authors** — real names, roles, short bios, photos.
7. **Google properties** — existing GA4, Search Console and Business Profile, or create new?
8. **Data protection contact** for the privacy policy.
9. **Client logo permissions** — six logos are in the repo; confirm each against the ~70-name list.
10. **School bus specifics** — the eight items in the write-up's source notes (payment gateway,
    biometric availability, alcohol sensor spec, retention periods, reference schools).
11. **Target launch date and named sprint approver.**

Items 1–3 are worth answering early; the rest can wait until their sprint.
