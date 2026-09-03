-- 0019  Solution content: vehicle-security.
--
-- DERIVED from content-source/02-products/car-alarms/*, per the Sprint 5
-- criterion. There is no vehicle-security solution write-up.
--
-- CONFIRMED PRODUCT NAMES USED EXACTLY (CLAUDE.md §5). Hybrid Car Alarm —
-- never "Hybrid Alarm". Hybrid ProMax Car Alarm is the vibrating key remote.
-- Hybrid ProMax Plus Car Alarm is the vibrating remote PLUS Anti-Jammer GPS.
-- The source document for the Plus was itself mis-titled and carries a
-- correction note; the confirmed naming is used here.
--
-- FOUR PROHIBITED CLAIMS ARE ABSENT, not softened:
--   "the strongest active vehicle protection system in Kenya"
--   "no way a thief will drive away with your car"
--   "#1 vehicle theft prevention solution in Kenya"
--   any promise of absolute security
-- The page instead says what each layer does and what it does not. A security
-- page that promises certainty is the one nobody can rely on.
--
-- HEDGES PRESERVED: "designed to detect", "configured GSM/GPS jamming
-- conditions", "the configured anti-jamming security response", "through
-- configured security functions", "can activate".
--
-- THE VIBRATING REMOTE IS LED ON. It is the genuinely distinctive thing in the
-- range and the source undersells it. A siren in a Nairobi car park is
-- background noise that everyone has learned to ignore; a vibration in the
-- owner's pocket reaches exactly one person, the one who can act.

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'vehicle-security',
  'Vehicle security and anti-theft',
  'Car alarms that reach you rather than the street — a vibrating key remote you feel, anti-jamming that treats silence as an event, GPS tracking and remote immobilisation, layered so no single defeat ends the protection.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'Vehicle security built in layers rather than around one device. A smart alarm detects unauthorised access, a vibrating key remote alerts the owner directly, anti-jamming watches for interference with the GSM and GPS signal, GPS tracking maintains visibility, and remote immobilisation can stop the vehicle through configured security functions.',
      'The range runs from the Hybrid Car Alarm through the Hybrid ProMax Car Alarm, which adds the vibrating key remote, to the Hybrid ProMax Plus Car Alarm, which adds Anti-Jammer GPS on top of it.'
    ),

    'problem', jsonb_build_array(
      'A conventional car alarm detects and sounds. That was enough when a siren still made people look. In a Nairobi car park, on a street where alarms go off weekly, the siren has become background noise — it warns everyone and reaches no one in particular.',
      'A conventional tracker has the opposite problem. It reports location well and does nothing at the moment of the break-in. By the time anyone checks the platform, the event is over.',
      'And both share a weakness that organised theft already exploits: a GSM jammer. Block the uplink and the tracker stops reporting, which looks like a coverage gap rather than a theft. The alarm sounds to an empty street, the tracker goes quiet, and nothing reaches the owner at all.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'Private vehicle owners',
        'detail', 'Anyone who parks in a place where a siren will not bring help — which is most places, most of the time.'),
      jsonb_build_object('label', 'Owners of high-value or frequently targeted vehicles',
        'detail', 'Where theft is likely to be organised rather than opportunistic, and where a single layer will be defeated deliberately.'),
      jsonb_build_object('label', 'Company and pool vehicles',
        'detail', 'Vehicles that spend nights away from a yard and change drivers, where the owner is rarely the person nearest the vehicle.'),
      jsonb_build_object('label', 'PSV and commercial operators',
        'detail', 'Vehicles carrying takings as well as passengers, where the response matters more than the record.'),
      jsonb_build_object('label', 'Owners who already have a tracker',
        'detail', 'Tracking answers where. An alarm with a vibrating remote answers now. They are different questions and the second one has a deadline.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Detect',
        'detail', 'The alarm is designed to detect unauthorised access or disturbance to the vehicle.'),
      jsonb_build_object('title', 'Alert the owner directly',
        'detail', 'The system can activate the vehicle''s audible alarm while alerting the owner through the remote key. On the ProMax and ProMax Plus, that alert is a vibration you feel rather than a sound you have to be near enough to hear.'),
      jsonb_build_object('title', 'Watch for interference',
        'detail', 'On the Hybrid ProMax Plus Car Alarm, Anti-Jammer GPS is designed to detect attempts to interfere with GSM/GPS communication and activate the configured anti-jamming security response.'),
      jsonb_build_object('title', 'Track',
        'detail', 'GPS tracking maintains visibility of vehicle location and movement, with route history behind it.'),
      jsonb_build_object('title', 'Immobilise',
        'detail', 'The vehicle can be immobilised remotely or automatically through configured security functions — which is the layer that changes a theft in progress rather than recording one.'),
      jsonb_build_object('title', 'Support recovery',
        'detail', 'Live location and movement history support a recovery led by the owner and the police.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Reaching you',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Vibrating key remote',
            'detail', 'On the Hybrid ProMax Car Alarm and ProMax Plus, the remote vibrates when the alarm activates. It reaches one person — the one who can do something — instead of a street that has stopped listening.'),
          jsonb_build_object('title', 'Smart alarm system',
            'detail', 'Intelligent alarm protection designed to detect unauthorised access or disturbance, activating the audible alarm and alerting the owner at the same time.')
        )),
      jsonb_build_object('group', 'Against jamming',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Anti-Jammer GPS',
            'detail', 'Built into the Hybrid ProMax Plus Car Alarm. Designed to detect configured GSM/GPS jamming conditions and activate the configured anti-jamming security response, so interference becomes an event rather than silence.')
        )),
      jsonb_build_object('group', 'Visibility and control',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Live GPS tracking and route history',
            'detail', 'Location and movement through the platform, with history behind it for reviewing what happened.'),
          jsonb_build_object('title', 'Geofencing',
            'detail', 'Boundaries around the places that matter, with alerts when the vehicle enters or leaves them.'),
          jsonb_build_object('title', 'Remote engine immobilisation',
            'detail', 'Immobilisation remotely or automatically, through configured security functions, and restoration when authorised.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'Fitting is done by Nebsam technicians, and which system suits a vehicle depends on what the vehicle supports — immobilisation in particular is not available on every vehicle, and some older units will not take every feature. We establish that during the survey, before anything is quoted.',
      'Configuration is where the security actually lives. What counts as a security event, what the anti-jamming response should be, and whether immobilisation is automatic or manual are all set per installation. A system configured carelessly either cries wolf until it is ignored, or stays silent when it should not.',
      'No security system makes a vehicle impossible to steal, and any supplier who tells you otherwise is selling a claim rather than a product. What layers buy you is that defeating one does not defeat the rest — and that you find out while it is happening.'
    )
  ),
  2,
  'published',
  now(),
  'Car Alarms & Vehicle Anti-Theft Systems in Kenya',
  'Vehicle security with a vibrating key remote, Anti-Jammer GPS, live tracking and remote immobilisation. Hybrid Car Alarm range fitted across Kenya.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('What does the vibrating remote actually do?',
   'It vibrates in your pocket when the alarm activates, so the alert reaches you rather than the street. A siren depends on somebody nearby caring; a vibration reaches the one person who will act. It is fitted on the Hybrid ProMax Car Alarm and the Hybrid ProMax Plus Car Alarm.',
   1),
  ('What is the difference between the Hybrid ProMax and the ProMax Plus?',
   'The Hybrid ProMax Car Alarm has the vibrating key remote. The Hybrid ProMax Plus Car Alarm adds Anti-Jammer GPS on top of it, which is designed to detect attempts to interfere with GSM/GPS communication and activate the configured anti-jamming security response.',
   2),
  ('Will an alarm stop my car being stolen?',
   'No security system makes a vehicle impossible to steal, and we will not tell you otherwise. What layered security changes is that defeating one layer does not defeat the rest, and that you learn about the attempt while it is happening rather than afterwards.',
   3),
  ('I already have a tracker. Do I need an alarm as well?',
   'They answer different questions. A tracker tells you where the vehicle is, which matters after the fact. An alarm with a vibrating remote tells you something is happening now, which is the only window in which you can change the outcome.',
   4),
  ('Can the engine be immobilised?',
   'The vehicle can be immobilised remotely or automatically through configured security functions, where the vehicle supports it. Whether immobilisation is automatic or requires a deliberate action is a configuration decision, and it is worth making carefully.',
   5),
  ('What happens if a thief uses a signal jammer?',
   'On the Hybrid ProMax Plus Car Alarm, Anti-Jammer GPS is designed to detect configured GSM/GPS jamming conditions and activate the configured anti-jamming security response. Without anti-jamming, a jammer simply makes the tracker go quiet, which is indistinguishable from a coverage gap.',
   6),
  ('Does it work on any vehicle?',
   'Not every feature does. Immobilisation in particular depends on the vehicle, and some older vehicles will not take every function. Our technicians establish what the vehicle supports during the survey rather than after installation.',
   7),
  ('Will the alarm go off by itself?',
   'A badly configured system will, and a system that cries wolf gets switched off — which is the worst possible outcome. Sensitivity and what counts as a security event are set during installation, and we would rather tune it with you than hand over defaults.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'vehicle-security';
