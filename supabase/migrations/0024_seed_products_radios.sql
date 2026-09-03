-- 0024  Products: the four priced PoC radios.
--
-- These are THE ONLY FOUR PRODUCTS WITH A CONFIRMED PRICE at launch
-- (SHOP_ARCHITECTURE §2.1). Everything else in the catalogue renders "Request
-- price", which is the honest state — brief 10.2 forbids inventing a number to
-- fill it. The other seven radio models stay off the site until their
-- specifications arrive.
--
-- THE RECURRING FEE IS PUBLISHED ON THE PAGE, NOT AT CHECKOUT. Each unit
-- carries a KES 3,000 per device per year licence renewal with the
-- Communications Authority. Brief 10.2 requires a recurring cost to appear on
-- the product page, and a buyer comparing a KES 30,000 radio against an
-- alternative is comparing the wrong number if the annual fee only surfaces
-- after the decision.
--
-- INSTALLATION TERMS ARE NOT STATED, on any of the four. Whether the price
-- includes installation, SIM provisioning or configuration is register item
-- V05, unresolved, and each source write-up tokenises it explicitly. The page
-- says terms are confirmed on order rather than asserting either way — the
-- register is clear that ambiguity here generates order disputes, and guessing
-- would create exactly that.
--
-- SPEC TABLES CARRY ONLY DOCUMENTED VALUES. The write-ups mark every unknown as
-- a verification token, and none of those tokens is published or guessed at.
-- The T-521 therefore has a very short table and the S-200 a long one. That
-- asymmetry is accurate: the S-200 is genuinely the best-documented handset in
-- the range, and inventing rows to even them up would be fabricating
-- specifications.
--
-- COVERAGE IS STATED AS THE LIMIT, on every unit. "Unlimited distances without
-- interference" is on the never-publish list; the honest form is that distance
-- stops being the limit and network coverage becomes it.

-- ── Inrico T-521 — handheld, KES 22,000 ─────────────────────────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, recurring_fee_kes, recurring_fee_period, recurring_fee_note,
  availability, featured, status, seo_title, seo_description)
select
  'inrico-t-521', 'Inrico T-521 PoC Radio', 'Radios',
  'A network-connected push-to-talk handset with GPS, programmable emergency buttons, guard patrol mapping and a 5000mAh battery, operating on a cellular data card rather than a radio frequency.',
  'The T-521 carries voice across a mobile data network rather than transmitting directly to another handset, so two users can talk regardless of the distance between them — provided both are within cellular network coverage. Where there is no mobile data service, the handset cannot transmit or receive.',
  jsonb_build_array(
    jsonb_build_object('title', 'Intercom globally', 'detail', 'Communication across cities, regions and countries, subject to network coverage and service availability in each area of operation.'),
    jsonb_build_object('title', 'Programmable emergency buttons', 'detail', 'Buttons are programmable for emergency use.'),
    jsonb_build_object('title', 'Guard patrol mapping', 'detail', 'The guard patrol function can be mapped, for security operations running fixed routes.'),
    jsonb_build_object('title', 'GPS supported', 'detail', 'Position reporting alongside voice.'),
    jsonb_build_object('title', 'Wi-Fi and Bluetooth', 'detail', 'Both supported.')
  ),
  jsonb_build_object('Battery capacity', '5000mAh', 'Operation', 'Cellular data card (PoC)', 'Positioning', 'GPS supported', 'Connectivity', 'Wi-Fi and Bluetooth'),
  c.id, 22000, 3000, 'year', 'Communications Authority licence renewal, per device',
  'in_stock', true, 'published',
  'Inrico T-521 PoC Radio | Push-to-Talk over Cellular',
  'Network-connected push-to-talk handset with GPS, guard patrol mapping, programmable emergency buttons and a 5000mAh battery. KES 22,000 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Inrico S-100 — handheld with cameras, IP68, KES 30,000 ──────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, recurring_fee_kes, recurring_fee_period, recurring_fee_note,
  availability, featured, status, seo_title, seo_description)
select
  'inrico-s-100', 'Inrico S-100 PoC Radio', 'Radios',
  'A push-to-talk handset with front and rear auto-focus cameras, accurate GPS, a dedicated SOS emergency alarm button, a 4000mAh battery and an IP68 protective design.',
  'The S-100 adds camera, mapping and emergency-alert capability to standard push-to-talk operation. It communicates through a mobile data or Wi-Fi network; where there is no network service, the handset cannot transmit or receive.',
  jsonb_build_array(
    jsonb_build_object('title', 'SOS emergency alarm button', 'detail', 'A dedicated button for raising an emergency alert — the feature that matters most for lone workers and patrol teams.'),
    jsonb_build_object('title', 'Front and rear cameras', 'detail', 'Both with auto-focus, for capturing what is in front of the user and the user themselves.'),
    jsonb_build_object('title', 'IP68 protective design', 'detail', 'Built for outdoor and industrial use where equipment takes weather and handling.'),
    jsonb_build_object('title', 'Accurate GPS and maps', 'detail', 'Positioning with Google search engine maps on the handset.'),
    jsonb_build_object('title', 'Single and group call', 'detail', 'Speak to one person or to a whole team from the same handset.')
  ),
  jsonb_build_object('Battery capacity', '4000mAh', 'IP rating', 'IP68 protective design', 'Cameras', 'Front and rear, auto-focus', 'Positioning', 'Accurate GPS', 'Connectivity', 'Wi-Fi and Bluetooth'),
  c.id, 30000, 3000, 'year', 'Communications Authority licence renewal, per device',
  'in_stock', true, 'published',
  'Inrico S-100 PoC Radio | Cameras, GPS and SOS Button',
  'Push-to-talk handset with front and rear cameras, accurate GPS, SOS emergency button and IP68 protection. KES 30,000 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Inrico S-200 — the best-documented handset, KES 30,000 ──────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, recurring_fee_kes, recurring_fee_period, recurring_fee_note,
  availability, featured, status, seo_title, seo_description)
select
  'inrico-s-200', 'Inrico S-200 PoC Radio', 'Radios',
  'An Android push-to-talk handset with a 3.1-inch touch screen, 13MP rear camera, NFC and a 4000mAh battery rated at 40 hours standby and 12 hours talk time.',
  'The S-200 is a radio, a camera and a connected terminal in one device. It communicates through an LTE, WCDMA, GSM or Wi-Fi connection; where there is no network service, the handset cannot transmit or receive.',
  jsonb_build_array(
    jsonb_build_object('title', 'Android operating system', 'detail', 'Android 7.0, so the handset runs applications alongside push-to-talk rather than only carrying voice.'),
    jsonb_build_object('title', 'Colour touch screen', 'detail', 'A 3.1-inch touch screen, which is what makes mapping and applications usable on the device.'),
    jsonb_build_object('title', 'Front and rear cameras', 'detail', 'Front 2.0MP and rear 13.0MP.'),
    jsonb_build_object('title', 'NFC', 'detail', 'Near-field communication supported.'),
    jsonb_build_object('title', 'Storage expansion', 'detail', 'Micro SD expansion up to 32GB, on top of 8GB of internal storage.')
  ),
  jsonb_build_object(
    'Network', 'LTE / WCDMA / GSM / Wi-Fi', 'Operating system', 'Android 7.0', 'CPU', '1.5GHz',
    'Memory', '1GB RAM + 8GB ROM, Micro SD up to 32GB', 'Screen', '3.1" touch screen',
    'Camera', 'Front 2.0MP, rear 13.0MP', 'Battery capacity', '4000mAh',
    'Standby / talk time', '40 hours standby, 12 hours talk', 'IP rating', 'IP54'
  ),
  c.id, 30000, 3000, 'year', 'Communications Authority licence renewal, per device',
  'in_stock', true, 'published',
  'Inrico S-200 PoC Radio | Android Push-to-Talk Handset',
  'Android 7.0 push-to-talk handset with 3.1-inch touch screen, 13MP camera, NFC and 40 hours standby. KES 30,000 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Inrico TM-7 — vehicle and base station, KES 30,000 ──────────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, recurring_fee_kes, recurring_fee_period, recurring_fee_note,
  availability, featured, status, seo_title, seo_description)
select
  'inrico-tm-7', 'Inrico TM-7 PoC Mobile and Base Station', 'Radios',
  'The fixed and vehicle-mounted unit in the range — 12V/24V powered, dual SIM, colour touch screen, dual-band Wi-Fi, a 5W speaker and external GPS and GSM antennas.',
  'Unlike the handheld models the TM-7 is not battery-powered. It runs from a 12V or 24V DC supply, which suits it to permanent installation in a vehicle cab, a control room or a dispatch desk — the desk and the dashboard rather than the belt clip.',
  jsonb_build_array(
    jsonb_build_object('title', 'Dual SIM operation', 'detail', 'Two SIM cards, which matters for a base station that has to stay reachable when one network is having a bad day.'),
    jsonb_build_object('title', 'External GPS and GSM antennas', 'detail', 'Supplied with the unit — essential for a device mounted inside a cab or a building where an internal antenna would struggle.'),
    jsonb_build_object('title', 'Dual-band Wi-Fi', 'detail', 'IEEE 802.11 b/g/n on both 2.4G and 5G.'),
    jsonb_build_object('title', '5W speaker', 'detail', 'Audio output sized for a vehicle cab or a dispatch room rather than a handset held to the ear.'),
    jsonb_build_object('title', 'Colour touch screen', 'detail', 'On-unit control without a separate terminal.')
  ),
  jsonb_build_object(
    'Power', '12V / 24V DC', 'Operating system', 'Android 7.0', 'CPU', 'MT6737, 1.2GHz',
    'Memory', '1GB RAM + 8GB ROM', 'SIM', 'Dual SIM card',
    'Wi-Fi', 'IEEE 802.11 b/g/n, 2.4G and 5G', 'Bluetooth', '4.0 and BLE',
    'Speaker', '5W', 'Antennas', 'External GPS and GSM, supplied', 'IP rating', 'IP54'
  ),
  c.id, 30000, 3000, 'year', 'Communications Authority licence renewal, per device',
  'in_stock', false, 'published',
  'Inrico TM-7 PoC Base Station | Vehicle and Desk Mounted',
  'A 12V/24V PoC mobile and base station with dual SIM, touch screen, dual-band Wi-Fi and external antennas. KES 30,000 excl. VAT.'
from product_categories c where c.slug = 'radios';
