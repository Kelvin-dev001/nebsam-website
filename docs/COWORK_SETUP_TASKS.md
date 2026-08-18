# NEBSAM — COWORK SETUP TASKS

Run these **in order**, one task per message. Check the output of each before starting the next.
Total: roughly 2–4 hours of Cowork time, most of it unattended.

Do not paste all seven at once. Each task builds on the previous one, and reviewing as you go is how
you catch a wrong decision before it propagates into 25 files.

---

## BEFORE YOU OPEN COWORK

**1. Clone the repo locally.**
```bash
git clone https://github.com/Kelvin-dev001/nebsam-website.git
cd nebsam-website
git checkout -b chore/00-project-scaffold
```
Work on a branch. Cowork will be creating and moving a lot of files; you want to be able to throw it
away if something goes sideways.

**2. Put the inputs where Cowork can see them.** Create `nebsam-website/_inbox/` and drop in:
- all 20 service/product `.txt` write-ups
- all 5 proposal PDFs
- `nebsam_transparent_logo.png`
- `NEBSAM_MASTER_PROMPT.md`
- `school-bus-solution-write-up.md`

**3. Point Cowork at the `nebsam-website` folder** when you start.

---

## TASK 1 — SCAFFOLD AND CONFIG

```
Read _inbox/NEBSAM_MASTER_PROMPT.md in full — it is the project brief and the source of truth
for every naming and structural decision. Pay particular attention to PART 1.5 (confirmed
decisions), PART 4.3 (taxonomy) and PART 7.0 (the current repository state).

Then read NEBSAM_CLAUDE_CODE_SETUP.md section 2 and build exactly that folder structure in this
repository. Specifically:

1. Create the full directory tree: .claude/{skills,commands}, docs/{brief,decisions},
   content-source/ with its numbered subfolders, brand/{logo,fonts}, media-source/ with its
   subfolders, and _inbox/.

2. Move NEBSAM_MASTER_PROMPT.md to docs/brief/00-MASTER-BRIEF.md (move, don't copy).

3. Write content-source/README.md stating that this folder is authoritative and read-only, that
   files in it must never be edited by an agent, and that content is rewritten INTO the app rather
   than edited here. Include a one-line-per-file manifest table (leave rows to be filled by Task 2).

4. Append the media-source/, _inbox/, .env*.local, .claude/settings.local.json entries to the
   existing .gitignore. Do not remove anything already in it.

5. Create .env.example with every variable the brief's stack implies (Supabase URL, anon key,
   service role key, site URL, WhatsApp number, GA4 measurement ID, email provider key, Turnstile
   keys, the HMAC secret for plate hashing). Comment each one. No real values.

6. Create .claude/settings.json exactly as specified in setup guide section 4, including the deny
   rules for writing to content-source/ and reading .env*.

7. Move the logo to brand/logo/ and create brand/README.md noting which file is the master asset.

Then show me the resulting tree and stop. Do not create any application code, do not touch src/,
and do not install anything.
```

**Check before moving on:** the tree matches, `.gitignore` still has its original entries, and
`docs/brief/00-MASTER-BRIEF.md` exists.

---

## TASK 2 — FILE AND RENAME EVERY SOURCE DOCUMENT

This is the task that most repays doing properly. The confirmed product names from PART 1.5 get
applied here, and the folder names become the URL slugs later.

```
Read docs/brief/00-MASTER-BRIEF.md PART 1.5 and PART 4.3 again before you start.

File every document currently in _inbox/ into content-source/, applying the CONFIRMED product
names. For each document: create its folder, convert the file to write-up.md, and move it (don't
copy). Use kebab-case throughout — no spaces, no capitals, no ampersands, no parentheses.

Apply these confirmed names, which differ from some of the file names and headings:

- "STANDARD TRACKER" → content-source/02-products/trackers/standard-tracker/
  (the brochure calls this "Basic Tracker" — Standard Tracker is canonical)
- HYBRID_PROMAX_CAR_ALARM.txt → car-alarms/hybrid-promax-car-alarm/
  (this is the vibrating-key-remote alarm)
- HYBRID_PROMAX__PLUS_CAR_ALARM.txt → car-alarms/hybrid-promax-plus-car-alarm/
  IMPORTANT: this file's own H1 reads "HYBRID PROMAX CAR ALARM" but its body describes vibrating
  remote PLUS anti-jammer GPS. The heading is wrong. It is the ProMax Plus. Correct the H1 in the
  new write-up.md and note the correction in the manifest.
- HYBRID_PRO_PLUS.txt → car-alarms/hybrid-pro-plus-car-alarm/
- "Hybrid Car Alarm" stays as-is (not "Hybrid Alarm")
- AI_VEHICLE_VIDEO_TELEMATICs.txt → 01-solutions/ai-video-telematics/
- Keep the Hybrid Dashcam separate from AI Video Telematics — they are two different products
  (PART 1.5 #2). Create 02-products/video/hybrid-dashcam/ as a stub with a TODO, since its content
  currently only exists inside the brochure PDF (Task 3 will fill it).
- school-bus-solution-write-up.md → 01-solutions/school-bus-management/write-up.md
- Solutions vs products: follow the PART 4.3 tables. Speed governor, fuel monitoring, container
  e-seal, radio communication, vehicle key programming go under 01-solutions/. Trackers and alarms
  go under 02-products/.

While converting, do NOT rewrite the content — this is source material. Only:
- fix the ProMax Plus heading as noted above
- fix obvious typos (monitopr → monitor, rfecognition → recognition, preffered → preferred)
- leave all hedging language ("according to the configured security logic", "subject to network
  availability", "where supported by the vehicle") completely untouched

Finally, fill in the content-source/README.md manifest: one row per file with its canonical product
or solution name, source filename, and whether it is final or needs work.

Show me the resulting content-source tree and the manifest, then stop.
```

**Check before moving on:** every folder name is a name you'd be happy to see in a URL, and the
ProMax/ProMax Plus split is right.

---

## TASK 3 — EXTRACT THE REMAINING PDF CONTENT

```
Four proposal PDFs in content-source (or _inbox) contain content that has no write-up yet. Extract
each into a write-up.md in the same house style as the existing service write-ups — look at
content-source/01-solutions/school-bus-management/write-up.md as the model, including its
"SOURCE NOTES — NOT FOR PUBLICATION" block at the end.

1. hybrid_tracker__hybrid_alarm__hybrid_dashcam__basic_tracker__recovery_tracker.pdf
   → extract the HYBRID DASHCAM content into 02-products/video/hybrid-dashcam/write-up.md
   (4G dual-lens unit: live GPS, vibration detection, driving record, remote video, cloud storage,
   low power consumption, dual lens, parking monitoring mode, radar/touch/motion detection).
   Cross-check the tracker and alarm feature lists in this brochure against the existing write-ups
   and log any discrepancies — do not silently merge them.

2. Video_Telematics_Proposal_2025.pdf
   → enrich 01-solutions/ai-video-telematics/write-up.md with the hardware detail it currently
   lacks: 3-camera simultaneous recording, interior/front/rear 720p lenses, 110° and 130° viewing
   angles, Android 8.1, 2GB+32GB, SD up to 256GB, 4G, WiFi, two-way talk, the ADAS list (FCW, LDW,
   HMW, pedestrian, stop sign, speed limit plate), the DMS list (phone call, seat belt, fatigue,
   smoking, distraction, yawning, no driver, lens covered), and the DBA list (harsh acceleration,
   hard braking, collision, sharp cornering).
   Also record the KEBS permit and laboratory test report details in
   content-source/05-certifications/README.md.
   CRITICAL: do NOT carry over the claim that traffic sign recognition transmits data to NTSA
   servers. It is unverified — see PART 1.5. Note it in the source notes as an open question.

3. FUEL_MONITORING_SOLUTION_PROPOSAL.pdf
   → enrich 01-solutions/fuel-monitoring/write-up.md with the hardware detail (fuel level sensor,
   DFM fuel flow meter, IoT gateway) and the report/alert lists.
   Extract the ~70 named client companies into content-source/04-testimonials/client-list.md as a
   table with columns: company, sector, logo available (y/n), permission confirmed (blank).
   Do NOT carry over the "90% reduction in fuel theft" claim — it is a vendor claim, unverified.

4. nebsam_radio_call_proposal.pdf (both the long-range and short-range sections)
   → create a per-model product folder under 02-products/radios/ for each of:
   inrico-t-521, inrico-s-100, inrico-s-200, inrico-t-290, inrico-tm-7, inrico-dr10-gateway,
   baofeng-bf-888s, baofeng-uv-5r, baofeng-uv-9r-plus, baofeng-uv-82, kenwood-tk-3000.
   Each write-up.md carries that model's documented specifications verbatim-accurate (frequency
   range, channels, battery capacity, IP rating, Android version, screen, camera, talk/standby
   time). These specs are the whole reason these pages will rank — get them exactly right.
   Record the confirmed prices (T-521 KES 22,000; S-100, S-200, TM-7 KES 30,000 — all excl. VAT)
   and the KES 3,000/year CAK annual licence renewal in each relevant file.
   Do NOT carry over "unlimited distances without interference" — hedge it as network-dependent.

Show me a summary of what you created and any discrepancies you found, then stop.
```

---

## TASK 4 — THE THREE TRACKERS

```
Create three tracking documents in docs/. Use a markdown table in each, or a .xlsx if you prefer —
whichever the client will actually maintain.

1. docs/CONTENT_INVENTORY.md — one row per source document in content-source/:
   source file | canonical name | type (solution/product/company/trust/download) |
   proposed URL | target search intent | content status | assets available | gaps

2. docs/NEEDS_VERIFICATION.md — the open register. Seed it with every [[NEEDS_VERIFICATION]] token
   in docs/brief/00-MASTER-BRIEF.md and every open item in the school bus write-up's source notes.
   Columns: id | question | why it matters | who answers | blocking which sprint | status.
   There should be roughly 20 rows.

3. docs/CLIENT_PERMISSIONS.md — the ~70 companies from the fuel proposal plus the six client logos
   already in public/clients/ (armytex, buscar, ismax-security, kensalt, muthukinjo, ngongveg).
   Columns: company | sector | logo file (if any) | permission requested | permission confirmed |
   may name publicly | notes.
   Flag the six that already have logo files in the repo — those are the ones to chase first.

Then stop.
```

---

## TASK 5 — ASSET AUDIT AND PRIVACY SWEEP

This one needs your judgement at the end. Cowork produces the shortlist; you decide.

```
Audit every image asset in this repository and in media-source/, and produce docs/ASSET_MAP.md.

1. Inventory public/ — it is about 28 MB. For each file: path, dimensions, file size, format, and
   what it appears to show. Flag:
   - duplicates (africa-map.svg / africa-mappp.svg, logo192.jpg / logo192.png)
   - "tracking-hero-bg (2).jpg" — the space and parenthesis will break shell operations; propose a
     rename
   - anything over 500 KB, which is most of them, with a proposed compressed target

2. PRIVACY SWEEP — inspect every screenshot and photograph for exposed data and list every hit:
   vehicle number plates, faces, personal names, phone numbers, GPS coordinates, device IDs, fleet
   or company names inside platform UIs.
   Look especially hard at anything derived from Video_Telematics_Proposal_2025.pdf — its sample
   footage pages contain real customer plates (KCK 283C, KCK 289C), a fleet group name, device IDs,
   coordinates, and two identifiable faces in a vehicle cab.
   Also check the six certificate scans in public/certificates/ for the phone number
   +254 727 727 461 and the email nebsam3kenya@gmail.com — both are confirmed NOT for publication.
   For each hit: file, what is exposed, and a recommendation (blur / crop / replace / exclude).
   Do not alter any image yet. This is a shortlist for me to decide on.

3. Identify platform screenshots that carry third-party product branding rather than Nebsam
   branding — the fuel proposal's dashboards are the known case. Flag them as not usable as
   "the Nebsam platform".

4. Produce a SHOT LIST of images the brief needs that do not exist yet, organised by page, with the
   required dimensions and orientation. Cross-reference what is already in public/ first — there is
   real product, certificate and premises photography in there and a chunk of the list may already
   be satisfied.

Then stop.
```

**Then you decide** on every privacy hit before any of those images go near the new site. Cowork's
sweep is a shortlist, not a clearance.

---

## TASK 6 — PDF CLEANUP FOR THE DOWNLOAD CENTRE

```
Prepare the five proposal PDFs for eventual publication in the download centre. For each:

1. Strip all document metadata. Nebsam_School_Bus_Solution.pdf currently carries an unrelated
   internal title and an unrelated author name from its original template.
2. Compress. The school bus file is roughly 40 MB, which is unusable as a download on Kenyan mobile
   data. Target under 5 MB each without making text or diagrams illegible; report the before and
   after sizes.
3. Save the cleaned versions to content-source/06-downloads/ with descriptive kebab-case filenames
   and leave the originals untouched.
4. Create content-source/06-downloads/README.md listing each file with title, description, file
   size, document date, and a "cleared for publication" column left blank.

Do not publish or link anything. Flag any PDF whose pages contain the privacy exposures found in
Task 5 as NOT cleared.
```

---

## TASK 7 — DRAFT TWO PROJECT SKILLS

`nebsam-brand` waits for Sprint 1, when the real tokens exist. These two can be written now.

```
Create two skills in .claude/skills/, each as a folder containing SKILL.md with YAML frontmatter
(name and description fields) followed by markdown instructions.

1. .claude/skills/nebsam-content/SKILL.md
   description: "Convert a Nebsam source document into website content. Use when migrating anything
   from content-source/, or when writing or editing any solution, product or industry page."
   Contents: the 11-part solution page content model from PART 5.2 of the brief; the writing
   standards from PART 5.3; the rule that hedging language is preserved verbatim; the
   anti-fabrication rules and the list of claims that must not be published; the
   [[NEEDS_VERIFICATION]] convention; the confirmed product names from PART 1.5.
   Then include ONE worked before/after example: take a section of a real source write-up and show
   the rewritten web version beside it. The worked example is the part that makes the skill work —
   show it once, get it right fifteen times.

2. .claude/skills/nebsam-seo/SKILL.md
   description: "SEO and LLM-discoverability checklist for every Nebsam page. Use when creating or
   editing any route."
   Contents: metadata rules with character limits; which schema type each template gets; the
   internal linking requirement; the answer-shaped-content rule; the canonical company description
   used verbatim everywhere; the llms.txt update rule; the target search intents from PART 13.4.

Keep each under 200 lines — these load into context on every relevant turn, so they must be tight.
Then stop.
```

---

## BEFORE YOU START CLAUDE CODE

Verify by hand, in about ten minutes:

- [ ] `docs/brief/00-MASTER-BRIEF.md` exists and is the v1.2 file
- [ ] Every `content-source/` folder name is one you'd accept as a URL slug
- [ ] `hybrid-promax-car-alarm` and `hybrid-promax-plus-car-alarm` describe the right products
- [ ] No folder is named "basic-tracker" or "hybrid-alarm"
- [ ] `hybrid-dashcam` and `ai-video-telematics` both exist, separately
- [ ] `content-source/README.md` manifest is complete
- [ ] `.env.example` has no real values; `.gitignore` covers `media-source/` and `_inbox/`
- [ ] `docs/NEEDS_VERIFICATION.md` has ~20 rows
- [ ] No published-facing file contains `+254 727 727 461`, "Equity Ngara", "Utawala", or
      "Kenyatta Ave" — grep for all four
- [ ] You have decided the certificate verification second factor (PART 9.2)

Then commit the branch, open a PR, merge it, and start Claude Code on `main` with the kickoff block
from PART 0 of the brief.

**One habit worth keeping through all of this:** ask Cowork to show you the plan before it writes
files on the bigger tasks (2, 3 and 5). One extra message, and it catches a misfiled product before
it becomes twenty misfiled files.
