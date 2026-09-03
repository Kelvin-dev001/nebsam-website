-- 0017  Solution content: vehicle-tracking.
--
-- DERIVED, not migrated. There is no vehicle-tracking write-up in
-- content-source/01-solutions/ — the Sprint 5 criterion requires this page to
-- be built out of the PRODUCT write-ups, with every fact traceable. The facts
-- below come from content-source/02-products/trackers/standard-tracker and
-- anti-jammer-tracker.
--
-- Because it is derived, the discipline is stricter rather than looser: a
-- capability appears here only if a tracker write-up states it. Nothing is
-- generalised upward from one device to "our trackers", and nothing is added
-- because a tracking page would normally mention it.
--
-- HEDGES PRESERVED: "Where configured and appropriate" on immobilisation, and
-- "according to the configured security logic" on the anti-jamming behaviour —
-- the latter is the sentence the whole homepage is built on, and it means the
-- response is set per installation rather than being a property of the device.
--
-- NOT CLAIMED: no accuracy figure in metres, no update interval in seconds, no
-- number of vehicles tracked, no uptime. None is stated in the sources.

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'vehicle-tracking',
  'Vehicle tracking',
  'Live GPS tracking, route playback, trip reports and geofence alerts for one vehicle or a fleet — with remote immobilisation where it is configured, and anti-jamming options where the risk warrants them.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'A GPS tracking unit fitted to the vehicle and a platform to watch it from. You see where the vehicle is now, where it has been, when it entered or left the places that matter, and — where it is configured — you can immobilise it remotely.',
      'The same system covers a single private car and a commercial fleet. What changes between them is not the hardware so much as what you do with it: an owner wants to know where the car is, and a fleet manager wants to know how the vehicles are being used.'
    ),

    'problem', jsonb_build_array(
      'Without tracking, a vehicle out of sight is a vehicle you have no information about. You find out where it went from the person who drove it, and you find out it was taken when somebody notices it is missing.',
      'For a business the cost is quieter than theft and larger over a year: unrecorded private use, routes that are longer than they need to be, time at a stop nobody can account for, and disputes about deliveries that have no evidence on either side.',
      'The specific Kenyan problem is jamming. A GSM jammer is cheap, and it defeats an ordinary tracker completely by cutting the uplink — the unit simply stops reporting, which on most platforms looks identical to a flat battery or a coverage gap. A tracker that cannot tell those apart offers no protection at the exact moment protection matters.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'Private vehicle owners',
        'detail', 'Knowing where the vehicle is, and having a way to respond if it moves when it should not.'),
      jsonb_build_object('label', 'Commercial fleets',
        'detail', 'Utilisation, routes, stops and driver activity turned into trip reports, so decisions about the fleet rest on records rather than recollection.'),
      jsonb_build_object('label', 'Logistics and distribution',
        'detail', 'Vehicles operating across Kenya, East Africa and international routes, where a customer asking "where is my delivery" deserves an answer that does not require phoning a driver.'),
      jsonb_build_object('label', 'PSV and matatu operators',
        'detail', 'Vehicles that carry takings as well as passengers, where route adherence and stop patterns are operational facts worth having.'),
      jsonb_build_object('label', 'Vehicles at elevated theft risk',
        'detail', 'Where the threat is organised rather than opportunistic, an anti-jamming tracker treats the loss of signal as an event in itself rather than as silence.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Fitting',
        'detail', 'The unit is installed and concealed by our technicians. Concealment is part of the work: a tracker that can be found in thirty seconds is a tracker that will be removed in a minute.'),
      jsonb_build_object('title', 'Reporting',
        'detail', 'The unit reports position and status over the mobile network, subject to network and GPS availability, and the platform records it.'),
      jsonb_build_object('title', 'Watching',
        'detail', 'Live location through a smartphone or the tracking platform, whether the vehicle is in town, upcountry or on an international route.'),
      jsonb_build_object('title', 'Alerting',
        'detail', 'Geofences around the places that matter raise an alert when the vehicle enters or leaves them, so you are told rather than having to look.'),
      jsonb_build_object('title', 'Acting',
        'detail', 'Where configured and appropriate, the engine can be immobilised remotely and restored when authorised. On an anti-jamming unit, loss of the uplink can itself trigger the response, according to the configured security logic.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Visibility',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Live GPS tracking',
            'detail', 'The vehicle''s current location through a smartphone or the tracking platform, locally or on cross-border routes.'),
          jsonb_build_object('title', 'Route playback',
            'detail', 'Historical routes replayed, for reviewing completed trips, verifying the route taken and investigating movement after the fact.'),
          jsonb_build_object('title', 'Trip reports',
            'detail', 'Journey activity, vehicle utilisation, driver movements and operating patterns — movement turned into something a manager can act on.')
        )),
      jsonb_build_object('group', 'Control',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Geofence alerts',
            'detail', 'Boundaries around offices, warehouses, depots, customer sites, construction sites and restricted areas, with alerts on entry and exit.'),
          jsonb_build_object('title', 'Remote immobilisation and restore',
            'detail', 'Where configured and appropriate, the engine can be immobilised remotely and restored when authorised. This is set up per installation rather than switched on by default.')
        )),
      jsonb_build_object('group', 'Against jamming',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Anti-jamming response',
            'detail', 'An anti-jamming tracker treats the loss of the uplink as an event rather than a gap — alerting you and immobilising the vehicle according to the configured security logic, instead of going quiet like an ordinary unit.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'Fitting is done by Nebsam technicians, at a branch or on site where that is more practical. Which unit suits a vehicle depends on what the vehicle supports and what you are protecting against, so the recommendation follows the survey rather than the enquiry.',
      'Support covers the unit, the platform and the people using it — including re-installation when a vehicle is sold or repaired, and showing new staff how the platform works. A system nobody opens is a system nobody benefits from.',
      'Available from the branches in Nairobi, Mombasa and Nakuru, and through agents and technicians elsewhere in the country.'
    )
  ),
  1,
  'published',
  now(),
  'Vehicle Tracking in Kenya | GPS Fleet Tracking',
  'Live GPS tracking, route playback, trip reports and geofence alerts for cars and fleets in Kenya. Remote immobilisation where configured, with anti-jamming options.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('What is a GSM jammer, and why does it matter?',
   'A GSM jammer blocks the mobile signal a tracker uses to report, so the unit goes quiet. On most platforms that silence looks the same as a flat battery or a coverage gap, which is exactly why jamming works. An anti-jamming tracker treats the loss of the uplink as an event in its own right — alerting you and immobilising the vehicle according to the configured security logic.',
   1),
  ('Can I immobilise my vehicle remotely?',
   'Where configured and appropriate, yes — the engine can be immobilised remotely and restored when authorised. It is set up per installation rather than enabled by default, because immobilising a moving vehicle is not something to make easy by accident.',
   2),
  ('Does tracking work outside Kenya?',
   'Local and international tracking options are available, and vehicles can be monitored on cross-border routes. As with any connected device, reporting depends on network coverage along the route, subject to network and GPS availability.',
   3),
  ('Can I see where the vehicle has been, not just where it is?',
   'Yes. Route playback replays previous journeys and trip reports summarise them, so you can verify a route taken, review a completed trip or investigate movement after the event.',
   4),
  ('Will the driver know the tracker is fitted?',
   'That is your decision and it is worth making deliberately. Concealment is part of the installation, but monitoring staff carries obligations under the Data Protection Act 2019, and fleets generally get better results from telling drivers than from not.',
   5),
  ('What happens if the vehicle is in an area with no network?',
   'The unit cannot report while it has no service. Position data resumes when the vehicle is back in coverage — but visibility while it is out of coverage is genuinely unavailable, and any tracking supplier who tells you otherwise is describing a product that does not exist.',
   6),
  ('Do I need a tracker on every vehicle in the fleet?',
   'Not necessarily, but partial coverage gives partial answers. Fleets usually start with the vehicles carrying the most value or the most risk, then extend once the reports prove useful.',
   7),
  ('Which tracker is right for my vehicle?',
   'It depends on what the vehicle supports and what you are protecting against. A standard unit covers visibility and control; an anti-jamming unit is for where the threat is organised. We establish which during the survey rather than quoting before seeing the vehicle.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'vehicle-tracking';
