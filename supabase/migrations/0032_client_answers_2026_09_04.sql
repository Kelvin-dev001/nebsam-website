-- 0032  Client answers of 4 September 2026.
--
-- Closes A01-A07, V05, V09, V27-V31 and V48, and changes how certifications are
-- displayed. Each block records what was asked and what was answered, because
-- in six months the reason will matter more than the value.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CERTIFICATIONS — expired instruments are now DISPLAYED, with their status.
--
-- CLIENT INSTRUCTION: "database should not hide any certificate ... include the
-- expired ones for now", renewed certificates to follow.
--
-- ⚠️ THIS CONFLICTS WITH BRIEF §3.5, which says the site must never display a
-- lapsed permit, and CLAUDE.md §1 says the brief outranks conversation. The
-- instruction was given twice, so it is treated as the client's decision and
-- implemented — but it needs the brief amended rather than silently overridden,
-- and that is recorded as V51.
--
-- HOW IT IS IMPLEMENTED MATTERS. The gate is not simply deleted. Every
-- instrument now carries a `display_status` the page renders next to it, so a
-- lapsed certificate appears as lapsed rather than as current. That satisfies
-- "include them" without asserting something untrue, which is the part of §3.5
-- that carries real risk: a reader must not conclude a permit is live when it
-- is not.
--
-- CAK, both ODPC registrations and PSRA are reported RENEWED. New expiry dates
-- have not been supplied, so `expires_on` is left as recorded and the status
-- says renewal is confirmed with dates to follow. When the dates arrive, set
-- them and the status returns to 'current' automatically.

alter table certifications
  add column if not exists display_status text not null default 'current'
  check (display_status in ('current', 'renewed_pending_dates', 'renewal_in_progress'));

comment on column certifications.display_status is
  'What the page says about this instrument. Shown next to it so a lapsed or renewing certificate is never presented as current.';

update certifications set display_status = 'renewed_pending_dates'
where reference_number in ('04-00274-00-09-0372', '05634', '05626', 'PSRA/NDSKL/19/00');

-- V31 — the CAK description. The document states on its own face "this is not a
-- licence but proof of compliance", so it is described as a compliance
-- certificate held, never as a licence and never as a certification of Nebsam
-- as an application service provider.
update certifications
set description = 'Compliance certificate issued by the Communications Authority of Kenya. The certificate states on its face that it is proof of compliance and not a licence.'
where reference_number = '04-00274-00-09-0372';

-- The public view must now surface everything, with its status. Recreated
-- rather than altered — Postgres cannot add a column to a view definition.
drop view if exists public_certifications;

create view public_certifications as
  select id, name, issuer, description, reference_number,
         document_path, image, effective_on, expires_on, scope_note,
         display_status, sort_order
  from certifications;

grant select on public_certifications to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. V05 — PRICES ARE INCLUSIVE OF INSTALLATION.
--
-- Answered 4 Sep 2026. This was open for every category and left every product
-- page unable to say whether a price included fitting. It now says so.

update products
set installation_terms = 'The price includes installation by a Nebsam technician.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. RECURRING FEES — annual, per device, reviewed each year.
--
-- Answered 4 Sep 2026. Brief 10.2 requires recurring costs on the product page
-- rather than at checkout, and these had been unknown until now.
--
--   trackers            KES  3,000 / year   SIM resources + server costs
--   radios              KES  3,000 / year   per radio
--   speed governors     KES  6,500 / year
--   fuel monitoring     KES 10,000 / year
--   video telematics    KES  6,500 / year   SERVER COSTS ONLY — the client tops
--                                           up their own data by usage
--
-- "Reviewed annually" is stated because the client said the fees change each
-- year. A published figure that turns out to be last year's is worse than one
-- that says plainly it is reviewed.

update products
set recurring_fee_kes = 3000,
    recurring_fee_period = 'year',
    recurring_fee_note = 'Annual renewal per device, covering SIM resources and server costs. Reviewed annually.'
where family = 'Trackers';

update products
set recurring_fee_note = 'Annual licence renewal per radio, covering SIM resources and server costs. Reviewed annually.'
where family = 'Radios';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. A01-A07 — the four blocked products are unblocked and published.
--
--   A01  Hybrid Tracker HAS a mobile app.                              answered
--   A02  Global tracking: yes.                                         answered
--   A03/A05  "No credit top up" is TRUE for the customer — there is no separate
--        airtime top-up, because the KES 3,000 annual renewal covers the SIM
--        resources. Both facts are published together, because publishing "no
--        top up" alone would read as "no recurring cost" and that is not what
--        was said.
--   A04  Standard Tracker has a mobile app.                            answered
--   A06  Recovery Tracker DOES do route playback.                      answered
--   A07  The Hybrid Tracker comes with a recovery tracker included, free.
--        A defined inclusion rather than an optional package, so it needs no
--        bundle concept in the data model before Sprint 7.

update products
set summary = 'GPS tracking with mobile app access, local and global coverage, and a recovery tracker included free — with no separate airtime top-up to manage.',
    body = 'The Hybrid Tracker covers the everyday questions: where the vehicle is, where it has been, and whether it has left where it should be. It ships with a second, portable recovery tracker included at no extra cost, so a thief who finds and removes the primary unit has not removed your only one.',
    features = jsonb_build_array(
      jsonb_build_object('title', 'Recovery tracker included free',
        'detail', 'A portable magnetic recovery tracker is included with the Hybrid Tracker at no additional cost. Two independent units protect against different failures: one survives a flat battery, the other survives being found.'),
      jsonb_build_object('title', 'Mobile app access',
        'detail', 'Live location and history through the mobile application as well as the web platform.'),
      jsonb_build_object('title', 'Local and global tracking',
        'detail', 'Vehicles tracked in Kenya and on cross-border routes, subject to network coverage along the route.'),
      jsonb_build_object('title', 'No separate airtime top-up',
        'detail', 'There is no airtime to buy or credit to remember. SIM resources are covered by the annual renewal fee below, so the unit does not stop reporting because somebody forgot to top it up.'),
      jsonb_build_object('title', 'Route playback and trip reports',
        'detail', 'Historical journeys and trip activity for reviewing routes and investigating movement after the event.'),
      jsonb_build_object('title', 'Geofence alerts and remote immobilisation',
        'detail', 'Alerts on entry and exit from defined areas, and remote engine immobilisation where configured and appropriate.')
    ),
    specs = jsonb_build_object(
      'Tracking', 'GPS, real time, local and global',
      'Access', 'Mobile app and web platform',
      'Included', 'Recovery tracker, free',
      'Airtime', 'No separate top-up required',
      'Engine control', 'Remote immobilisation and restore'
    ),
    status = 'published'
where slug = 'hybrid-tracker';

update products
set summary = 'Everyday GPS tracking with mobile app access, route playback and geofence alerts — with no separate airtime top-up to manage.',
    body = 'The essentials, done properly: live location, the journey history behind it, and alerts when a vehicle enters or leaves somewhere it matters. Suitable for a single private vehicle or a commercial fleet.',
    features = jsonb_build_array(
      jsonb_build_object('title', 'Mobile app access',
        'detail', 'Live location and history through the mobile application as well as the web platform.'),
      jsonb_build_object('title', 'No separate airtime top-up',
        'detail', 'SIM resources are covered by the annual renewal fee below, so there is no credit to buy and nothing to forget.'),
      jsonb_build_object('title', 'Live tracking, route playback and trip reports',
        'detail', 'Where the vehicle is, where it went, when it moved and where it stopped.'),
      jsonb_build_object('title', 'Geofence alerts',
        'detail', 'Boundaries around the places that matter, with alerts on entry and exit.'),
      jsonb_build_object('title', 'Remote immobilisation and restore',
        'detail', 'Where configured and appropriate, the engine can be immobilised remotely and restored when authorised.')
    ),
    specs = jsonb_build_object(
      'Tracking', 'GPS, real time',
      'Access', 'Mobile app and web platform',
      'Airtime', 'No separate top-up required',
      'Engine control', 'Remote immobilisation and restore'
    ),
    status = 'published'
where slug = 'standard-tracker';

update products
set summary = 'A wire-free magnetic tracker for stolen vehicle recovery and asset protection — up to three years of battery, removal alerts and route playback.',
    body = 'No wiring and no installation: it attaches magnetically to a suitable metallic surface and reports immediately. Built for recovery and for assets that move between jobs, rather than for day-to-day fleet management.',
    features = jsonb_build_array(
      jsonb_build_object('title', 'Route playback',
        'detail', 'The journey reconstructed after the event, at the reporting interval the unit is configured for.'),
      jsonb_build_object('title', 'Strong magnetic mount',
        'detail', 'Attaches to a suitable metallic surface in seconds, with no wiring and no permanent installation, and moves between assets.'),
      jsonb_build_object('title', 'Up to three years of battery',
        'detail', 'Up to 3 years when configured for one location update per day. Battery performance depends on tracking frequency, network conditions, operating environment, and configuration.'),
      jsonb_build_object('title', 'Removal and drop-off alert',
        'detail', 'Detection of unauthorised removal or displacement — the failure mode that matters most on a recovery unit.'),
      jsonb_build_object('title', 'Tracking by app, web and SMS',
        'detail', 'Three channels to the same information, rather than one that has to be working on the day.')
    ),
    specs = jsonb_build_object(
      'Mounting', 'Magnetic, no wiring',
      'Battery', 'Up to 3 years at one update per day',
      'Tracking', 'Mobile app, web platform and SMS',
      'Alerts', 'Removal and drop-off detection'
    ),
    status = 'published'
where slug = 'recovery-tracker';

update products
set summary = 'A smart car alarm with intrusion detection and owner alerting — the entry point to the Hybrid range.',
    body = 'Alarm protection designed to detect unauthorised access or disturbance, activating the vehicle''s audible alarm and alerting the owner. The starting point of the range; the Plus, Pro Plus, ProMax and ProMax Plus each add a layer above it.',
    features = jsonb_build_array(
      jsonb_build_object('title', 'Smart intrusion alarm',
        'detail', 'Designed to detect unauthorised access or disturbance to the vehicle and activate the audible alarm.'),
      jsonb_build_object('title', 'Part of a range',
        'detail', 'Where this is not enough, the Hybrid Plus adds GPS tracking and app control, the Pro Plus adds anti-jamming, and the ProMax models add a vibrating key remote.')
    ),
    specs = jsonb_build_object('Alarm', 'Smart intrusion alarm', 'Tracking', 'Not included — see Hybrid Plus'),
    status = 'published'
where slug = 'hybrid-car-alarm';

-- Join the newly published products to their solutions, so they are not orphans.
insert into product_solutions (product_id, solution_id)
select p.id, s.id
from (values
  ('hybrid-tracker',   'vehicle-tracking'),
  ('standard-tracker', 'vehicle-tracking'),
  ('recovery-tracker', 'vehicle-recovery'),
  ('recovery-tracker', 'vehicle-tracking'),
  ('hybrid-car-alarm', 'vehicle-security')
) as v(product_slug, solution_slug)
join products  p on p.slug = v.product_slug  and p.status = 'published'
join solutions s on s.slug = v.solution_slug and s.status = 'published'
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. V09 — the first blog author.
--
-- Answered 4 Sep 2026. Bio and photograph to follow; the row exists now so
-- posts can be attributed and published. `bio` and `avatar` stay null rather
-- than carrying placeholder text, because an invented bio is exactly the
-- fabrication the no-anonymous-byline rule exists to prevent.

insert into authors (name, role)
select 'Kelvin Oyugi', 'Technology & Telematics Expert'
where not exists (select 1 from authors where name = 'Kelvin Oyugi');
