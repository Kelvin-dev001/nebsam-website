# SPRINT 12b — MOTION & SCROLL

**Branch** `sprint/12b-motion-scroll` · 57 commits · 25–28 September 2026
**Delivers** Motion tokens, an SSR-safe pinned-stage primitive, the homepage set piece "One vehicle,
instrumented", the approved hero headline, and a micro-interaction pass. None of it may cost
crawlability, accessibility or the Kenyan mobile budget.
**Prompt** `docs/prompts/CLAUDE_CODE_S12B_MOTION_SCROLL.md` · **Memo**
`docs/design/S12B_MOTION_DECISION_MEMO.md` · **Preview** (Vercel Authentication)
`nebsam-website-git-sprint-12b-058a3b-kelvins-projects-1de5cca3.vercel.app`

---

## COMPLETED

| Task | What shipped | Evidence |
|---|---|---|
| T0 | Emil Kowalski's skills at project scope; scroll-craft workspace gitignored; NV-1…5 logged as V71–V75; the baseline everything is paired against | `PERFORMANCE_BASELINE.md` §9: home and fuel 97, LCP 2.561 s, CLS 0.012 |
| T1 | Reconciliation with the Falcon brief; token proposal; `DURATION.press` 120ms, `STAGE.inactiveOpacity` 0.6, `PIN_QUERY`; ADR-0006 (native sticky pinning); contrast rows for dimmed stage text | ADR-0006; `DESIGN_SYSTEM.md` §3.5 |
| T2 | `/dev/motion` playground, development-only, with its utilities kept out of the global stylesheet; the Next 15.5.26 security fix merged in (approved) | §10 |
| T3 | The pinned-stage primitive: server-rendered and complete, one `willPin` decision shared with `Reveal`, a 595 B lazy enhancer, a scroll-driven progress rail. A dev route found shaping the homepage's chunks (+74 ms LCP) and fixed with `page.dev.tsx` (approved config change) | §11: no effect on public routes |
| T4 | "One vehicle, instrumented": five beats of one vehicle's telemetry, peaking at the jamming readout moved out of the hero. Every line traced to a source, hedges verbatim; the feel check forced a larger peak, a hold instead of a gap, and a face for beat 2 | `docs/design/sets/home-BRIEF.md`; §12 |
| Follow-ups | Kelvin's 28 Sep decisions: **V77 (a)** stage CSS into the one stylesheet; **V75** "Know where your vehicles are, what they're doing, and when something goes wrong."; **V76 option 1** `vercel.json`, giving the first Next.js previews this project has built; register answers recorded | §12.3; register |
| T5 | Five micro-interactions (WhatsApp button lift by transform, mobile menu entrance, enquiry confirmation entrance, add-to-cart as a primary Button with a fading confirmation, eased 1px press) and two accessibility fixes (enquiry success and add-to-cart are now announced) | §13: **CLS 0.012 → 0.000** |

---

## DEVIATIONS FROM PLAN

- **T2's control arm was unusable.** It shared `node_modules` through a junction and did not
  reproduce §9. T3 rebuilt it as a proper worktree with its own `npm ci`; that arm reproduced §9 and
  every later comparison uses it.
- **A config change in T3** (`pageExtensions` with `page.dev.tsx`), proposed and approved, after the
  playground was proven to change the homepage's chunking even though it 404s in production.
- **T4 changed the primitive.** It gained `spans`, sticky step content (so a long span is a hold),
  resting-frame-only stacked flow, and a stacked width cap, all found by looking at the real page.
- **The readout's alarm colour became asymmetric** (review-animations gate): into amber at micro, back
  to green at data speed.
- **V77 reversed a T3 choice.** The stage's CSS module was a second render-blocking stylesheet on
  Home; Kelvin chose to move it into the global stylesheet.
- **The approved headline is set smaller on phones and tablets.** At display size it ran to seven
  lines at 360px and pushed the WhatsApp action under the cookie bar. The sub-line also dropped "on
  your smartphone or the tracking platform"; its hedge is intact.
- **`vercel.json` needed `outputDirectory: .next`.** The first preview proved the Next build works on
  Vercel, then failed on the project's saved CRA output directory.
- **T5 split `enquiry-success.tsx` out of `enquiry-form.tsx`** to keep both under ~200 lines. The
  confirmation was verified through a playground demo rather than a real submission, which would have
  written a row that staff see in the admin.

---

## NEW FILES / CHANGED FILES

**New.** `components/motion/`: `pinned-sequence.tsx`, `pinned-sequence.css`,
`pinned-sequence-loader.tsx`, `pinned-enhancer.ts`, `will-pin.ts`, `micro-interactions.css`.
`components/home/`: `one-vehicle.tsx`, `one-vehicle-copy.ts`, `one-vehicle-frames.tsx`,
`peak-readout.tsx`, `telemetry-panel.tsx`. `components/telemetry/`: `use-jam-sequence.ts`,
`readout-parts.tsx`. `components/forms/enquiry-success.tsx`. `components/dev/motion/*` and
`app/(site)/dev/motion/page.dev.tsx` (development only). `vercel.json`. ADR-0006.
`docs/design/sets/home-BRIEF.md`.

**Changed.** `lib/motion.ts`, `app/globals.css`, `next.config.mjs`, `app/(site)/page.tsx`,
`components/home/hero.tsx`, `components/motion/reveal.tsx`, `components/telemetry/signal-readout.tsx`,
`components/ui/button.tsx`, `components/layout/whatsapp-button.tsx`, `components/layout/mobile-nav.tsx`,
`components/forms/enquiry-form.tsx`, `components/cart/add-to-cart.tsx`.

**Removed.** `components/home/thesis.tsx` (its copy seeds the set piece's intro).

**Docs.** CLAUDE.md, ANIMATION_SYSTEM, DESIGN_SYSTEM, PERFORMANCE_BASELINE §9–§13, ADR-0002 (headline
superseded), NEEDS_VERIFICATION.

---

## DATABASE CHANGES

None. No migrations.

## DEPENDENCIES ADDED

None to `package.json`. Next.js moved to **15.5.26** on the `fix/next-15.5.26-and-csp` branch (a
security patch, approved and merged into `develop` and this branch). Tooling only: Emil Kowalski's
four animation skills at project scope in `.claude/skills/`.

---

## VERIFICATION

- **Every task:** typecheck, lint and build pass; the retired-strings check is clean on every build.
- **Server HTML (no-JS):** every set-piece step, hedge, the KEBS reference and the illustration
  caption appear exactly once; one `<h1>`; `data-pinned="off"` in the markup.
- **Browser:**
  - pinned at 1440 (each frame matches its step; the peak plays once; its words hold beside it)
  - stacked at 390
  - reduced motion complete and static
  - keyboard pass over every step link
  - hero at 360, 390, 768 and 1440 (the WhatsApp action clears the cookie bar at every width)
  - each T5 item measured frame by frame
  - zero console errors or warnings
- **scroll-craft harness:** no dead scroll in any pass. Contrast is clean at 1440 and 390. The one
  reduced-motion flag is the documented cookie-bar false positive; each flagged step reads 18.69:1 once
  it is clear of the bar.
- **Vercel previews:** READY for both `develop` and this branch, serving 200 with the new headline and
  a single stylesheet.
- **Two environment faults were found and ruled out:**
  - The headed test window was throttled to 2 frames per second, which froze transitions. It was
    brought to the front at 62 fps and everything re-checked.
  - One keyboard pass was disturbed by outside input on that window. It was re-run clean with an
    input counter.

---

## PERFORMANCE

| Home, paired against T0 | T0 baseline (§9) | After V77 (§12.3, n = 9) | After T5 (§13, n = 9) |
|---|---|---|---|
| Performance | 97 | 97, delta 0 | 97, delta 0 |
| LCP | 2.561 s | 2.567 s, delta −2 ms | 2.563 s, delta −8 ms |
| CLS | 0.012 | 0.012 | **0.000** |
| Requests | 15 | 15 | 15 |
| Transfer | 256 KB | +5,211 B | +5,305 B |
| First Load JS | 105 kB | 106 kB | 106 kB |

- **Product pages:** first-load JS is +0.4 kB; `AddToCart` now uses the shared `Button`.
- **Every route:** +836 B for the stage rules, plus about 118 B gzipped of T5 CSS.
- **INP:** not measured; Lighthouse lab runs report TBT. TBT on Home is unchanged within noise.
- **LCP is still ~63 ms over budget on Home, as on T0** (V47, open since Sprint 4).
- **The T5 run took two sittings.** Claude Code stopped the servers for low memory during round 6;
  rounds 6–9 were re-run with a script that rejects failed reports (§13).

---

## ACCESSIBILITY

- **Tested:** reduced motion complete and static on every motion surface. Dimmed stage text is
  4.86:1 on navy; frame labels 6.22:1; the readout's amber 8.62:1. Keyboard focus activates the step
  it lands in and is never in an invisible step. Focus moves into the mobile menu, Escape closes it,
  and focus returns to the trigger.
- **Failed and fixed:**
  - **A.** The enquiry confirmation was never announced: focus fell to the page body. It now focuses
    its heading.
  - **B.** "Added to cart" was never announced. It now renders in a `role="status"` region that
    exists before the click.
  - The cookie bar drew over the open mobile menu (both `z-40`) and hid its WhatsApp action. The menu
    is now `z-50`; a hit test at that action lands on it with the bar open (fixed 28 Sep, before the PR).

---

## NEEDS_VERIFICATION ADDED

V71 (70+ clients basis), V72 (legacy imagery licence), V73 (premises photo branches), V74 (real
footage), V75 (headline sign-off, **closed**), V76 (previews, **closed**), V77 (render-blocking stage
CSS, **closed**).

Also closed this sprint: V41, V50, V01, V02, V24 (school bus is enquiry-only). Answered and awaiting their
pages: V13, V17, V18, V20–V23 (St. Augustine PCEA only with written permission), the KIPI scan, and the
radio prices in Part B (VAT basis still to confirm). V15: real testimonials with permission, nothing
seeded. Held: "publish this" on two never-publish claims.

---

## KNOWN ISSUES / RISKS

- **Home LCP ~63 ms over budget** (V47, pre-existing). A preview measurement (V53) is still blocked:
  previews have no environment variables and no protection bypass.
- **Four found in testing were fixed before the PR** (28 Sep, at Kelvin's request): links to the draft
  school bus page (navigation, footer, 404 page, `llms.txt`) now skip it; the open mobile menu sits above
  the cookie bar; the product page renders its installation terms (V05) instead of a placeholder; and
  the recurring-fee sentence no longer ends in "..".
- **The T0 worktree `C:\Projects\nebsam-t0` still exists and holds a copy of `.env.local`.** It was kept
  for the paired runs, which are complete; remove it at merge.
- **The harness flags a reduced-motion contrast false positive** when a step sits under the fixed
  cookie bar.

---

## DECISIONS NEEDED FROM THE HUMAN

1. **"#1 vehicle theft prevention…" and "No way a thief…":** amend the brief, or keep them unpublished
   (recommended).
2. **V76 (2) and (3):** preview environment variables and a protection bypass, if preview measurement
   (V53, V47) is wanted before Sprint 14.
3. **The brief's "It's the site where ___" sentence and references** (asked 26 Sep), still open.
4. **The radio prices:** excluding VAT, as every price on the site is shown?

Decided on 28 Sep: remove certificate verification (V03/V04, its own branch after this one); real
testimonials only (V15); school bus enquiry-only (V24); merge this branch by PR.

## RECOMMENDED NEXT STEP

Merge this PR into `develop` after review. Then the certificate-verification removal, on its own
branch: a written plan first, because it drops a route, an API, admin screens and database tables.

**STOPPING HERE FOR REVIEW.**
