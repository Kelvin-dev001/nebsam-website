# NEBSAM DIGITAL SOLUTIONS — MASTER PROJECT BRIEF & CLAUDE CODE KICKOFF PROMPT

**Version:** 1.2
**Owner:** Nebsam Digital Solutions (K) Ltd
**Purpose:** Complete rebuild of nebsamdigital.com as a telematics knowledge, trust, and commerce platform for Kenya and East Africa.

**v1.1 changes:** added the School Bus Solution; added verified KEBS permit and laboratory test details; added confirmed radio pricing; added the corporate client list; expanded the content-conflict register (product naming, branch addresses, legal name); added handling rules for real customer data and third-party platform screenshots found in existing sales collateral; added children's and biometric data requirements.

**v1.2 changes:** all seven blocking decisions resolved by the client and recorded in PART 1.5; product naming settled; canonical NAP settled; pricing published VAT-exclusive; products and shop merged into one page type; certificate verification changed to number-plate lookup and the security model reworked accordingly (PART 9.2); actual repository inspected and its stack recorded in PART 7.0; the current site's live URL inventory captured for the 301 map.

---

## PART 0 — HOW TO USE THIS DOCUMENT

**For the human:**

1. Save this file into the repository as `docs/brief/00-MASTER-BRIEF.md` **before** starting Claude Code.
2. Start Claude Code in the repository root, switch to **Plan Mode**, and paste only the block below as your first message.

```
You are starting a major project. Read docs/brief/00-MASTER-BRIEF.md in full before doing
anything else. That document is your contract for this entire project — every rule in it
applies to every session, not just this one.

Execute SPRINT 0 only (see PART 20). Do not write application code. Do not install
dependencies. Do not modify the database. Do not touch existing pages.

Begin with the CLARIFYING QUESTIONS GATE in PART 23, then produce the Sprint 0
deliverables and STOP.
```

**Why this two-layer approach matters:** a giant pasted prompt gets summarised away when the
context window compacts, and later sessions lose it. A brief that lives *in the repo* can be
re-read on demand, referenced by `CLAUDE.md`, version-controlled, and amended by the human.
Never rely on conversation memory for project rules.

---

## PART 1 — MISSION AND ROLE

You are acting as **Lead Product Architect, Creative Director, Senior Frontend Engineer, SEO/LLM
Discoverability Architect, CMS Architect and Technical Writer** for the complete rebuild of the
Nebsam Digital Solutions website.

The visitor's conclusion within 10 seconds must be:

> "These are the most technologically advanced vehicle tracking and fleet intelligence people in Kenya."

That claim must be **earned by the artefact**, not asserted in a headline. It is earned through
information depth, real photography, real platform screenshots, precise technical writing,
measurable speed, and a visual language that could not be mistaken for a template.

Three commercial objectives, in priority order:

1. **Generate qualified enquiries** — WhatsApp first, then call, quote, installation booking.
2. **Be found** — by Google *and* by LLM assistants, for telematics intent in Kenya/East Africa.
3. **Sell products** — a real shop with WhatsApp checkout, managed by non-technical staff.

Every design or engineering decision must trace back to one of those three.

---

## PART 1.5 — CONFIRMED DECISIONS (CLIENT SIGN-OFF)

These are settled. Do not re-ask, do not propose alternatives, do not "improve" them without being
invited to. Where a decision has a security or accuracy consequence, that consequence is handled in
the referenced PART.

| # | Decision | Detail |
|---|---|---|
| 1 | Tracker naming | **Standard Tracker** is the canonical name. "Basic Tracker" is retired. |
| 2 | Dashcam vs video telematics | **Two separate products.** `Hybrid Dashcam` (4G dual-lens unit) and `AI Vehicle Video Telematics` (3-camera Streamax ADAS/DMS system) are distinct product lines with distinct pages. Do not merge them. |
| 3 | Alarm naming | **Hybrid Car Alarm** is canonical. "Hybrid Alarm" is retired. |
| 4 | ProMax disambiguation | **Hybrid ProMax Car Alarm** = smart alarm with vibrating key remote. **Hybrid ProMax Plus Car Alarm** = vibrating key remote **plus** Anti-Jammer GPS tracking. The source file whose heading reads "ProMax" but whose body describes anti-jamming GPS is the **ProMax Plus**. |
| 5 | Company name | **Nebsam Digital Solutions (K) Ltd** — plural "Solutions", site-wide, including `Organization` schema and `llms.txt`. |
| 6 | Nairobi branch | **Kiambu Road, Ridgeways, next to Impact Motors.** "Equity Ngara" and "Utawala" are retired and must not appear anywhere. |
| 7 | Mombasa branch | **Makupa Roundabout, next to Mass Petrol Station.** "Kenyatta Ave / Saba Saba" is retired. |
| 8 | Phone number | **+254 727 727 461 is NOT published.** It may appear in supplied source documents and on the KEBS permit; strip it from all web output, schema, and any published PDF. |
| 9 | Radio pricing | The 2025 radio prices are **current and publishable**: Inrico T-521 KES 22,000; S-100 KES 30,000; S-200 KES 30,000; TM-7 KES 30,000. |
| 10 | VAT | **Prices are exclusive of VAT.** Every displayed price must carry a visible "excl. VAT" label. See PART 10.2. |
| 11 | Publish prices | Yes — prices are shown publicly because the shop is a first-class part of the site. |
| 12 | WhatsApp order routing | **All shop orders route to +254 759 000 111.** No per-branch routing. |
| 13 | Certificate verification | **Customers search by vehicle number plate**, not certificate number. This materially changes the threat model — see PART 9.2, which is now a security-critical spec. |
| 14 | Products vs Shop | **One merged page type.** See PART 8. |
| 15 | "Over 10 years" claim | **Approved for publication.** |
| 16 | IRMS | Nebsam's speed governor system is associated with **IRMS**. Mention only — no functional or code implication. Get the exact expansion and correct phrasing before publishing (see 3.5). |
| 17 | KEBS test report | **May be quoted in marketing.** Use it — it is the strongest third-party proof on the site. |
| 18 | Radio licence fee | The KES 3,000 per device per year is an **annual licence renewal with the Communications Authority of Kenya (CAK)**. Present it as a recurring cost of ownership, never hidden. |

### Still open — do not publish these until answered
- `[[NEEDS_VERIFICATION: NTSA data transmission]]` — what the video telematics system actually
  transmits to NTSA, and under what obligation. **Until answered, the claim that traffic sign
  recognition "transmits data directly to NTSA servers" must not appear on the site.** Write the
  page without it rather than hedging it.
- `[[NEEDS_VERIFICATION: IRMS]]` — full expansion and the correct way to describe the relationship.
- Unsubstantiated and therefore unpublishable: "50,000 customers across Africa", "#1 vehicle theft
  prevention solution in Kenya", "decrease fuel theft by 90%", "no way a thief will drive away with
  your car". "70+ corporate clients" **is** substantiated by the named client list and may be used.

---

## PART 2 — NON-NEGOTIABLE OPERATING RULES

These override any instinct to be maximally productive.

### 2.1 Discovery before construction
Inspect before you change. Before editing any existing file: read it, map its dependents,
state its purpose, then make the smallest coherent change.

### 2.2 Never invent facts
Nebsam is a regulated business (data controller/processor registration, CAK licence, KEBS
permit). Fabricated claims are a commercial and legal risk, not just a quality problem.

You may **never** invent:
statistics · customer counts · years in business · uptime figures · prices · warranty terms ·
technical specifications · certifications · partnerships · client names · testimonials ·
awards · superlatives · locations · staff names · response times.

When a fact is missing, write the placeholder token and log it:

```
[[NEEDS_VERIFICATION: description of what is needed]]
```

All such tokens are collected in `docs/NEEDS_VERIFICATION.md` with page, line, and question.
**The build cannot be marked ready to launch while unresolved tokens exist on public pages.**

### 2.3 Preserve legal hedging in source content
The source product documents deliberately hedge: *"according to the configured security
logic"*, *"subject to network and GPS availability"*, *"where supported by the vehicle"*,
*"within the supported remote range"*. These hedges are not padding — they are accuracy.
Rewrite for the web, keep every hedge.

### 2.4 Stop at sprint boundaries
Each sprint ends with a report and a full stop. Never roll into the next sprint unprompted.

### 2.5 Ask rather than assume on architecture
Any change to the stack, data model, routing scheme, or dependency list gets proposed and
approved first — briefly, in writing, with the trade-off named.

### 2.6 Verify, don't claim
"Implemented" means you ran it. Use the browser (webapp-testing / Playwright) to load the page,
screenshot it, check console errors, and test the interaction. Report what you actually observed.
Never report a feature as working on the basis that the code looks correct.

### 2.7 One branch per sprint, small commits
See PART 22.

### 2.8 Secrets never enter the repo
`.env.example` documents every variable with a comment. Real values never appear in code,
commits, docs, or logs. Service-role keys are server-side only.

---

## PART 3 — VERIFIED BUSINESS FACTS (SINGLE SOURCE OF TRUTH)

Mirror this into `lib/company.ts` (or `content/company.json`) as the **only** place these values
exist. Never hard-code a phone number or address in a component. Consistency of Name/Address/
Phone across the site matters for local SEO and for LLM entity resolution.

### 3.1 Identity
- Legal name: **Nebsam Digital Solutions (K) Ltd**
- Trading name: **Nebsam Digital Solutions**
- Tagline in use: **"We are the solution."**
- Domain: **nebsamdigital.com** (retained)
- Primary market: **Kenya** · Expansion: **East Africa**

### 3.2 Branches (physical offices — only these three)

| Branch | Address | Phones |
|---|---|---|
| Nairobi | Kiambu Road, Ridgeways — next to Impact Motors | +254 140 999399 · +254 726 221122 |
| Mombasa | Makupa Roundabout — next to Mass Petrol Station | +254 769 063333 · +254 711 895555 · +254 759 000111 |
| Nakuru | Lower Bedi Road | +254 725 221122 |

**The table above is canonical and confirmed (PART 1.5, decisions 6–8). Existing sales collateral
contradicts it and must never be used as an address source.** Retired variants that must not appear
anywhere on the site, in schema, or in any published PDF:

- Nairobi as "Equity Ngara" or "Utawala" — **retired**
- Mombasa as "Kenyatta Ave near Saba Saba" — **retired**
- The postal and physical addresses on the KEBS permit (P.O. Box 82436; Ronald Ngala Street,
  Plot No. 810/XVI/MI, Mombasa) — administrative only, **not for publication**
- **+254 727 727 461 — not published.** It appears in the fuel proposal and on the KEBS permit.
  If the KEBS permit image is displayed on the certifications page, that number and the
  `nebsam3kenya@gmail.com` address are visible in it. Either redact those fields in the displayed
  image or display a cropped extract showing only the permit's substantive terms.
- `nebsam3kenya@gmail.com` — administrative only, **not for publication**

Add a build-time check: fail the build if any retired address string or the unpublished phone number
appears in rendered output. That is cheap to implement and it prevents the single most likely
regression on this project, because the strings live in the source documents Claude will be reading
all the way through Sprint 6.

### 3.3 Contact
- Primary WhatsApp: **+254 759 000111**
- Sales email: **onlinesales@nebsamdigital.com**
- General email: **info@nebsamdigital.com** `[[NEEDS_VERIFICATION: confirm this address is live]]`
- Business hours: **24/7, Monday–Sunday**

### 3.4 Service coverage — agents and technicians (NOT branches)
Kisii · Kisumu · Homa Bay · Eldoret · Malindi · Kilifi · Kericho · Thika · Isiolo · Meru ·
Marsabit · Lodwar · Busia · Garissa · Nanyuki · Embu

**Rule:** the UI must visually distinguish *branch* from *service coverage*. Never imply an
office where there is none. Never state a count of agents or technicians.

### 3.5 Registrations and certifications — exact wording required
Describe each as a registration/permit **held**, never as an endorsement of product quality,
and never with invented scope:

- Registered **Data Controller** (Office of the Data Protection Commissioner, Kenya)
- Registered **Data Processor** (Office of the Data Protection Commissioner, Kenya)
- **Communications Authority of Kenya (CAK)** — Application Service Provider (AS) licence
- **Private Security Provider** registration
- **KEBS Permit to Use the Standardization Mark**
- **KIPI (Kenya Industrial Property Institute)** — intellectual property registration

**Verified KEBS documentation** (from the video telematics proposal — this is genuine, dated,
documented substantiation and should be presented prominently rather than as a generic badge):

| Field | Value |
|---|---|
| Permit | Permit to Use the Standardization Mark, Standards Act (Cap. 496) |
| Mark number | SM#84618 |
| Granted to | NEBSAM DIGITAL SOLUTION (K) LIMITED |
| Commodity | Vehicle cameras for video telematics |
| Brand | STREAMAX |
| Standard | KNWA 3006:2024 — Video telematics system for motor vehicle: Performance Requirements |
| Effective | 26 February 2025 |
| Expires | 26 February 2027 |

A **KEBS Laboratory Test Report** (ref BS202445237, report UID 20250205171510-V1, dated
5 February 2025) records that the sampled video telematics system **complies** with KNWA 3006:2024
on ADAS camera detection, driver alerts, DSM camera detection, G-sensor detection, power supply
(in-built battery sustaining the system for a minimum of 30 minutes), system tampering detection,
and ignition-triggered power-on.

Three accuracy traps to avoid:
- **The KEBS permit is product-scoped, not company-scoped.** It covers vehicle cameras for video
  telematics under the STREAMAX brand. Never present it as certifying Nebsam as a company, and
  never imply it covers trackers, alarms, speed governors or radios. Display it on the video
  telematics pages and on the certifications page with its actual scope stated.
- The permit expires **26 February 2027**. Store the expiry in the CMS and surface a reminder in
  admin, so the site never displays a lapsed permit.
- KIPI registers intellectual property. It is **not** a safety or quality certification. Never
  phrase it as "KIPI certified" in a way that implies product approval.

**The KEBS laboratory test report may be quoted in marketing** (confirmed, PART 1.5 #17). Use it.
A dated, named, third-party laboratory report stating that the system complies with a specific Kenyan
standard is worth more than any amount of adjectives, and almost no competitor will have one on their
site. Present the parameters tested and the result, cite the report reference and date, and link to
the document. Do not paraphrase "Complies" into anything stronger.

**IRMS** — Nebsam's speed governor system is associated with IRMS (PART 1.5 #16). Mention it on the
speed governor and certifications pages. There is no functional or code implication. Because
misdescribing a national regulatory system is exactly the kind of error that damages credibility with
the audience that cares, get the exact expansion and phrasing before publishing:
`[[NEEDS_VERIFICATION: IRMS full name and the correct description of Nebsam's relationship to it]]`

**Company name:** use **Nebsam Digital Solutions (K) Ltd** — plural — site-wide (PART 1.5 #5). The
KEBS permit's singular "NEBSAM DIGITAL SOLUTION (K) LIMITED" is a document-level variance; reproduce
it verbatim only where the permit itself is quoted, and never as the site's own name.

Where a certificate document is supplied, display it; where it isn't, do not illustrate it with a
generic badge graphic that implies a document exists.

### 3.6 Trust assets available
- Approximately **6 real testimonials** — use only these, verbatim or lightly edited with
  permission. Never generate a testimonial.
- Real **client logos** — permission granted. Display only logos actually supplied.
- Real photography: team, technicians, vehicles, offices, devices, products, **platform screenshots**.
- AI-generated imagery is permitted **only** to fill genuine gaps, never to depict Nebsam staff,
  Nebsam premises, Nebsam vehicles, or the Nebsam platform.
- **A named corporate client list of roughly 70 companies** exists in the fuel monitoring proposal
  (logistics, transport, energy, engineering, manufacturing, hardware and auto-spares businesses).
  This substantiates "70+ corporate clients" as a factual statement, so that claim may be used —
  but naming or logo-ing an individual client still requires that client's permission. Import the
  list into the CMS with a `permission_confirmed` flag per client and display only confirmed ones.

**Two hazards in the existing collateral — read before touching any supplied media:**

1. **Real customer data is visible in the video telematics proposal.** The "sample footages" pages
   show a live platform session containing customer vehicle registrations (KCK 283C, KCK 289C), a
   fleet group name, device IDs, GPS coordinates, and clearly identifiable faces of a driver and a
   passenger. Publishing any of that without written consent would be a data protection failure by
   a registered data controller, and a straightforward privacy wrong to the people in the cab.
   These frames must be blurred, replaced with consented footage, or excluded. Treat every supplied
   screenshot as suspect until checked for plates, names, faces, coordinates and device IDs.
2. **Some platform screenshots carry third-party product branding.** The fuel proposal's dashboard
   images show interfaces branded to third-party telematics platforms rather than to Nebsam. Using
   another company's UI as "the Nebsam platform" is both misleading and a trademark risk. Use only
   Nebsam-branded platform screenshots. `[[NEEDS_VERIFICATION: which platform screenshots are
   Nebsam-branded and cleared for publication]]`

### 3.7 Conversion hierarchy (design must reflect this order)
1. WhatsApp → 2. Phone call → 3. Request a quote → 4. Book installation →
5. Contact form → 6. Email → 7. Request demo

Not every CTA is visually equal. The primary action on a page is unmistakable.

### 3.8 Language
English now. Architecture must accommodate **Swahili** later without refactoring: copy lives in
the content layer or a message catalogue, never inline in JSX; routing is i18n-ready
(`next-intl` or the App Router `[locale]` pattern) but **only one locale is active**.

---

## PART 4 — CONTENT SOURCE OF TRUTH

### 4.1 Where content comes from
`content-source/` in the repository is **authoritative and read-only**. Never edit files there.
It contains the service and product write-ups, company documents, testimonials, certificates,
downloads and media. The current live website is a secondary reference only, and its **design is
explicitly not a reference**.

Rewrite source documents into web content: same facts, better structure, tighter language, added
scannability and schema. Do not paste them verbatim — the source copy is deck-style, with heavy
ALL-CAPS headings and repetition that reads poorly as a web page.

### 4.2 Known content conflicts to resolve in `docs/CONTENT_AUDIT.md`
Discovered before the project started — verify each with the human, do not silently pick a side:

**Resolved by the client (PART 1.5) — these are closed. Recorded here so the audit trail exists:**

1. ~~ProMax naming~~ → **Hybrid ProMax Car Alarm** (vibrating key remote) and **Hybrid ProMax Plus
   Car Alarm** (vibrating key remote + Anti-Jammer GPS). The source file headed "ProMax" that
   describes anti-jamming GPS is the **ProMax Plus** — its heading is wrong, its body is right.
2. ~~Basic vs Standard Tracker~~ → **Standard Tracker**.
3. ~~Hybrid Alarm vs Hybrid Car Alarm~~ → **Hybrid Car Alarm**.
4. ~~Dashcam vs AI Video Telematics~~ → **two separate products**, not a naming conflict.
5. ~~Branch addresses~~ → Kiambu Road/Ridgeways and Makupa Roundabout. See 3.2.
6. ~~Legal name~~ → "Solutions", plural. See 3.5.
7. ~~KEBS test report usage~~ → quotable. See 3.5.
8. ~~Radio licence fee~~ → annual CAK licence renewal, KES 3,000 per device.
9. ~~"Over 10 years"~~ → approved.
10. ~~"70+ corporate clients"~~ → substantiated by the named client list.

**Still open — log in `docs/CONTENT_AUDIT.md` and keep out of published copy until resolved:**

1. **"KEBS accredited" wording.** The source documents say "accredited"; the verified instrument is
   a Permit to Use the Standardization Mark, product-scoped to video telematics cameras. Use the
   verified wording site-wide. See 3.5.
2. **NTSA data transmission.** The video telematics proposal states that traffic sign recognition
   "transmits this data directly to NTSA servers". Unverified. **Do not publish this claim.** Write
   the traffic-sign-recognition section without any NTSA transmission statement rather than hedging
   it — a hedged regulatory claim is still a regulatory claim.
3. **IRMS.** Expansion and correct phrasing needed. See 3.5.
4. **Unsubstantiated claims** — do not publish: "trusted by over 50,000 customers across Africa",
   "#1 vehicle theft prevention solution in Kenya", "the strongest active vehicle protection system
   in Kenya", "we believe there is no way a thief will drive away with your car", "out-of-this-world
   advantages", "unlimited distances without interference" (radio range is network-dependent and must
   be hedged), and the fuel proposal's vendor claim of a "90%" reduction in fuel theft.
   Reframe each as a capability statement.
5. **Dated collateral.** Fuel proposal 2023; short-range radio 2024; video telematics and long-range
   radio 2025. Specifications, prices and screenshots may be stale. Do not treat a 2023 proposal as
   current fact, and refresh any proposal before publishing it to the download centre.
6. **PDF metadata leakage.** Supplied PDFs carry authoring metadata from their original templates
   (one school-transport document has an unrelated internal title and an unrelated author name).
   Strip metadata from every published PDF and compress them — one supplied file is roughly 40 MB,
   which is unacceptable as a download on Kenyan mobile data.

### 4.3 Taxonomy (product naming CONFIRMED — build against this)

**Solutions** — problem/outcome pages, the primary SEO surface:

| Solution | URL |
|---|---|
| Vehicle Tracking | `/solutions/vehicle-tracking` |
| Fleet Management | `/solutions/fleet-management` |
| Vehicle Security & Anti-Theft | `/solutions/vehicle-security` |
| Fuel Monitoring | `/solutions/fuel-monitoring` |
| AI Video Telematics & Driver Safety | `/solutions/ai-video-telematics` |
| **School Bus Management** | `/solutions/school-bus-management` |
| Speed Limiters (NTSA Compliance) | `/solutions/speed-governors` |
| Cargo & Container Security | `/solutions/container-e-seal` |
| Asset & Equipment Tracking | `/solutions/asset-tracking` |
| Vehicle Recovery | `/solutions/vehicle-recovery` |
| Vehicle Key Programming & Diagnostics | `/solutions/vehicle-key-programming` |
| Radio Communication (PTT / PoC) | `/solutions/radio-communication` |

**Products** — hardware/spec pages, from the supplied documents:

*Trackers:* **Standard Tracker** (local & international) · Bluetooth Tracker · Anti-Jammer Tracker ·
Hybrid Tracker · Hybrid Pro Tracker · Hybrid Pro Max Tracker · Recovery Tracker

*Car alarms:* **Hybrid Car Alarm** · Hybrid Plus Car Alarm · Hybrid Pro Plus Car Alarm ·
**Hybrid ProMax Car Alarm** (vibrating key remote) · **Hybrid ProMax Plus Car Alarm**
(vibrating key remote + Anti-Jammer GPS)

*Video:* **Hybrid Dashcam** and **AI Vehicle Video Telematics** are **two separate products**.
The Hybrid Dashcam is the 4G dual-lens unit (live GPS, vibration detection, driving record, remote
video, cloud storage, parking monitoring, radar/touch/motion detection). AI Vehicle Video Telematics
is the 3-camera Streamax ADAS/DMS system covered by the KEBS permit. Give each its own page, state
plainly how they differ, and cross-link them — "which one do I need?" is a real buying question and
answering it well will rank.
*Systems:* Fuel Monitoring System (fuel level sensor + DFM flow meter) · AI Video Telematics /
Hybrid Dashcam (3-camera Streamax unit) · Speed Governor · Container E-Seal ·
School Bus package (video telematics unit + RFID/biometric attendance terminal + alcohol breath
sensor + twin panic buttons)

*Radios — model-level detail exists and should become real product pages:*
Long-range PoC: Inrico T-521 · Inrico S-100 · Inrico S-200 · Inrico T-290 · Inrico TM-7 (mobile/base
unit) · Inrico DR10 PoC & LMR convergence gateway.
Short-range: Baofeng BF-888s · Baofeng UV-5R · Baofeng UV-9R Plus · Baofeng UV-82 · Kenwood TK-3000.
These have documented specifications (frequency ranges, channels, battery capacity, IP ratings,
Android versions) — use them, they are exactly the technical depth that makes product pages rank.

**Note on the School Bus Solution:** it is a *composite* — it sells video telematics, GPS tracking,
an attendance terminal, an alcohol sensor and three software modules as one package. Model it as a
solution with a bill of materials referencing existing products, not as a standalone product, so
the hardware pages stay single-sourced.

**Industries** — derived only from industries the documents actually name:
logistics & transport · public service vehicles (PSV/matatu) · school transport · car hire &
rental · construction & heavy equipment · mining · agriculture · fuel & hazardous transport ·
security companies · government & institutions · NGOs & humanitarian · corporate fleets ·
cross-border transport

**Relationship rule:** every Solution links to its Products; every Product links to its
Solutions, its Industries, and its Shop entry; every Blog article links to at least one
Solution. No orphan pages.

---

## PART 5 — POSITIONING AND CONTENT MODEL

### 5.1 The distinction that drives everything
Ordinary competitors say "we sell GPS trackers". Nebsam says "we give you visibility, control and
protection over vehicles, drivers, fuel, cargo and field teams". The information architecture must
make that difference structural, not rhetorical.

### 5.2 Solution page content model — every solution page answers, in this order
1. What it is — one paragraph a non-specialist understands
2. The problem it solves — in Kenyan operational terms
3. Who it is for — industries, fleet sizes, vehicle types
4. How it works — 4–6 concrete steps
5. What you get — features, grouped and explained rather than bulleted flatly
6. Hardware options — the actual products that deliver it
7. Installation & support — what happens, where, how long
8. Coverage — where Nebsam can install and support it
9. FAQs — 6–10 real questions, marked up as FAQPage
10. Related solutions, products, industries, articles
11. Conversion block — WhatsApp / quote / call

Write for a fleet manager who is technical about vehicles and not about software.

### 5.3 Writing standards
- Sentence case for headings. The source documents' ALL-CAPS shouting does not transfer.
- Short paragraphs. One idea each. No "In today's fast-paced world".
- Specific over clever: "detects abnormal fuel level drops and alerts you with time, location and
  litres lost" beats "revolutionary fuel intelligence".
- Kenyan English, international clarity. Local nouns where they are the right nouns
  (matatu, PSV, NTSA, boda boda, ICD, Makupa) — they also carry real search value.
- Every page states plainly who Nebsam is and where it operates. LLMs quote what is explicit.

---

## PART 6 — BRAND, DESIGN DIRECTION AND VISUAL SIGNATURE

### 6.1 Direction
**Premium corporate foundation + futuristic telematics + industrial engineering.**
Reference the logo as the brand anchor; never redraw or recolour it.

### 6.2 Colour
Blue-led, deliberately **not** SaaS sky-blue. Build a token system around deep navy, rich blue, a
disciplined electric-blue signal accent, near-black, white, cool neutrals. Derive exact values
from the supplied logo and document them in `DESIGN_SYSTEM.md` with contrast ratios recorded.

Required token names (values TBD by you):
```
brand-navy · brand-blue · brand-signal · ink · surface · surface-raised · surface-inverse
border-hairline · text-primary · text-secondary · text-inverse
state-ok · state-warn · state-alert
```

Light and dark **sections** — a composed rhythm across the page. No user-facing theme toggle.

### 6.3 Typography
Pair a characterful display face with a highly legible body face, plus a mono/utility face for
telemetry and technical labels. Mono is part of the brand voice here — it is how the site signals
"instrumentation" rather than "brochure". Set a real type scale. Load only the weights used;
`font-display: swap`; self-host or use `next/font` — no render-blocking font requests.

Do **not** default to Inter + a purple gradient. Do not default to the current AI-design cluster
either: cream background with high-contrast serif and terracotta accent; near-black with one acid
accent; or fake-broadsheet hairline columns. Those are defaults, not decisions.

### 6.4 The signature element
The site needs **one** thing it is remembered by, derived from Nebsam's own world — telemetry.
Candidate directions (explore three, propose one):
- a live-feeling telemetry strip that reads like a real vehicle status feed
- an animated Kenya network map where branches and coverage towns resolve as signal nodes
- a route-line motif that draws itself as the reader scrolls, carrying section transitions
- a device-frame platform viewer built from the real screenshots

Spend boldness in one place. Everything around the signature stays quiet and disciplined.

### 6.5 Simulated telemetry — hard rule
Demonstration telemetry is allowed and encouraged as visual language. It must:
- use obviously illustrative registration plates, never a real customer's
- be labelled as an illustration where a reasonable person could mistake it for live data
- never be described as live customer data or real-time fleet status

### 6.6 Prohibited patterns
Uniform rounded-card grids · three-column feature blocks as the default answer · purple/blue AI
gradients · abstract blobs · glass on everything · pill buttons everywhere · giant centred
headings in every section · identical section rhythm · decorative icons that carry no meaning ·
stock corporate handshakes · stock "African businessman with tablet" imagery · numbered 01/02/03
markers where the content is not actually a sequence · motion for its own sake · emoji as UI
iconography.

### 6.7 Process (mandatory, per major surface)
Use the **frontend-design** skill and work in two passes:
1. **Plan** — a compact token system (4–6 named hex values, 2–3 typefaces with roles, a layout
   concept in prose + ASCII wireframe, the signature element). Present it.
2. **Critique before code** — ask whether any part is what you would produce for any generic
   telematics brief. Revise what is, and say what you changed and why.
Then build, screenshot, critique the screenshot, remove one thing.

---

## PART 7 — TECHNOLOGY AND CONVENTIONS

### 7.0 THE ACTUAL REPOSITORY — ALREADY INSPECTED

Repository: `github.com/Kelvin-dev001/nebsam-website` (branch `main`). Inspected before this brief
was finalised. **Verify these findings yourself in Sprint 0, but do not spend the sprint
rediscovering them.**

**Current stack — this is not a Next.js project.**

| | |
|---|---|
| Framework | **Create React App** (`react-scripts` 5.0.1) — a client-rendered SPA |
| React | 19 |
| Routing | `react-router-dom` 7 |
| Styling | Tailwind CSS 3.4 + PostCSS + Autoprefixer |
| Animation | `framer-motion` 12 |
| Icons | FontAwesome + `lucide-react` + `react-icons` (three icon libraries) |
| Metadata | `react-helmet` — client-side only |
| Other | `react-type-animation`, `web-vitals`, Testing Library (unused) |
| Backend | **None.** No API, no database, no auth, no env config. |
| Size | 23 source files, ~9 components, `src` 1.3 MB, `public` **28 MB** |

**This confirms the central problem and reframes the work.** CRA ships an empty HTML shell and
renders everything in the browser; `react-helmet` writes metadata after hydration. So the current
site's content and its titles and descriptions are largely invisible to crawlers that don't execute
JavaScript, and to most LLM retrieval. The diagnosis in the original brief was right, and it is
architectural, not a matter of adding tags.

Therefore: this is a **migration from CRA to Next.js App Router**, not a refactor. Almost nothing in
`src/` transfers. Do not attempt to preserve the SPA and bolt SSR onto it. Do not try to run both.
Record the migration approach as `docs/decisions/ADR-0001-cra-to-nextjs.md` in Sprint 0.

**What to keep:**
- `public/certificates/` — real scans: `kebs.jpg`, `cak.jpg`, `data-controller.jpg`,
  `data-processor.jpg`, `private-security-provider.jpg`, `installation.jpg`. These are the
  certification assets the brief needs. Check each for the unpublished phone number and the
  administrative email before display (see 3.2).
- `public/clients/` — six real client logos: `armytex.png`, `buscar.jpg`, `ismax-security.png`,
  `kensalt.jpeg`, `muthukinjo.jpeg`, `ngongveg.png`. Cross-check against the ~70-name client list
  and the permission tracker.
- Real product and facility photography already in `public/`: trackers (`2-wire-tracker`,
  `magnetic-tracker`, `obd-tracker`, `fingerprint-tracker`, `fuel-tracker`), `fuel-sensor`,
  cameras (`front-camera`, `rear-camera`, `cabin-camera`), `sr-100` … `sr-600`, `xlr-3000`,
  `mobile-app`, `web-platform`, `kenya-map`, and premises shots (`showroom`, `reception`,
  `main-entrance`, `service-bay`, `office-hero`). Inventory all of it in `ASSET_MAP.md` before
  requesting new photography — a meaningful part of the shot list may already be satisfied.
- The Tailwind setup as a reference point only. Tokens get rebuilt in Sprint 1.

**What to discard:** all components, `react-router-dom`, `react-helmet`, `react-scripts`, two of the
three icon libraries, `react-type-animation`, the CRA test scaffolding.

**28 MB in `public/` must not carry over as-is.** Audit, compress, convert to AVIF/WebP, and move
managed media to Supabase Storage or Cloudinary. Duplicates exist (`africa-map.svg` /
`africa-mappp.svg`, `logo192.jpg` / `logo192.png`, `tracking-hero-bg (2).jpg` — note the space and
parenthesis in that filename, which will break shell operations; rename before use).

**The live URL inventory is already known — the 301 map has no excuse to be missing.** From
`public/sitemap.xml`:

```
/                                        → /
/about                                   → /about
/services                                → /solutions
/services/car-tracking                   → /solutions/vehicle-tracking
/services/fuel-monitoring                → /solutions/fuel-monitoring
/services/radio-calls                    → /solutions/radio-communication
/services/vehicle-video-telematics       → /solutions/ai-video-telematics
/services/speed-governors                → /solutions/speed-governors
/services/car-alarms                     → /solutions/vehicle-security
/contact                                 → /contact
```

Those mappings are proposals — confirm each in Sprint 0, then implement as permanent 301s in
`next.config.js` in Sprint 2, not Sprint 15. `/services/*` currently holds whatever ranking equity
the site has; losing it is the one irreversible mistake available on this project. Also cross-check
Search Console for indexed URLs absent from this sitemap.

Note the current `<title>` is just "Nebsam" and there is no meta description in `index.html`. The
existing `robots.txt` is permissive and correct; the sitemap is hand-maintained and must become
generated.

### 7.1 Stack (change only with approval)
- **Next.js (App Router) + React + TypeScript + Tailwind CSS**
- Server Components by default; `"use client"` only where interaction requires it, and justified
- **Motion (Framer Motion)** for interaction and scroll animation; GSAP only if a specific
  timeline genuinely needs it, and never both on the same page
- **Supabase** — Postgres, Auth, Storage, Row Level Security
- **Vercel** — existing deployment retained; preview deployments per branch
- Images: `next/image`, AVIF/WebP, explicit dimensions; Supabase Storage or Cloudinary for
  managed media
- Forms: server actions + **Zod** validation on the server, not only the client
- Transactional email: Resend (or equivalent) behind a single `lib/email.ts` interface
- Analytics: GA4 + Google Search Console; Vercel Analytics optional
- Selective **shadcn/ui** primitives only where they save real time. The site must not read as a
  shadcn template — restyle to the Nebsam tokens.

### 7.2 Repository conventions
- `kebab-case` files and folders; `PascalCase` components; `camelCase` functions
- One component per file; colocate component-only helpers
- No component over ~200 lines — split it
- Route groups: `app/(site)`, `app/(shop)`, `app/(admin)`, `app/api`
- All shared types in `types/`; database types generated from Supabase, not hand-written
- No magic strings — routes, event names, statuses live in `lib/constants.ts`
- ESLint + Prettier + `tsc --noEmit` must pass before any commit
- A dependency is added only with a one-line justification in the sprint report

### 7.3 Environment contract
Maintain `.env.example` with every variable, commented, grouped by service. Any new variable is
added there in the same commit that introduces its use.

---

## PART 8 — SITE ARCHITECTURE

```
/                                     Home
/solutions                            Solutions index
/solutions/[slug]                     Solution detail
/products                             Product catalogue — browse, filter, compare
/products/category/[slug]             Category (GPS trackers, car alarms, dashcams, radios, …)
/products/[slug]                      MERGED product page: specs + price + buy
/shop                                 → 301 to /products (kept as a nav label only)
/cart                                 Cart → WhatsApp checkout
/orders/[orderNumber]                 Order confirmation / status lookup
/industries                           Industries index
/industries/[slug]                    Industry detail
/platform                             Fleet platform showcase
/resources                            Resources hub
/resources/blog                       Blog index
/resources/blog/category/[slug]       Blog category
/resources/blog/[slug]                Article
/resources/downloads                  Download centre
/resources/faqs                       FAQs
/about                                About Nebsam
/about/team                           Team
/about/certifications                 Certifications & registrations
/about/coverage                       Coverage network (branches + agents)
/about/partners                       Partners
/support                              Support hub
/support/verify-installation          Certificate verification
/support/suggestions                  Suggestions
/support/book-installation            Installation booking
/contact                              Contact
/quote                                Request a quote
/legal/privacy-policy                 Privacy policy (Kenya DPA 2019)
/legal/terms                          Terms
/legal/cookies                        Cookie notice
/admin/*                              Admin (noindex, auth-gated)
/llms.txt · /robots.txt · /sitemap.xml
```

**Products and Shop are MERGED — one page type (confirmed, PART 1.5 #14).** `/products/[slug]` is
canonical and carries everything: technical specifications, features, use cases, compatibility,
installation, the price, and the add-to-cart action. There is no separate commercial page.

This is the right call and it avoids the classic keyword-cannibalisation trap where a spec page and a
shop page for the same device compete with each other and split their own ranking signal. It also
halves what staff have to maintain.

Consequences to honour:
- One `Product` schema block per product, with `Offer` where a price is published.
- "Shop" may remain a navigation label pointing at `/products`, but `/shop` and `/shop/*` must
  **301** to the `/products` equivalents. Never let both resolve 200.
- A product without a published price shows "Request price" and a WhatsApp CTA in place of
  add-to-cart. Same page, different action.
- The page must serve two very different readers without becoming a mess: a fleet manager
  researching capability, and a buyer ready to pay. Put the decision-useful summary and price above
  the fold, the deep specification below it. Do not bury the specs in a tab that renders client-side
  only — that is the crawlability failure this whole rebuild exists to fix.

Slugs are permanent. Confirm naming before minting URLs. Any later change requires a 301.

---

## PART 9 — KEY PAGE SPECIFICATIONS

### 9.1 Homepage
Not a stack of generic sections — a narrative with a beginning and an argument:

1. **Hero** — real cinematic vehicle/fleet photography, telemetry overlay, one clear headline,
   CTA hierarchy per 3.7
2. **Proof band** — registrations, branches, client logos (real only)
3. **What Nebsam actually does** — the visibility/control/protection thesis in one screen
4. **Signature telematics moment** — the element from 6.4
5. **Solutions** — deliberately composed, not a uniform card grid
6. **The platform** — real screenshots in a device frame, honestly labelled
7. **Shop** — featured products, real photography, direct path to buy
8. **Industries** — entry points by sector
9. **How we work** — enquiry → survey → installation → training → support
10. **Coverage** — the Kenya network: 3 branches, 16+ coverage towns
11. **Customer proof** — the real testimonials
12. **Resources** — latest articles
13. **Conversion close** — WhatsApp-led

Twelve excellent sections beat twenty mediocre ones. Cut rather than pad.

### 9.2 Certificate verification (`/support/verify-installation`) — SECURITY-CRITICAL

**Confirmed: customers look up their installation by vehicle number plate, not certificate number**
(PART 1.5 #13). That is the right UX call — nobody remembers a certificate number, everybody knows
their plate. But it changes the threat model completely, because a plate is public information
visible on every vehicle on the road, and it must be designed for accordingly.

#### The problem with a plate-only public lookup
If anyone can type any plate and get back a valid/expired status, the endpoint becomes:

- **a target list for vehicle thieves** — it discloses which vehicles carry a Nebsam installation
  and, far worse, which installations have **expired**. An expired record identifies a vehicle whose
  owner believes it is protected and whose protection has lapsed. That is the single most valuable
  piece of information you could hand a thief.
- **a customer list for competitors** — plate ranges can be enumerated and scraped to size and map
  Nebsam's customer base.
- **a disclosure of personal data** — a vehicle registration linked to a named service relationship
  is personal data about the owner under the Data Protection Act 2019, and Nebsam is a registered
  data controller.

**Do not ship a plate-only public lookup that reveals validity or expiry.** Raise this with the
client before Sprint 11 and get one of the options below signed off.

#### Recommended design — plate plus one lightweight second factor
Keep the plate as the primary field, add one thing only the legitimate holder knows.

**Option A (recommended).** Plate + **last 4 digits of the phone number registered on the
installation**. No SMS cost, one extra field, and it defeats casual and automated enumeration.
**Option B (strongest).** Plate + OTP to the registered phone. Best protection, carries SMS cost and
friction; worth offering as the fallback when the phone number on file has changed.
**Option C.** Plate + certificate number — defeats the purpose of the change, do not propose it.

**And make the legitimate path frictionless:** the QR code printed on the certificate should deep-link
with a **signed, expiring token** (`/support/verify-installation?t=<signed>`) that resolves directly to
the result with no second factor at all. The holder of the physical certificate scans and sees the
answer instantly; only manual plate entry requires the second factor. That gives the client the
convenience they want without the exposure.

**If the client insists on plate-only with no second factor**, then the public response must be
reduced to a single neutral state — "An installation record exists for this vehicle. Contact Nebsam
for details." — with **no dates and no valid/expired distinction**, because the valid/expired
distinction is the harmful part. Full details then go out by SMS or WhatsApp to the phone number on
file, not to the browser.

#### Public result after successful verification
```
Status:            VALID / EXPIRED / NOT FOUND
Vehicle:           KXX 000X   (as entered, echoed only)
Installation date: DD/MM/YYYY
Expiry date:       DD/MM/YYYY
```
No customer name, no phone number, no branch, no technician name, no device ID, no address.

#### Implementation requirements
- Server-side lookup only. Never ship the certificate table, or any part of it, to the client.
- **Store a keyed hash of the normalised plate, not the plate in plaintext.** Normalise first
  (uppercase, strip spaces and hyphens, canonicalise `O`/`0` confusion), then HMAC with a server-side
  secret, and index on the hash. A database leak then yields no usable plate list. Keep a plaintext
  plate only where operations genuinely require it, and if so, in a separate restricted table.
- Rate limit per IP **and** per normalised plate, with escalating backoff. Plate-space enumeration is
  cheap; make it expensive.
- Bot protection (Turnstile/hCaptcha) from the first failed attempt, implemented so it never blocks
  keyboard-only users.
- Identical, generic failure copy whether the plate is unknown or the second factor is wrong. A
  different response for the two states is itself an oracle.
- Log every attempt — hashed IP, hashed plate, outcome, timestamp — in `verification_attempts`, and
  surface a spike alert in admin. An enumeration attack looks like traffic; you only see it if you
  are counting.
- No plate, and no verification outcome tied to a plate, may enter analytics, URLs, logs or error
  messages. Fire `certificate_verified` with the outcome only.

### 9.3 Suggestions (`/support/suggestions`)
Optional name/phone/email, category, message, optional attachment, explicit anonymous option.
Attachments: extension **and** MIME allowlist, size cap, stored in a private bucket, served only
via short-lived signed URLs to admins. Honeypot + rate limit. Confirmation state that reads as a
real acknowledgement, not a toast.

### 9.4 Download centre (`/resources/downloads`)
Category → item cards with title, type, size, updated date, thumbnail. Public files via CDN;
gated files (if any) via signed URLs. Count downloads per file and surface it in admin. Never
publish a document not supplied.

### 9.5 Coverage (`/about/coverage`)
Stylised Kenya map. Branch markers and coverage markers are **visually distinct and legended**.
Branch cards carry full NAP + Google Maps link + branch phones. Coverage towns state
"agents and technicians available" — no invented addresses, no invented counts.

### 9.6 Platform (`/platform`)
Built entirely from real screenshots. Describe only functionality visible in them or documented
in the source material. If a capability cannot be evidenced, it does not appear.

---

## PART 10 — SHOP AND WHATSAPP CHECKOUT (EXPLICIT)

**Decision from the client: WhatsApp is the checkout. There is no online payment.**
No card gateway, no M-Pesa integration in this build. The schema is prepared for them; the flow
is not built.

### 10.1 Flow
```
Browse → product page → add to cart → cart review → "Order on WhatsApp"
   → order persisted server-side, order number issued
   → WhatsApp opens with a pre-filled structured message
   → Nebsam confirms, arranges payment and installation off-platform
   → admin moves the order through its status pipeline
```

### 10.2 Requirements
- Cart persists across reloads (client storage) and is **rehydrated safely** — never trust client
  prices; recompute every total server-side from the database at order creation.
- Pressing "Order on WhatsApp" **must** create an `orders` row before opening WhatsApp, so a
  dropped chat is still a recorded lead. This is the single most important detail in the shop.
- Order number format: `NBS-YYMMDD-XXXX` (short, human-readable over a phone call).
- The WhatsApp message is generated server-side and deep-linked via `https://wa.me/254759000111?text=…`
  (URL-encoded), formatted as:

```
NEBSAM ORDER  NBS-260817-0431

1x Hybrid Pro Max Tracker
2x Hybrid Car Alarm

Subtotal: KES 00,000
Preference: Installation at Mombasa branch
Name: (customer fills)

View: nebsamdigital.com/shop/order/NBS-260817-0431
```

- Optional pre-checkout fields (name, town, install vs pickup, preferred branch) — keep the form
  to the minimum that makes the WhatsApp conversation efficient. Every additional field costs
  conversions.
- A single "Enquire on WhatsApp" action on product pages for buyers who never open the cart.
- Order confirmation page is reachable by order number and shows status. It must not expose other
  customers' orders — treat the order number as a bearer token and keep it unguessable.
#### 10.2 Pricing — confirmed rules
- **Prices are published.** Where a product's price is not confirmed, show **"Request price"** with a
  WhatsApp CTA in place of add-to-cart. Never invent or placeholder a number.
- **All prices are exclusive of VAT** (PART 1.5 #10). Every displayed price carries a visible
  `excl. VAT` label — on the product page, in the cart, in the cart total, and inside the generated
  WhatsApp order message. A VAT-exclusive price shown without a label is the most common source of
  order disputes in Kenyan e-commerce, and the fix costs one span.
- Store `price_kes` as the VAT-exclusive figure. Keep a single `VAT_RATE` constant in
  `lib/constants.ts` so a VAT-inclusive display toggle can be added later without touching data.
- **Confirmed radio prices** (2025, current): Inrico T-521 **KES 22,000** · Inrico S-100
  **KES 30,000** · Inrico S-200 **KES 30,000** · Inrico TM-7 **KES 30,000**.
- **Recurring costs must be disclosed on the product page, not at checkout.** PoC radios carry an
  **annual CAK licence renewal of KES 3,000 per device** (PART 1.5 #18). Add `recurring_fee_kes`,
  `recurring_fee_period` and `recurring_fee_note` to `products`, render them next to the price, and
  include them in the WhatsApp order message. Hiding a recurring fee until after purchase generates
  refund requests and destroys the trust the rest of this site is built to earn.
- State clearly per product whether installation is included or quoted separately.
  `[[NEEDS_VERIFICATION: installation and delivery terms per product category]]`
- Order routing: which number/branch receives which orders.
  `[[NEEDS_VERIFICATION: WhatsApp order routing rules]]`
- Instrument the funnel: `view_item`, `add_to_cart`, `begin_checkout`,
  `whatsapp_order_submitted` (with order number and value).

### 10.3 Prepared but not built
`payments`, `payment_intents`, `shipments` tables and a `PaymentProvider` interface with a single
`WhatsAppManualProvider` implementation. Adding M-Pesa Daraja later must not require touching the
cart, product, or order UI.

---

## PART 11 — ADMIN / CMS

A non-technical staff member must run the site without a developer. That is a design requirement,
not an afterthought — the admin quality determines whether the blog actually gets published weekly.

### 11.1 Manages
**Content:** solutions · products · industries · FAQs · blog posts · downloads · homepage
featured slots
**Shop:** products, categories, prices, availability, images, featured
**Orders:** status pipeline (new → contacted → confirmed → installed → closed / cancelled),
internal notes, export
**Trust:** testimonials · certifications · client logos · partners
**Operations:** installation certificates (with CSV import) · branches · coverage locations
**Inbox:** contact · quote · demo · installation · suggestion submissions, with status and notes
**Media library:** upload with automatic optimisation, alt-text field that is *required*

### 11.2 Editor experience requirements
- Rich text with a constrained toolbar — no arbitrary HTML, no font/colour pickers that break
  the design system
- Image upload with drag-drop, auto-resize, auto-format, mandatory alt text
- SEO panel per item: title, meta description, slug, social image, with live character counts
- Draft → in review → published, plus scheduled publishing and unpublish
- Preview as it will appear publicly, before publishing
- Autosave and revision history — a staff member who loses 40 minutes of writing stops using the CMS
- Validation with helpful messages, never a raw database error
- Mobile-usable for approvals

### 11.3 Roles
`admin` (all) · `editor` (content + shop, no settings/users) · `sales` (inbox + orders only) ·
`viewer` (read-only). Enforced in **Supabase RLS**, not merely hidden in the UI. Admin routes
`noindex, nofollow` and excluded from the sitemap.

---

## PART 12 — DATA MODEL (first pass, finalise in Sprint 0)

```
profiles(id, email, full_name, role, created_at)
solutions(id, slug, name, summary, body, hero_image, order, status, seo_*)
products(id, slug, name, family, summary, body, specs jsonb, features jsonb,
         gallery jsonb, status, seo_*)
product_solutions(product_id, solution_id)
industries(id, slug, name, summary, body, hero_image, status, seo_*)
product_industries(product_id, industry_id)
product_categories(id, slug, name, description, order)
-- products and shop are merged: commercial fields live on `products`, no separate shop table
-- products(… sku, price_kes /* excl. VAT */, price_visible, availability, featured,
--           recurring_fee_kes, recurring_fee_period, recurring_fee_note)
orders(id, order_number, status, customer_name, customer_phone, customer_town,
       fulfilment_type, branch_id, subtotal_kes, whatsapp_sent_at, notes, created_at)
order_items(id, order_id, product_id, name_snapshot, unit_price_snapshot, qty)
blog_posts(id, slug, title, excerpt, body, featured_image, author_id, category_id,
           status, published_at, updated_at, reading_time, seo_*)
blog_categories(id, slug, name, description)
authors(id, name, role, bio, avatar, links jsonb)
faqs(id, question, answer, scope, scope_id, order)
downloads(id, slug, title, description, file_path, file_type, file_size,
          category, thumbnail, download_count, status)
certifications(id, name, issuer, description, document_path, image, order)
testimonials(id, author_name, company, industry, quote, logo, status, order)
client_logos(id, name, logo_path, order, permission_confirmed)
branches(id, slug, name, address, town, phones jsonb, maps_url, hours, lat, lng)
coverage_locations(id, town, county, type['agent'|'technician'|'both'], lat, lng, active)
installation_certificates(id, plate_hash /* HMAC of normalised plate */,
                          phone_last4_hash, certificate_number_last4,
                          installed_on, expires_on, status, created_at)
verification_attempts(id, ip_hash, plate_hash, outcome, created_at)
submissions(id, type['contact'|'quote'|'demo'|'installation'|'suggestion'],
            payload jsonb, is_anonymous, status, assigned_to, notes, created_at)
media(id, path, alt_text, width, height, bytes, mime, uploaded_by, created_at)
audit_log(id, actor_id, action, entity, entity_id, diff jsonb, created_at)
```

Rules: RLS on every table; public read only where genuinely public; every migration is a
reviewed file in `supabase/migrations/`; never mutate schema outside migrations; seed script for
local development that contains **no** real customer data.

---

## PART 13 — SEO AND LLM DISCOVERABILITY

### 13.1 Foundations (every indexable page)
Unique title · unique meta description · canonical · exactly one H1 · logical H2/H3 · clean
descriptive URL · breadcrumbs (visible + `BreadcrumbList`) · Open Graph + Twitter card with a
real image · alt text on every image · internal links in and out · sitemap inclusion.

Content that matters must be **server-rendered**. Nothing important behind client-only rendering
or interaction. This is where the current site reportedly fails — verify it and record the
before/after in `docs/SEO_LLM_STRATEGY.md`.

### 13.2 Structured data by template
- Global: `Organization` (with `sameAs` socials, `logo`, `contactPoint`), `WebSite`
- Branches: `LocalBusiness` × 3, with consistent NAP, `openingHours` 24/7, `geo`
- Solutions: `Service`
- Products / Shop: `Product` (+ `Offer` only where a real price is published)
- Blog: `Article` with real `author`, `datePublished`, `dateModified`
- FAQ blocks: `FAQPage`
- Never: `Review`/`AggregateRating` without genuine collected reviews. Never markup that
  contradicts the visible page. Validate every type before a sprint closes.

### 13.3 LLM discoverability — the part most sites get wrong
Assistants answer from text that is explicit, self-contained, and consistent. So:

- **`/llms.txt`** at the root: who Nebsam is, what it does, where it operates, branch details,
  the canonical list of solutions and products with URLs, and pointers to key pages.
- **A canonical company description** (2–3 sentences) stored once in `lib/company.ts` and reused
  verbatim in the footer, About, `llms.txt` and Organization schema. Identical wording everywhere
  strengthens entity resolution; drift weakens it.
- **Self-contained answers.** Each page states its own context — "Nebsam Digital Solutions
  installs and supports vehicle tracking across Kenya from branches in Nairobi, Mombasa and
  Nakuru" — because an assistant may retrieve one page with no site context.
- **Answer-shaped sections.** A short, direct answer paragraph immediately under each question
  heading, before elaboration. Assistants (and featured snippets) lift the first clear answer.
- **Definitional content.** Pages that define telematics, geofencing, immobilisation, anti-jamming,
  fuel siphoning detection, PoC radio, e-seal. Definitions get cited.
- **Zero contradictions.** One phone number per branch across every page; one product name per
  product; one company description. Contradictions make a model distrust the source.
- **Real dates.** `datePublished` and `dateModified` on articles; a visible "last updated" on
  solution pages.

### 13.4 Target intents (build genuine depth, never stuff)
vehicle tracking Kenya · GPS tracker Kenya · car tracking Nairobi / Mombasa · fleet management
Kenya · fleet tracking system Kenya · fuel monitoring Kenya · fuel theft detection · speed
governor Kenya · NTSA speed limiter · dashcam Kenya · driver behaviour monitoring · vehicle
immobilizer Kenya · anti-jammer tracker Kenya · motorbike tracking Kenya · school bus tracking
Kenya · car hire vehicle tracking · container e-seal Kenya · asset tracking Kenya · vehicle key
programming Nairobi · PoC radio Kenya · telematics East Africa

No dedicated thin town-landing pages (client decision). Local relevance comes from real branch
pages, the coverage architecture, and consistent NAP.

### 13.5 Blog as an acquisition engine
Weekly cadence, published by non-technical staff. Categories mapped to solutions. Seed 8–10
articles that answer real questions, each linking to its solution and product. Author profiles
with a real name, role and photo — anonymous "admin" bylines weaken both E-E-A-T and LLM trust.
`[[NEEDS_VERIFICATION: blog author names, roles, bios, photos]]`

---

## PART 14 — PERFORMANCE (THE KENYAN MOBILE REALITY)

Most visitors will arrive on a mid-range Android phone on mobile data that they pay for by the
megabyte. A cinematic, animation-rich site that costs 8 MB is a *failure*, however beautiful it
looks on a MacBook on office fibre. This constraint is a design input, not a post-launch cleanup.

### Hard budgets — a sprint does not close if these are breached
| Metric | Budget |
|---|---|
| LCP (mobile, throttled 4G, mid-tier Android) | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| Initial JS per route (gzipped) | ≤ 180 KB |
| Total page weight, homepage | ≤ 1.5 MB |
| Total page weight, content pages | ≤ 1.0 MB |
| Largest single image, delivered | ≤ 250 KB |
| Lighthouse mobile Performance | ≥ 90 |
| Lighthouse Accessibility / Best Practices / SEO | ≥ 95 |
| Web fonts | ≤ 3 files total |

### Techniques
Server Components by default · `next/image` with AVIF/WebP, sized and `priority` only on the LCP
image · lazy-load below the fold · no autoplaying background video on mobile (poster + optional
tap to play) · dynamic-import heavy client components (maps, carousels, editors) · animation via
`transform`/`opacity` only · `will-change` used surgically · no layout-thrashing scroll handlers ·
route-level code splitting · ISR/static generation for content pages · CDN caching headers.

Test on a throttled mobile profile, not on your machine. Record numbers in each sprint report.

---

## PART 15 — ACCESSIBILITY

Target **WCAG 2.2 AA**.

Semantic HTML first, ARIA only where semantics fall short · visible focus rings on every
interactive element (a glass surface must not swallow the focus ring) · full keyboard operability
including the mega menu, cart, carousels and modals · skip-to-content link · 4.5:1 text contrast
(3:1 for large text) verified on **glass and dark sections specifically**, where this usually
breaks · required alt text with no decorative-image alt padding · labelled form fields with
inline, specific errors · `prefers-reduced-motion` honoured by disabling transforms and
parallax while preserving meaning · touch targets ≥ 44 px · tested with keyboard only and with a
screen reader on the critical paths (nav, quote form, cart → WhatsApp, verification).

Accessibility is never traded for a visual effect. If an effect cannot be made accessible, the
effect is cut.

---

## PART 16 — SECURITY AND PRIVACY

Nebsam is a registered data controller and processor under Kenya's **Data Protection Act, 2019**.
The site must not undermine that posture.

- Supabase **RLS on every table**; anon key is read-only against public views; service-role key
  server-side only
- Admin routes protected by middleware **and** RLS; session expiry; no client-side-only guards
- Server-side Zod validation on every mutation; never trust client input or client prices
- Rate limiting on all public POST endpoints and on certificate verification (see 9.2)
- Bot protection on public forms (honeypot + Turnstile), no CAPTCHA that blocks keyboard users
- File uploads: extension + MIME allowlist, size cap, private bucket, signed URLs, never served
  from a public path
- Security headers: CSP (report-only first, then enforced), HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `frame-ancestors`
- No PII in logs, analytics, URLs, or error messages; no customer data in seed files
- Privacy policy that names: what is collected, why, retention, third parties (Supabase, Vercel,
  Google, WhatsApp/Meta), the rights of data subjects under the DPA 2019, and how to contact the
  data protection contact person. `[[NEEDS_VERIFICATION: DPO/data protection contact details]]`
- Cookie notice with genuine consent gating for analytics — do not fire GA4 before consent
- `audit_log` written for every admin create/update/delete

### 16.1 Children's data and biometric data — School Bus Solution
The School Bus Solution processes **children's personal data**, optionally **children's biometric
data** (facial recognition, fingerprint, iris), and **driver biometric and alcohol-screening data**.
Under the Data Protection Act 2019 biometric data is sensitive personal data, and children's data
attracts heightened protection. The marketing site does not process this data, but how the site
*describes* it creates the company's public commitments, so:

- describe plainly what is collected, who can see it, and how long it is retained
- state that biometric attendance is **optional**, and that RFID or manual attendance are
  alternatives — parents and schools must be able to see a non-biometric path
- never imply that in-bus video is viewable by anyone beyond authorized school administrators
- never promise absolute safety; the system supports safety, it does not guarantee it
- never present driver alcohol screening as a legal or evidential test
- the privacy policy must address children's data and biometric data specifically for this product,
  not by generic reference
- `[[NEEDS_VERIFICATION: retention periods for in-bus video, attendance records and biometric templates]]`

This is the highest legal-sensitivity page on the site. Draft it conservatively and flag it for
legal review before launch.

---

## PART 17 — ANIMATION SYSTEM

Intensity: **7/10** — alive and engineered, never restless.

Five defined levels, documented with durations and easings in `ANIMATION_SYSTEM.md`:
1. **Micro** — hover, press, focus, icon response. 120–200 ms.
2. **Reveal** — scroll-triggered entrance, staggered. 300–500 ms, once, never on re-scroll.
3. **Data** — counters, telemetry ticks, signal pulses, route lines. The brand's signature motion.
4. **Cinematic** — hero sequence, parallax layers, map resolution. One per page maximum.
5. **Transition** — page and product transitions. Must never delay content paint.

Rules: nothing animates purely because it can — every animation communicates hierarchy, state,
continuity, or "this is instrumentation" · content is never gated behind an animation · no
infinite ambient motion in the reader's peripheral vision · no scroll-jacking · reduced motion
respected at every level · animation never causes layout shift · GPU-friendly properties only.

---

## PART 18 — MEDIA AND PLACEHOLDERS

Priority order: real Nebsam photography → real platform screenshots → real product photography →
licensed stock (rare, and never depicting Nebsam) → AI-generated (gaps only, never people or
premises presented as Nebsam's).

Placeholder system — a typed component, not a grey box with lorem ipsum:
```tsx
<ImagePlaceholder
  kind="hero" | "product" | "team" | "platform" | "certificate" | "branch" | "industry"
  ratio="16/9"
  note="Mombasa branch exterior — needed at 2400px wide"
/>
```
Every placeholder renders a visible on-brand notice in development, a neutral on-brand block in
production, and registers itself in `docs/ASSET_MAP.md` so the human gets one clear shot list.

Never silently substitute stock imagery where a real Nebsam asset is expected.
All images: meaningful filenames, correct dimensions, AVIF/WebP, alt text written for a human.

---

## PART 19 — ANALYTICS AND CONVERSION INSTRUMENTATION

If it is not measured, nobody will know whether the site brings business. Track, at minimum:

`whatsapp_click` (with source page + context) · `phone_click` · `quote_submitted` ·
`installation_booking_submitted` · `demo_requested` · `contact_submitted` ·
`suggestion_submitted` · `download_started` (file name) · `add_to_cart` · `begin_checkout` ·
`whatsapp_order_submitted` (order number + value) · `certificate_verified` (outcome only, never
the number) · `blog_read_complete`.

One `lib/analytics.ts` wrapper; event names in `lib/constants.ts`; no PII in any payload; nothing
fires before cookie consent. Configure GA4 conversions for WhatsApp click, quote submitted, and
WhatsApp order submitted, and submit the sitemap to Search Console at launch.

---

## PART 20 — SPRINT PLAN

Resequenced from a naive order so that dependencies land before the things that need them: the
content layer and admin scaffold precede the blog and shop, because building content pages
against hard-coded data and migrating them later wastes a sprint.

**Every sprint ends with a report (PART 21) and a full stop.**

| # | Sprint | Delivers | Gate |
|---|---|---|---|
| 0 | Discovery & Architecture | Audits + all planning docs + `CLAUDE.md`. No code. | Human approves architecture |
| 1 | Design System & Homepage Prototype | Tokens, type, primitives, motion primitives, signature element, one homepage screen as visual proof | Human approves the *look* |
| 2 | Core Infrastructure | Layout, nav, footer, WhatsApp button, SEO/metadata/schema infrastructure, generated sitemap, robots, `llms.txt`, **the `/services/*` → `/solutions/*` 301 map (PART 7.0)**, `/shop` → `/products` 301s, retired-string build check (3.2), error/loading states, analytics + consent | Lighthouse + a11y baseline; every old URL resolves |
| 3 | Data & Content Layer | Supabase schema + migrations + RLS, types, content access layer, seed data, admin auth + shell | Schema review |
| 4 | Homepage (production) | Full narrative homepage on real data | Perf budget + review |
| 5 | Solutions | Reusable solution template + all solutions migrated from `content-source/` | Content accuracy review |
| 6 | Products (merged spec + commerce page) | Product template + all products + families + comparison, built to the confirmed names in 4.3 | Naming/spec review |
| 7 | Commerce on the merged product pages | Price + VAT labelling, recurring-fee display, categories, filters, cart, order creation, WhatsApp handoff, order lookup | End-to-end order test incl. VAT and recurring fee in the WhatsApp message |
| 8 | Industries | Industry template + cross-linking | Review |
| 9 | Blog & CMS | Full publishing workflow + editor + 8–10 seeded articles | **Non-technical user publishes a post unaided** |
| 10 | Resources | Downloads, FAQs, guides | Review |
| 11 | Trust & Support | Certifications, testimonials, coverage map, branches, certificate verification, suggestions, contact, quote, booking | Security test on verification |
| 12 | Admin Completion | Orders pipeline, inbox, media library, roles, audit log | Staff walkthrough |
| 13 | SEO / LLM Audit | Full crawl, schema validation, metadata, internal linking, `llms.txt`, Search Console | Crawl report clean |
| 14 | Performance & Accessibility | Budgets met, keyboard + screen reader pass, image optimisation, bundle analysis | All budgets green |
| 15 | QA & Launch | Cross-device QA, forms, emails, 301 map from old URLs, backups, monitoring, deploy | Human sign-off |

**Sprint 0 has no code. Sprint 1 has no content migration. Do not merge sprints.**

Old-URL 301 mapping (Sprint 15) is easy to forget and expensive to skip — inventory the current
site's indexed URLs during Sprint 0 so the map exists before launch.

---

## PART 21 — DEFINITION OF DONE AND SPRINT REPORTS

### 21.1 Definition of Done (every sprint)
- [ ] `tsc --noEmit`, lint, and build all pass
- [ ] Rendered and interacted with in a real browser; screenshots captured
- [ ] Zero console errors or warnings on affected routes
- [ ] Mobile (360 px), tablet, desktop, and ultrawide all verified
- [ ] Keyboard-only pass on new interactive elements
- [ ] Contrast checked on any new dark/glass surface
- [ ] Perf budgets (PART 14) measured, not assumed
- [ ] Metadata + schema present and validated on new pages
- [ ] `reduced-motion` verified on any new animation
- [ ] No new `[[NEEDS_VERIFICATION]]` left unlogged
- [ ] No secrets, no PII, no fabricated content
- [ ] Docs updated (`CLAUDE.md`, `ASSET_MAP.md`, relevant architecture doc)
- [ ] Committed on the sprint branch with clean, scoped commits

### 21.2 Sprint report format
```
SPRINT n — <name>

COMPLETED
DEVIATIONS FROM PLAN  (what changed and why)
NEW FILES / CHANGED FILES
DATABASE CHANGES  (migration names)
DEPENDENCIES ADDED  (with one-line justification each)
VERIFICATION  (what you actually ran; numbers; screenshots)
PERFORMANCE  (LCP / INP / CLS / JS KB / page KB)
ACCESSIBILITY  (what was tested, what failed, what was fixed)
NEEDS_VERIFICATION ADDED  (list)
KNOWN ISSUES / RISKS
DECISIONS NEEDED FROM THE HUMAN
RECOMMENDED NEXT STEP

STOPPING HERE FOR REVIEW.
```

---

## PART 22 — GIT WORKFLOW

`main` (production) ← `develop` (integration) ← `sprint/NN-name` (work).
Conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `perf:`, `chore:`).
Small, single-purpose commits — never a 60-file "sprint 4" commit. Never commit secrets, raw
media over ~2 MB (use Storage/Cloudinary), or generated output. Open a PR per sprint with the
sprint report as the description. Never force-push a shared branch. Never rewrite history on
`main`. Vercel preview URL for every branch, included in the sprint report.

---

## PART 23 — SPRINT 0: YOUR IMMEDIATE TASK

### 23.1 Clarifying questions gate (do this first)
**The blocking decisions are already made — see PART 1.5. Do not re-ask them.** Product naming,
branch addresses, company name, pricing and VAT, WhatsApp routing, the merged product/shop page, and
plate-based certificate verification are all settled.

Read PART 1.5, PART 7.0 and section 4.2 first. Then ask **only** questions that (a) are genuinely
still open, or (b) arise from something you find in the repository or `content-source/` that
contradicts this brief. Maximum 8. Mark each **BLOCKING** or **NON-BLOCKING**, propose your own
recommended answer so the human can simply confirm, and ask them in one message. Then wait.

Two things you should raise if the client has not already:
1. The certificate verification exposure described in PART 9.2, and which of Options A/B you are to
   build.
2. Anything in `content-source/` that conflicts with PART 1.5 — flag it, do not silently reconcile it.

Do not ask what you can determine by reading the repository.

### 23.2 Discovery
Audit and document: current stack, dependencies, routes, components, config, build and deploy
setup, existing environment variables, existing database (if any), current indexed URLs, current
metadata and schema state, crawlability of current content, the logo and brand assets, and every
file in `content-source/` and `media-source/`.

### 23.3 Deliverables (all in `docs/`, except `CLAUDE.md` at the root)
```
CLAUDE.md                     — the development constitution (see 23.4)
docs/DISCOVERY_REPORT.md      — what exists, what to keep, remove, rebuild; risks
docs/PROJECT_ARCHITECTURE.md  — app structure, rendering strategy, folder conventions
docs/DESIGN_SYSTEM.md         — tokens, type scale, spacing, primitives, contrast table
docs/CONTENT_ARCHITECTURE.md  — content model + full source-doc → page mapping table
docs/CONTENT_AUDIT.md         — conflicts, unverifiable claims, recommended resolutions
docs/ROUTE_MAP.md             — every route, template, data source, metadata, schema type
docs/SEO_LLM_STRATEGY.md      — intents, schema plan, internal linking, llms.txt plan, 301 map
docs/CMS_ARCHITECTURE.md      — admin IA, roles, editor workflows
docs/SHOP_ARCHITECTURE.md     — catalogue, cart, WhatsApp checkout, order lifecycle
docs/DATABASE_ARCHITECTURE.md — tables, relations, RLS policies, migration plan
docs/ANIMATION_SYSTEM.md      — levels, durations, easings, reduced-motion behaviour
docs/ASSET_MAP.md             — assets present, assets missing, the shot list
docs/SECURITY_REQUIREMENTS.md — threat notes, RLS, rate limits, headers, DPA 2019 posture
docs/PERFORMANCE_BUDGETS.md   — budgets + how each is measured
docs/ACCESSIBILITY_PLAN.md    — standards, test method, known risks
docs/SPRINT_PLAN.md           — the plan with per-sprint acceptance criteria
docs/NEEDS_VERIFICATION.md    — the open register
docs/decisions/ADR-0001-*.md  — one ADR per significant architectural decision
```

These must be grounded in what you actually found. Generic boilerplate is a failed Sprint 0.
Where information is missing, say so explicitly rather than filling the gap with plausible text.

### 23.4 `CLAUDE.md` requirements
Short enough to be read every session, complete enough to govern one. It must contain: project
purpose and positioning · stack and versions · the pointer to `docs/brief/00-MASTER-BRIEF.md`
and the rule that it is authoritative · the non-negotiable rules from PART 2 · design tokens and
prohibited patterns · content and anti-fabrication rules · SEO/schema checklist per page type ·
performance budgets · accessibility bar · security rules · commands (dev, build, lint, typecheck,
test, migrate) · file organisation and naming · Definition of Done · sprint methodology and the
stop rule · where the source-of-truth company data lives.

### 23.5 STOP
After the questions and the deliverables:
**Do not write application code. Do not install dependencies. Do not create the database. Do not
modify existing pages. Do not begin Sprint 1.** Present the deliverables and wait for approval.

---

## PART 24 — SUCCESS CRITERIA

Design and experience: a visual identity that reads as bespoke, one memorable signature element,
a homepage that argues rather than lists, real photography and real platform screenshots
throughout, motion that feels engineered.

Information: every solution and product on its own shareable URL with genuine depth; a customer
question answerable from the site; no orphan pages; no fabricated fact anywhere.

Commerce: a working shop with WhatsApp checkout where every attempt is captured as an order,
managed end-to-end by staff.

Operations: a non-technical staff member publishes a blog post, adds a product, changes a price,
uploads a brochure, imports certificates, and reads the enquiry inbox — unaided.

Discoverability: server-rendered, valid schema, consistent entity data, `llms.txt`, definitional
content, and clean crawl for the target intents.

Engineering: budgets met on a mid-range Android over mobile data; WCAG 2.2 AA; RLS everywhere;
no secrets in the repo; a codebase another developer can extend without a rebuild.

And the human test, the only one that finally matters:

> A fleet manager in Mombasa opens the site on their phone on mobile data, understands within ten
> seconds that Nebsam is the most technologically advanced vehicle tracking company in Kenya,
> finds the answer to their actual question, and starts a WhatsApp conversation.

---

## PART 25 — WHAT WOULD MAKE THIS PROJECT FAIL

Read this list at the start of every sprint.

1. Building before understanding — code in Sprint 0.
2. Inventing facts, statistics, specifications, or testimonials.
3. A beautiful site that is 8 MB and unusable on Kenyan mobile data.
4. Generic AI-template aesthetics: uniform rounded cards, purple gradients, glass everywhere.
5. Animation everywhere, meaning nowhere.
6. An admin that a non-technical person quietly abandons, killing the blog.
7. Content that is a copy-paste of the source documents with the caps lock still on.
8. URLs minted before product naming is settled.
9. A shop where a dropped WhatsApp chat means a lost order because nothing was persisted.
10. A certificate endpoint that leaks customer data or can be enumerated.
11. Client-only rendering that makes the content invisible to crawlers — repeating the current
    site's central failure.
12. Rolling sprints together and delivering 15,000 unreviewed lines.

---

**END OF BRIEF — begin with PART 23.**
