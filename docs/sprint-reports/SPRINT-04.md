# Sprint 4 — Homepage (production)

**Branch** `sprint/04-homepage` → `develop`
**Report date** 2 September 2026
**Format** Brief PART 21.2

---

## 1. Completed

| Sprint 4 acceptance criterion | State |
|---|---|
| Twelve sections or fewer — cut rather than pad | ✅ **seven** |
| Proof band uses only permission-confirmed logos (V12); if none, registrations rather than logos | ✅ no logos shown |
| Platform section uses only cleared screenshots (V13); if none, the section is cut | ✅ **cut** |
| Testimonials real or the section is absent (V15) | ✅ **absent** |
| All budgets met | ⚠️ **one miss — LCP, accepted by the client (V47)** |

**Seven sections ship:** hero (carrying the signature element) · proof band · the
visibility/control/protection thesis · the KEBS "Complies." result · how we work · coverage ·
WhatsApp-led close. Tone rhythm `dark → paper → light → paper → dark → light → dark`, so no two
adjacent sections share a ground (brief 6.6 prohibits identical section rhythm).

**Six of the brief's thirteen candidates do not ship, each for a recorded reason:**

| § | Section | Disposition |
|---|---|---|
| 5 | Solutions | **Deferred** to Sprint 5 — 0 rows, and `/solutions/*` does not exist |
| 6 | The platform | **Cut** — every screenshot carries third-party branding (V13) |
| 7 | Shop | **Deferred** to Sprint 6 — as §5 |
| 8 | Industries | **Deferred** to Sprint 5 — as §5 |
| 11 | Customer proof | **Absent** — no testimonial has attribution and permission (V15) |
| 12 | Resources | **Deferred** to Sprint 9 — as §5 |

The four deferrals are one decision, not four. Each depends on content a later sprint creates.
Building them now would mean designing against imagined data and shipping code nobody can verify in
a browser, and linking to routes that 404 — so they are added by the sprint that creates their
content, when they can be reviewed against the real thing.

---

## 2. Deviations from plan

**The proof band carries no registrations, contrary to the criterion's own fallback.** The criterion
says that if no client logos are confirmed the band "shows registrations rather than logos". Of six
regulatory instruments exactly **one** is currently valid — CAK lapsed 30 Jun 2025, both ODPC
registrations lapsed 27 May 2026, and the PSRA annual renewal is unconfirmed. A one-item band is not
proof, and brief 3.5 forbids displaying a lapsed permit. **Client decision (2 Sep 2026):** build the
band from facts CLAUDE.md §5 already approves — "over 10 years", "70+ corporate clients", three
branches and 16+ coverage towns — and give the KEBS permit its own section, where it is far stronger
than a line in a strip.

**All five instruments are seeded anyway, with their real dates** (migration 0011), at the client's
direction that the expired ones be included pending renewal. They are not published while lapsed,
because `public_certifications` filters on `expires_on > current_date`. The database decides what is
displayable rather than a developer remembering to check, and the moment operations renew one and
update `expires_on` it appears on the site with no code change and no deployment.

**The type system moved off `next/font` to self-hosted faces.** Proposed and approved during the
sprint. Rationale in §5.

**No hero photography.** Brief 9.1 asks for "real cinematic vehicle/fleet photography". Nothing
suitable exists: `hero-image.webp` is 333 KB against a 250 KB per-image budget, and `ASSET_MAP.md`
still lists Kenyan-context fleet photography as a HIGH outstanding need. The Sprint 1 composition
makes the readout the dominant object rather than a photograph, so the hero holds without one.
Adding an image also moves LCP further out — see V47.

---

## 3. Files

**Added**
```
components/home/hero.tsx                 hero + signature element
components/home/proof-band.tsx           approved figures, branch and coverage counts
components/home/thesis.tsx               visibility / control / protection
components/home/kebs-result.tsx          "Complies." — permit read from the database
components/home/how-we-work.tsx          enquiry → survey → installation → training → support
components/home/coverage.tsx             3 branches + 16 towns, live data
components/home/conversion-close.tsx     WhatsApp-led close
supabase/migrations/0011_seed_certifications.sql
public/fonts/*.woff2                     8 faces, self-hosted
docs/sprint-reports/SPRINT-04.md         this report
```

**Changed**
```
app/(site)/page.tsx                      composition, revalidate = 3600
app/globals.css                          @font-face + metric-matched fallbacks
app/layout.tsx                           next/font removed, preload links added
next.config.mjs                          immutable cache header for /fonts/
components/telemetry/signal-readout.tsx  CLS fix; sequence deferred to idle
lib/company.ts                           PSRA no longer published as current
docs/NEEDS_VERIFICATION.md               V47 raised; V41 closed
```

---

## 4. Database changes

Migration **0011** seeds five regulatory instruments from the inspection record in
`content-source/05-certifications/README.md` §4A. Verified live: the base table holds 5, the public
view exposes **1**.

PSRA carries `expires_on = null` deliberately. Its certificate states a five-year term to 2029 but is
expressly "subject to annual license renewal", and that renewal is unconfirmed (V30). 0004 already
treats null as not displayable. Writing 2029 would have published an instrument nobody has verified
is live — which is what `lib/company.ts` was doing, see §5.

No images are set on any row. Every scan needs work first: `kebs.jpg` carries the unpublished phone
number, the administrative email, two addresses, a handwritten signature and an unread QR code.

**The migration ledger was reconciled.** 0001–0010 had been applied outside the CLI, so the remote
history was empty and `db push` tried to replay from 0001 against an existing schema. Repaired to
`applied`, so future pushes work.

---

## 5. Defects found and fixed

**`llms.txt` was publishing the PSRA registration as current.** `REGISTRATIONS` in `lib/company.ts`
carried `expiresOn: '2029-06-28'`, so `isCurrent()` read it as live and the file advertised it to
every crawler and assistant that reads it — while `content-source` says explicitly "publish only once
the annual renewal is confirmed". A five-year term conditional on a yearly renewal is not evidence of
a current registration. Now null, and `isCurrent()` fails closed on null, mirroring the database rule.

**The homepage would have published a lapsed permit despite the database preventing it.** The page is
statically prerendered, so `expires_on > current_date` was being evaluated once at build time and
frozen into the HTML: the KEBS permit would have kept rendering after 26 Feb 2027 until somebody
happened to redeploy. `revalidate = 3600` makes the gate effective. This is a correctness
requirement, not a tuning choice — the rendering strategy was quietly defeating a data-layer
safeguard.

**Cumulative layout shift in the signature element.** Its four status strings run from "Link OK" (7
characters) to "Anti-jammer armed · Alert sent" (29). In a `flex-wrap` row that swing moved the wrap
point and changed the container height. Reserving 30ch — exact, since the readout is mono — took
Lighthouse mobile from 79 to 92 and TBT from 400 ms to 70 ms. It measured **0 on desktop and 0.116 on
mobile**, so only a throttled mobile run could have caught it.

**Fonts were never preloaded — register V41, now CLOSED.** `next/font` emits no
`<link rel="preload" as="font">`; both the `variable` and `className` forms were tested and neither
produced one, so this was a limitation rather than a misconfiguration. The eight faces now live in
`public/fonts/` at stable paths, which is what makes a hand-written preload possible. Only the two
latin subsets are preloaded. The non-latin faces are kept because **`ũ` (U+0169) and `ĩ` (U+0129) sit
in the vietnamese subset and are ordinary letters in Kikuyu** — dropping it to save repository weight
would silently break Kenyan names. The metric-matched fallbacks are copied verbatim from next/font's
computed values; without them the swap reflows the page.

**The hero hard-coded a WhatsApp number, a `tel:` number and the company description** — three §4
violations inherited from the Sprint 1 prototype. All now come from `lib/company.ts`. It also offered
"Call Mombasa" as the secondary action on a national homepage; it now names the branch it dials.

**Two hypotheses were tested and rejected**, recorded so they are not re-tried: `Reveal` was not
gating the LCP paint (it is correctly implemented and leaves above-fold content alone — the change
was reverted), and the signature sequence's 2700 ms final beat was not pinning TTI. Deferring that
sequence to idle was kept anyway, on its own merits: a decorative illustration must not compete with
first paint on a mid-range Android.

---

## 6. Dependencies added

**None.** `lighthouse@12` and `prettier` were invoked through `npx` for measurement and formatting
and are not project dependencies.

---

## 7. Verification actually run

| | |
|---|---|
| `tsc --noEmit`, `eslint .`, `npm run build` | pass |
| `npm run verify:db` | pass — 30/30 tables, 17/17 views, 0 anon reads, 30/30 anon writes refused |
| Server-rendered content | branch addresses, KEBS permit, coverage towns and approved figures all present in the HTML, not client-fetched |
| Expired instruments | CAK, both ODPC and PSRA **absent** from the rendered page — gate verified end to end |
| Console | zero messages |
| Headings | exactly one H1, no level jumps, one `main` landmark |
| Contrast | 8 new pairings measured, 5.32:1 – 16.49:1, all pass |
| Tap targets | 44 px minimum on branch phone links |
| Retired strings | 101 build artefacts scanned, 0 violations |

---

## 8. Performance — measured

Lighthouse mobile, simulated throttling, median of three runs on the production build.

| Metric | Sprint start | Final | Budget | |
|---|---|---|---|---|
| Performance | 79 | **95** | ≥ 90 | ✅ |
| Accessibility | 100 | **100** | ≥ 95 | ✅ |
| Best Practices | 96 | **96** | ≥ 95 | ✅ |
| SEO | 100 | **100** | ≥ 95 | ✅ |
| CLS | 0.116 | **0.012** | ≤ 0.05 | ✅ |
| TBT | 400 ms | **80 ms** | — | |
| FCP | 1.7 s | **0.9 s** | — | |
| Total page weight | — | **274 KB** | ≤ 1500 KB | ✅ |
| Initial JS | — | **105 KB** | ≤ 180 KB | ✅ |
| Web fonts delivered | — | **2** | ≤ 3 | ✅ |
| **LCP** | 3.1 s | **2.878 s** | ≤ 2.5 s | ❌ **–378 ms** |

**On the LCP miss (V47).** The trace records **observed LCP at 237 ms, identical to FCP** — the
largest element paints immediately and there is no real late paint. The 2.878 s is Lighthouse's
simulated mobile model (1.6 Mbps, 562 ms request latency, 4× CPU) charging for the entire critical
path: 105 KB JS + 100 KB fonts. That is why LCP tracked TTI exactly and did not move across four
separate interventions. It is not dismissed on that basis — the simulated model is what brief PART 14
writes the budget against.

Closing it requires removing critical-path bytes, and both routes are decisions rather than fixes:
the 90 KB Archivo variable font, whose width axis is ADR-0002's "one superfamily separated by optical
width"; or the 105 KB of JS, largely the React/Next floor plus four client components.

**Client accepted the miss and directed the sprint to proceed.** Recorded as V47 against Sprint 14.

---

## 9. Accessibility

Lighthouse accessibility **100**. Exactly one H1, no heading-level jumps, one `main` landmark, no
horizontal overflow at any width tested. Eight new colour pairings measured between 5.32:1 and
16.49:1 against requirements of 3:1 and 4.5:1. Branch phone links carry 44 px minimum tap targets.

Branches and coverage towns are rendered as two visibly different things with different markup and
weight, because CLAUDE.md §4 forbids implying an office where there is none. No count of agents or
technicians appears anywhere.

**Not completed: 360 px and ultrawide renders on real hardware.** The development machine's screen is
1536 px with a docked panel holding the viewport at 568 px. 360 px was verified structurally — no
element carries a fixed or minimum width above 360 px, the container is fluid, and there is no
horizontal overflow — and Lighthouse renders at a 360 px mobile viewport, which exercises the layout
that structural analysis could not prove. Ultrawide remains unrendered.

---

## 10. Decisions needed from the human

1. **V47 — the LCP miss.** Accepted for Sprint 4. The underlying decision (font strategy vs client
   JS) is still open and should be taken together with the hero photography, which moves the number
   further out.
2. **Hero photography (ASSET_MAP HIGH).** Nothing suitable exists and nothing was invented.
3. **V12 client logos.** The band is built and will take them whenever permissions arrive.

---

## 11. Known issues and open register items

| Item | Effect |
|---|---|
| **V47** | Homepage LCP 2.878 s against ≤ 2.5 s. Accepted for this sprint |
| **V25** | Search Console URL cross-check. **Sprint 2 still cannot formally close** |
| **V28a** | The ODPC registration claim ships verbatim from `lib/company.ts`. Unconfirmed since 18 Aug 2026, and now live on the homepage |
| **V12** | Client logo permissions. Proof band ships without logos until they arrive |
| **V13** | Platform screenshots. Blocks the platform section and `/platform` |
| **V15** | Testimonials. Section absent until real ones exist |
| **V04** | Certificate source and format. Import deferred to Sprint 11 |
| **V45** | OG image is 225×225, not 1200×630 |
| **V27 / V28 / V29 / V30** | CAK, both ODPC registrations and PSRA. All seeded with real dates; each appears automatically once renewed and `expires_on` is updated |
| **`CERT_PLATE_HMAC_SECRET`** | Empty in `.env.local`. Required before any certificate import |
| Housekeeping | `_to_delete/` and `nebsam-scaffold.zip` remain untracked; removal was approved but the command was denied at the permission prompt |

**V41 closed this sprint.** No new `[[NEEDS_VERIFICATION]]` tokens were created.

---

## 12. Recommended next step

Sprint 5 — Solutions. It unblocks four homepage sections that are written to appear the moment their
content exists, and `/solutions/*` is the largest hole in the site's internal linking today.

Before it starts: the ten solution slugs are permanent once minted, so confirm naming first. A later
change costs a 301.

---

**STOPPING HERE FOR REVIEW.**
