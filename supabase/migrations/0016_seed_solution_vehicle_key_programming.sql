-- 0016  Solution content: vehicle-key-programming.
--
-- Rewritten out of
-- content-source/01-solutions/vehicle-key-programming/write-up.md.
--
-- THIS SOURCE HEDGES MORE HEAVILY THAN ANY OTHER, and every hedge is load
-- bearing, because what is possible here genuinely depends on the vehicle in
-- front of the technician:
--   "where supported"
--   "where supported by the vehicle system"
--   "where the vehicle supports this function"
--   "subject to the vehicle make, model and security system"
--   "varies by vehicle make, model, year and immobilizer architecture"
--
-- Dropping any one of them would turn a conditional capability into a promise
-- the technician cannot keep on an unknown car. The source even carries its own
-- "Important:" note saying the procedure varies and technicians verify first —
-- that caveat is kept as body copy rather than demoted to small print.
--
-- THE DUPLICATE KEY CHECK IS LED ON, and that is an editorial decision worth
-- recording. It is the most valuable thing on this page for a Kenyan buyer: a
-- used vehicle can carry keys the new owner knows nothing about, held by a
-- previous owner, a driver, a mechanic or a former employee. The source buries
-- it as service 04. It runs earlier here because it is the reason someone who
-- was not looking for a locksmith should read the page.
--
-- NOTHING INVENTED: no list of supported makes, no turnaround time, no price,
-- no success rate. The source states none of them, and each would be a promise
-- about a vehicle nobody has seen yet.

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'vehicle-key-programming',
  'Vehicle key programming and diagnostics',
  'Spare keys, all-keys-lost recovery, immobiliser programming and a duplicate-key security check that shows how many keys can actually start your vehicle — which matters most if you bought it used.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'Programming keys to a vehicle''s security system, rather than cutting metal. A modern key is a transponder, a remote or a smart key talking to an immobiliser, so adding or replacing one means connecting the key to the vehicle''s electronics — and, where the vehicle supports it, removing keys that should no longer work.',
      'The services cover spare and duplicate keys, all-keys-lost recovery, clearing previously authorised keys, smart key and remote programming, and a security check of which keys are held in the vehicle''s key memory.'
    ),

    'problem', jsonb_build_array(
      'Most people think about keys at the worst possible moment: when the last one is lost, or when a vehicle will not start. At that point the options are narrower and the cost is higher than it needed to be.',
      'The quieter problem belongs to anyone who bought a used vehicle. You received one key, or two. You do not know how many exist. A previous owner, a driver, a mechanic or a former employee may still hold one, and a key that was never surrendered does not announce itself — it simply continues to work. Nothing about the vehicle looks wrong, and nothing will, until it is gone.',
      'Programming a new key does not address that on its own. Adding a key adds a key; it does not remove the ones already authorised.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'Anyone who has bought a used vehicle',
        'detail', 'The single most useful check on this page. Before you rely on a vehicle you did not buy new, find out how many keys can start it — and, where the vehicle supports it, make sure only yours can.'),
      jsonb_build_object('label', 'Owners down to one key',
        'detail', 'A spare programmed now is an inconvenience. A key programmed after the last one is lost is a recovery job, and a more expensive one.'),
      jsonb_build_object('label', 'Fleet and company vehicle operators',
        'detail', 'Vehicles that change drivers, and keys that leave with staff. Clearing a departed driver''s key, where supported, is the equivalent of collecting a door key on the last day.'),
      jsonb_build_object('label', 'Drivers who have lost every key',
        'detail', 'All-keys-lost recovery through professional key programming and immobiliser procedures, subject to the vehicle make, model and security system.'),
      jsonb_build_object('label', 'Vehicles with smart or keyless systems',
        'detail', 'Smart keys, keyless-entry remotes, remote fobs, push-to-start and transponder keys, which cannot be duplicated by cutting.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Identify the vehicle and its system',
        'detail', 'Make, model, year and immobiliser architecture determine what is possible. Our technicians first verify what the vehicle system supports — before any work is quoted, not after.'),
      jsonb_build_object('title', 'Read what is already programmed',
        'detail', 'Where the vehicle supports this function, we check the key-memory system to establish how many keys are authorised and whether any are unknown.'),
      jsonb_build_object('title', 'Decide what the vehicle actually needs',
        'detail', 'A spare is a different job from all-keys-lost, and both are different from securing a vehicle against keys you cannot account for. The check comes before the recommendation.'),
      jsonb_build_object('title', 'Program the new keys',
        'detail', 'Compatible duplicate, spare or replacement keys are programmed, retaining the vehicle''s authorised key configuration where supported.'),
      jsonb_build_object('title', 'Clear the keys that should not work',
        'detail', 'Where supported by the vehicle system, previously authorised keys can be cleared or deactivated so that only the newly programmed keys start the vehicle. The exact procedure varies by vehicle make, model, year and immobilizer architecture.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Security',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Duplicate key security check',
            'detail', 'A check of whether unknown or unauthorised duplicate keys are present in the vehicle''s key-memory system, where the vehicle supports this function. It answers a question most owners have never been able to ask.'),
          jsonb_build_object('title', 'Clearing lost or stolen keys',
            'detail', 'Where supported by the vehicle system, previously authorised keys can be cleared and new keys programmed — so a lost key becomes a dead key rather than an outstanding one.'),
          jsonb_build_object('title', 'A new unique set',
            'detail', 'Where unauthorised or unknown keys are found, we recommend programming a new unique pair, with the appropriate procedure clearing or deactivating what came before, where supported.')
        )),
      jsonb_build_object('group', 'Keys',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Spare and duplicate keys',
            'detail', 'Compatible duplicate or spare keys programmed while retaining the vehicle''s authorised key configuration where supported — for family members, shared vehicles, company cars and emergency backup.'),
          jsonb_build_object('title', 'All-keys-lost recovery',
            'detail', 'Designed to help restore vehicle access through professional key programming and immobiliser procedures, subject to the vehicle make, model and security system.'),
          jsonb_build_object('title', 'Smart key and remote programming',
            'detail', 'Smart keys, keyless-entry remotes, remote key fobs, push-to-start keys and transponder keys.')
        )),
      jsonb_build_object('group', 'Diagnostics',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Immobiliser and module work',
            'detail', 'Immobiliser programming and automotive diagnostics using professional equipment, supporting a range of vehicle makes and models.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'Key work is done by Nebsam technicians. The first step is always establishing what the vehicle supports, because the answer differs between two cars that look identical on the forecourt — the exact key-clearing and deactivation procedure varies by vehicle make, model, year and immobilizer architecture.',
      'That means we will sometimes tell you a procedure is not available on your vehicle. That is a more useful answer than attempting it, and it is why the vehicle is checked before anything is promised.',
      'Available from the branches in Nairobi, Mombasa and Nakuru, and through agents and technicians elsewhere in the country.'
    )
  ),
  10,
  'published',
  now(),
  'Car Key Programming & Duplicate Key Check in Kenya',
  'Spare keys, all-keys-lost recovery, immobiliser programming and smart key coding. Check how many keys can start your vehicle — essential when buying a used car.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('How do I know how many keys can start my car?',
   'We can check whether unknown or unauthorised duplicate keys are present in the vehicle''s key-memory system, where the vehicle supports this function. It is the most important check for anyone who bought a vehicle used, because a key held by a previous owner, driver or mechanic keeps working until it is cleared.',
   1),
  ('I bought a used car. Should I replace the keys?',
   'If you cannot account for every key that exists, yes. Where unauthorised or unknown keys are found we recommend programming a new unique pair, and the appropriate security procedure can clear or deactivate previously programmed keys where supported by the vehicle.',
   2),
  ('I have lost all my keys. Can you help?',
   'Our all-keys-lost service is designed to help restore vehicle access through professional key programming and immobiliser procedures, subject to the vehicle make, model and security system. Tell us the make, model and year when you call, because that determines what is possible.',
   3),
  ('Can you deactivate a key that was lost or stolen?',
   'Where supported by the vehicle system, previously authorised keys can be cleared and new keys programmed. This matters because adding a replacement key does not remove the lost one — without clearing, the missing key still starts the vehicle.',
   4),
  ('Do you program smart keys and push-to-start systems?',
   'Yes. We support programming for smart keys, keyless-entry remotes, remote key fobs, push-to-start keys and transponder keys. These cannot be duplicated by cutting, because the key has to be introduced to the vehicle''s immobiliser.',
   5),
  ('Will this work on my vehicle?',
   'It depends on the vehicle. The exact key-clearing and deactivation procedure varies by vehicle make, model, year and immobilizer architecture, so our technicians first verify what the vehicle system supports. We would rather tell you a procedure is unavailable than attempt one that is.',
   6),
  ('Why not just cut a spare key at a hardware shop?',
   'A cut key will turn in the door and the ignition but will not start a vehicle with an immobiliser, because the immobiliser is looking for the transponder rather than the shape of the metal. The key has to be programmed to the vehicle.',
   7),
  ('When is the best time to get a spare?',
   'Before you need one. Programming a spare while you still have a working key is a straightforward job; recovering a vehicle with no working key is a different and more expensive procedure.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'vehicle-key-programming';
