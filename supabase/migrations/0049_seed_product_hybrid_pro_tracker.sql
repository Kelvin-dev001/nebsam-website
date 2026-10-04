-- 0049  Product: the Hybrid Pro Tracker.
--
-- Kelvin, 4 October 2026: it is sold, and "it works like hybrid tracker but in
-- addition it has the illegal door opening phone calling feature". He approved
-- the name "Hybrid Pro Tracker" and the slug `hybrid-pro-tracker` the same day
-- (register V91). Slugs are permanent, so this one was confirmed before it was
-- minted.
--
-- EVERY FACT IS FROM content-source/02-products/trackers/hybrid-pro-tracker/
-- write-up.md, rewritten out of it (nebsam-content). Its hedge "according to
-- its configured security logic" is kept word for word.
--
-- WHAT IS DELIBERATELY NOT ON THE PAGE, and why:
--
--   The Hybrid Tracker's free recovery unit and "no separate airtime top-up".
--   Kelvin's "works like hybrid tracker" describes the tracking, and the Pro's
--   own write-up never mentions either. Not claimed until confirmed.
--
--   "Don't wait until your vehicle is stolen…", "Track smarter. Protect
--   better." and the other deck lines. Taglines carry no fact (§5). "Ideal for
--   high-value vehicles" and the rest of the audience list are a list, not a
--   claim, so they inform the industry links instead.
--
--   Any promise that a thief cannot take the vehicle. Brief §3: never promise
--   absolute security. The layers are described as what each one does.
--
-- PRICE: not supplied, so `price_kes` is null: "Request price" and Product
-- schema with no Offer, like every other tracker. RENEWAL and INSTALLATION
-- follow the 4 September answers (0032 §2 and §3), which cover every tracker:
-- KES 3,000 a year per device, and installation included.
--
-- AVAILABILITY is the column default ('in_stock'). It is not shown on the page
-- and only feeds a schema Offer, which a product without a price does not get.
--
-- LINKS follow the siblings: Vehicle Tracking and Vehicle Security, as the
-- Hybrid Pro Max; Corporate Fleets and Car Hire & Rental, the write-up's
-- "company fleets" and "rental vehicles".
--
-- ONE TRANSACTION, as 0045: the product and its links land whole or not at
-- all, and a re-run fails on the first insert (products.slug is unique).
begin;

insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, recurring_fee_kes, recurring_fee_period, recurring_fee_note,
  installation_terms, featured, status, seo_title, seo_description)
select
  'hybrid-pro-tracker', 'Hybrid Pro Tracker', 'Trackers',
  'GPS tracking with five added security layers: anti-jamming, a tamper alert, removal protection, a phone call when a door is opened while armed, and smartphone Bluetooth ignition.',
  'A conventional tracker mainly tells you where the vehicle is. The Hybrid Pro Tracker adds layers that respond when someone interferes with the vehicle or with the tracker itself: detection, alerts, access control and immobilisation. It is engineered by Nebsam Digital Solutions (K) Ltd, around the security problems vehicle owners face in Kenya.',
  jsonb_build_array(
    jsonb_build_object('title', 'Illegal door opening call alert', 'detail', 'When the vehicle is armed and a door is opened without authorisation, the system calls the owner''s phone. So whether you are at home, in the office or away from the vehicle, you hear about a possible break-in, rather than relying only on an alarm sound.'),
    jsonb_build_object('title', 'Anti-jamming', 'detail', 'Designed to detect GSM/GPS jamming attempts and automatically activate vehicle immobilisation according to its configured security logic.'),
    jsonb_build_object('title', 'Anti-tamper alert', 'detail', 'If someone tries to open or tamper with the tracker, the owner gets an instant SMS.'),
    jsonb_build_object('title', 'Anti-removal protection', 'detail', 'Designed to detect unauthorised removal of the tracker. When it does, the vehicle can be immobilised automatically, the engine stays disabled even after rewiring attempts, and restoring it needs a unique recovery device.'),
    jsonb_build_object('title', 'Smart Bluetooth ignition', 'detail', 'The engine will not start until the owner''s smartphone makes an authorised Bluetooth connection with a secure 4-digit PIN. The owner can switch the feature on or off and change the PIN. It adds a layer beyond the key, including when someone has the physical key.'),
    jsonb_build_object('title', 'Live tracking, playback, trips and geofences', 'detail', 'Real-time location on your smartphone or the tracking platform, route playback of past journeys, trip reports, and alerts when the vehicle enters or leaves an area you define.'),
    jsonb_build_object('title', 'Remote immobilisation and restore', 'detail', 'Immobilise the vehicle remotely when necessary, and restore engine operation when authorised.')
  ),
  jsonb_build_object(
    'Tracking', 'GPS, real time, with route playback and trip reports',
    'Security layers', 'Five, on top of standard tracking',
    'Owner alerts', 'Phone call on illegal door opening when armed; SMS on tamper',
    'Anti-jamming', 'Detects GSM/GPS jamming; immobilises per configured security logic',
    'Removal protection', 'Immobilisation on removal; restore with a unique recovery device',
    'Engine control', 'Remote immobilisation and restore; Bluetooth ignition with a 4-digit PIN'
  ),
  c.id, null, 3000, 'year',
  'Annual renewal per device, covering SIM resources and server costs. Reviewed annually.',
  'The price includes installation by a Nebsam technician.',
  false, 'published',
  'Hybrid Pro Tracker | Five-Layer Car Security',
  'GPS tracking plus five security layers: anti-jamming, tamper and removal alerts, a call on illegal door opening, Bluetooth ignition. Engineered in Kenya.'
from product_categories c where c.slug = 'gps-trackers';

insert into product_solutions (product_id, solution_id)
select p.id, s.id
from products p, solutions s
where p.slug = 'hybrid-pro-tracker' and s.slug in ('vehicle-tracking', 'vehicle-security');

insert into product_industries (product_id, industry_id)
select p.id, i.id
from products p, industries i
where p.slug = 'hybrid-pro-tracker' and i.slug in ('corporate-fleets', 'car-hire-and-rental');

commit;
