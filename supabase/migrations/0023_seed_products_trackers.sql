-- 0023  Products: the two trackers with no open audit items.
--
-- WHY ONLY TWO OF SEVEN TRACKERS. The Sprint 6 criterion is "Audit items
-- A01-A07 resolved before the affected pages ship", and all seven are open:
--   A01/A02/A03 -> Hybrid Tracker      (mobile app, global tracking, top-up)
--   A04/A05     -> Standard Tracker    (mobile app, top-up)
--   A06         -> Recovery Tracker    (route playback)
-- Those three are seeded as drafts in 0025. The Anti-Jammer Tracker and Hybrid
-- Pro Max Tracker carry no audit item and no verification token, so they ship.
--
-- KIPI IS AN INTELLECTUAL PROPERTY REGISTRATION, NEVER A CERTIFICATION.
-- The source says "certified by KIPI (Kenya Industrial Property Institute)",
-- twice. KIPI registers patents, trademarks and industrial designs; it does not
-- certify that a product works or is safe. "Certified by KIPI" therefore reads
-- as a quality endorsement that no institution has given, which is exactly the
-- kind of borrowed authority CLAUDE.md §5 exists to stop. The Sprint 6
-- criterion says so explicitly. Described here as a registration, which is both
-- accurate and still worth saying — locally engineered hardware with registered
-- IP is a genuine differentiator.
--
-- ALSO NOT PUBLISHED, from the Hybrid Pro Max source: "systems that actually
-- stop vehicle theft" and "We are the solution." The first is an absolute
-- security promise of the kind the never-publish list names; the second is
-- deck copy carrying no information.
--
-- HEDGES PRESERVED: "according to its configured security logic", "subject to
-- the selected configuration and applicable privacy requirements".
--
-- SPECS ARE SPARSE ON PURPOSE. Only values the write-ups actually document are
-- present. An empty specification row is more useful than a plausible one.

insert into products (slug, name, family, summary, body, features, specs, category_id, price_kes, availability, featured, status, seo_title, seo_description)
select
  'anti-jammer-tracker',
  'Anti-Jammer Tracker',
  'Trackers',
  'A GPS tracker that treats a jamming attempt as a security event rather than as silence — detecting GSM/GPS interference and immobilising the vehicle according to its configured security logic.',
  'An ordinary tracker is defeated by a cheap GSM jammer: block the uplink and the unit simply stops reporting, which on any platform looks the same as a flat battery or a coverage hole. The Anti-Jammer Tracker is built for the case where someone is working against you deliberately, and it responds to interference instead of going quiet.',
  jsonb_build_array(
    jsonb_build_object('title', 'Anti-network jamming',
      'detail', 'Designed to detect GSM/GPS jamming attempts and automatically immobilise the vehicle according to its configured security logic, so a jamming attempt triggers a security response rather than leaving the vehicle unprotected.'),
    jsonb_build_object('title', 'Live GPS tracking',
      'detail', 'The vehicle''s location in real time through a smartphone or the tracking platform.'),
    jsonb_build_object('title', 'Route playback',
      'detail', 'Historical journeys retraced, for investigating incidents and reviewing driver activity.'),
    jsonb_build_object('title', 'Trip reports',
      'detail', 'Detailed trip information for fleet monitoring and operational management.'),
    jsonb_build_object('title', 'Geofence alerts',
      'detail', 'Virtual boundaries around selected locations, with alerts on entry and exit, to identify unauthorised movement.'),
    jsonb_build_object('title', 'Remote engine immobilisation and restore',
      'detail', 'Immobilise the vehicle when required and restore engine operation when authorised.'),
    jsonb_build_object('title', 'Optional microphone integration',
      'detail', 'An option for microphone integration where an audio monitoring component is required. Microphone functionality is optional and subject to the selected configuration and applicable privacy requirements.')
  ),
  jsonb_build_object(
    'Tracking', 'GPS, real time',
    'Anti-jamming', 'GSM/GPS jamming detection with configured automatic response',
    'Engine control', 'Remote immobilisation and restore',
    'Audio', 'Optional microphone integration'
  ),
  c.id, null, 'in_stock', true, 'published',
  'Anti-Jammer GPS Tracker in Kenya',
  'A vehicle tracker that detects GSM/GPS jamming and immobilises the vehicle according to its configured security logic. Fitted across Kenya.'
from product_categories c where c.slug = 'gps-trackers';

insert into products (slug, name, family, summary, body, features, specs, category_id, price_kes, availability, featured, status, seo_title, seo_description)
select
  'hybrid-pro-max-tracker',
  'Hybrid Pro Max Tracker',
  'Trackers',
  'Locally engineered vehicle security with six active layers that begin at the door — a vibrating key remote that warns you on first touch, a call when the door is opened, anti-jamming and remote immobilisation.',
  'Most tracking systems begin responding once a vehicle is already moving. The Hybrid Pro Max begins at the first touch of a door handle: the key remote vibrates and beeps before entry has been made. It is designed around theft patterns seen in Kenya rather than adapted from a general-purpose product.',
  jsonb_build_array(
    jsonb_build_object('title', 'Vibrating key remote alert',
      'detail', 'The moment someone touches the vehicle doors or attempts interference, the key remote vibrates and beeps continuously — an instant warning that the vehicle is being targeted, before entry is made.'),
    jsonb_build_object('title', 'Illegal door opening call alert',
      'detail', 'With the vehicle in armed status, an illegal door opening places a phone call to the owner, so notification does not depend on anyone watching a screen.'),
    jsonb_build_object('title', 'Anti-jamming protection',
      'detail', 'Defends against signal jamming, so interference with the tracking uplink triggers the configured security response.'),
    jsonb_build_object('title', 'Engine start prevention and immobilisation',
      'detail', 'Prevents engine start and immobilises the vehicle as part of the active security layers.'),
    jsonb_build_object('title', 'Tamper and removal protection',
      'detail', 'Protection against tampering with and removal of the unit itself.'),
    jsonb_build_object('title', 'Live tracking, playback, trips and geofences',
      'detail', 'The full tracking set: real-time location, historical route playback, trip reports and geofence alerts on entry and exit.'),
    jsonb_build_object('title', 'Locally engineered, with registered intellectual property',
      'detail', 'Designed and engineered in Kenya by Nebsam Digital Solutions (K) Ltd, with intellectual property registered at the Kenya Industrial Property Institute (KIPI). KIPI registers intellectual property; it is not a product quality certification.')
  ),
  jsonb_build_object(
    'Security layers', 'Six active layers, beginning at door touch',
    'Owner alerts', 'Vibrating key remote; phone call on illegal door opening',
    'Tracking', 'GPS, real time, with route playback and trip reports',
    'Engine control', 'Remote immobilisation and restore; engine start prevention',
    'Anti-jamming', 'Included',
    'Intellectual property', 'Registered with KIPI (Kenya Industrial Property Institute)'
  ),
  c.id, null, 'in_stock', true, 'published',
  'Hybrid Pro Max Tracker | Locally Engineered Vehicle Security',
  'Six active security layers beginning at door touch: vibrating key remote, call alerts, anti-jamming and remote immobilisation. Engineered in Kenya.'
from product_categories c where c.slug = 'gps-trackers';
