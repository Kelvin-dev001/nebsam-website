# S12B MOTION DECISION MEMO — decisions before Claude Code runs

**For:** Kelvin · **From:** Cowork · **Date:** 25 September 2026
**Baseline:** `develop` @ `7b7f1e7` (11 Sep 2026). Sprints 0–12 are merged. ADR-0002 (Direction B "Jamming") is accepted and shipped.
**Sprint:** **12b — Motion & Scroll**. It retrofits motion onto pages that already exist and runs **before Sprint 13** (SEO/LLM audit), so the Sprint 13 audit and the Sprint 14 budgets measure the final motion layer.
**How to answer:** fill in the `DECISIONS` block at the top of `docs/prompts/CLAUDE_CODE_S12B_MOTION_SCROLL.md`. This memo flags each decision and recommends an answer. It resolves nothing.

---

## Corrections to the task brief, found while preparing this

| The task brief said | Verified in the repo or the skill source | Effect |
|---|---|---|
| Base `sprint/00-discovery`; Sprint 1 still in evaluation | Develop is 12 sprints ahead; ADR-0002 was accepted on 21 Aug | This is a retrofit sprint (you chose option 1) |
| Files `S1_…` | "Sprint 1" is already the design-system sprint | Files renamed `S12B_…` |
| `NEBSAM_MASTER_PROMPT.md`, `NEBSAM_CLAUDE_CODE_SETUP.md` | `docs/brief/00-MASTER-BRIEF.md` (v1.2). There is no setup file; its content lives in `CLAUDE.md` and `docs/SETUP_GUIDE.md` | Paths corrected in the prompt |
| 18 source documents; 26 open items | **32** write-ups in `content-source/`; the register has 39 rows, **20 OPEN** | — |
| Invoke `/nateherk-design:scrollcraft` | The skill is named **`scroll-craft`**, so the command is **`/nateherk-design:scroll-craft`** | Corrected |
| `senlindesign/taste` | The repo is **`senlindesign/taste-skill`**, cloned to `~/.claude/skills/taste` and invoked as `/taste` | Corrected |
| Only `emil-design-eng` gives a canned reply | **All five** Emil skills in scope do so when invoked with no question | Always invoke with a concrete task |
| `review-animations` is a gate Claude Code runs | Its frontmatter sets **`disable-model-invocation: true`**, so only you can type `/review-animations`. Claude Code applies the same method by reading its `SKILL.md` and `STANDARDS.md` | Prompt §4 |
| CLS ≤ 0.1; page weight ≤ 1.5 MB | The repo budget is **CLS ≤ 0.05**, with **1.0 MB** for content pages (brief PART 14) | The stricter value applies |
| Out of scope: 301s (Sprint 2), certificate backend | **Both are already built** (Sprint 2; Sprints 11–12) | Do not touch |
| The Falcon journey is a pinned sequence | **It is not pinned.** It is a map pin travelling a dotted route line (`FALCON_REFERENCE_BRIEF.md` §3) | Changes D3 and D4 |

---

## D0 — Sprint frame

**Recommendation:** branch **`sprint/12b-motion-scroll`** from `develop` @ `7b7f1e7`. The report goes to `docs/sprint-reports/SPRINT-12B.md`. The alternative is to renumber Sprints 13–15, which would churn `SPRINT_PLAN.md` and three reports for nothing.

---

## D1 — Falcon theme vs Option B

Option B has moved past "conditionally approved": it is accepted (ADR-0002), implemented and live on `develop`.

| Option | What happens |
|---|---|
| **A. Option B stays whole; Falcon contributes mechanics only** *(recommended)* | Survives: the token system, Archivo at `wdth 118`/`100` plus IBM Plex Mono, the 4px spacing scale, radii 2/6/10, "Complies." at display scale, and amber as signal. Falcon adds: (1) a step sequence where each claim is paired with one visual, (2) a sequence-progress rail in the telemetry idiom, (3) proof blocks **only** where a figure is traced, (4) a poster-plus-play video once footage exists, (5) a firmer ground cadence (never three of the same ground in a row). **No token changes** |
| B. Falcon extends the palette or type | Adds a second accent (their CTA green) or a rounder, shadowed card language. ADR-0002 says "nothing else gets an accent", and Falcon's own CTA contrast is 1.94:1. This would need a new ADR |
| C. Falcon replaces Option B | Reopens an accepted ADR and a live homepage 12 sprints later. Not recommended |

**Guard, whichever you pick:** the rejected headline ("A jammer can silence a tracker…") does not return in any form. That includes paraphrases built on "cannot silence", "can't be stopped" or "no way". The live headline, "Losing signal is the alarm.", stays until you decide otherwise (D3b).

**Motion-token reconciliation (part of D1).** Keep `lib/motion.ts` exactly as named and valued: `outQuart`, `outExpo`, `inOutQuad`, `linear`; 160/420/900ms; stagger 70ms capped at 6; 20px travel. Emil's own `animate` rule is "extend the codebase's tokens, don't fork them". Add only what a component in this sprint actually needs: a `DURATION.press` of 120ms, and spring presets **only** if D4 adopts Motion.

---

## D2 — Motion tier per page type

| Tier | Pages (proposed) | Motion |
|---|---|---|
| **A — immersive scroll** | Home · `/solutions/vehicle-security` · `/solutions/fuel-monitoring` | At most one pinned signature sequence per page, with one engineered peak. **This sprint builds Home only.** The two solution set pieces are specced in Appendix B for a follow-up |
| **B — reveals and micro-interactions** | Every other `/solutions/*`: tracking, recovery, AI video (sits next to V01), speed governors (V02), container e-seal, radio, key programming, and **school bus (legal sensitivity: reveals only, never dramatised)** · `/products`, `/products/[slug]` · `/industries/*` · `/about`, `/about/certifications`, `/about/coverage` · `/resources/*` · `/support` | Level 2 reveals plus Level 1 |
| **C — micro only, zero scroll effects** | `/cart` and the WhatsApp order flow · `/orders/[orderNumber]` · `/support/verify-installation` · `/contact` · `/quote` · `/support/book-installation` · `/support/suggestions` · `/legal/*` · `/admin/*` | Level 1 only. "Add to cart" and the WhatsApp CTA get no animation beyond the press state |

**Adjustments to your proposal:** only two solution pages qualify as pillars, because only those two have a real, sourced sequence. School bus is demoted to Tier B for legal-sensitivity reasons.

**Mobile policy** *(recommended)*: pin only at **≥ 768px with a fine pointer**. Below that, the same markup renders as stacked flow with Level 2 reveals. Mid-range Android, collapsing URL bars and the Lighthouse mobile gate all favour that. Falcon also turns its effect off on phones. Revisit after a real-device test.

---

## D3 — Home signature set piece

**Which story carries the sequence?**

| Option | Beats and sources | Assessment |
|---|---|---|
| **H1. "One vehicle, instrumented"** *(recommended)* | **1 Ignition, position** · `02-products/trackers/standard-tracker/write-up.md` §01; hedge "subject to network and GPS availability" (brief 2.3). **2 Where it has been, where it may not go** · the same file, §02 route playback and §04 geofence alerts. **3 Fuel** · `01-solutions/fuel-monitoring/write-up.md` §02: "identifies abnormal fuel level drops and generates alerts" (how much, when, where, which vehicle). The 90% claim is never used. **4 The driver and the road** · `01-solutions/ai-video-telematics/write-up.md` ("according to the configured system") plus the KEBS laboratory report BS202445237 (brief 3.5; "Complies" is never paraphrased). The NTSA line is absent (V01). **5 Peak: someone switches on a jammer** · `02-products/trackers/anti-jammer-tracker/write-up.md`: "designed to detect GSM/GPS jamming attempts and automatically immobilize the vehicle according to its configured security logic." **Close:** "Talk to us on WhatsApp" | Falcon's structure (ignition, route, fuel, driver) carrying Nebsam's argument. It spans the whole company and ends on what only Nebsam documents. All telemetry is illustrative: plate `KXX 000X`, labelled "Illustration — not live customer data" |
| H2. Pin the existing Thesis (visibility, control, protection) | 3 beats; the approved, hedged copy already sits in `components/home/thesis.tsx` | Lowest content risk. Too short for a pinned stage to earn its scroll |
| H3. Pin "How we work" (enquiry, survey, installation, training, support) | Copy exists in `components/home/how-we-work.tsx` | A real sequence with no duplication, but the lowest drama. Better kept as Tier B |
| H4. Falcon-literal route line with a moving pin | — | This is ADR-0002 Direction C, rejected for Home and deferred to `/about/coverage`. **Not recommended** |

**D3b — how H1 sits with the current hero, which already dramatises jamming.** A page with two jamming moments has two peaks, and a page with two peaks has none.

| Option | What happens |
|---|---|
| **(b) Move the jamming readout into beat 5; the hero carries the whole company** *(recommended)* | ADR-0002 recorded that "the Sprint 4 production hero must carry the full company" and that the sequence "may migrate". That was never done: the hero and the home meta description still lead with anti-jamming. A new headline is a public claim, so Claude Code **drafts three, ships none, and stops for your sign-off (NV-5)**. The LCP element stays a server-rendered text headline |
| (a) Keep the hero; make fuel (beat 3) the peak; beat 5 stays quiet | A smaller sprint with no copy approval needed. The strongest argument is spent in the hero, before the reader has any context |
| (c) Keep both | Not recommended (two peaks) |

**Placement:** the set piece **replaces the Thesis section**. Its hedged copy seeds beats 1, 2 and 5. The set piece goes after the proof band, which is brief 9.1 §4 "Signature telematics moment". The home stays at seven sections.

---

## D4 — Scroll implementation, and what it costs against the 180 KB gate

**Headroom:** routes currently ship **103–106 KB** of initial JS, leaving about **74 KB**. **Home LCP is 2.583 s against a 2.5 s budget** (median of 9; V47 is open), so any set-piece JS must load **after** LCP, when the section comes within about a viewport.

Measured sizes (esbuild 0.28, minified ESM, gzip -9, React external): motion 13.4.3, gsap 3.15.0, lenis 1.3.26, scroll-craft 0.3.0. Next's webpack/terser output will land within roughly ±10%.

| Approach | JS gz | Verdict |
|---|---|---|
| **Native:** CSS `position: sticky` stage, IntersectionObserver for step state, CSS scroll-driven animation for the progress rail behind `@supports` | **~2–4 KB** own code (estimate), no dependency | **Recommended.** No scroll handler. Matches the zero-library motion Sprint 1 shipped |
| Motion `useScroll` + `useTransform` + `useMotionValueEvent` | 8.6 KB | Acceptable fallback. `CLAUDE.md` names Motion, but adding it is a dependency change (brief 2.5) |
| … plus `LazyMotion` + `m` | +7.1 KB (the `domAnimation` feature pack adds a further 24.8 KB, lazy-loaded) | Only if a real exit or spring need appears |
| Motion `motion` component | 41.5 KB | No |
| Motion vanilla `scroll()` / `inView` / `motion/mini animate` | 6.4 / 0.4 / 3.9 KB | Useful if a JS timeline is ever needed |
| GSAP + ScrollTrigger | 45.1 KB | No. Heavy, and "never both on a page" |
| scroll-craft engine wrapped as a client component (option **i**) | 7.5 KB JS + 3.0 KB CSS | **No, see below** |
| Lenis smooth scroll | 5.4 KB | **No.** Scroll smoothing is scroll-jacking |

**scroll-craft: option (ii) is recommended over option (i).** Wrapping the engine unmodified fails on four counts, and its "never edited per project" rule means none of them can be fixed:

1. `scrollcraft.css` sets `[data-sc-cue]`, `[data-sc-in]` and `[data-sc-copy]` to `opacity: 0` **before any JS runs**, so content is hidden from no-JS visitors and on slow hydration.
2. The same stylesheet sets **global** `:focus-visible` outline, `::selection`, `caret-color`, `accent-color` and `scroll-behavior: smooth`, which overrides Nebsam's verified focus rings.
3. The IIFE reads `window` and `matchMedia` at evaluation, so it must never reach a server bundle.
4. Its reduced motion is "fewer and gentler, not zero": cues still fade. Nebsam renders complete with no inline style.

**Option (ii):** adopt the process (the brief, journey, feeling curve, one peak, the cue contract, and the device-per-beat score) plus the **verification harness**. Build the pin natively, emitting the harness's markup contract (`html.sc-ready`, `data-sc-act="pin"`, `data-sc-span`, `data-sc-stage`, `data-sc-cue`) so `shoot.mjs` can walk it and grade contrast.

**Smooth scroll:** none this sprint. No Lenis, and no global `scroll-behavior: smooth`. If you want it later, limit it to `(pointer: fine) and (prefers-reduced-motion: no-preference)`, with `scroll-margin-top` for the sticky header.

---

## D5 — Asset generation

**Recommendation: none.** `KIE_AI_API_KEY` stays unset. The set piece is built from type and CSS-drawn telemetry (the medium of the ADR-0002 signature, at zero image cost). Photographs come only from `ASSET_MAP.md` and only after NV-2 and NV-3 clear, delivered through `next/image` at ≤ 250 KB. Any generated asset needs your written approval, and brief PART 18 still bars AI depicting Nebsam people, premises, vehicles or the platform.

---

## D6 — New verification items (not yet in the register; add them if you agree)

| # | Item | Why it matters now |
|---|---|---|
| **NV-1** | **"70+ corporate clients": the list counts 67.** `CLIENT_PERMISSIONS.md` has 63 names from the proposal plus 4 repo logos whose relationships are unconfirmed. The claim is client-approved (brief PART 1.5), and the fuel proposal itself says "Trusted by 70+". Confirm the basis | It already appears in the live proof band. It must never become a counter until this is answered |
| **NV-2** | **Provenance and licence of the legacy CRA imagery** that `ASSET_MAP.md` lists as reusable: the concept set (anti-hijack, theft-prevention, driver-safety, accident-prevention, fleet-optimization, compliance-management, smartphone-integration) and the old hero set | Stock or AI imagery presented as Nebsam breaks PART 18. It blocks use in any set piece |
| **NV-3** | Which branch each premises photo shows (showroom, reception, main-entrance, service-bay, customer-care, customer-parking) | Captions, alt text and the branch-vs-coverage rule |
| **NV-4** | Does real Nebsam video footage exist (installation, a device demo)? | Decides whether a video facade exists at all |
| **NV-5** | Sign-off on a new homepage headline, if D3b = (b) | A headline is a public claim |

Open items this sprint depends on: **V47** (Home LCP), V41 (font preload), V13 (platform screenshots), V12 (client logos), V15 (testimonials), V37 (logo on dark), V01 (NTSA), V02 (IRMS).

---

## D7 — Amend the motion rules (ADR-0006)

`ANIMATION_SYSTEM.md` §5 and brief PART 17 say "No scroll-jacking" and "IntersectionObserver only".

| Option | What happens |
|---|---|
| **A. ADR-0006 permits native sticky pinning** *(recommended)* | Scroll position maps 1:1 to progress. All content stays in DOM order and in the server HTML. The pinned sequence **is** the page's one Level 4. CSS scroll-driven animation is allowed alongside IntersectionObserver. **Still banned:** wheel/touch/key interception, scroll smoothing, forced snapping, scroll-linked layout properties, and JS scroll handlers |
| B. No amendment | The set piece must be a stepped reveal with no pin. That is closer to what Falcon actually does |

---

## D8 — Tooling footprint

| Tool | Recommendation |
|---|---|
| Emil skills | **Project scope, committed:** `.claude/skills/` plus `skills-lock.json`. The install command was verified in a sandbox. Install `emil-design-eng`, `animate`, `review-animations` and `find-animation-opportunities`. Skip `improve-animations`: it writes `plans/` and dispatches executor subagents into worktrees, which cuts across stop-per-task |
| scroll-craft | **Claude Code plugin at user scope.** You type the two `/plugin` commands. Record version 0.3.0 @ `0b81622` in the report. Point `.scrollcraft.json` at a **gitignored** `.scrollcraft/`. `BRIEF.md` is copied into `docs/design/` |
| Harness dependencies | A full ffmpeg build (`winget install Gyan.FFmpeg`), which the doctor requires and the contact sheet uses. Installed Chrome. `npm i --no-save playwright-core`, so `package.json` is untouched |
| taste (senlindesign) | User scope: `~/.claude/skills/taste` plus Playwright MCP (user scope). **Restart Claude Code after T0** |
| Leonxlnx taste-skill | **Do not install.** It contradicts ADR-0002 and duplicates Emil and scroll-craft (Appendix A) |

---

## Appendix A — Skills matrix (verified from source, 25 Sep 2026)

| Skill | Role on Nebsam | Invocation | Prerequisites | Auto-behaviours to suppress | Conflicts (the higher layer wins, and the conflict is logged) |
|---|---|---|---|---|---|
| `emil-design-eng` (emilkowalski/skills @ `d16ebe6`) | Owns motion tokens, enter/exit, hover/press/focus and micro-interactions | `/emil-design-eng <question>`, or model-invoked **with a concrete task** | Node; `npx skills@latest add emilkowalski/skills …` | A canned one-line reply when no question is given. Its required Before/After review-table format is fine | Its reduced motion is "gentler, not zero" where Nebsam is complete and static. Its curves differ from `lib/motion.ts` (keep ours). Press uses `scale(0.97)` where Nebsam uses `translate-y-px`. Its UI < 300ms rule has a marketing exemption, which covers the 420ms reveal |
| `animate` | Builds each approved animation | `/animate <request>` or model-invoked | as above | Canned reply | May reach for Motion, which is a dependency change (D4). May hand off to `pick-ui-library` (not installed) |
| `review-animations` | **Mandatory gate** before any task closes: findings table plus Block/Approve | **User-only** `/review-animations <scope>` (`disable-model-invocation`). Claude Code applies `SKILL.md` and `STANDARDS.md` by reading them | as above | Canned reply | Standard #8 (reduced motion) will flag Nebsam's instant behaviour. Log it; Nebsam wins |
| `improve-animations` | Not used this sprint | — | as above | Writes `plans/` at the repo root; `execute` dispatches executor subagents into worktrees | Stop-per-task and small commits |
| `find-animation-opportunities` | T5 sweep; read-only; at most 5–7 suggestions | `/find-animation-opportunities <scope>` | as above | Canned reply | None material |
| `scroll-craft` (nateherkai/scroll-craft 0.3.0 @ `0b81622`) | Owns Tier A set pieces: process plus harness | `/nateherk-design:scroll-craft`; scripts by path (`doctor.mjs`, `shoot.mjs`) | Node 18+, **full** ffmpeg, `playwright-core` resolvable from the cwd, installed Chrome. `KIE_AI_API_KEY` is only needed for generation and is not set | Interview (AskUserQuestion), answered from the prompt's answer sheet. Asset generation: none. Copying the engine into a build folder: not done. `scrollcraft/` workspace in the repo root: redirected. Fingerprint gate, "4+ device families", dimensional layered hero, a new signature move: **suppressed** (one set piece on an existing page, not a scroll-craft page) | Em-dash ban and "≤ 1 eyebrow per 3 sections" versus Nebsam's copy and design system. Reduced motion "gentler". Engine CSS globals. `drift` (background-colour interpolation) is rejected. Its `count` device is allowed only with traced numbers (this aligns) |
| `taste` (senlindesign/taste-skill 1.1.0 @ `6dce223`) | T1: extract static tokens from falcontrackers.com, as reference only | `/taste https://falcontrackers.com`, with "export target: Skip; crawl scope: single page" in the same message | Playwright MCP (`claude mcp add playwright -s user -- npx -y @playwright/mcp@latest --isolated`) and a restart. Downloads about 100 MB of Chromium on first run | Two setup questions (pre-answered). Writes `falcontrackers.md` and `.json` to the cwd, **overwriting without asking**. The Claude Code export target **appends a "Design Taste" section to `CLAUDE.md`**: choose Skip, verify that `git diff CLAUDE.md` is empty, and move the output to `docs/design/reference/` | Static only, so it cannot see scroll behaviour. Its directives are never binding |
| Leonxlnx/taste-skill (`design-taste-frontend` v2) | **Not installed** | `npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend` | — | DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY dials | "If the page is dark mode, ALL sections are dark" (against our ground rhythm). A total em-dash ban. Eyebrow restraint. Perpetual micro-interactions and magnetic physics above MOTION_INTENSITY 5. GSAP pin and horizontal-pan hijack patterns. Its own font picks |

---

## Appendix B — Solution set pieces, specced for a follow-up sprint

| Page | Source sequence | Peak | Hedges and exclusions |
|---|---|---|---|
| `/solutions/vehicle-security` | `02-products/trackers/anti-jammer-tracker/write-up.md`, "How the anti-jammer tracker protects your vehicle": normal operation → movement → unauthorised movement → security incident → signal interference | Signal interference | "according to its configured security logic"; immobilisation "where supported by the vehicle" |
| `/solutions/fuel-monitoring` | `01-solutions/fuel-monitoring/write-up.md`, "How the system works": install → measure → locate → transmit → monitor | Monitor (every fuel movement tied to a time, location, vehicle and quantity) | Drop the source's "unprecedented". The 90% claim is never used |
