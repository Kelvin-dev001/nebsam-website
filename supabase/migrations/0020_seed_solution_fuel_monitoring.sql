-- 0020  Solution content: fuel-monitoring.
--
-- Rewritten out of content-source/01-solutions/fuel-monitoring/write-up.md,
-- which carries EIGHT unresolved [[NEEDS_VERIFICATION]] tokens. No public page
-- may ship carrying a token, so the page is written AROUND the gaps rather than
-- printing them. Each unanswered fact is simply not asserted:
--
--   bill of materials — is the DFM flow meter standard or an option?   not stated
--   fuel level sensor and DFM flow meter                               not stated
--   fuel sensor accuracy and calibration                               not stated
--   calibration procedure and interval                                 not stated
--   supported tank types and vehicle types                             not stated
--   price and recurring cost                                           not stated
--   installation terms                                                 not stated
--   whether SMS alert delivery carries a per-message cost              not stated
--
-- THREE PHRASES FROM THE SOURCE ARE DROPPED, and it is worth being explicit
-- about why, because each looks harmless:
--
--   "high-precision" — a precision claim with no accuracy figure behind it.
--     Sensor accuracy is one of the eight open tokens, so the adjective asserts
--     exactly the thing nobody has verified. Dropped, not softened.
--   "unprecedented visibility" — a superlative, prohibited by CLAUDE.md §5.
--   "Decrease fuel theft by 90%" — appears in other Nebsam source material and
--     is on the never-publish list as a third-party vendor claim. Absent here.
--
-- WHAT REMAINS IS STILL A STRONG PAGE, because the capability is specific
-- without the missing numbers: a drop is detected, and it is reported with how
-- much, when, where and which vehicle. That is the sentence a fleet manager
-- needs, and none of the eight open tokens is required to write it truthfully.

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'fuel-monitoring',
  'Fuel monitoring',
  'A sensor in the tank, tied to GPS, so every fuel movement carries a time, a location, a vehicle and a quantity — and an abnormal drop reaches you the day it happens rather than at month end.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'An IoT fuel sensor installed inside the vehicle''s fuel tank, reporting alongside GPS to a cloud platform. It measures the fuel level continuously, so a drop, a fill and a journey are all recorded against each other rather than reconciled from paperwork afterwards.',
      'The output is not a fuel gauge on a screen. It is an account of every fuel event with a time, a location, a vehicle and a quantity attached to it.'
    ),

    'problem', jsonb_build_array(
      'Fuel is one of the largest costs in a transport operation, and it is the one most often reconciled from documents rather than measured. A litre lost on one vehicle is invisible. The same loss on thirty vehicles, every week, is a significant amount of money that never appears as a single line anybody notices.',
      'The usual symptoms are familiar: consumption that does not match the route, refuelling that does not match the receipts, and a suspicion about a vehicle or a driver that nobody can evidence either way. Without measurement, an accusation and a denial carry equal weight, and most managers let it go rather than accuse someone on a hunch.',
      'The timing is the other half of the problem. Discovering a discrepancy during the month-end reconciliation means discovering a pattern that has had a month to establish itself.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'Transport and logistics fleets',
        'detail', 'Where fuel is a major cost line and vehicles operate far from any supervision. The larger the fleet, the more a small per-vehicle loss compounds.'),
      jsonb_build_object('label', 'Long-distance and cross-border operators',
        'detail', 'Vehicles refuelling away from base, where the only record of a fill is the one the driver brings back.'),
      jsonb_build_object('label', 'Construction and plant operators',
        'detail', 'Machinery and vehicles fuelled on site, often from bowsers, where accountability is hardest.'),
      jsonb_build_object('label', 'PSV operators',
        'detail', 'Buses and matatus with predictable routes and therefore predictable consumption, which makes an anomaly easy to see once it is measured.'),
      jsonb_build_object('label', 'Any fleet with a suspicion it cannot evidence',
        'detail', 'Measurement settles it in both directions. It identifies real losses, and it clears drivers who have been quietly under suspicion for a consumption pattern that turns out to be the route.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Install',
        'detail', 'An IoT fuel sensor is installed inside the vehicle''s fuel tank by our technicians.'),
      jsonb_build_object('title', 'Measure',
        'detail', 'The sensor measures the fuel level inside the tank continuously, rather than sampling at the start and end of a trip.'),
      jsonb_build_object('title', 'Locate',
        'detail', 'GPS records the vehicle''s location and movement at the same time, so a fuel event and a place are one record rather than two.'),
      jsonb_build_object('title', 'Transmit',
        'detail', 'Fuel and vehicle data are transmitted to the Nebsam cloud platform.'),
      jsonb_build_object('title', 'Monitor',
        'detail', 'Fleet managers access the information through the web dashboard or the mobile application, and alerts arrive without anyone having to go looking.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Detecting loss',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Fuel theft and draining alerts',
            'detail', 'The system identifies abnormal fuel level drops and generates an alert when unauthorised draining is detected — with how much was lost, when it happened, where it happened and which vehicle was affected.'),
          jsonb_build_object('title', 'Real-time fuel level monitoring',
            'detail', 'Current fuel levels across the fleet through the day, and the unusual changes that indicate a loss, a refill or something that needs explaining.')
        )),
      jsonb_build_object('group', 'Accounting for fills',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Refuelling detection',
            'detail', 'Every fill recorded with date, time, location, quantity added, and the fuel level before and after — so a receipt can be checked against what actually entered the tank.'),
          jsonb_build_object('title', 'Verification against purchases',
            'detail', 'Discrepancies between reported and actual fuel usage become visible as a matter of record rather than a matter of opinion.')
        )),
      jsonb_build_object('group', 'Understanding the fleet',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Every fuel event located',
            'detail', 'Fuel events are associated with a GPS location, so you can see where fuel was added and where it was lost.'),
          jsonb_build_object('title', 'Reporting',
            'detail', 'Consumption and fuel activity across the fleet, which is what identifies the high-consumption vehicles worth investigating first.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'The sensor is installed in the tank by Nebsam technicians. What a given vehicle needs depends on the vehicle and the tank, so the specification follows a survey rather than an order form — tell us the fleet and we will tell you what each vehicle takes.',
      'Support covers the sensors, the platform and the reports. The reports are the part that repays attention: the first month usually establishes what normal consumption looks like for each route, and anomalies only mean something against that baseline.'
    )
  ),
  4,
  'published',
  now(),
  'Fuel Monitoring & Theft Detection in Kenya',
  'Fuel sensors and GPS that record every fuel event with time, location, vehicle and quantity. Detect draining, verify refuelling and cut fleet fuel losses in Kenya.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('How does the system detect fuel theft?',
   'It identifies abnormal fuel level drops and generates an alert when unauthorised draining is detected. The alert carries how much was lost, when it happened, where it happened and which vehicle was affected — which is what turns a suspicion into something you can act on.',
   1),
  ('Will it tell the difference between theft and normal consumption?',
   'Normal consumption is gradual and tracks the vehicle''s movement; draining is an abrupt drop, often while the vehicle is stationary. The system looks for the abnormal drop rather than the total used, which is why the location and timing attached to each event matter so much.',
   2),
  ('Can I check refuelling against receipts?',
   'Yes. Every fill is recorded with date, time, location, quantity added and the fuel level before and after, so a receipt can be compared with what actually entered the tank.',
   3),
  ('How do I see the information?',
   'Through the web dashboard or the mobile application. Alerts reach you when an event occurs, so the system does not depend on somebody remembering to log in.',
   4),
  ('Will it work on my vehicles?',
   'That depends on the vehicles and their tanks, and it is established during a survey rather than assumed. Tell us what the fleet consists of and we will tell you what each vehicle needs before anything is quoted.',
   5),
  ('How long before it is useful?',
   'The alerts work immediately, but the reports become far more useful once there is a baseline. The first month generally establishes what normal consumption looks like on each route, and anomalies only mean something measured against that.',
   6),
  ('Does it also track the vehicle?',
   'Yes. GPS records location and movement alongside the fuel data, which is what allows every fuel event to be tied to a place. Fuel monitoring without location tells you a litre went missing but not where.',
   7),
  ('What if a driver disputes a reading?',
   'That is a fair question and the reason measurement helps both ways. The record shows the level before and after, the time and the location, so a dispute is resolved by evidence rather than by seniority — and drivers wrongly suspected are cleared by the same data.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'fuel-monitoring';
