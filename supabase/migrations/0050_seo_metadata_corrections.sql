-- ============================================================================
-- 0050 — SEO title and description corrections found by the Sprint 13 crawl.
--
-- RENUMBERED FROM 0044. Written in Sprint 13 (11 Sep 2026) on
-- sprint/13-seo-llm-audit, which was never merged; develop has since used 0044
-- for another migration. Restarted in Sprint 13r (5 Oct 2026), register V96.
--
-- ── This records values that are ALREADY in the database ───────────────────
--
-- On 11 Sep the values were written by data update through the service role,
-- because V61 left `npm run db:apply` unusable, and nothing was recorded in
-- the ledger. Checked on 5 Oct 2026 against the published views: all 38 values
-- below match the live database exactly. So on this database applying this
-- file changes nothing; what it does is make a database built from the
-- migrations match this one. Without it, the history and the data disagree,
-- which is the trap V80 closed for 0001-0040.
--
-- Dropped from the original: the two updates for the Inrico S-100, retired in
-- 0048. They would now match no row.
--
-- ── The trap that made the titles look fine ─────────────────────────────────
--
-- `buildMetadata` appends " | Nebsam" — nine characters — unless a title
-- already ends in it, so the RENDERED title is what truncates and the real
-- ceiling on a stored value is 51. The crawl measures the rendered page, which
-- is the only length Google sees.
--
-- ── What is and is not changed ──────────────────────────────────────────────
--
-- Every value is a trim or a rephrase of wording already approved and stored.
-- No new fact is introduced and no hedge is dropped:
--
--   * vehicle-tracking keeps "where configured" on remote immobilisation
--   * inrico-tm-7 keeps both senses — "Mobile & Base Station" rather than
--     dropping the desk-mounted half to save characters
--   * the confirmed radio prices stay, with "excl. VAT"
--   * product names stay exactly as confirmed (Hybrid ProMax Plus Car Alarm)
--   * container-e-seal keeps "Electronic Cargo Tracking System (ECTS)" in its
--     title, which it must: it receives the ECTS 301 (V34a)
-- ============================================================================

update products
   set seo_title = 'Hybrid Pro Max Tracker | Six-Layer Car Security'
 where slug = 'hybrid-pro-max-tracker';

update products
   set seo_title = 'Hybrid Pro Plus Car Alarm | Anti-Jammer GPS'
 where slug = 'hybrid-pro-plus-car-alarm';

update products
   set seo_title = 'Hybrid ProMax Plus Car Alarm | Anti-Jammer GPS'
 where slug = 'hybrid-promax-plus-car-alarm';

update products
   set seo_title = 'Inrico S-200 PoC Radio | Android Push-to-Talk'
 where slug = 'inrico-s-200';

update products
   set seo_title = 'Inrico TM-7 PoC Mobile & Base Station, Dual SIM'
 where slug = 'inrico-tm-7';

update industries
   set seo_title = 'Construction Plant & Equipment Tracking Kenya'
 where slug = 'construction-and-heavy-equipment';

update industries
   set seo_title = 'Farm Vehicle & Equipment Tracking in Kenya'
 where slug = 'agriculture';

update solutions
   set seo_description = 'Live GPS tracking, route playback, trip reports and geofence alerts for fleets in Kenya. Remote immobilisation where configured, plus anti-jamming.'
 where slug = 'vehicle-tracking';

update solutions
   set seo_description = 'Fuel sensors and GPS that record every fuel event with time, location, vehicle and quantity. Detect draining and verify refuelling across Kenya.'
 where slug = 'fuel-monitoring';

update solutions
   set seo_description = 'Speed governors for PSVs, matatus, school buses and trucks. Limits to 80 km/h, transmits to the NTSA portal, with SMS violation and expiry alerts.'
 where slug = 'speed-governors';

update solutions
   set seo_description = 'Container e-seal with electronic locking, GPS tracking, tamper detection and door alerts. Cargo security for cross-border transport in Kenya.'
 where slug = 'container-e-seal';

update solutions
   set seo_description = 'Push-to-talk radios for security, construction and transport teams. Short-range and 4G PoC radios with GPS, SOS alerts and group talk, across Kenya.'
 where slug = 'radio-communication';

update solutions
   set seo_description = 'Spare keys, all-keys-lost recovery, immobiliser programming and smart key coding. Check how many keys can start your vehicle before you buy.'
 where slug = 'vehicle-key-programming';

update industries
   set seo_description = 'Vehicle tracking, fuel monitoring and asset tracking for farms and agricultural operations in Kenya, including tractors and irrigation plant.'
 where slug = 'agriculture';

update industries
   set seo_description = 'Wire-free asset tracking, fuel monitoring and site radios for construction fleets and heavy equipment operators, including on remote sites in Kenya.'
 where slug = 'construction-and-heavy-equipment';

update products
   set seo_description = 'Android 7.0 push-to-talk handset with a 3.1-inch touch screen, 13MP camera, NFC and 40 hours of standby. KES 30,000 excl. VAT, supplied in Kenya.'
 where slug = 'inrico-s-200';

update products
   set seo_description = 'A 12V/24V PoC mobile and base station with dual SIM, touch screen, dual-band Wi-Fi and external antennas. KES 30,000 excl. VAT, supplied in Kenya.'
 where slug = 'inrico-tm-7';

-- ── Batch 2: the UNDER-length half ──────────────────────────────────────────
--
-- The same crawl also reported 21 titles under the 50-character minimum and 16
-- descriptions under 140 — space in a search result that was simply unused.
-- Four products had NO seo_title at all, so their rendered title was the bare
-- product name plus " | Nebsam": 23 to 25 characters.
--
-- Every description here is built from that row's OWN `summary`, which is copy
-- already approved and already published on the page. Nothing is invented, and
-- the hedges are carried across verbatim — cross-border-transport keeps
-- "subject to network coverage along the route".
--
-- "Fitted by Nebsam technicians" is a confirmed fact: V05, answered 4 Sep 2026,
-- prices are inclusive of installation by a Nebsam technician.

update products
   set seo_title = 'Hybrid Car Alarm | Intrusion Detection & Alerts',
       seo_description = 'A smart car alarm with intrusion detection and owner alerting — the entry point to the Hybrid range. Fitted by Nebsam technicians across Kenya.'
 where slug = 'hybrid-car-alarm';

update products
   set seo_title = 'Hybrid Tracker | GPS with Free Recovery Unit',
       seo_description = 'GPS tracking with mobile app access, local and global coverage, and a recovery tracker included free. No separate airtime top-up to manage in Kenya.'
 where slug = 'hybrid-tracker';

update products
   set seo_title = 'Recovery Tracker | Wire-Free Magnetic GPS',
       seo_description = 'A wire-free magnetic tracker for stolen vehicle recovery and asset protection, with up to three years of battery, removal alerts and route playback.'
 where slug = 'recovery-tracker';

update products
   set seo_title = 'Standard Tracker | Everyday GPS Vehicle Tracking',
       seo_description = 'Everyday GPS tracking with mobile app access, route playback and geofence alerts. No separate airtime top-up to manage. Fitted across Kenya.'
 where slug = 'standard-tracker';

update industries
   set seo_description = 'Speed limiters and vehicle tracking for school transport operators in Kenya, where speed management and vehicle visibility are what parents expect.'
 where slug = 'school-transport';

update industries
   set seo_description = 'Tracking, geofencing and vehicle security for car hire and rental operators in Kenya — vehicles handed to people you do not employ, and expected back.'
 where slug = 'car-hire-and-rental';

update industries
   set seo_description = 'Vehicle tracking, speed management and security for company vehicles and pool fleets in Kenya: an asset on the balance sheet and a duty of care.'
 where slug = 'corporate-fleets';

update industries
   set seo_description = 'Fuel monitoring, speed limiters and tracking for tanker fleets and hazardous goods transport in Kenya, where every litre has to be accounted for.'
 where slug = 'fuel-and-hazardous-transport';

update industries
   set seo_description = 'Vehicle tracking, speed limiters and retained records for government and institutional fleets in Kenya, where accountability must be demonstrable.'
 where slug = 'government-and-institutions';

update industries
   set seo_description = 'Tracking, geofencing and fuel monitoring for mining site vehicles, plant and haulage in Kenya — a fixed operating area with its own access control.'
 where slug = 'mining';

update industries
   set seo_description = 'Vehicle tracking, cargo seals and radio communication for NGO and humanitarian operations in Kenya and the region, including areas with patchy coverage.'
 where slug = 'ngos-and-humanitarian';

update industries
   set seo_description = 'Speed limiters with NTSA reporting, tracking and vehicle security for buses, matatus and PSV operators across Kenya, where speed management is law.'
 where slug = 'public-service-vehicles';

update industries
   set seo_description = 'PoC radios with SOS alerts and guard patrol mapping, plus vehicle tracking for security firms and response teams across Kenya. Reach people instantly.'
 where slug = 'security-companies';

update industries
   set seo_description = 'Electronic cargo seals and vehicle tracking for regional and cross-border transport, subject to network coverage along the route. Supplied from Kenya.'
 where slug = 'cross-border-transport';

update products
   set seo_description = 'A smart car alarm with built-in GPS tracking, route history, geofencing and smartphone door control. Fitted by Nebsam technicians across Kenya.'
 where slug = 'hybrid-plus-car-alarm';

-- Batch 3: the last two, one character short of the minimum.
update products
   set seo_title = 'Anti-Jammer GPS Tracker for Vehicles in Kenya',
       seo_description = 'A vehicle tracker that detects GSM/GPS jamming and immobilises the vehicle according to its configured security logic. Fitted by Nebsam across Kenya.'
 where slug = 'anti-jammer-tracker';
