# Home set piece — BRIEF

**Set piece:** "One vehicle, instrumented" — memo D3 = **H1**, D3b = **(b)**. Sprint 12b, T4.
**Status:** authored from the Sprint 12b prompt §7 answer sheet, **not interviewed.** Two items the
prompt reserves for Kelvin (**ASK KELVIN**) were asked on 26 September 2026 and are not yet answered;
they are marked open below and were not filled in by Claude Code.
**Suppressed per prompt §4:** the fingerprint gate, the four-device-family minimum, the layered hero
and a new signature move. This is one set piece on an existing page, not a scroll-craft page.

---

## Step 0 — the eight topics

| # | Topic | Answer | Source |
|---|---|---|---|
| 1 | Vibe | "Premium corporate foundation + futuristic telematics + industrial engineering"; instrumentation, not brochure; 7/10, "alive and engineered, never restless" | brief 6.1, 6.3, 17 |
| 1b | References from any medium | **ASK KELVIN — open** | prompt §7 |
| 2 | Scroll journey | Hero → proof band → **this set piece** → KEBS result → how we work → coverage → WhatsApp close. The set piece replaces the Thesis section and is brief 9.1 §3 and §4 in one | memo D3; brief 9.1 |
| 3 | Energy curve | Calm open, steady middle, a sharp rise in unease at fuel, calm again at the test result, the one loud moment at the jammer, then a quiet resolve | this file, below |
| 4 | Feeling curve and the one moment | recognition → confidence → unease → trust → tension then relief → resolve. The peak is beat 5 | prompt §7 |
| 5 | One thing no other site does | Not asked: a new signature move is suppressed. The site's signature is already ADR-0002's jamming readout; this set piece gives it context and moves it to beat 5 | prompt §4; ADR-0002 |
| 6 | Range | Premium-minimal industrial instrument | ADR-0002 |
| 7 | One world or distinct scenes | **Distinct scenes.** No continuous world, no scrub video | prompt §7 |
| 8 | Assets | Type and CSS-drawn telemetry in the fonts already loaded, at zero image weight. No photography (NV-2, NV-3 open), no video (NV-4), no platform screenshots (V13) | ASSET_MAP; memo D5 |

## Step 1 — who, what they must believe, what they do

- **Audiences:** fleet managers "technical about vehicles and not about software" in logistics,
  cross-border, fuel transport, construction and corporate fleets; PSV and matatu saccos, school
  transport, car hire; owners of single vehicles worried about theft; search engines and LLM
  assistants, which read only the server HTML (brief 4.3, 5.2, PART 1).
- **What the visitor must conclude:** "these are the most technologically advanced vehicle tracking
  and fleet intelligence people in Kenya" — **earned by the page, never written as copy** (PART 1).
- **The one action:** "Talk to us on WhatsApp" — the same label everywhere (`hero.tsx`).
- **Art direction:** ADR-0002, Direction B, tokens unchanged (memo D1 = A).

### The journey

| Beat | Shift in what the visitor knows | Step heading |
|---|---|---|
| 1 Position | The vehicle is visible, and so is its state | "Where the vehicle is, as it moves." |
| 2 History and boundaries | Its past and its limits are on record | "Where it has been, and where it may not go." |
| 3 Fuel | Losses are reported, not discovered at month end | "Fuel that goes missing is reported, not discovered at month end." |
| 4 Driver and road | A third party has tested the camera system | "What happens on the road, on camera." |
| 5 Signal — **the peak** | Someone attacks the tracker, and the attack itself is the alarm | "Someone switches on a jammer." |
| Close | The action | "Talk to us on WhatsApp" |

## Step 2 — grammar, feeling curve, peak, score

**Grammar:** not chosen here. The homepage's grammar is its existing composition (Sprint 4,
ADR-0002). This is one Level 4 act inside it (ADR-0006).

### The feeling curve (written before the score)

| Beat | Feeling | What on screen causes it |
|---|---|---|
| 1 | Recognition | The vehicle's position, speed and ignition state on the stage, reporting |
| 2 | Confidence | A trip on record and two boundary alerts — nothing escapes the record |
| 3 | Unease | A fuel drop in the small hours, with how much, when, where and which vehicle |
| 4 | Trust | A laboratory's one word, "Complies", on the camera system — the quietest frame |
| 5 | Tension, then relief | The readout degrades to "Signal jammed", then resolves to "Anti-jammer armed · Alert sent" |
| Close | Resolve | The stage releases; one sentence and the WhatsApp action |

No two adjacent beats carry the same feeling.

### The peak

**Beat 5.** The reader arrives from the calmest frame on the page (beat 4) and watches the signal
readout run healthy → degrading → **jammed** → **armed, alert sent**, while the step beside it says
what the tracker does and names its hedges. It gets:

- **The most scroll room:** span **1.8** viewports against **1.0** for every other beat.
- **The only motion on the stage:** the Level 3 readout sequence, played once when beat 5 becomes
  active (or, in stacked flow, when the readout is seen). It never loops.
- **The only amber:** no other frame uses a state-warn colour.
- **Silence before it:** beat 4 is a static frame whose loudest element is the word "Complies".

### The tell-someone sentence

**ASK KELVIN — open.** "It's the site where ___" was asked on 26 September 2026 and has not been
answered. Prompt §7 forbids filling it in, so T4 ships without it and this line is updated when it
arrives.

### Authored silence

None. Beat 4 is quiet but never empty: the stage always shows a frame.

### Device-per-beat score

One device family by design: the four-family minimum is suppressed (prompt §4) and ADR-0006 allows
one pinned act. Variety comes from the frames and from pacing.

| Beat | Device | Why this one |
|---|---|---|
| 1 | Pinned stage, static frame | An instrument reading, held still while the step explains it |
| 2 | Pinned stage, static frame | The record is the point; nothing needs to move |
| 3 | Pinned stage, static frame | Unease comes from the content (a 02:14 drop), not from motion |
| 4 | Pinned stage, static frame | The quiet before the peak |
| 5 | Pinned stage + Level 3 data sequence, largest span | The one moment; the only thing that moves |
| Close | Flow | The stage releases; the page arrives somewhere and holds |

Below 768 px, on touch, or under reduced motion: stacked flow with Level 2 reveals, the resting
frame (beat 5's resolved readout) at the head of the section, and the sequence played once when seen
(never under reduced motion).

### Spans and length

`[1, 1, 1, 1, 1.8]` viewports, **5.8** in total. The homepage is otherwise flow, so the page stays
well inside the 8-to-14-viewport pacing reference.

---

## Copy — every line traced

Copy lives as typed constants in `components/home/one-vehicle-copy.ts`, each block commented with its
source. Hedges verbatim.

| Beat | Source | Hedge kept word for word |
|---|---|---|
| Intro | the Thesis section, `components/home/thesis.tsx` (approved Sprint 4; removed in T4, in git history) | — |
| 1 | `02-products/trackers/standard-tracker/write-up.md` §01; `thesis.tsx` Visibility | "subject to network and GPS availability" (brief 2.3) |
| 2 | Same file, §02 route playback and §04 geofence alerts | — |
| 3 | `01-solutions/fuel-monitoring/write-up.md` §02 and §03 | — ("unprecedented", "instant" and the 90% claim never used) |
| 4 | `01-solutions/ai-video-telematics/write-up.md`, "How it works"; KEBS report per brief 3.5 | "according to the configured system"; "Complies" verbatim, scoped to the sampled video telematics system. NTSA **absent** (V01); road-sign recognition not mentioned |
| 5 | `02-products/trackers/anti-jammer-tracker/write-up.md` lines 79, 81; `thesis.tsx` Protection | "according to its configured security logic"; "where supported by the vehicle" |

**Guard:** the rejected Sprint 1 headline does not return in any form — no "cannot silence", "can't be
stopped" or "no way".

## Feel check — T4, 27 September 2026 (scroll-craft feel §6)

**Not cold.** Claude Code wrote this brief, so the check could not arrive without it in mind. It was
run as close to cold as that allows: a live scroll of the production build at 1440×900 at reading
pace, one word per act written from the screen before this file was reopened.

| Beat | Intended | Felt | Verdict |
|---|---|---|---|
| 1 Position | Recognition | Oriented | Close — informational rather than recognition |
| 2 History and boundaries | Confidence | Orderly | Close, but the same register as beat 1: the two frames were the same list of rows |
| 3 Fuel | Unease | Suspicion | Agrees — the 02:14 in a depot yard does it, with no motion |
| 4 Driver and road | Trust | Reassured | Agrees — the quietest frame; "Complies" is its only colour |
| 5 Signal | Tension, then relief | Alarm, then relief | Agrees — after the fixes below |
| Close | Resolve | Invited | Agrees — the last screen stands still with the sentence and the action |

**Peak reads as the peak:** yes, after two changes made before this check and forced by the first
screenshots. **Silence in front of it:** yes, beat 4. **The end resolves:** yes.

**What changed, and why the page moved rather than this brief:**

1. **The peak frame was the smallest thing on the stage.** It was the hero's strip, shorter than the
   fuel panel, with a hole beneath it. `SignalReadout` gained a `stage` variant: the plate row matches
   the other frames, and the status gets its own line, set at `h3` size from `lg`. Now the one change
   the reader should watch is the largest type on the stage.
2. **The peak's extra room played while its own words were still below the fold.** Step content was
   centred in its 1.8-viewport step, so the stage switched to the peak and ran the sequence about 40vh
   before the heading arrived. Step content is now one viewport tall and sticky at the top of its step,
   so the words arrive like every other beat's and hold beside the frame for the whole extra span.
3. **Beats 1 and 2 read alike.** Beat 2's frame gained a static route strip (two geofences and the
   trip between them), as beat 3 has its fuel gauge. Each frame now has a face of its own.

**Decided by Kelvin, 28 Sep 2026: keep both.** "Complies" lands twice in quick succession — beat 4
ends on it, and the next section (the KEBS result, Sprint 4) leads with it as display type. The first
is the claim in context, the second is the evidence in full.

## The hero (D3b = b)

The jamming readout moves from the hero into beat 5, so the page has one peak, not two. The hero
headline is a public claim and changed only with Kelvin's sign-off (**NV-5 / V75**). **Approved 28 Sep
2026:** "Know where your vehicles are, what they're doing, and when something goes wrong." — each
clause is a beat below it. The condition of approval, met: the sub-line carries "subject to network and
GPS availability" word for word. The headline is set smaller on phones and tablets so the WhatsApp
action clears the cookie bar at 360px; the LCP element is server-rendered text either way.
