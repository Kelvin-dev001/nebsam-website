# CLIENT PERMISSIONS TRACKER

Source: the named client list in `FUEL_MONITORING_SOLUTION_PROPOSAL.pdf` (2023), plus the six logo
files the old site carried, now in `source-assets/legacy-public/clients/` (moved out of `public/` in
Sprint 14, so they are no longer downloadable).

**63 named companies** from the proposal, plus 4 logos in the repo that do not appear on that
list. Together these substantiate the claim "70+ corporate clients" (brief PART 1.5).

## Rules
- The **aggregate** claim ("70+ corporate clients") may be published — it is substantiated by this list.
- Naming or logo-ing an **individual** client requires that client's written permission.
- Import into the CMS `client_logos` table with `permission_confirmed` defaulting to false.
- Display only rows where `may name publicly` is confirmed.
- The list is from 2023. Some relationships may have ended. Verify before approaching anyone.

## How a logo goes live (built in Sprint 16)

The homepage proof band shows a logo row as soon as one client is confirmed, and nothing before
(`components/home/proof-band.tsx`, reading `public_client_logos`). To add one:
1. **Written permission**, recorded in the table below: date, and who gave it. Nothing else counts.
2. **The file:** SVG preferred, or PNG at least 600px wide on a transparent ground, under about
   50 KB. Save it as `public/clients/<company-slug>.svg` (or `.png`), lowercase with hyphens. A file
   from `source-assets/legacy-public/clients/` may be reused only for a client who has said yes.
3. **The row:** a migration (`npm run db:apply -- <file>`) that inserts or updates `client_logos`
   with `name`, `sector`, `logo_path = '/clients/<company-slug>.svg'`, `sort_order` and
   `permission_confirmed = true`. The page shows only paths under `/clients/`.
4. **Deploy.** The row appears on the next build, or within the hour as the homepage revalidates.

To take a logo down: a migration setting `permission_confirmed = false`. It disappears at the next
revalidation, and the file can then be deleted.

## Priority
The four repo logos flagged below and the two matched ones are the six to chase first — they are the
only clients whose logo files you already hold, so they are the fastest route to a credible proof band.

| Company | Sector | Logo file | Permission requested | Permission confirmed | May name publicly | Notes |
|---|---|---|---|---|---|---|
| ABBYSINIA ENERGY LTD | Energy | — | | | | |
| ACCELERATOR INVESTMENT LIMITED | Investment | — | | | | |
| ACE STANDARD | Unknown | — | | | | |
| AL BURAQ | Unknown | — | | | | |
| ALBEITY LOGISTICS | Logistics | — | | | | |
| ANIMAL LOGISTICS | Logistics | — | | | | |
| ATHS LIMITED | Unknown | — | | | | |
| AWADA ENTERPRISES | Trade | — | | | | |
| BADAR HARDWARE | Hardware | — | | | | |
| BAHAN TRANSPORTERS | Transport | — | | | | |
| BROADWAY LOGISTICS | Logistics | — | | | | |
| BRONSTER ENTERPRISES | Trade | — | | | | |
| CHANIA FEEDS MANUFACTURERS LTD | Manufacturing | — | | | | |
| COAST CALCIUM LIMITED | Manufacturing | — | | | | |
| DESPEK INVESTMENTS | Investment | — | | | | |
| DIAMOND ENGINEERING | Engineering | — | | | | |
| DOLPHINE FREIGHTERS LTD | Freight | — | | | | |
| EQUISTAR | Unknown | — | | | | |
| FLEETEX HAULIERS LTD | Haulage | — | | | | |
| GAKUYAZ LIMITED | Unknown | — | | | | |
| GENERAL SERVICES | Services | — | | | | |
| GOLDEN BOY | Unknown | — | | | | |
| GRANTOH LOGISTICS | Logistics | — | | | | |
| GREYHOOD INTERNATIONAL | Unknown | — | | | | |
| GROUP AGE VENTURES | Trade | — | | | | |
| HAMUKI TRANSPORTERS | Transport | — | | | | |
| HATIMY ENTERPRISES LTD | Trade | — | | | | |
| HERITAGE INVESTMENT LIMITED | Investment | — | | | | |
| ISAWAKA INVESTMENT LTD | Investment | — | | | | |
| JAYID ENTERPRISES | Trade | — | | | | |
| JEFFERS AUTO SPARES | Auto spares | — | | | | |
| JENGA IDEAS LTD | Unknown | — | | | | |
| JUBILEE CLEARING AND FORWARDING | Clearing & forwarding | — | | | | |
| K511 LOGISTICS | Logistics | — | | | | |
| KANINI HARAKA | Transport | — | | | | |
| KIBURU ENTERPRISES | Trade | — | | | | |
| KIMSA LOGISTICS | Logistics | — | | | | |
| KPAKA SUNUTUKE | Unknown | — | | | | |
| KUJIM LOGISTICS | Logistics | — | | | | |
| LESI COMPANY LTD | Unknown | — | | | | |
| MAGOCHI AUTO WORKS | Automotive | — | | | | |
| MASH TRANSPORTERS | Transport | — | | | | |
| MATRIZ MOVES K LTD | Transport | — | | | | |
| MBACHA LOGISTICS | Logistics | — | | | | |
| METLINK LOGISTICS | Logistics | — | | | | |
| MUTHOKINJU PAINTS | Manufacturing/retail | muthukinjo.jpeg | | | | |
| NGONG VEGETABLES | Agriculture | ngongveg.png | | | | |
| OPEN TOP HAULIERS | Haulage | — | | | | |
| PEPSON LOGISTICS | Logistics | — | | | | |
| RIOMA FREIGHTERS LTD | Freight | — | | | | |
| ROSAM KENYA LIMITED | Unknown | — | | | | |
| SABROL EA LTD | Unknown | — | | | | |
| SAMROCK AUTO SPARES | Auto spares | — | | | | |
| SANALSA LIMITED | Unknown | — | | | | |
| SIHA TRANSPORTERS LTD | Transport | — | | | | |
| SUMMER LINER | Transport | — | | | | |
| SUPER SPEED LOGISTICS | Logistics | — | | | | |
| TECHNIQS LOGISTICS | Logistics | — | | | | |
| TECHNOCRATS LOGISTICS | Logistics | — | | | | |
| TEDROSE | Unknown | — | | | | |
| WATERFALL LOGISTICS | Logistics | — | | | | |
| YELLOWLINE LOGISTICS | Logistics | — | | | | |
| ZASK LOGISTICS | Logistics | — | | | | |
| ARMYTEX | Unknown | armytex.png | | | | **Logo in repo but NOT on the fuel-proposal client list — confirm relationship** |
| BUSCAR | Transport | buscar.jpg | | | | **Logo in repo but NOT on the fuel-proposal client list — confirm relationship** |
| ISMAX SECURITY | Security | ismax-security.png | | | | **Logo in repo but NOT on the fuel-proposal client list — confirm relationship** |
| KENSALT | Manufacturing | kensalt.jpeg | | | | **Logo in repo but NOT on the fuel-proposal client list — confirm relationship** |
