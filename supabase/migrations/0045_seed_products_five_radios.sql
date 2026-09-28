-- 0045  Products: five more radios, now that they have prices.
--
-- 0024 kept seven radio models off the site "until their specifications
-- arrive". On 28 September 2026 Kelvin supplied prices for five of them and
-- asked for the pages to be shown. All five prices EXCLUDE VAT, which is how
-- every price on the site is stored and shown ("excl. VAT").
--
--   Inrico DR10 gateway   KES 350,000   renewal KES 6,000 (period not confirmed)
--   Baofeng UV-82         KES   6,500
--   Kenwood TK-3000       KES   6,500
--   Baofeng BF-888s       KES   3,500
--   Baofeng UV-5R         KES   5,500
--
-- The Inrico T-290 is out of stock, so it gets no page. The UV-9R Plus, S-100
-- and S-200 notes are unaffected.
--
-- SPEC TABLES CARRY ONLY DOCUMENTED VALUES, as in 0024. Every value below comes
-- from content-source/02-products/radios/<slug>/write-up.md. Undocumented
-- fields are left out, never estimated; they stay in the register (Part B, B1).
--
-- WHAT IS DELIBERATELY NOT ON THESE PAGES, and why:
--
--   DR10 repeater function. The source says the DR10 can act as a repeater for
--   an existing frequency network. Running a repeater on licensed frequencies
--   may need its own Communications Authority licence, and the source notes say
--   to confirm that before advertising it. Absent, not hedged.
--
--   DR10 comparison with "most gateway products". A vendor claim about unnamed
--   competitors; it becomes a statement about the gateway's own approach.
--
--   Third-party radio brands the DR10 works with. The source names none
--   reliably (one is misspelt), so none is named.
--
--   TK-3000 "5W (VHF)". The source gives "5W (VHF) / 4W (UHF)" but only a UHF
--   band, 440-480 MHz. The page describes that UHF model at 4W; whether a VHF
--   variant is also sold is still open (register V85). No dealer status is
--   claimed for Kenwood: reselling is fine, an implied dealership is not.
--
--   UV-5R transceiver band. The source's "65-108MHz" is the FM BROADCAST
--   receiver, not the two-way band, which the source never states. The page says
--   exactly that and gives no transceiver band.
--
--   UV-82 "long battery life", "rugged", "louder speaker". Comparatives with no
--   baseline; dropped.
--
--   Licensing on the four short-range pages. Nebsam's CAK position covers
--   selling them; whether a buyer needs a licence of their own to operate one
--   is open, and no short-range page implies either way (register B1).
--
-- DR10 RENEWAL. KES 6,000, supplied by Kelvin; the period is not confirmed
-- (register V85). It is NOT stored in recurring_fee_kes: the
-- recurring_fee_needs_period constraint (0002) refuses a fee with no period,
-- rightly, and inventing "per year" to satisfy it would be a fabricated term.
-- Hiding a known recurring cost is not an option either (brief 10.2), so the
-- overview states it and says to ask how often it falls due. When the period
-- is confirmed, move it into the fee columns and drop that sentence.
--
-- INSTALLATION TERMS follow V05 (answered 4 Sep 2026): prices include
-- installation by a Nebsam technician, the sentence 0032 wrote on every product.
--
-- LINKS follow 0026 and 0029: every radio to the radio-communication solution,
-- and to the industries its write-up names that exist on the site. "Events",
-- "Hotels & Hospitality" and "Retail" are named in the write-ups but are not
-- industries here, so they are not linked.

-- ONE TRANSACTION. apply-migration.mjs does not wrap a file, and five inserts
-- plus two link inserts are not re-runnable halfway: a failure on the third
-- product would leave two published. Wrapped, it lands whole or not at all; a
-- re-run fails on the first insert (products.slug is unique) and changes nothing.
begin;

-- ── Inrico DR10 — PoC and LMR gateway, KES 350,000 ─────────────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, recurring_fee_kes, recurring_fee_period, recurring_fee_note,
  installation_terms, availability, featured, status, seo_title, seo_description)
select
  'inrico-dr10-gateway', 'Inrico DR10 PoC and LMR Gateway', 'Radios',
  'A gateway that joins conventional DMR and analogue two-way radios to a PoC network, so a user on a frequency radio and a user on a PoC radio can talk to each other.',
  'Most organisations that move to PoC radios already own conventional frequency radios. The DR10 connects the two into a single communications network, so the radios already in service stay in service alongside the new ones. The PoC side reaches as far as the network does, subject to network coverage and service availability. The frequency bands and DMR tiers it supports are not listed here yet, so send us the make and model of the radios you run before you buy. It has no battery, so it runs from a power supply where it is installed. A renewal fee of KES 6,000 applies on top of the price; ask us how often it falls due.',
  jsonb_build_array(
    jsonb_build_object('title', 'Frequency and PoC radios on one network', 'detail', 'Interconnects analogue, DMR and PoC radios, including equipment from different brands, so the handsets you already own stay in use.'),
    jsonb_build_object('title', 'Caller ID across both radio types', 'detail', 'Within a group, a user can see who is talking, whether that person is on a PoC radio or a frequency radio.'),
    jsonb_build_object('title', 'Signalling-protocol bridging', 'detail', 'The gateway links the networks using signalling protocol technology rather than collecting and forwarding voice messages, an approach designed to make voice transmission more efficient and complete.'),
    jsonb_build_object('title', 'Cellular, Wi-Fi, Bluetooth and LAN', 'detail', 'Carrier 2G, 3G and 4G network access, plus Wi-Fi, Bluetooth and LAN.'),
    jsonb_build_object('title', 'One-click SOS and GPS', 'detail', 'A one-click SOS function and GPS positioning.'),
    jsonb_build_object('title', 'Video, voice and messages', 'detail', 'Video, voice and message communication, with support for an external camera. None is built in.')
  ),
  jsonb_build_object(
    'Screen', '2.45-inch touch display', 'Operating system', 'Android',
    'Cellular', '4G LTE; carrier 2G, 3G and 4G network access',
    'Connectivity', 'Wi-Fi, Bluetooth and LAN', 'Positioning', 'GPS',
    'Camera', 'External camera supported; none built in', 'Battery', 'None',
    'Radio systems', 'Analogue, DMR and PoC interconnection'
  ),
  c.id, 350000, null, null, null,
  'The price includes installation by a Nebsam technician.',
  'in_stock', false, 'published',
  'Inrico DR10 Gateway | Link DMR, Analogue and PoC Radios',
  'A gateway that joins DMR and analogue two-way radios to a PoC network, with caller ID across both, 4G, Wi-Fi, LAN and GPS. KES 350,000 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Baofeng UV-82 — dual-band, dual PTT, KES 6,500 ─────────────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, installation_terms, availability, featured, status, seo_title, seo_description)
select
  'baofeng-uv-82', 'Baofeng UV-82 Dual-Band Short-Range Radio', 'Radios',
  'A dual-band VHF and UHF handheld with 128 programmable memory channels and a dual push-to-talk rocker that transmits on either of two frequencies without changing channel.',
  'The UV-82 is a conventional short-range two-way radio. It talks directly to other radios, with no network, SIM card or data connection involved, so it keeps working where there is no mobile signal at all. The trade-off is distance: operating range is limited by transmit power, terrain, obstructions and antenna. Its reason to exist is the rocker switch, which lets a supervisor hold one frequency for their own team and another for site control, and choose which to transmit on with a thumb.',
  jsonb_build_array(
    jsonb_build_object('title', 'Dual push-to-talk', 'detail', 'A rocker PTT switch transmits on either of two frequencies.'),
    jsonb_build_object('title', 'Dual watch', 'detail', 'One receiver watches two channels in semi-duplex operation, even across VHF and UHF, and gives priority to the first station to receive an incoming call.'),
    jsonb_build_object('title', '128 memory channels', 'detail', 'Programmable, and added or removed with computer software.'),
    jsonb_build_object('title', 'Hands-free VOX', 'detail', 'Internal VOX for hands-free use with the included earpiece and microphone.'),
    jsonb_build_object('title', 'FM broadcast radio', 'detail', 'Listen to FM radio while the radio frequencies are monitored in the background.')
  ),
  jsonb_build_object(
    'Bands', 'Dual band, VHF and UHF', 'Channels', '128 programmable memory channels',
    'Push-to-talk', 'Dual PTT rocker switch', 'Receiver', 'Single receiver, semi-duplex dual watch',
    'Hands-free', 'Internal VOX', 'Type', 'Analogue short-range radio'
  ),
  c.id, 6500,
  'The price includes installation by a Nebsam technician.',
  'in_stock', false, 'published',
  'Baofeng UV-82 Dual-Band Radio | Dual PTT, 128 Channels',
  'Dual-band VHF and UHF handheld with a dual push-to-talk rocker, dual watch, 128 memory channels and hands-free VOX. No network needed. KES 6,500 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Kenwood TK-3000 — 16-channel UHF, KES 6,500 ────────────────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, installation_terms, availability, featured, status, seo_title, seo_description)
select
  'kenwood-tk-3000', 'Kenwood TK-3000 Short-Range Radio', 'Radios',
  'A 16-channel UHF handheld covering 440–480 MHz, with priority scan, selectable wide or narrow channel bandwidth, busy channel lockout and Windows programming.',
  'The TK-3000 is a conventional short-range two-way radio. It transmits directly to other radios, with no network, SIM card or data connection involved, so it keeps working where there is no mobile signal at all. The trade-off is distance: operating range is limited by transmit power, terrain, obstructions and antenna. It sits in the range as the alternative to the Baofeng handhelds.',
  jsonb_build_array(
    jsonb_build_object('title', '16 channels with scan', 'detail', 'Sixteen channels, with a scan function and priority scan.'),
    jsonb_build_object('title', 'Wide or narrow bandwidth', 'detail', 'Channel bandwidth is selectable between wide and narrow.'),
    jsonb_build_object('title', 'Busy channel lockout', 'detail', 'Prevents transmitting on a channel that is already busy.'),
    jsonb_build_object('title', 'Windows programming and tuning', 'detail', 'Programmed and tuned from a Windows computer.'),
    jsonb_build_object('title', 'Ready for hands-free', 'detail', 'VOX ready.'),
    jsonb_build_object('title', 'Battery care', 'detail', 'A battery saver, a low-battery alert and a time-out timer.')
  ),
  jsonb_build_object(
    'Frequency range', '440–480 MHz (UHF)', 'Channels', '16, with scan',
    'Output power', '4W (UHF)', 'Channel bandwidth', 'Wide or narrow, selectable',
    'Programming', 'Windows programming and tuning', 'Indicator', 'Tri-colour LED',
    'Type', 'Analogue short-range radio'
  ),
  c.id, 6500,
  'The price includes installation by a Nebsam technician.',
  'in_stock', false, 'published',
  'Kenwood TK-3000 UHF Radio | 16 Channels, 440–480 MHz',
  'Kenwood TK-3000 UHF handheld on 440–480 MHz, with 16 channels, priority scan, wide or narrow bandwidth and busy channel lockout. KES 6,500 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Baofeng BF-888s — 16-channel UHF, KES 3,500 ────────────────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, installation_terms, availability, featured, status, seo_title, seo_description)
select
  'baofeng-bf-888s', 'Baofeng BF-888s Short-Range Radio', 'Radios',
  'A 16-channel UHF handheld on 420–450 MHz with a 1500mAh lithium-ion battery, hands-free VOX, an emergency alarm and PC programming.',
  'The BF-888s is a conventional short-range two-way radio. It transmits directly to other radios on the same frequency, with no network, SIM card or data connection involved, which makes it the simplest and most self-contained option in the range. It keeps working where there is no mobile signal at all. The trade-off is distance: operating range is limited by transmit power, terrain, obstructions and antenna.',
  jsonb_build_array(
    jsonb_build_object('title', '16 channels, PC programmed', 'detail', 'Sixteen channels, programmed from a PC.'),
    jsonb_build_object('title', 'Hands-free VOX', 'detail', 'VOX function for hands-free operation.'),
    jsonb_build_object('title', 'Emergency alarm', 'detail', 'A built-in emergency alarm.'),
    jsonb_build_object('title', 'Voice prompt and flashlight', 'detail', 'A voice prompt function and a built-in flashlight.'),
    jsonb_build_object('title', 'Battery care', 'detail', 'Intelligent charging, battery save, a low-voltage alert and a time-out timer.')
  ),
  jsonb_build_object(
    'Frequency range', '420–450 MHz (UHF)', 'Channels', '16',
    'Battery', '1500mAh Li-ion', 'Hands-free', 'VOX',
    'Programming', 'PC programming', 'Type', 'Analogue short-range radio'
  ),
  c.id, 3500,
  'The price includes installation by a Nebsam technician.',
  'in_stock', false, 'published',
  'Baofeng BF-888s Radio | 16-Channel UHF Walkie-Talkie',
  'Baofeng BF-888s short-range UHF handheld on 420–450 MHz, with 16 channels, a 1500mAh battery, hands-free VOX and an emergency alarm. KES 3,500 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Baofeng UV-5R — dual-band, 128 channels, KES 5,500 ─────────────────────
insert into products (slug, name, family, summary, body, features, specs, category_id,
  price_kes, installation_terms, availability, featured, status, seo_title, seo_description)
select
  'baofeng-uv-5r', 'Baofeng UV-5R Short-Range Radio', 'Radios',
  'A dual-band handheld with 128 channels, switchable 5W high or 1W low transmit power, a dual-band display with dual standby, and built-in VOX.',
  'The UV-5R is a conventional short-range two-way radio with more channels and more configurability than the entry-level models in the range. It transmits directly to other radios, with no network, SIM card or data connection involved. Typical operating range is 5–10 km on open ground and 3–5 km where there are obstacles. Actual range depends on transmit power, terrain, obstructions and antenna, so treat those figures as typical rather than guaranteed.',
  jsonb_build_array(
    jsonb_build_object('title', 'Dual-band display, dual standby', 'detail', 'A large LCD shows two bands at once, with dual standby.'),
    jsonb_build_object('title', '128 channels', 'detail', 'Room for sites running more than sixteen working channels.'),
    jsonb_build_object('title', 'Switchable transmit power', 'detail', '5W high or 1W low, switchable between close and distant users.'),
    jsonb_build_object('title', 'Built-in VOX', 'detail', 'Hands-free operation.'),
    jsonb_build_object('title', 'Emergency alert and flashlight', 'detail', 'An emergency alert function and an LED flashlight.'),
    jsonb_build_object('title', 'FM broadcast radio', 'detail', 'Receives FM broadcast stations on 65–108 MHz. That is the broadcast receiver, not the two-way radio band.'),
    jsonb_build_object('title', 'Battery and safety', 'detail', 'A battery saver, low-battery alert, time-out timer, keypad lock and monitor channel.')
  ),
  jsonb_build_object(
    'Channels', '128', 'Transmit power', '5W high or 1W low, switchable',
    'Channel step', '2.5 / 5 / 6.25 / 10 / 12.5 / 25 kHz',
    'Operating range (typical)', 'Open ground 5–10 km; with obstacles 3–5 km',
    'Display', 'Large LCD, dual-band display, dual standby',
    'FM broadcast receiver', '65–108 MHz', 'Type', 'Analogue short-range radio'
  ),
  c.id, 5500,
  'The price includes installation by a Nebsam technician.',
  'in_stock', false, 'published',
  'Baofeng UV-5R Dual-Band Radio | 128 Channels, 5W or 1W',
  'Baofeng UV-5R dual-band handheld with 128 channels, switchable 5W or 1W power, dual standby and VOX. Typically 5–10 km on open ground. KES 5,500 excl. VAT.'
from product_categories c where c.slug = 'radios';

-- ── Links: solution and industries (the 0026 / 0029 pattern) ───────────────
insert into product_solutions (product_id, solution_id)
select p.id, s.id
from (values
  ('inrico-dr10-gateway', 'radio-communication'),
  ('baofeng-uv-82',       'radio-communication'),
  ('kenwood-tk-3000',     'radio-communication'),
  ('baofeng-bf-888s',     'radio-communication'),
  ('baofeng-uv-5r',       'radio-communication')
) as v(product_slug, solution_slug)
join products  p on p.slug = v.product_slug and p.status = 'published'
join solutions s on s.slug = v.solution_slug and s.status = 'published'
on conflict do nothing;

insert into product_industries (product_id, industry_id)
select p.id, i.id
from (values
  -- The DR10 write-up names these four as its cross-links.
  ('inrico-dr10-gateway', 'security-companies'),
  ('inrico-dr10-gateway', 'logistics-and-transport'),
  ('inrico-dr10-gateway', 'construction-and-heavy-equipment'),
  ('inrico-dr10-gateway', 'government-and-institutions'),
  -- The short-range write-ups name security and construction.
  ('baofeng-uv-82',       'security-companies'),
  ('baofeng-uv-82',       'construction-and-heavy-equipment'),
  ('kenwood-tk-3000',     'security-companies'),
  ('baofeng-bf-888s',     'security-companies'),
  ('baofeng-bf-888s',     'construction-and-heavy-equipment'),
  ('baofeng-uv-5r',       'security-companies'),
  ('baofeng-uv-5r',       'construction-and-heavy-equipment')
) as v(product_slug, industry_slug)
join products   p on p.slug = v.product_slug  and p.status = 'published'
join industries i on i.slug = v.industry_slug and i.status = 'published'
on conflict do nothing;

commit;
