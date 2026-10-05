# PERFORMANCE BASELINE — measured 5 September 2026

Budgets and method are defined in `docs/PERFORMANCE_BUDGETS.md`; this file records what was measured
against them, and is appended to rather than overwritten.

> ## Correction, same day
>
> **The first version of this document reported Performance 80–82 and a 17-point cost for client
> JavaScript. Both figures were wrong, and the documents built on them — V47, V53 and ADR-0004 — were
> corrected with it.**
>
> The error was not in the tooling. It was in comparing runs taken minutes apart on a machine whose
> load was swinging by a factor of four, and in measuring a server that had just started and had not
> served a single request. Re-measured under a controlled protocol, the same build medians **89–97**.
>
> The lesson is recorded in §3 because it will otherwise be repeated: **on this development machine,
> a single Lighthouse run means nothing, and an unpaired comparison between two runs means less.**

---

## 1. What prompted the measurement

Sprint 7 removed a `loading.tsx` that had been suppressing hydration on every route
(commit `3d58ddf`, ADR-0003). Until that commit every page shipped a client bundle and never executed
it, so every Lighthouse figure recorded in Sprints 4, 5 and 6 measured a site doing less work than
the real one. Those numbers cannot be compared with anything measured from now on. That much was
true, and remains true.

What changed is the size of the gap. It is not sixteen points. On the evidence below it is small
enough that the budget question is open rather than lost.

---

## 2. Results

Production build, warmed server, Lighthouse 12.8.2 mobile preset, median of n runs.

| Route | n | Performance | Range | LCP | Range | TBT | Transfer |
|---|---|---|---|---|---|---|---|
| `/` | 9 | **93** | 82–97 | **2.583 s** | 2.492–2.837 | 232 ms | 255 KB |
| `/solutions/container-e-seal` | 9 | **89** | 72–97 | **2.576 s** | 2.490–2.858 | 363 ms | 256 KB |
| `/products/hybrid-car-alarm` | 7 | **97** | 79–98 | **2.420 s** | 2.343–2.739 | 95 ms | 246 KB |

Accessibility 100, Best Practices 96, SEO 100 on every run of every route. CLS 0.000–0.012.

**Against budget:** Performance ≥ 90 is met at the median on two routes of three and missed by one
point on the third. LCP ≤ 2.5 s is met on the product page and missed by **76–83 ms** on the other
two — not by the 588 ms first reported.

The ranges are the finding as much as the medians. A spread of 72–97 on one page, one build and one
machine is not a property of the site.

---

## 3. Method, and why the first attempt was wrong

```bash
npm run build && npm start
# warm every route under test with a few requests first
npx lighthouse@12 <url> --output=json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

Lighthouse **12.8.2**, mobile preset, default **simulated** throttling (Slow 4G, 4× CPU), against
`localhost:3000` serving the production build.

**Three protocol rules, each learned by getting it wrong this morning:**

1. **Warm the server first.** The first attempt measured a server that had just started. Routes carry
   `revalidate: 3600`, so the first request to each renders rather than serving from cache, and that
   render time lands in observed TTFB, which Lantern then charges for. Production behind a CDN is
   warm; a cold local server is not representative of anything.

2. **Never compare two unpaired runs.** `environment.benchmarkIndex` ranged **606–3174** across this
   session — a fivefold swing on one machine, driven by whatever else Windows was doing. The first
   attempt's "80 vs 97" compared a loaded-machine run against a quiet-machine run and read the
   difference as a property of the code. **A/B questions are answered by interleaving the two arms —
   old, new, old, new — against the same server, and taking the median of the paired differences.**

3. **Nine runs, not three.** Three runs happened to cluster tightly in the first attempt, which read
   as precision and was luck.

**The standing conflict, now resolved by evidence.** `PERFORMANCE_BUDGETS.md` §3 requires measurement
against a **Vercel preview deployment**; `CLAUDE.md` §11 requires `npm run build && npm start`. §3 is
right, and this session is the argument for it: a shared development machine cannot hold a Lighthouse
score still to within twenty points. **CLAUDE.md §11 should be amended to say that local measurement
is for paired comparisons only, and that budget compliance is judged on a preview deployment.** Until
that happens, no absolute score in this document should be treated as the site's score.

---

## 4. Paired comparisons

These are the trustworthy numbers, because each is a median of differences measured back to back
under the same conditions.

### 4.1 The favicon — shipped

`public/favicon.ico` was a CRA leftover: nine sizes to 256×256 as uncompressed 32-bit bitmaps,
191 KB, fetched at High priority ahead of the render. Re-encoded to 16/32/48 as PNG-in-ICO, same
artwork, **3.4 KB**. Five interleaved pairs on the homepage:

| | Median paired delta |
|---|---|
| **LCP** | **−226 ms** (range −381 to +1) |
| Transfer | 305 KB → 255 KB |
| Performance | no resolvable change |

The score is TBT-dominated, so 50 KB off the critical path shows up in LCP and not in the headline
number. LCP is the budget that was missed, which is why it was worth doing.

### 4.2 All client JavaScript — the framework's real cost

Five interleaved pairs on the solution page, normal against
`--blocked-url-patterns="*/_next/static/chunks/*"`:

| | Median paired delta from blocking **all** client JS |
|---|---|
| Performance | **+3 points** |
| LCP | **−449 ms** |
| TBT | −155 ms |

**This supersedes the +17 first reported.** Removing every interactive part of the site — cart,
mobile menu, consent bar, the lot — buys three points. The framework is not the reason the budget is
close; it costs about 450 ms of LCP and three points of score.

That cuts both ways. It kills the argument that a sprint of optimisation could recover a large
score. It also means the remaining LCP gap of ~80 ms is small against a JS cost of 450 ms, so it is
plausibly reachable — unlike the 588 ms gap first reported.

---

## 5. Bundle composition

Of roughly 110 KB of client JavaScript on the homepage:

| Chunk | Transferred (gz) | What it is |
|---|---|---|
| `4bd1b696….js` | 53 KB | React and react-dom |
| `255….js` | 46 KB | Next client runtime and router |
| `webpack….js`, `main-app….js` | 2 KB | Module runtime |
| `page….js`, `356….js`, `531….js` | ~10 KB | This project's own client components |

About **99 KB is framework**. This project's four client components — mobile navigation, cookie
notice, WhatsApp button, reveal — are roughly a tenth of the client JavaScript. Verified by locating
the `Reveal` component's `revealDecided` marker in the 8 KB raw homepage chunk rather than in either
large one.

**Consequence for the cookie-notice deferral, which was proposed and is now dropped.** Deferring one
~2 KB component cannot matter when removing all 110 KB is worth three points. It would have added
lazy-loading indirection to consent code, which is the most legally sensitive client component on the
site, for an effect below the noise floor. Not done, deliberately.

---

## 6. Budget compliance

| Budget | Status |
|---|---|
| LCP ≤ 2.5 s | **Marginal** — 2.420 s product, 2.576–2.583 s home and solution |
| Lighthouse Performance ≥ 90 | **Marginal** — medians 89, 93, 97; unresolvable on this rig |
| CLS ≤ 0.05 | ✅ 0.000–0.012 |
| Initial JS per route ≤ 180 KB | ✅ 103–106 KB |
| Homepage weight ≤ 1.5 MB | ✅ 255 KB |
| Content page weight ≤ 1.0 MB | ✅ 246–256 KB |
| Accessibility ≥ 95 | ✅ 100 |
| Best Practices ≥ 95 | ✅ 96 |
| SEO ≥ 95 | ✅ 100 |
| Web fonts ≤ 3 files | ✅ 2 delivered |
| Largest delivered image ≤ 250 KB | ✅ on these routes — see §8 |
| INP ≤ 200 ms | Not obtainable in a lab run |

---

## 7. What to do next, in order

1. **Measure on a Vercel preview deployment** before any further conclusion. Nothing else in this
   document is worth acting on until an absolute score exists that does not move by twenty points
   between runs. This is what `PERFORMANCE_BUDGETS.md` §3 has always required.
2. **Then, if LCP still misses by ~80 ms**, the candidates are the 89 KB Archivo variable font — the
   largest single asset and High priority on the critical path — and the render-blocking 7 KB CSS.
   The font question reopens ADR-0002 and must be measured, not assumed.
3. **Do not spend a sprint on client-JS reduction.** §4.2 prices the entire client bundle at three
   points.

---

## 8. What was not measured

- **INP.** Needs field data, which needs traffic and V10 (GA4).
- **A Vercel preview deployment.** The measurement that actually decides budget compliance.
- **`/cart`, `/admin`, blog and industry routes.**
- **A real device on real Kenyan mobile data.** Everything here is simulation.
- **Unused legacy media.** `public/` still holds CRA-era images up to 1.9 MB
  (`about-us-image-1.jpg`). None is referenced by a built route today, but the about pages are
  unbuilt and must not pick them up unprocessed.

Raw JSON for every run in this document is archived outside the repo at
`~/.claude/projects/C--Projects-nebsam-website/perf-2026-09-05/`.

---

## 9. Sprint 12b T0 baseline — 25 September 2026

The reference every Sprint 12b task is compared against. **The app code is `7b7f1e7`**: every commit
on `sprint/12b-motion-scroll` up to the end of T0 is docs or tooling.

Method as §3, exactly. Production build with `.next/cache/fetch-cache` cleared first (V54b),
`next start` on port 3000, each route warmed with five requests, Lighthouse **12.8.2** mobile preset
with default simulated throttling, **9 runs per route**, the two routes interleaved (home, fuel,
home, fuel…) so machine load falls on both equally. `benchmarkIndex` stayed at **2879–3518** across
all 18 runs. The machine was quiet, which is why these ranges are narrow where §2's were not.

### 9.1 Lighthouse

| Route | n | Performance | Range | LCP | Range | FCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 9 | **97** | 97–97 | **2.561 s** | 2.559–2.585 | 0.935 s | 35 ms | 0.012 | 256 KB |
| `/solutions/fuel-monitoring` | 9 | **97** | 97–98 | **2.561 s** | 2.489–2.568 | 0.912 s | 36 ms | 0.012 | 256 KB |

Accessibility 100, Best Practices 96, SEO 100 on every run of both routes.

**Not comparable with §2.** A different day under different load is exactly the unpaired comparison
§3 rule 2 forbids, so home's 93 → 97 is not evidence of anything. LCP is still **~61 ms over the
2.5 s budget** on both routes (V47 stands).

**The LCP element is the paragraph under the H1, not the headline**, on both routes: home
`<p class="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">`, fuel
`<p class="mt-4 text-body-lg text-text-primary">`. Two consequences for Sprint 12b: prompt §6's rule
that the LCP element never animates in covers that paragraph, and a D3b hero rewrite that changes its
length can move LCP. Why a text element paints at ~2.56 s after an FCP of ~0.91 s is not established
here. V41 (fonts not preloaded) is the standing candidate.

### 9.2 First Load JS (`next build`)

| Route | First Load JS | Headroom to 180 KB |
|---|---|---|
| Shared by all | 103 kB (46.4 + 54.2 + 2) | — |
| `/` | 105 kB | 75 kB |
| `/solutions/[slug]` | 103 kB | 77 kB |
| `/products/[slug]` | 104 kB | 76 kB |
| `/cart` | 107 kB | 73 kB |
| `/support/verify-installation` | 108 kB | 72 kB |
| `/contact`, `/quote`, `/support/book-installation`, `/support/suggestions` | 131 kB | **49 kB** |
| `/admin/*` | 103–112 kB | 68 kB or more |
| Middleware | 93.6 kB | — |

The four form routes are the tightest in the app, and all are Tier C (no scroll effects).

### 9.3 How later tasks compare against this

Paired, per §3 rule 2. The T0 arm is the app at `7b7f1e7`, served as a production build from a
separate worktree on a second port. Runs interleave T0 and the task build against the same warm
servers, and the reported figure is the median of the paired differences.

Raw JSON for all 18 runs, the build log and the two scripts that produced and summarised them are
archived outside the repo at `~/.claude/projects/C--Projects-nebsam-website/perf-2026-09-25-s12b-t0/`.

---

## 10. Sprint 12b T2 against T0 — sizes solid, timing comparison inconclusive

T2 added the motion tokens, ADR-0006 docs and the `/dev/motion` playground. Nine interleaved pairs
per route (T0 arm then T2, back to back) on `/` and `/solutions/fuel-monitoring`, Lighthouse 12.8.2.
The T0 arm was `7b7f1e7` in a separate git worktree on port 3002, sharing `node_modules` through a
directory junction.

### 10.1 What is solid: deterministic, and identical in every pair

| | `/` | `/solutions/fuel-monitoring` |
|---|---|---|
| Transfer, paired delta | **+63 B** (every pair) | **+15 B** (every pair) |
| First Load JS | 105 kB, unchanged | 103 kB, unchanged |
| CLS | 0.012, unchanged | 0.012, unchanged |
| Accessibility / Best Practices / SEO | 100 / 96 / 100, unchanged | 100 / 96 / 100, unchanged |

Where the bytes come from: the global stylesheet grew **+17 B gzipped** (two custom properties;
zero new rules once the playground was given its own stylesheet), and the home page chunk grew
~60 B because `PIN_QUERY` and `STAGE` are not tree-shaken out of `lib/motion.ts`, which the home
page already imports. The T4 set piece uses both on that page.

### 10.2 What is not: the timing comparison

| | T2 median | T0-arm median | Paired delta, median (range) |
|---|---|---|---|
| `/` Performance | 97 (94–97) | 97 | 0 (0 to +24) |
| `/` LCP | 2.580 s | 2.518 s | −2 ms (−746 to +82) |
| fuel Performance | 97 (78–97) | 82 | **+14** (+1 to +22) |
| fuel TBT | 97 ms | 576 ms | **−475 ms** |

**The fuel deltas are not a T2 effect and must not be read as one.** T2 changed 15 bytes on that
page. Two faults in the measurement explain them instead:

1. **The T0 arm does not reproduce the T0 baseline.** On the same app code, §9 measured fuel TBT at
   31–44 ms in every run. The T0 arm split into two modes: 94–200 ms in three runs, 547–957 ms in
   six, with a steady `benchmarkIndex` (2398–2609). Its shared chunk is also named differently
   (`4454-…` against `1255-…`), so the worktree build is not byte-identical to the original. The
   `node_modules` junction is the likely cause; it is **not established**.
2. **The machine ran out of memory.** Claude Code stopped both servers and the run for memory
   pressure just after the last pair completed; free RAM was 1.7 GB of 15.6 GB. Home's
   `benchmarkIndex` fell to 604 in the worst pair.

**For T3 and T4:** build the T0 arm with its own `npm ci`, not a junction; confirm it reproduces §9
before pairing against it; measure with memory headroom. Better still, judge on Vercel preview
deployments, as `PERFORMANCE_BUDGETS.md` §3 and the sprint prompt both prefer.

Budgets on T2's own medians are unchanged from §9: Performance ≥ 90 met; **LCP still over 2.5 s**
(V47, 2.580 / 2.517 s, not moved by T2: the home paired delta is −2 ms); everything else met.

Raw JSON for all 36 runs and the scripts are archived at
`~/.claude/projects/C--Projects-nebsam-website/perf-2026-09-25-s12b-t2/`.

---

## 11. Sprint 12b T3 — a regression found, traced to a dev route, fixed, re-measured

T3 added the pinned-stage primitive (ADR-0006) and demonstrated it on the `/dev/motion` playground.
No public route uses the primitive yet.

### 11.1 A trustworthy control, this time

§10's T0 arm was unusable. This one was rebuilt the way §10 said it should be: a worktree at
`bcab5d4` (the T0 app code plus the Next 15.5.26 security fix, so the arms differ only by Sprint 12b
work), with its **own `npm ci`** instead of a junction. Its shared chunks carry **the same content
hashes** as the sprint build, and it **reproduces §9**: home 97 / 2.561 s / TBT 33 ms, fuel 97 /
2.561 s / 32 ms. Best Practices reads **100** on both arms, up from 96, because the CSP console error
fixed on 25 September was the failing audit.

### 11.2 First measurement: +74 ms LCP on the homepage

Nine interleaved pairs per route: home paired LCP delta **+74 ms** (seven of nine pairs at +73 to
+76), transfer **+1,462 B**; fuel flat. The homepage made **one more request**: its motion code had
been moved out of its page chunk into a shared chunk (`1566-…`), which the homepage then had to
fetch separately. A rebuild with the playground moved out of `app/` put the homepage back to one
page chunk, which proved the cause: **the dev-only playground, because it imports the same Reveal
and readout as the homepage, was shaping the homepage's chunking.** A runtime 404 did not stop that;
a built route participates in code splitting whether or not it is ever served.

### 11.3 The fix, and the re-measurement

Development-only pages are now `page.dev.tsx`, and `next.config.mjs` treats `.dev.tsx` as a page
only in `next dev` or a build made with `MOTION_PLAYGROUND=1`. An ordinary production build does not
contain `/dev/motion` at all.

| Paired against T0, n = 9 | Home | Fuel |
|---|---|---|
| Performance | 97, delta **0** | 97, delta **0** |
| LCP | 2.562 s, delta **0 ms** (−7 to +2) | 2.561 s, delta **−1 ms** |
| TBT | 30 ms, delta −2 ms | 32 ms, delta +1 ms |
| Transfer | delta **+171 B** | delta **+43 B** |
| Requests | 15 vs 15 | unchanged |
| CLS · A11y / BP / SEO | 0.012 · 100 / 100 / 100 | 0.012 · 100 / 100 / 100 |

`benchmarkIndex` 3349–3622 across all 36 runs. The +171 B on home is the T2 constants and `willPin`
in its page chunk; the T4 set piece uses all of them there. **LCP is unchanged and still ~60 ms over
budget (V47).**

**Rule that follows:** measure public routes only on an **unflagged** build. A build made with
`MOTION_PLAYGROUND=1` chunks differently, by design of the bug above.

Raw JSON, scripts and build logs: `perf-2026-09-26-s12b-t3/` (the regression) and
`perf-2026-09-26-s12b-t3-fixed/` (the fix), under `~/.claude/projects/C--Projects-nebsam-website/`.

## 12. Sprint 12b T4 — the homepage set piece, paired against T0

T4 put the pinned stage on a public route for the first time: "One vehicle, instrumented" on Home.
Two nine-pair runs, both against the §11 T0 arm (`bcab5d4`, own `npm ci`) on :3002, with T4
**unflagged** on :3000, Lighthouse 12.8.2. Run 1 measured the build before the last three changes
(the asymmetric alarm colour, the readout file split, beat 2's route strip); run 2 measured the final
build. **The machine was busier than in T3:** `benchmarkIndex` about 2,000–2,700 against 3,349–3,622,
and round 1 of each run was heavily loaded on both arms (503–991).

| Home, paired against T0, n = 9 | Run 1 | Run 2 (final build) |
|---|---|---|
| Performance | 97, delta **0** | 95, delta **+1** |
| LCP | 2.568 s, delta **+5 ms** (−1 to +82) | 2.717 s, delta **+150 ms** (−121 to +519) |
| TBT | 65 ms, delta +4 ms | 126 ms, delta −50 ms |
| CLS | 0.012, delta 0 | 0.012, delta 0 |
| Transfer | delta **+6,917 B** | delta **+6,954 B** |
| Requests | **16** vs 15 | **16** vs 15 |
| A11y / BP / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

Fuel, which T4 does not touch, moved only by **+275 B** (the new Tailwind utilities in the global
stylesheet); its LCP deltas were −75 and −37 ms, and both arms were erratic there (TBT up to about
1 s on T0).

### 12.1 Where Home's extra cost comes from

Both runs show **one more request, and it is render-blocking**: the pinned stage's CSS module
(`pinned-sequence.module.css`, 2,803 B raw, **855 B gzipped**) is a second stylesheet in Home's
`<head>`. Lighthouse's render-blocking audit prices potential savings at **198 ms on T4 against
57 ms on T0**, and the LCP element is the same hero paragraph on both arms. The rest of the +6.95 KB
is the set piece's server-rendered copy and its RSC payload (HTML **+3.7 KB**) and the page chunk
(**+1.1 KB**, the peak's client code); the shared chunks are unchanged.

The two runs disagree on the size (+5 vs +150 ms), not the direction or the cause. Lantern scales
CPU work to the machine's measured speed, and run 2's machine was slower. **Home LCP was already over
budget at T0 (V47), and on this rig T4 adds to it.**

### 12.2 Not fixed in T4 — a decision (V77)

Each fix has a cost, and one of them reverses a T3 decision, so this is Kelvin's call:

- **(a) Move the stage's rules into the global stylesheet.** Home returns to one stylesheet; every
  route's CSS grows by about 0.85 KB gzipped. Reverses T3's "a CSS module, so it loads only where
  used".
- **(b) `experimental.inlineCss` in `next.config.mjs`.** No render-blocking stylesheet on any route,
  but every navigation carries its CSS in the HTML, with no cross-page cache. A config change.
- **(c) Leave it until a preview measurement.** The local rig serves HTTP/1.1. V47 already records
  that this rig cannot resolve LCP differences of this size, and previews are blocked on V76.

Raw JSON and scripts: `perf-2026-09-27-s12b-t4/` (run 1) and `perf-2026-09-27-s12b-t4-final/`
(run 2), under `~/.claude/projects/C--Projects-nebsam-website/`.

### 12.3 Kelvin chose (a) — re-measured, 28 September 2026

The stage's rules became global `pinned-` classes pulled into `app/globals.css` by an `@import`, so
they ship inside the one stylesheet (`37f2c65`). The same build also carries the approved hero
headline (V75, `ba67ad4`). Nine pairs against the same T0 arm:

| Paired against T0, n = 9 | Home | Fuel |
|---|---|---|
| Performance | 97 (88–97), delta **0** | 97 (82–98), delta −1 |
| LCP | 2.567 s (2.496–2.600), delta **−2 ms** (−186 to +70) | 2.543 s, delta −1 ms |
| TBT | 66 ms, delta −11 ms | 42 ms, delta −9 ms |
| CLS | 0.012, delta 0 | 0.012, delta 0 |
| Transfer | delta **+5,211 B** | delta **+836 B** |
| Requests | **15 vs 15** | 14 vs 14 |
| A11y / BP / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

`benchmarkIndex` 1,495–3,305. **Home is back to one stylesheet and one request fewer**, and
Lighthouse's render-blocking savings read 94 ms against T0's 103 ms. The cost of (a) is the +836 B on
Fuel and every other route: the stage's rules in the shared stylesheet. The rest of Home's +5.2 KB is
the set piece's server-rendered copy and its client code.

On mobile, the LCP element is now the hero **headline**: at five lines of display type it is a
larger block than the paragraph, which was LCP before. It is server-rendered text in the same
preloaded font, so what gates it is unchanged. **Home LCP still sits about 67 ms over budget, exactly where T0 does:
that is V47, not T4.**

Raw JSON: `perf-2026-09-28-s12b-t4-v77/`, under `~/.claude/projects/C--Projects-nebsam-website/`.

## 13. Sprint 12b T5 — the micro-interaction pass, paired against T0

T5 shipped five micro-interactions and two accessibility fixes (`ANIMATION_SYSTEM.md`, Level 1).
Nine pairs, in two sittings. Claude Code stopped both servers during round 6 of the first run because
the machine ran critically low on memory; the loop ran on against nothing, so rounds 6–9 came back
`runtimeError` and were discarded. Rounds 6–9 were re-run on 28 September with a script that rejects
a `runtimeError` report. Rounds 1–5 measured the T5 build before the easing fix (`0eb772a`), rounds
6–9 the build after it; that fix changes an easing curve only, with no layout or load effect.
`benchmarkIndex` 2,392–2,734, except home round 1's T0 run (999).

| Paired against T0, n = 9 | Home | Fuel |
|---|---|---|
| Performance | 97 (95–98), delta **0** | 95 (82–98), delta +1 |
| LCP | 2.563 s (2.497–2.619), delta **−8 ms** (−351 to +71) | 2.527 s, delta +1 ms |
| TBT | 61 ms, delta −3 ms | 96 ms, delta −44 ms |
| **CLS** | **0.000 in every run; T0 0.012 in every run** | **0.000** (max 0.004); T0 0.012 |
| Transfer | delta +5,305 B | delta +854 B |
| A11y / BP / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

**CLS is gone.** Every page's only layout shift was the floating WhatsApp button jumping clear of the
cookie bar by changing `bottom`; it now lifts by a transform, which is not a layout shift. The timing
columns are unchanged within noise. **Home LCP stays ~63 ms over budget, as on T0 (V47).**

Transfer: the T5 stylesheet added about 118 B gzipped to every route; the floating button's class
list, sent in every page's HTML, got shorter. Product pages grew 0.4 kB of first-load JS because
`AddToCart` now uses the shared `Button`.

Raw JSON: `perf-2026-09-28-s12b-t5/`, under `~/.claude/projects/C--Projects-nebsam-website/`.
**Lesson for the scripts:** checking only that a report file exists lets a dead server produce "ok".
Reject any report that carries `runtimeError`.

---

## 14. V47 closed — the fonts, 29 September 2026

Kelvin asked for Home and Coverage to be brought inside the LCP budget. Lighthouse mobile medians,
local production build, `develop` against `sprint/12k-lcp`:

| Page | Before | After | Change |
|---|---|---|---|
| `/` | 2,714 ms (5 runs) | **2,360 ms** (5); 2,427 / 2,437 on two later 3-run checks under load | −277 to −354 ms |
| `/about/coverage` | 2,714 ms (5) | **2,426 ms** (5); 2,438 / 2,434 under load | −276 to −288 ms |
| `/products/inrico-t-521` | 2,567 ms (5) | **2,287 ms** (5) | −280 ms |

Performance 97–98 at the medians, CLS 0 in every run but one (0.119, in a run under heavy machine load
with TBT 341 ms; six further runs of that page were 0.000).

**What decided LCP, measured rather than supposed.** Lighthouse's model counts every request started
before the page's first paint. On these pages that is about 250 KB, and the largest item was the
89 KB Archivo latin file (High priority, preloaded). Real-browser throttled runs on this machine
varied too much to rank causes (first paint 1.7–3.1 s for the same build), so the lever was chosen
from the model and then confirmed by repeated runs. The first cut bought about 8 ms of LCP per KB.

**What changed** (`scripts/fonts/build-webfonts.py`, deterministic, rebuilds from upstream):
1. **Archivo drops the condensed half of its width axis** (62–100%), which nothing on the site sets.
   Removing one side of an axis rescales nothing: advance widths are unchanged, and all 24
   weight × width × size combinations the site uses render pixel-identically. Restricting the weight
   axis too would have saved 7 KB more but moved spacing by up to one unit, so it was not done.
2. **Each latin face is split into CORE and REST.** CORE (preloaded) holds ASCII, the Latin-1 symbols
   without the accented letters, general punctuation, € and ™. The site's text uses 92 distinct
   characters, all in CORE. REST is fetched only by a page using an accented Latin-1 letter or a rarer
   symbol, which is the mechanism the latin-ext and vietnamese faces already used. Kept glyphs are
   untouched: CORE renders pixel-identically to the upstream file.

Result: the preloaded fonts went from 100,156 B to **52,608 B** (Archivo 45,456 + Plex Mono 7,152).
A typical page still delivers 2 font files. A page with an accented letter delivers 3, which is inside
the ≤3 budget; only accented letters in *both* body and mono text would make 4. Verified in the
browser: é pulls the Archivo rest file, Š latin-ext, Kikuyu ũ vietnamese, and each renders in Archivo.
The one cost is that kerning between a core letter and an accented one (say "Té") is lost, because
they now come from different files.

**Not yet done:** a preview-deployment measurement (§7.1, V53). Previews have no database environment
and sit behind Vercel Authentication, so they cannot yet render these pages as production will. The
margin here is 60–140 ms on a noisy local rig; confirm it on a preview or production once one can
render real content.

## 15. Sprint 12n — photography, paired against develop, 4 October 2026

The photo hero, four new Home sections and photos on all three branch cards. Lighthouse 12, mobile
preset, simulated throttling, five interleaved pairs per route: `sprint/12n-visual-pass` at `ec25c89`
on :3101 against `develop` at `b909b72` on :3102. Each was built in its own git worktree, because a
`next dev` left running in the main checkout since 30 September shares `.next` and corrupted
production builds there ("Cannot find module './5873.js'"). `benchmarkIndex` 2,465–3,430.

| Route | 12n | develop | Change |
|---|---|---|---|
| `/` | **2,322 ms** | 2,358 ms | −36 ms |
| `/contact` | **2,408 ms** | 2,501 ms | −93 ms |
| `/about/coverage` | **2,354 ms** | 2,437 ms | −83 ms |

Performance 98–99 on 12n; Accessibility and SEO 100; CLS 0 in every run. Best Practices 96 on
`/contact` on BOTH builds (a CSP issue in Chrome's Issues panel), so it predates 12n.

**How it got there, measured rather than supposed.** The first complete 12n build was over budget
(Home 2,627, Contact 2,620, Coverage 2,396 paired against develop's 2,398 / 2,461 / 2,471).

1. **Branch photos.** A build with them switched off gave Contact 2,239 ms against 2,802 with them:
   about 560 ms. A lazy image near the viewport is fetched at first layout, before first paint, so
   Lighthouse charges for it. `AfterLoad` renders them once `load` fires.
2. **Home's pre-paint bytes.** 254 KB against develop's 211 KB: the hero photo (24 KB, fetched
   early even when lazy) and 15.5 KB more gzipped HTML. Part of that HTML was every photo's blur data,
   serialised twice (HTML and RSC payload). The hero now uses `AfterLoad` too, and the blur
   placeholders are gone. Home HTML went from 35.4 to 30.5 KB gzipped; the remaining 10.6 KB over
   develop is the four sections' content.
3. **Not a fix, but measured:** `next/link` in the new sections prefetched 216 KB of other pages as
   Home scrolled on a phone. They use plain anchors, like the rest of the public site.

**Measurement hazard, recorded.** On battery, Windows throttled this machine to a `benchmarkIndex`
of 540–1,100, and every run inflated by 0.5–1 s. Twenty runs were discarded. Check
`Win32_Battery.BatteryStatus` (2 = on mains) before measuring.

## 16. Sprint 12o — product and solution photos, paired against develop, 4 October 2026

All 18 products get a photo (in the product title band with the 2x loupe, and as catalogue
thumbnails), the Hybrid Pro Tracker page is new, and Vehicle Tracking and Radio Communication get a
photo band. Five interleaved pairs per route: `sprint/12o-product-photos` at `0d44c2d` on :3101,
`develop` at `f7609fa` on :3102, each built in its own worktree. `benchmarkIndex` 1,856–3,295.

| Route | 12o | develop |
|---|---|---|
| `/products` | **2,359 ms** | 2,222 ms |
| `/products/hybrid-pro-tracker` | **2,235 ms** | 1,969 ms |
| `/products/inrico-t-521` | **2,226 ms** | 2,232 ms |
| `/solutions/vehicle-tracking` | **2,258 ms** | 2,265 ms |
| `/solutions/radio-communication` | **2,353 ms** | 2,300 ms |

Every route is inside the budget. Accessibility, Best Practices and SEO are 100 on all five.
Performance is 98–99 except `/products/hybrid-pro-tracker`, at 83–99 on BOTH builds because of
V94. That page's CLS reached 0.124 (develop 0.118): a late web-font swap re-wraps the display H1.
It predates 12o; CLS was 0 on the other four. The photos are held back until `load`
(`AfterLoad`), so they stay out of the pre-paint window.

**A discarded round.** The first paired round ran with `benchmarkIndex` down to 450. The cause was
an orphaned `next dev` from 30 September spinning a full core (V92). It was stopped with Kelvin's
approval and the round re-run. Rule kept: check for stray `node` processes before measuring.

## 17. Sprint 12p — industry bands, article covers, share images, 5 October 2026

Lighthouse 12, mobile preset, 3 runs per route, production build on :3207, `benchmarkIndex`
1,945–3,472. Every route is inside the budget; CLS 0 throughout.

| Route | LCP median | LCP element |
|---|---|---|
| `/about` | 2,204 ms | text |
| `/industries` | 2,374 ms | text (the cookie notice, as before 12p) |
| `/industries/public-service-vehicles` | 2,238 ms | text |
| `/industries/mining` | **2,196 ms** (after the move below) | text |
| `/industries/agriculture` | **2,251 ms** (after the move) | text |
| `/industries/school-transport` | 2,204 ms | text |
| `/resources/blog` | 2,196 ms | text |
| `/resources/blog/what-is-geofencing` | **2,208 ms** (after the move) | text |
| `/resources/blog/what-is-telematics` | 2,199 ms | text |

Performance 98–99; Accessibility, Best Practices and SEO 100.

**One rule, learned on two templates.** A photo that renders after `load` must not be in the first
screen, or it becomes the LCP element when it arrives. Lighthouse still scored that case inside
budget (geofencing 2,289 ms with the cover as LCP), but on a real slow connection `load` fires late,
so the real LCP would be late. Two things moved:
- **The article cover** now follows the second paragraph. After the first, geofencing's short intro
  left it at 681px.
- **The industry band** now follows "What applies to this sector". Mining, agriculture and car hire
  had 125–153px of it on screen.

Every photo on every page that has one now starts below the fold of a 412×823 phone (checked with
Playwright).

## 18. Sprint 12q — five more solution bands, 5 October 2026

| Route | LCP median (3 runs) | Page weight | LCP element |
|---|---|---|---|
| `/solutions/fuel-monitoring` | 2,383 ms | 255 KB | the opening paragraph |
| `/solutions/vehicle-security` | 2,382 ms | 260 KB | the opening paragraph |
| `/solutions/vehicle-key-programming` | 2,354 ms | 258 KB | the opening paragraph |
| `/solutions/speed-governors` | 2,359 ms | 250 KB | the opening paragraph |
| `/solutions/ai-video-telematics` | 2,354 ms | 238 KB | the opening paragraph |
| `/solutions/vehicle-recovery` (control, no photo) | 2,366 ms | 217 KB | the opening paragraph |

Lighthouse 12, mobile preset, production build on :3207, on mains power, `benchmarkIndex`
2,181–3,488. Performance 98 on every run; Accessibility, Best Practices and SEO 100; CLS 0.

**The control** is the same template without a photo, measured in the same session. The pages
with a photo land within 17 ms of it either way, so the band costs no LCP. It costs 21–43 KB,
fetched after `load`. The `/solutions/[slug]` route chunk grows from 1.89 to 2.96 kB gzipped:
each static import adds a small record to it (lib/media/solutions.ts). First load: 111 kB.

## 19. Sprint 13r — SEO / LLM audit, 5 October 2026

**Not closed: one page sits on the 2.5 s line, and the check could not finish.**

Lighthouse 12, mobile preset, production builds, on mains power. First a single-build pass (3 runs
per route), then a paired pass against `develop` built in a worktree, alternating run by run. The
system stopped the paired pass for low memory after 15 of 18 reports (1.2 GB free of 15.6 GB, held
mostly by other programs), so its numbers carry that load.

| Route | 13r, single pass | 13r, paired | `develop`, paired |
|---|---|---|---|
| `/` | 2,401 ms | 2,354 · 2,390 · 2,391 | 2,114 · 2,386 |
| `/solutions` | 2,241 ms | 2,238 · 2,244 | 2,237 · 2,241 |
| `/legal/cookies` | **2,542 ms** | **2,501 · 2,530 · 2,542** | 2,115 · **2,535** · 2,008 |

Accessibility, Best Practices and SEO 100 on every run; CLS 0; Performance 97–99.

**`/legal/cookies` is bimodal on both builds.** Every run picks the same LCP element: a paragraph of
server HTML ("It does not cover the vehicle tracking platform…"). It needs no download, and its LCP
is all render delay, either about 1.6 s or about 2.1 s. First paint is about 915 ms on both, and
both font files arrive within about 100 ms. The two builds deliver the page identically (the same
stylesheet, the same preloaded fonts; 13r's HTML is 480 bytes smaller, from the removed nav links),
and `develop` hit the slow mode too (2,535). So nothing this sprint changed explains it, and nothing
here clears it either. This page has no earlier measurement to compare with.

**What closes it:** the paired pass re-run on a machine with memory to spare (about ten minutes;
the `develop` worktree build is kept for it). If `/legal/cookies` still lands at about 2.5 s on
both builds, it is a pre-existing near-miss and belongs with V94 (the late font swap) in Sprint 14.
If only 13r does, it is this sprint's to fix.
