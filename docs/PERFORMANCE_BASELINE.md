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
