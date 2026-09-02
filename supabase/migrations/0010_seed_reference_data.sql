-- ============================================================================
-- 0010 — Reference data.
--
-- THERE IS NO CUSTOMER DATA IN THIS FILE AND THERE NEVER WILL BE.
-- No plates, no names, no phone numbers belonging to a person, no certificates.
-- Brief PART 12 and PART 16. Demonstration telemetry uses obviously
-- illustrative plates (KXX 000X) and lives in component fixtures, not here.
--
-- What IS here: the three branches, the sixteen coverage towns, and the product
-- and blog categories — facts about Nebsam that come from brief PART 3 and are
-- already the single source of truth in lib/company.ts. They are duplicated
-- into the database so the CMS can edit branch hours and phone numbers without
-- a deploy, while lib/company.ts remains the build-time source for schema,
-- llms.txt and the sitemap.
--
-- Idempotent: safe to re-run.
-- ============================================================================

-- ── Branches. ONLY these three are physical offices. ────────────────────────
-- The retired variants ("Equity Ngara", "Utawala", "Kenyatta Ave / Saba Saba")
-- must never appear here or anywhere else — brief PART 1.5 #6 and #7. The
-- build-time check in scripts/check-retired-strings.mjs catches them if they
-- ever reach rendered output.
insert into branches (slug, name, address, town, county, phones, maps_url, sort_order)
values
  ('nairobi', 'Nairobi',
   'Kiambu Road, Ridgeways — next to Impact Motors', 'Nairobi', 'Nairobi',
   '[{"display":"+254 140 999399","e164":"+254140999399"},
     {"display":"+254 726 221122","e164":"+254726221122"}]'::jsonb,
   'https://www.google.com/maps/search/?api=1&query=Kiambu+Road+Ridgeways+Nairobi', 1),

  ('mombasa', 'Mombasa',
   'Makupa Roundabout — next to Mass Petrol Station', 'Mombasa', 'Mombasa',
   '[{"display":"+254 769 063333","e164":"+254769063333"},
     {"display":"+254 711 895555","e164":"+254711895555"},
     {"display":"+254 759 000111","e164":"+254759000111"}]'::jsonb,
   'https://www.google.com/maps/search/?api=1&query=Makupa+Roundabout+Mombasa', 2),

  ('nakuru', 'Nakuru',
   'Lower Bedi Road', 'Nakuru', 'Nakuru',
   '[{"display":"+254 725 221122","e164":"+254725221122"}]'::jsonb,
   'https://www.google.com/maps/search/?api=1&query=Lower+Bedi+Road+Nakuru', 3)
on conflict (slug) do nothing;

-- ── Coverage. Agents and technicians — NOT offices. ─────────────────────────
-- Brief 3.4 forbids implying an office where there is none and forbids stating
-- a count of agents or technicians. No count column exists on this table.
insert into coverage_locations (town, type)
values
  ('Kisii', 'both'), ('Kisumu', 'both'), ('Homa Bay', 'both'), ('Eldoret', 'both'),
  ('Malindi', 'both'), ('Kilifi', 'both'), ('Kericho', 'both'), ('Thika', 'both'),
  ('Isiolo', 'both'), ('Meru', 'both'), ('Marsabit', 'both'), ('Lodwar', 'both'),
  ('Busia', 'both'), ('Garissa', 'both'), ('Nanyuki', 'both'), ('Embu', 'both')
on conflict (town) do nothing;

-- ── Product categories ──────────────────────────────────────────────────────
insert into product_categories (slug, name, description, sort_order)
values
  ('gps-trackers', 'GPS Trackers',
   'Wired, magnetic, OBD and anti-jamming trackers for vehicles and assets.', 1),
  ('car-alarms', 'Car Alarms',
   'Smart alarms, vibrating key remotes and anti-jammer GPS variants.', 2),
  ('dashcams-video', 'Dashcams & Video Telematics',
   'The 4G dual-lens Hybrid Dashcam and the 3-camera AI video telematics system.', 3),
  ('radios', 'Radios',
   'Long-range PoC handsets and gateways, and short-range frequency radios.', 4),
  ('systems', 'Systems',
   'Fuel monitoring, speed governors and container e-seals.', 5)
on conflict (slug) do nothing;

-- ── Blog categories, mapped to solutions (brief 13.5) ───────────────────────
-- solution_id is left null: solutions are migrated from content-source/ in
-- Sprint 5, and a category is linked to its solution then. Guessing an id here
-- would create a dangling reference.
insert into blog_categories (slug, name, description)
values
  ('vehicle-tracking',    'Vehicle tracking',    'Tracking, recovery and anti-jamming.'),
  ('fleet-operations',    'Fleet operations',    'Running a fleet in Kenya day to day.'),
  ('fuel-monitoring',     'Fuel monitoring',     'Fuel loss, sensors and reporting.'),
  ('driver-safety',       'Driver safety',       'Video telematics, ADAS and driver behaviour.'),
  ('compliance',          'Compliance',          'NTSA, speed limiters and regulatory duties.'),
  ('school-transport',    'School transport',    'Safeguarding, attendance and parent visibility.'),
  ('cargo-security',      'Cargo security',      'E-seals, corridors and transit visibility.'),
  ('radio-communication', 'Radio communication', 'PoC and short-range radio for field teams.')
on conflict (slug) do nothing;
