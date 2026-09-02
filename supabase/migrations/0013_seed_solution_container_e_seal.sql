-- 0013  Solution content: container-e-seal.
--
-- Rewritten out of content-source/01-solutions/container-e-seal/write-up.md,
-- never pasted from it. The source is deck copy — ALL-CAPS headings, one-line
-- slogans, the same capability restated three times — and it reads badly as a
-- page. Same facts, better structure, tighter language.
--
-- THE NAME CARRIES "Electronic Cargo Tracking System (ECTS)" ON PURPOSE.
-- `/services/electronic-cargo-tracking-system` was a live route on the old site
-- that appeared in no URL inventory (register V34a) and 301s here. Someone who
-- searched for ECTS, or followed an old link, has to land on a page that
-- visibly answers to that name — the H1 renders this column, so the phrase has
-- to live here rather than only in the meta title. "Cargo and container
-- security" opens the summary so the plainer description is not lost.
--
-- HEDGES PRESERVED WORD FOR WORD, per the content skill §1:
--   "according to the configured security permissions"
--   "designed to detect"
--   "selected events" / "configured security events"
-- These are accuracy. The source says the camera records selected events, not
-- that it films the journey; it says the system is designed to detect tampering,
-- not that it detects all tampering. Both distinctions survive here.
--
-- NOTHING INVENTED. No battery life, no lock rating, no coverage percentage, no
-- detection rate, no price, no response time, no client names. The source
-- states none of them and neither does this.
--
-- Status is 'published': the write-up carries zero [[NEEDS_VERIFICATION]]
-- tokens, so nothing on this page is waiting on an answer.

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'container-e-seal',
  'Electronic Cargo Tracking System (ECTS)',
  'Cargo and container security that adds electronic access control, GPS tracking, tamper detection and event recording to a container, so its location and security status are visible for the whole journey rather than only on arrival.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'An electronic seal fitted to a shipping container that locks it, tracks it, and reports on it. It combines an electronic lock, GPS tracking, door and tamper detection, geofencing and an inbuilt camera into one unit, so the container''s location and security status can be monitored throughout the transportation journey.',
      'A conventional seal tells you one thing, once: whether the container was opened before it reached you. It cannot tell you when, or where, or by whom, and it cannot tell you anything at all while the cargo is still moving. An electronic seal replaces that single after-the-fact answer with a continuous record.'
    ),

    'problem', jsonb_build_array(
      'Cargo moving between Mombasa, an ICD and an inland customer passes through several hands and several stops, and a physical seal is checked at the end of that chain rather than during it. If the container was opened at an unscheduled stop outside Mariakani, the seal will show it — a day later, at the destination, with no record of where or when it happened.',
      'That gap has two costs. The first is the loss itself. The second is that nobody can say where the loss occurred, which makes it impossible to hold anyone accountable and difficult to make a claim. Pilferage in particular is easy to deny when the only evidence is a broken seal and a shortfall.',
      'The point of an electronic seal is to move the moment of discovery from the destination to the event. An alert while the door is open is actionable; the same information the following morning is a report.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'Logistics and transport companies',
        'detail', 'Containers moving locally and across borders, where the operator is accountable for cargo they cannot see. Location, movement and security events stay visible for the whole journey rather than only at handover.'),
      jsonb_build_object('label', 'Importers, exporters and freight forwarders',
        'detail', 'Containers moving through international shipping and inland transport. You can see when a container moves, where it travels, and whether an unauthorised access event occurred along the way.'),
      jsonb_build_object('label', 'Manufacturers and distributors',
        'detail', 'Goods from the moment they leave the warehouse until they reach the customer, with a record that supports accountability if a shipment arrives short.'),
      jsonb_build_object('label', 'High-value cargo',
        'detail', 'Electronics, pharmaceuticals, industrial equipment and sensitive commercial goods, where electronic access control matters as much as knowing the location.'),
      jsonb_build_object('label', 'Ports, ICDs and dry ports',
        'detail', 'Container security during transit, handling and storage, including identifying unexpected container activity while it sits in a yard.'),
      jsonb_build_object('label', 'Government and humanitarian consignments',
        'detail', 'Sensitive or critical cargo moving through multiple locations and multiple custodians, where accountability has to be demonstrable rather than assumed.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Secure',
        'detail', 'The electronic seal is fitted to the container and the cargo is secured. It replaces the conventional seal rather than sitting alongside it.'),
      jsonb_build_object('title', 'Activate',
        'detail', 'The unit is configured with the security and monitoring settings for that consignment — who may unlock it, which zones matter, which events should raise an alert.'),
      jsonb_build_object('title', 'Track',
        'detail', 'GPS provides visibility of the container''s location and movement, whether it is at the warehouse, at the port, in transit, at an ICD, at a customer site or crossing a border.'),
      jsonb_build_object('title', 'Monitor',
        'detail', 'The system monitors lock status, door activity, tampering and the configured security events, continuously rather than at checkpoints.'),
      jsonb_build_object('title', 'Alert',
        'detail', 'Unauthorised access or a selected security event triggers a notification, so the people who can act on it hear about it while it is happening.'),
      jsonb_build_object('title', 'Respond',
        'detail', 'Authorised personnel can investigate the event, keep watching the container, and take whatever action the situation calls for.'),
      jsonb_build_object('title', 'Verify',
        'detail', 'Movement history, the security event log and any available video support post-incident investigation and cargo accountability after delivery.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Access control',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Electronic container lock',
            'detail', 'An electronic lock in place of a conventional seal, giving digital visibility of the container''s security status rather than a seal number that has to be read in person.'),
          jsonb_build_object('title', 'Remote lock and unlock',
            'detail', 'Authorised users can control the locking system remotely, according to the configured security permissions. This reduces reliance on physical keys travelling with the container.')
        )),
      jsonb_build_object('group', 'Visibility',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Real-time GPS tracking',
            'detail', 'The container''s position through the journey, so a status update does not depend on reaching a driver by phone.'),
          jsonb_build_object('title', 'Geofence monitoring',
            'detail', 'Virtual boundaries around ports, warehouses, ICDs, distribution centres, customer premises, approved routes and restricted areas, with alerts when the container enters or leaves a defined zone.'),
          jsonb_build_object('title', 'Route playback and movement reports',
            'detail', 'The journey reconstructed after the fact: where the container travelled, when it moved, where it stopped, whether it left the approved route, and where a security event occurred.'),
          jsonb_build_object('title', 'Local and cross-border monitoring',
            'detail', 'Designed for cargo moving locally and across international borders, so visibility does not end at a frontier.')
        )),
      jsonb_build_object('group', 'Security events',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Unauthorised door opening alerts',
            'detail', 'An alert when the container door is opened without authorisation, so a security or fleet team can respond quickly rather than discovering it at the destination.'),
          jsonb_build_object('title', 'Tamper detection',
            'detail', 'The system is designed to detect tampering attempts and generate immediate notifications when suspicious activity involving the seal or container security system is detected.'),
          jsonb_build_object('title', 'Inbuilt camera for special events',
            'detail', 'A camera designed to record selected events, which can provide useful visual information when an important security event occurs. It is an event camera, not a continuous recorder.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'Fitting and configuration are done by Nebsam technicians. The configuration matters as much as the hardware: which users may unlock the container, which zones should raise an alert and which events count as security events are all set per operation, and getting them wrong produces either silence or an alert nobody reads.',
      'Support covers the units, the platform and the people using them. Cargo operations change — new routes, new customers, new staff — and the geofences and permissions have to change with them.',
      'Installation and support are available from the branches in Nairobi, Mombasa and Nakuru, and through agents and technicians elsewhere in the country.'
    )
  ),
  8,
  'published',
  now(),
  'Electronic Cargo Tracking System (ECTS) in Kenya | Nebsam',
  'Container e-seal with electronic locking, GPS tracking, tamper detection and door alerts. Cargo security for local and cross-border transport, installed across Kenya.'
);

-- FAQs — section 9. Answer-shaped: the first sentence answers the question, so
-- an assistant quoting the page lifts something true and complete.
insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('What is an electronic cargo tracking system?',
   'It is a container seal that locks, tracks and reports. In place of a conventional seal that can only be inspected on arrival, an electronic seal combines a lock, GPS tracking, door and tamper detection and an inbuilt camera, so the container''s location and security status are visible throughout the journey.',
   1),
  ('How is this different from a conventional container seal?',
   'A conventional seal tells you whether the container was opened, once, at the destination. An electronic seal tells you when and where, while it is happening. The physical security is comparable; the difference is visibility and the record that visibility leaves behind.',
   2),
  ('Can the container be unlocked remotely?',
   'Yes. Authorised users can control the electronic locking system remotely, according to the configured security permissions. Who may unlock a given container is part of the configuration, not a property of the device.',
   3),
  ('Does it work across borders?',
   'It is designed for cargo moving locally and across international borders, so container visibility continues through regional and cross-border transport. As with any connected device, reporting depends on network coverage along the route.',
   4),
  ('What happens if someone opens the container without authorisation?',
   'The system generates an alert when the door is opened without authorisation, so a security or fleet team can investigate while the event is current. The event is also recorded, so the location and time remain available afterwards for investigation and accountability.',
   5),
  ('Does the camera record the whole journey?',
   'No. The inbuilt camera is designed to record selected events rather than continuous footage, and it provides visual information when an important security event occurs. It is there to document an incident, not to film the trip.',
   6),
  ('Can we see where the container has been?',
   'Yes. Route playback and movement reports reconstruct the journey — where the container travelled, when it moved, where it stopped, whether it left the approved route and where a security event occurred.',
   7),
  ('Who is it suitable for?',
   'Logistics and transport operators, importers, exporters and freight forwarders, manufacturers and distributors, ports, ICDs and dry ports, and anyone moving high-value or sensitive cargo where knowing the container was opened matters as much as knowing where it is.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'container-e-seal';
