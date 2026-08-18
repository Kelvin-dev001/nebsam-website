# content-source — AUTHORITATIVE AND READ-ONLY

**This folder is the source of truth for all Nebsam content. Do not edit anything in it.**

Content is *rewritten into* the application (`app/`, `content/`, or the CMS) — never edited here.
If a source document is wrong, the correction is recorded in `docs/CONTENT_AUDIT.md` and the fix is
made in the app layer, not by silently altering the source.

`.claude/settings.json` denies write access to this path for exactly this reason.

## Rules
1. Never edit. Never delete. Never reorganise without updating this manifest.
2. Folder names are canonical and become URL slugs. Renaming one later costs a 301.
3. Hedging language in these documents ("according to the configured security logic", "subject to
   network availability", "where supported by the vehicle") is deliberate accuracy. Preserve it
   verbatim in every rewrite.
4. Claims listed as unpublishable in brief PART 1.5 must not reach the app, even though they appear
   in these files.

## Manifest

### Solutions — `01-solutions/`
| Folder | Canonical name | Status | Notes |
|---|---|---|---|
| `fuel-monitoring` | Fuel Monitoring | Needs enrichment | Enrich from the 2023 fuel proposal PDF (hardware: fuel level sensor + DFM flow meter, IoT gateway). Do NOT carry over the "90% reduction" vendor claim. |
| `ai-video-telematics` | AI Vehicle Video Telematics | Needs enrichment | 3-camera Streamax ADAS/DMS system. Enrich from the 2025 video telematics proposal. **Distinct product from Hybrid Dashcam.** Do NOT carry over the NTSA transmission claim. |
| `speed-governors` | Speed Governor | Final | Also a product. IRMS to be mentioned — wording pending verification. |
| `container-e-seal` | Container E-Seal | Final | Also a product. |
| `radio-communication` | Radio Communication | Final | Solution overview; per-model specs live in `02-products/radios/`. Hedge "unlimited range" as network-dependent. |
| `vehicle-key-programming` | Vehicle Key Programming | Final | Service, delivered in branch. |
| `school-bus-management` | School Bus Solution | Final (extracted) | Extracted from the school bus proposal PDF. Carries a SOURCE NOTES block with 8 open questions — **delete that block before publication**. Highest legal sensitivity on the site. |

### Products — `02-products/`
| Folder | Canonical name | Status | Notes |
|---|---|---|---|
| `trackers/standard-tracker` | Standard Tracker | Final | **CONFIRMED name.** The brochure calls this "Basic Tracker" — retired. Local + international variants. |
| `trackers/bluetooth-tracker` | Bluetooth Tracker | Final | Anti-jamming + Smart Bluetooth ignition. |
| `trackers/anti-jammer-tracker` | Anti-Jammer Tracker | Final | Optional microphone integration. |
| `trackers/hybrid-tracker` | Hybrid Tracker | Final | 4 security layers. |
| `trackers/hybrid-pro-tracker` | Hybrid Pro Tracker | Final | 5 security layers. |
| `trackers/hybrid-pro-max-tracker` | Hybrid Pro Max Tracker | Final | 6 security layers, KIPI registered. Contains unpublishable superlatives — see PART 1.5. |
| `trackers/recovery-tracker` | Recovery Tracker | Final | Magnetic, portable, IP65, up to 3 years battery at one fix/day. |
| `car-alarms/hybrid-car-alarm` | Hybrid Car Alarm | Final | **CONFIRMED name** — not "Hybrid Alarm". |
| `car-alarms/hybrid-plus-car-alarm` | Hybrid Plus Car Alarm | Final | Alarm + GPS. |
| `car-alarms/hybrid-pro-plus-car-alarm` | Hybrid Pro Plus Car Alarm | Final | Alarm + anti-jammer GPS. |
| `car-alarms/hybrid-promax-car-alarm` | Hybrid ProMax Car Alarm | Final | **Vibrating key remote.** |
| `car-alarms/hybrid-promax-plus-car-alarm` | Hybrid ProMax Plus Car Alarm | Final, **H1 corrected** | **Vibrating key remote + Anti-Jammer GPS.** The source document's heading read "ProMax"; its body describes the Plus. Correction is recorded as an HTML comment at the top of the file. |
| `video/hybrid-dashcam` | Hybrid Dashcam | **STUB — needs extraction** | 4G dual-lens unit. Content exists only in the product brochure PDF. **Distinct product from AI Vehicle Video Telematics.** |
| `radios/` | 11 radio models | **EMPTY — needs extraction** | Per-model spec pages from the radio proposals: inrico-t-521, inrico-s-100, inrico-s-200, inrico-t-290, inrico-tm-7, inrico-dr10-gateway, baofeng-bf-888s, baofeng-uv-5r, baofeng-uv-9r-plus, baofeng-uv-82, kenwood-tk-3000. |
| `systems/fuel-monitoring-system` | Fuel Monitoring System | **STUB — needs extraction** | Hardware page for the sensor + flow meter, distinct from the fuel monitoring solution page. |

### Other
| Folder | Status |
|---|---|
| `03-company` | **EMPTY** — needs about, branches, coverage, team |
| `04-testimonials` | **EMPTY** — needs the 6 real testimonials + the ~70-name client list from the fuel proposal |
| `05-certifications` | **EMPTY** — 6 scans exist in the repo's `public/certificates/`; KEBS permit + lab report details to be recorded here |
| `06-downloads` | **EMPTY** — cleaned, compressed, metadata-stripped PDFs go here |
| `07-legacy-site` | URL inventory captured — cross-check Search Console for extras |
| `08-pricing` | Radio prices confirmed; everything else pending |
