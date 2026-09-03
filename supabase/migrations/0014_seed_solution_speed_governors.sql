-- 0014  Solution content: speed-governors.
--
-- Rewritten out of content-source/01-solutions/speed-governors/write-up.md.
--
-- TWO CLAIMS IN THE SOURCE ARE DELIBERATELY NOT PUBLISHED.
--
-- 1. KEBS. The source opens "A KEBS and NTSA-compliant speed management
--    solution" and later carries a "KEBS COMPLIANCE" block. Nebsam's KEBS
--    instrument is a Permit to Use the Standardization Mark, and it is
--    PRODUCT-SCOPED to vehicle cameras for video telematics under the STREAMAX
--    brand (content-source/05-certifications/README.md §1). It does not cover
--    speed governors. Repeating the source here would extend a real permit to
--    a product it does not cover, which is the exact accuracy failure
--    CLAUDE.md §5 exists to prevent. Omitted entirely — not hedged, not
--    softened.
--
-- 2. IRMS. Register V02 blocks the speed governor page on IRMS wording. The
--    write-up turns out not to mention IRMS at all, so there is nothing to
--    omit and nothing is invented to fill the gap.
--
-- NTSA IS DIFFERENT, and is published. The prohibition in CLAUDE.md §5 is
-- specific: traffic sign recognition "transmits data directly to NTSA servers"
-- on the VIDEO TELEMATICS page (register V01). Transmission to the NTSA portal
-- is the defining regulatory function of a Kenyan speed limiter, the source
-- states it, and the source's own hedges are preserved word for word:
-- "designed to transmit", "supports real-time transmission of relevant vehicle
-- information".
--
-- OTHER HEDGES PRESERVED: "intended to help prevent unauthorized interference",
-- "configured speed violations", "up to one year", "can be retained".
--
-- Figures used are the source's own: 80 km/h, one year of records. No accident
-- reduction percentage, no fine amount, no installation time — the source
-- states none of them.

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'speed-governors',
  'Speed limiters and NTSA compliance',
  'Speed limiters for PSVs, school buses, trucks and commercial fleets — limiting the vehicle to 80 km/h, transmitting to the NTSA portal, and alerting you to violations and certificate expiry before they become a problem.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'An electronic speed limiter that caps the vehicle at 80 km/h and connects that limit to a monitoring system. It combines speed limitation, GPS tracking, transmission to the NTSA portal, SMS alerts for violations and certificate expiry, and up to a year of vehicle records.',
      'A speed governor is a compliance requirement before it is anything else. What separates one from another is what happens around the limiter: whether you can see where the vehicle is, whether you hear about a violation the day it happens, and whether you find out the certificate has expired before an inspection does.'
    ),

    'problem', jsonb_build_array(
      'A speed limiter that only limits speed answers one question and leaves the operator with several. Is the vehicle operating within the permitted speed? Where is it? Are violations happening? Is the governor still functioning? Is the certificate still valid? Can the records be produced when somebody asks for them?',
      'For a PSV operator those questions are not academic. An expired speed-governor certificate takes a vehicle off the road, and finding out at a roadside check is the most expensive way to learn it. A violation nobody hears about until the monthly report is a driving pattern that has already been established for a month.',
      'Excessive speed also raises the severity of a collision, not only its likelihood — which is why the requirement exists in the first place, and why enforcement of it inside the fleet matters more than the certificate on the windscreen.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'PSVs — buses and matatus',
        'detail', 'Passenger transport, where speed management is both a safety measure and a regulatory obligation. Limit the vehicle, monitor location, receive violation alerts and keep the records that support NTSA compliance.'),
      jsonb_build_object('label', 'School transport',
        'detail', 'School buses, where driver behaviour is scrutinised more closely than in any other fleet and controlled speed is the baseline expectation of every parent.'),
      jsonb_build_object('label', 'Trucks and logistics operators',
        'detail', 'Long-distance vehicles operating hundreds of kilometres from the fleet office, where GPS and speed data are the only realistic visibility of how a vehicle is actually being driven.'),
      jsonb_build_object('label', 'Commercial and corporate fleets',
        'detail', 'Enforcing one speed policy consistently across every vehicle, rather than depending on which driver is in which vehicle on a given day.'),
      jsonb_build_object('label', 'Government fleets',
        'detail', 'Speed management combined with GPS monitoring and historical records, where vehicle accountability has to be demonstrable.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Speed control',
        'detail', 'The governor manages the vehicle''s maximum operating speed, limiting it to 80 km/h.'),
      jsonb_build_object('title', 'GPS monitoring',
        'detail', 'The system records vehicle location and movement alongside the speed data, so the two can be read together.'),
      jsonb_build_object('title', 'Data transmission',
        'detail', 'Relevant vehicle information is transmitted to the monitoring systems, including the NTSA portal.'),
      jsonb_build_object('title', 'Monitoring',
        'detail', 'Fleet operators access vehicle information through the web platform or the mobile application, without having to be at the yard.'),
      jsonb_build_object('title', 'Alerts',
        'detail', 'SMS notifications are generated for configured speed violations and for certificate expiry.'),
      jsonb_build_object('title', 'Historical records',
        'detail', 'Vehicle information can be retained for up to one year, so a question about last quarter still has an answer.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Speed management',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Limiting to 80 km/h',
            'detail', 'The vehicle''s maximum speed is held at 80 km/h, which is what makes the fleet policy real rather than an instruction drivers are asked to remember.'),
          jsonb_build_object('title', 'Tamper-resistant design',
            'detail', 'The governor incorporates a tamper-resistant design intended to help prevent unauthorized interference with the speed-management system.')
        )),
      jsonb_build_object('group', 'Compliance',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'NTSA portal transmission',
            'detail', 'The system is designed to transmit relevant vehicle data to the NTSA portal in real time, supporting regulatory monitoring and the digital speed-governor connectivity operators are required to maintain.'),
          jsonb_build_object('title', 'Certificate expiry alerts',
            'detail', 'SMS notifications relating to speed-governor certificate expiry, so a renewal is handled ahead of the deadline instead of at a roadside check.'),
          jsonb_build_object('title', 'Up to one year of vehicle records',
            'detail', 'Records can be retained for up to a year and used to investigate speed violations, vehicle movements, driving patterns and compliance questions after the fact.')
        )),
      jsonb_build_object('group', 'Visibility',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'GPS tracking',
            'detail', 'Vehicle location through the monitoring platform, so speed information and location information can be read together rather than separately.'),
          jsonb_build_object('title', 'Mobile app and web monitoring',
            'detail', 'Supported vehicle information through both the mobile application and the web platform.'),
          jsonb_build_object('title', 'SMS violation alerts',
            'detail', 'Notifications when configured speed violations are detected, so corrective action happens while the trip is still current.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'Fitting and certification are done by Nebsam technicians at the branches in Nairobi, Mombasa and Nakuru, and through agents and technicians elsewhere in the country.',
      'Support covers the unit, the monitoring platform and the certificate cycle. The expiry alerts matter most for operators running several vehicles, where renewal dates fall on different months and the one that gets missed is always the vehicle nobody was thinking about.'
    )
  ),
  7,
  'published',
  now(),
  'Speed Limiters & NTSA Compliance in Kenya',
  'Speed governors for PSVs, matatus, school buses and trucks. Limits to 80 km/h, transmits to the NTSA portal, with SMS violation and certificate expiry alerts.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('What speed does the governor limit a vehicle to?',
   'It limits the vehicle''s maximum speed to 80 km/h. That applies to the vehicle as a whole rather than to a particular road, so the limiter is a ceiling and the driver remains responsible for observing lower limits where they apply.',
   1),
  ('Does it transmit to NTSA?',
   'Yes. The system is designed to transmit relevant vehicle data to the NTSA portal in real time, which is the digital speed-governor connectivity commercial operators are required to maintain.',
   2),
  ('What happens when a driver speeds?',
   'An SMS notification is generated when a configured speed violation is detected, so the operator hears about it while the trip is current rather than in a monthly summary. The violation is also retained in the vehicle''s records.',
   3),
  ('Will I be warned before the certificate expires?',
   'Yes. The system provides SMS notifications relating to speed-governor certificate expiry. For an operator running several vehicles with renewal dates in different months, that reminder is usually the point of the whole feature.',
   4),
  ('How long are vehicle records kept?',
   'Records can be retained for up to one year, and can be used to investigate speed violations, vehicle movements, driving patterns and compliance questions after the event.',
   5),
  ('Can the governor be tampered with?',
   'It incorporates a tamper-resistant design intended to help prevent unauthorized interference with the speed-management system. No design makes interference impossible, which is why the monitoring side matters: a governor that stops reporting is itself information.',
   6),
  ('Which vehicles need one?',
   'Speed limiters are required for commercial and public service vehicles in Kenya — buses, matatus, school buses, trucks and other commercial vehicles. If you are unsure whether a particular vehicle falls inside the requirement, ask us before fitting rather than after.',
   7),
  ('Can I see where the vehicle is as well as how fast it is going?',
   'Yes. GPS tracking is integrated, and vehicle location is available through the mobile application and the web platform alongside the speed-management data.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'speed-governors';
