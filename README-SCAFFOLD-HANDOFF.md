# SCAFFOLD HANDOFF — how to merge this into the repo

This folder contains the completed setup-phase scaffold. Copy it into your local clone of
`nebsam-website`, on a branch.

```bash
cd /path/to/nebsam-website
git checkout -b chore/00-project-scaffold

# copy everything except the gitignore helper
rsync -av --exclude='.gitignore.ADD-THESE-LINES' /path/to/scaffold/ ./

# append the gitignore lines to your existing .gitignore (do not replace it)
cat /path/to/scaffold/.gitignore.ADD-THESE-LINES >> .gitignore

git add -A && git commit -m "chore: project scaffold, content-source, brief and setup docs"
```

## What is done
- Full folder structure
- All 18 text write-ups filed under confirmed product names, typos fixed, hedging language untouched
- School Bus Solution write-up filed
- ProMax / ProMax Plus heading corrected, correction recorded in the file and the manifest
- `content-source/README.md` — complete manifest
- `docs/brief/00-MASTER-BRIEF.md` — the v1.2 brief
- `docs/NEEDS_VERIFICATION.md` — 26 tracked items
- `docs/CLIENT_PERMISSIONS.md` — 67 companies
- `docs/ASSET_MAP.md` — 120-file inventory, privacy sweep, shot list
- `content-source/07-legacy-site/indexed-urls.txt` — 301 map source
- `.env.example`, `.claude/settings.json`, gitignore additions
- Logo in `brand/logo/`
- Original PDFs in `_inbox/original-pdfs/` (gitignored — keep them locally)

## What is NOT done — remaining Cowork tasks
- **Task 3:** extract Hybrid Dashcam, enrich AI video telematics and fuel monitoring, create the
  11 radio model pages. Stub folders exist at `02-products/video/hybrid-dashcam/` and
  `02-products/systems/fuel-monitoring-system/`; `02-products/radios/` is empty.
- **Task 4 (partial):** `docs/CONTENT_INVENTORY.md` — the manifest in `content-source/README.md`
  covers most of it; add proposed URLs and target search intents per row.
- **Task 5 (your part):** decide on every privacy exposure in `docs/ASSET_MAP.md`. Inspect the six
  certificate scans, especially `installation.jpg`.
- **Task 6:** strip metadata from and compress the five PDFs into `content-source/06-downloads/`.
- **Task 7:** draft `.claude/skills/nebsam-content/` and `.claude/skills/nebsam-seo/`.
- **Empty folders needing client material:** `03-company`, `04-testimonials`, `05-certifications`,
  `06-downloads`, `08-pricing`.
