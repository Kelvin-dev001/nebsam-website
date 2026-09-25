# Claude Code — Nebsam Sprint 12b: Motion & Scroll

## 1. Mission and context

You are working in `github.com/Kelvin-dev001/nebsam-website`, the Next.js App Router rebuild of nebsamdigital.com for Nebsam Digital Solutions (K) Ltd, a Kenyan vehicle telematics company. The legacy Create React App site rendered its content client-side, so crawlers and LLM assistants saw almost nothing. Server-rendered, crawlable content is the core problem this rebuild solves, and nothing in this sprint may weaken it. Sprints 0–12 are merged into `develop` (@ `7b7f1e7`). Direction B, "Jamming" (ADR-0002), is the accepted visual system.

**This sprint delivers a motion and scroll layer on pages that already exist:** motion tokens, an SSR-safe scroll foundation, one Home signature set piece and a micro-interaction pass. None of it may cost crawlability, accessibility or the Kenyan mobile budget. Stop after every task.

## 2. Read first

Read these before T0:

1. `CLAUDE.md`, and `docs/brief/00-MASTER-BRIEF.md` PART 1.5, 2, 3, 6, 9.1, 14, 15, 17 and 18
2. `docs/decisions/ADR-0002-visual-direction.md`, `docs/decisions/ADR-0004-performance-budget.md`
3. `docs/DESIGN_SYSTEM.md`, `ANIMATION_SYSTEM.md`, `ACCESSIBILITY_PLAN.md`, `PERFORMANCE_BUDGETS.md`, `PERFORMANCE_BASELINE.md`, `ASSET_MAP.md`, `NEEDS_VERIFICATION.md`, `CLIENT_PERMISSIONS.md` (all in `docs/`)
4. `docs/design/FALCON_REFERENCE_BRIEF.md` and `docs/design/S12B_MOTION_DECISION_MEMO.md`. **If either is missing, STOP and ask Kelvin. Never recreate them.**
5. The existing motion code: `lib/motion.ts`, `components/motion/*`, `components/telemetry/signal-readout.tsx`, the reduced-motion block in `app/globals.css`, `app/(site)/page.tsx`, `components/home/*`
6. For copy: the `content-source/` files named in memo D3 (read-only)

```
DECISIONS — Kelvin fills before running
(options are defined in S12B_MOTION_DECISION_MEMO.md; the first option is Cowork's recommendation)
D0  Branch ............ sprint/12b-motion-scroll | other                        ANSWER:
D1  Visual direction .. A Option B whole, Falcon = mechanics only | B | C       ANSWER:
D2  Tiers ............. memo table, no pins below 768px | adjusted as noted     ANSWER:
D3  Home story ........ H1 One vehicle, instrumented | H2 | H3 | H4             ANSWER:
D3b Hero .............. b readout moves to beat 5, 3 headline drafts | a | c    ANSWER:
D4  Scroll build ...... native sticky + IO + CSS scroll-driven | Motion hooks  ANSWER:
D5  Asset generation .. none | approved list                                   ANSWER:
D6  NV-1 to NV-5 ...... Claude Code logs them in T0 | Kelvin logs them          ANSWER:
D7  ADR-0006 .......... A permit native sticky pinning | B no pin               ANSWER:
D8  Tooling ........... as memo D8 | changes as noted                          ANSWER:
```

If any ANSWER is blank, stop at T0 and ask. Where an answer differs from the recommendation, follow the answer and adapt the tasks to it.

## 3. Non-negotiables

- Never fabricate facts, statistics, testimonials or specs.
- Preserve hedging language verbatim.
- Confirmed product names: Standard Tracker · Hybrid Car Alarm · Hybrid ProMax Car Alarm (vibrating key remote) · Hybrid ProMax Plus Car Alarm (adds Anti-Jammer GPS) · Hybrid Dashcam and AI Vehicle Video Telematics are separate products · Nebsam Digital Solutions (K) Ltd.
- WhatsApp orders go to +254 759 000 111.
- Never publish +254 727 727 461.
- Prices are exclusive of VAT.
- The NTSA data-transmission claim and the IRMS description stay unpublished.
- Performance gates on Lighthouse mobile: LCP ≤2.5s, total page weight ≤1.5MB, initial JS ≤180KB gzipped.

Also binding:

- The full budget table in `CLAUDE.md` §8 applies: CLS ≤ 0.05, content pages ≤ 1.0 MB, Performance ≥ 90, other categories ≥ 95. Where two values differ, the stricter one wins.
- The headline rejected in Sprint 1 ("A jammer can silence a tracker…") never returns in any form.
- No Falcon copy, imagery, icons or figures.
- `content-source/` is read-only.
- No dependency is added unless D4 names it (brief 2.5).

## 4. Skill roster and precedence

When layers conflict, the earlier one wins: **binding decisions → performance gates → accessibility → SEO/crawlability → Nebsam tokens (per the memo) → Emil → scroll-craft → taste / Falcon reference.** When a skill conflicts with a higher layer, follow the higher layer and log the conflict (skill, rule, what you did).

Already resolved; do not reopen: reduced motion is complete and static, with instant reveals (not Emil's or scroll-craft's "gentler, not zero"). Em dashes and eyebrows follow Nebsam's copy and design system. `lib/motion.ts` names and values stay, and press is `translate-y-px`.

**Emil** (`.claude/skills/`: `emil-design-eng`, `animate`, `review-animations`, `find-animation-opportunities`)

- Owns motion tokens (easing curves, duration scale, spring presets), enter/exit, hover/press/focus and micro-interactions.
- Every Emil skill gives one canned line if invoked with no question, so always pass a specific task and file paths.
- High-frequency actions (nav, filters, the WhatsApp order CTA, add to cart) get minimal or no animation. Focus rings appear instantly.
- **`review-animations` is a mandatory gate before any task closes.** The model cannot invoke it, so read its `SKILL.md` and `STANDARDS.md`, apply the method to the task's diff, and put the findings table and Block/Approve verdict in the STOP report. Kelvin may also run `/review-animations`.
- Never install or run `improve-animations`.

**scroll-craft** (plugin `nateherk-design`, invoked as `/nateherk-design:scroll-craft`; record its folder as `SC_DIR`)

- Owns scroll set pieces on Tier A pages. Its interview is answered from §7, never improvised.
- Its harness (`shoot.mjs`) and contact sheet run on every set piece. Its refuse list stands except where §3 or §6 decide otherwise.
- No generated assets without Kelvin's written approval; `KIE_AI_API_KEY` stays unset.
- Take the process, not the engine: never copy `engine/scrollcraft.*` into the app (memo D4).
- Suppress the fingerprint gate, the four-device-family minimum, the layered hero and a new signature move. This is one set piece on an existing page.
- The workspace is `.scrollcraft/`, gitignored. Only the brief is copied into `docs/design/`.

**taste** (`/taste`) is reference only. Run it with export target Skip so `CLAUDE.md` is never touched, and move its output to `docs/design/reference/`.

## 5. Motion tiers

These follow memo D2, adjusted by Kelvin's D2 answer.

- **Tier A — immersive scroll.** Home, `/solutions/vehicle-security` and `/solutions/fuel-monitoring`. At most one pinned signature sequence per page, with one engineered peak. That sequence is the page's single Level 4. **Build Home only this sprint.**
- **Tier B — reveals and micro-interactions.** Products and shop, industries, about, coverage and branches, every other solution page, resources.
- **Tier C — micro-interactions only, zero scroll effects.** The WhatsApp order flow (cart, order), certificate verification, contact and forms (quote, book installation, suggestions), legal pages and admin.

Pins run only at ≥ 768px with a fine pointer. Below that, the same markup renders as stacked flow with Level 2 reveals.

## 6. Motion engineering rules

- The SSR HTML renders all content fully visible. Hidden start states apply only after hydration, via a class on `<html>`, so crawlers and no-JS users see everything. Keep the existing `Reveal` contract: decide before paint, and never hide what is already on screen.
- **Pinned primitive:**
  - The server renders an ordinary ordered list of steps in normal flow.
  - A client enhancer always adds `html.sc-ready` once it has decided (the harness waits for it). It adds `data-pinned="on"` only when motion is allowed, the viewport is ≥ 768px and the pointer is fine. Hidden states key off `data-pinned` only.
  - Step state comes from IntersectionObserver sentinels. The progress rail uses CSS scroll-driven animation behind `@supports (animation-timeline: view())`, with IntersectionObserver as the fallback. **No scroll event handlers.**
  - Emit `data-sc-act="pin"`, `data-sc-span`, `data-sc-stage` and `data-sc-cue` for the harness.
- Inactive steps use opacity only. Never `display:none`, `visibility:hidden`, `content-visibility`, `inert` or `aria-hidden`. Focus inside a step activates that step.
- The LCP element never animates in.
- Animate `transform` and `opacity` only. CLS ≤ 0.05 (the repo budget replaces the brief's 0.1).
- Under `prefers-reduced-motion`, scroll-linked motion is off, smooth scroll is off and reveals are instant.
- Smooth scroll, if adopted, applies to fine pointers only; phones keep native scrolling. Anchors, keyboard scrolling, find-in-page and sticky-header offsets (`scroll-margin-top`) must still work.
- Motion and scroll code is dynamically imported per route, never in the shared initial bundle, and set-piece JS loads only once its section is within one viewport (never before LCP). Report the bundle delta for every task.
- No video scrubbing or image sequences on mobile unless they fit the 1.5 MB budget with a poster fallback.
- Use `next/image` responsive images. No duplicated desktop/mobile DOM.
- Test with the Lighthouse mobile preset (Slow 4G, 4× CPU), targeting mid- to low-end Android on Kenyan networks. Follow `PERFORMANCE_BASELINE.md` §3: production build, warmed server, 9 runs, medians, and A/B as interleaved pairs against T0. Judge budgets on a Vercel preview when one exists.
- Set-piece copy lives beside its component as typed constants (the existing home pattern), each with a comment naming its source file. Illustrative telemetry uses the plate `KXX 000X` and the caption "Illustration — not live customer data".

## 7. scroll-craft interview answer sheet

Sources are in brackets. **ASK KELVIN** means stop and ask; never fill that item yourself.

**Audiences**

- Fleet managers "technical about vehicles and not about software" [brief 5.2], in logistics, cross-border, fuel transport, construction and corporate fleets; PSV and matatu saccos, school transport, car hire [brief 4.3].
- Owners of single vehicles worried about theft [`standard-tracker` write-up].
- Search engines and LLM assistants, which read only server HTML [brief PART 1].

**Visitor journeys** [brief 3.7, 9.1, 10]

- Worried owner: Home → `/solutions/vehicle-security` → product → WhatsApp.
- Fleet manager: Home → `/solutions/fuel-monitoring` or AI video → quote.
- Buyer: `/products` → cart → WhatsApp checkout (Tier C).
- Existing customer: `/support/verify-installation` (Tier C).
- There is one action, with one label everywhere: "Talk to us on WhatsApp" [`components/home/hero.tsx`].

**Emotional direction**

- Vibe: "premium corporate foundation + futuristic telematics + industrial engineering" [6.1]; instrumentation, not brochure [6.3]; 7/10, "alive and engineered, never restless" [17].
- What the visitor must conclude: "these are the most technologically advanced vehicle tracking and fleet intelligence people in Kenya". It is earned by the page and **never written as copy** [PART 1].
- Range: premium-minimal industrial instrument [ADR-0002]. Structure: distinct scenes. No continuous world, no scrub video.
- Feeling curve if D3 = H1: recognition (the vehicle starts its day) → confidence (history and boundaries) → unease (fuel that goes missing) → trust (a third party says "Complies") → tension then relief (jamming detected, response triggered) → resolve (WhatsApp). The peak is beat 5 and gets the largest span.
- Tell-someone sentence, references from any medium, and the curve and peak if D3 is not H1: **ASK KELVIN.**

**Proof points (verified only)**

- "Over 10 years" [brief 1.5 #15].
- "70+ corporate clients" [brief 1.5]: text only, and never a counter until NV-1 is answered.
- Branches: Nairobi (Kiambu Road, Ridgeways), Mombasa (Makupa Roundabout), Nakuru (Lower Bedi Road) [3.2]. The coverage towns listed in 3.4, never a count of agents or technicians.
- KEBS laboratory report BS202445237, 5 Feb 2025, "Complies", seven parameters including an in-built battery lasting at least 30 minutes. Permit SM#84618 under KNWA 3006:2024, product-scoped to STREAMAX video telematics cameras [3.5].
- Capability lines, with their hedges verbatim, from the source files named in memo D3.

**Available assets** [ASSET_MAP]

- Primary medium: type and CSS telemetry in the fonts already loaded, at zero image weight.
- Usable after checks: premises photos (branch unknown, NV-3), product photos (device unverified: **ASK KELVIN**), `public/certificates/kebs-permit-terms.jpg`.
- Not available: hero photography, Nebsam-branded platform screenshots (V13), testimonials (V15), permitted client logos (V12), video (NV-4), a logo for dark grounds (V37). Never use the legacy concept or hero images (NV-2).

## 8. Task sequence

**Stop and report after each task.**

**T0 — Setup** (no app code)

1. Run `git fetch` and check out `develop`. Confirm the tree is clean and that the only commit after `7b7f1e7` is the one adding these Sprint 12b docs (`docs/design/`, `docs/prompts/`). If anything else has landed, list those commits and STOP. Otherwise create the D0 branch.
2. Record the baseline: the `npm run build` First Load JS table, and 9-run Lighthouse medians for `/` and `/solutions/fuel-monitoring`.
3. Install Emil's skills: `npx skills@latest add emilkowalski/skills --skill emil-design-eng --skill animate --skill review-animations --skill find-animation-opportunities -a claude-code --copy -y`.
4. Ask Kelvin to type `/plugin marketplace add nateherkai/scroll-craft`, `/plugin install nateherk-design` (user scope), and `/reload-plugins` if prompted. Record the folder under `~/.claude/plugins` that contains `scripts/doctor.mjs` as `SC_DIR`.
5. Run `npm i --no-save playwright-core`. Confirm a full ffmpeg build (Windows: `winget install Gyan.FFmpeg`) and Chrome. From the repo root, `node "$SC_DIR/scripts/doctor.mjs"` must pass every required line; the API-key line stays missing by design.
6. Write `.scrollcraft.json` as `{ "workspace": ".scrollcraft" }`, gitignore `.scrollcraft/`, and run `node "$SC_DIR/scripts/workspace.mjs" --ensure`.
7. Run `git clone https://github.com/senlindesign/taste-skill ~/.claude/skills/taste` and `claude mcp add playwright -s user -- npx -y @playwright/mcp@latest --isolated`.
8. If D6 says so, log NV-1 to NV-5 in `docs/NEEDS_VERIFICATION.md`. Commit as a chore, then STOP and ask Kelvin to restart Claude Code.

**T1 — Reference extraction**

- Run `/taste https://falcontrackers.com`, stating "export target: Skip; crawl scope: single page" in the same message. Move `falcontrackers.md` and `.json` to `docs/design/reference/`, then confirm `git diff CLAUDE.md` is empty.
- Reconcile the output with `FALCON_REFERENCE_BRIEF.md` §5: where they agree, where they conflict, and anything the brief missed.
- Propose token additions as a table (name, value, use, contrast, reason). Implement nothing. ADR-0002 forbids a new accent colour or a new font file.

**T2 — Tokens**

- Implement the D1-approved token additions in `app/globals.css`, `tailwind.config.ts` (mapping only) and `lib/motion.ts`, extending existing names rather than forking them. Reduced motion runs through the existing hook and CSS backstop.
- If D7 = A, write `docs/decisions/ADR-0006-pinned-scroll.md` and amend `ANIMATION_SYSTEM.md` §5.
- Build a `/dev/motion` playground: noindex/nofollow, absent from the sitemap and `llms.txt`, `notFound()` in production unless `MOTION_PLAYGROUND=1`. It shows every token and level, plus reduced motion.
- Run the review-animations method.

**T3 — Scroll foundation**

- Implement D4: the pinned primitive per §6, the smooth-scroll policy, and the SSR-safe reveal (the existing `Reveal`, extended only if needed).
- Demonstrate both on `/dev/motion`, with sample content labelled as illustration.
- Bundle report: First Load JS per route against T0, the enhancer chunk's size, and proof that it is absent from the shared chunks.
- Run the harness against `/dev/motion` at 1440×900, at 390×844 and with `--reduced-motion`.

**T4 — Home signature set piece**

- Work through scroll-craft Steps 0–2 using §7 and write `docs/design/sets/home-BRIEF.md`: the journey, the feeling curve, one peak holding the largest span, the tell-someone sentence, and the device-per-beat score.
- Build per D3 and D3b with the T3 primitive. Every line of copy traces to its named source file. If D3b = (b), draft three hero headlines in the report and ship none of them.
- Run the harness at 1440×900, at 390×844 and under reduced motion. Read each `sheet.png` yourself, then run scroll-craft's feel check.
- Run Lighthouse mobile, paired against T0.

**T5 — Micro-interaction pass**

- Scope: `components/ui/button.tsx`, `components/layout/header.tsx`, `mobile-nav.tsx`, `whatsapp-button.tsx`, `components/ui/field.tsx`, `components/forms/enquiry-form.tsx` and `components/cart/add-to-cart.tsx`. There is no Card primitive; do not create one.
- Order: `/find-animation-opportunities` → **Kelvin approves the list** → `/animate` for each approved item → the review-animations method.

## 9. Acceptance checklist (every task)

- [ ] Lighthouse mobile gates pass (the §3 values, as medians, paired against T0)
- [ ] CLS within the limit (≤ 0.05)
- [ ] No-JS render check: `curl` the production HTML; every step's text appears exactly once
- [ ] Reduced-motion check: complete and static, with no inline hide styles
- [ ] Keyboard and anchor-link check: visible focus, focus never lands in an invisible step, anchors clear the sticky header
- [ ] Contrast check via the scroll-craft harness
- [ ] No console errors
- [ ] Every claim on the page traced to a source doc
- [ ] Typecheck, lint and build pass; small conventional commits

## 10. STOP report format

End every task with these sections:

- Files changed
- Screenshot and contact-sheet paths
- Bundle delta per route
- Lighthouse scores (median, range, n)
- Skill-conflict log
- review-animations verdict
- Open questions for Kelvin

Then write **STOPPING HERE FOR REVIEW.** After T5, also write `docs/sprint-reports/SPRINT-12B.md` in the PART 21.2 format.

## 11. Out of scope this sprint

- `/services/*` → `/solutions/*` 301s: already built in Sprint 2. Do not touch.
- The certificate-verification backend: already built in Sprints 11–12. Do not touch.
- Any content that depends on unresolved claims (V01, V02, V12, V13, V15).
- The solution set pieces (memo Appendix B), the `/about/coverage` corridor, Sprint 13 and 14 work, the Next 16 upgrade, generated assets.
