-- 0021  Solution content: ai-video-telematics.
--
-- Rewritten out of content-source/01-solutions/ai-video-telematics/write-up.md,
-- which carries ten unresolved tokens and, unusually, its own SOURCE NOTES
-- telling the writer what must not be repeated. Both instructions are followed.
--
-- 1. NTSA — ABSENT, NOT HEDGED.
--    The 2025 proposal claims road sign recognition "transmits this data
--    directly to NTSA servers". That is unverified (register V01) and CLAUDE.md
--    §5 is specific: write the section WITHOUT it — absent, not hedged. The road
--    sign section below therefore says nothing about NTSA at all. If someone
--    later asks why, the answer is V01. Do not reintroduce it.
--
-- 2. "KEBS ACCREDITED" — CORRECTED TO THE PERMIT WORDING.
--    The source body says the system is "KEBS accredited". There is no such
--    thing. The instrument is a Permit to Use the Standardization Mark, and
--    "accredited" is the wrong word for it.
--
--    THIS IS ALSO THE ONE PAGE WHERE THE PERMIT LEGITIMATELY BELONGS. It is
--    product-scoped to vehicle cameras for video telematics under the STREAMAX
--    brand — which is exactly this product. Everywhere else on the site the
--    permit would be overreach; here it is the evidence, and it is stated with
--    its scope attached. The laboratory test report (BS202445237, 5 February
--    2025, result "Complies" against KNWA 3006:2024) is cited without being
--    paraphrased into anything stronger.
--
-- 3. THE TEN TOKENS ARE WRITTEN AROUND. Not stated anywhere: rear lens viewing
--    angle, the appended hardware specification, Android security support,
--    DMS retention, cloud video retention period, price and recurring cost.
--
-- 4. PRIVACY IS ON THE PAGE, because this is the most intrusive product Nebsam
--    sells. A driver-facing camera records a person at work for their whole
--    shift. Consent, retention and access are open tokens (V14 and others), so
--    no period or procedure is stated — but the OBLIGATION is stated plainly,
--    because a fleet manager who buys this without having thought about the
--    Data Protection Act 2019 has bought a problem. Saying so is accuracy, and
--    it is also the more useful page.
--
-- 5. ALCOHOL DETECTION is named as optional and explicitly NOT presented as a
--    legal or evidential test (CLAUDE.md §10).

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'ai-video-telematics',
  'AI video telematics and driver safety',
  'Cameras that watch the road and the driver, with AI picking out the events worth seeing — so an incident comes with footage rather than two conflicting accounts, and risky driving is visible before it becomes a collision.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'AI-powered cameras fitted to the vehicle, combined with GPS tracking, live video and event-based recording. Where a tracker tells you where a vehicle is, video telematics tells you what the driver is doing and what is happening around the vehicle.',
      'The AI is what makes it usable. Nobody watches hours of footage from a fleet, so the system identifies the events worth looking at — harsh driving, a distraction event, a road sign, an incident — and surfaces those with the video attached.'
    ),

    'problem', jsonb_build_array(
      'After a collision there are two accounts and no evidence. Your driver says one thing, the other party says another, and the claim is settled on the balance of who argues better. For a fleet with vehicles on the road every day, that is an expensive way to resolve a recurring problem.',
      'The larger cost is the one that never becomes an incident. Risky driving is a pattern before it is a crash — following too closely, phone use, fatigue on a long run. None of it shows up in a tracking report, because a tracker records where the vehicle went, not how it was driven.',
      'And a driver who knows nobody can see is a driver managed by trust alone. That works until it does not, and the moment it stops working usually involves someone getting hurt.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'PSV operators',
        'detail', 'Buses and matatus carrying passengers, where driver behaviour is the safety system and an incident involves people rather than only cargo.'),
      jsonb_build_object('label', 'Logistics and long-distance fleets',
        'detail', 'Long runs where fatigue and distraction accumulate, and where an incident happens hundreds of kilometres from anyone who can assess it.'),
      jsonb_build_object('label', 'Fleets facing repeated claims',
        'detail', 'Where the cost of disputed liability has become a line item. Footage changes a negotiation into a matter of record.'),
      jsonb_build_object('label', 'Operators running driver safety programmes',
        'detail', 'Coaching needs specifics. "Drive more carefully" changes nothing; a clip of a specific event on a specific day changes behaviour.'),
      jsonb_build_object('label', 'High-value and sensitive cargo',
        'detail', 'Where what happens around the vehicle matters as much as where the vehicle is.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Cameras fitted to the vehicle',
        'detail', 'Road-facing and driver-facing cameras, installed and configured by our technicians for the vehicle and the operation.'),
      jsonb_build_object('title', 'AI watches continuously',
        'detail', 'The system monitors driver activity and the road environment, identifying safety-related events rather than requiring anyone to review footage.'),
      jsonb_build_object('title', 'Events are flagged with video',
        'detail', 'When the system identifies a critical driving event, it captures the video evidence alongside the GPS position, so the event has a time, a place and a picture.'),
      jsonb_build_object('title', 'The driver is identified',
        'detail', 'Using the configured driver identification system, activity and events are connected to the responsible driver rather than only to the vehicle.'),
      jsonb_build_object('title', 'Managers review and act',
        'detail', 'Live video and recorded events through the platform, used for coaching, incident investigation and answering a claim with something better than a recollection.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Watching the driver',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'AI-powered driver management',
            'detail', 'Camera technology that monitors driver activity and identifies safety-related events, giving managers visibility of behaviour and flagging situations that may require intervention or further investigation.'),
          jsonb_build_object('title', 'Driver identification',
            'detail', 'Vehicle activity and driving events connected to the responsible driver through the configured driver identification system — which is what makes accountability specific rather than collective.'),
          jsonb_build_object('title', 'Optional alcohol detection',
            'detail', 'Available as an option. It is a screening aid intended to support an operator''s own procedures, and it is not a legal or evidential test — it does not replace one, and should not be described as though it does.')
        )),
      jsonb_build_object('group', 'Watching the road',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Driver assistance',
            'detail', 'Intelligent driver assistance designed to help identify potentially hazardous driving situations, adding a layer between the driver, the vehicle and the road environment.'),
          jsonb_build_object('title', 'Road sign recognition',
            'detail', 'The system can recognise supported road signs and provide additional information about road conditions and traffic requirements, supporting driver awareness during journeys.')
        )),
      jsonb_build_object('group', 'Evidence',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Live video and event recording',
            'detail', 'Live streaming from the vehicle and event-based recording, so the footage that matters is retained and findable rather than buried in continuous video.'),
          jsonb_build_object('title', 'Video evidence for incidents',
            'detail', 'Footage tied to the GPS position and time of the event, which is what settles a disputed claim on the facts.')
        )),
      jsonb_build_object('group', 'Independent testing',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'KEBS Permit to Use the Standardization Mark',
            'detail', 'Permit SM#84618 covers vehicle cameras for video telematics under the STREAMAX brand — this product specifically. It is a permit to use the standardization mark, not a company-wide certification.'),
          jsonb_build_object('title', 'KEBS laboratory test report',
            'detail', 'Test report BS202445237, dated 5 February 2025, records that the sampled system complies with KNWA 3006:2024 — Video telematics system for motor vehicle: Performance Requirements.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'Cameras are fitted and configured by Nebsam technicians. Camera placement determines what the system can and cannot see, so it is decided per vehicle rather than applied from a template.',
      'Before you fit driver-facing cameras, decide the privacy position deliberately. A driver-facing camera records an identifiable person throughout their working day, and that is personal data under the Data Protection Act 2019. Drivers should be told what is recorded, why, who can see it and how long it is kept — and in practice, fleets that explain the system get better cooperation and better results than fleets that install it quietly.',
      'Support covers the hardware, the platform and the review process. The value is in the review: a system generating events nobody looks at is an expense, not a safety programme.'
    )
  ),
  5,
  'published',
  now(),
  'AI Video Telematics & Driver Safety in Kenya',
  'AI dash cameras with driver monitoring, road sign recognition, driver ID and video evidence. KEBS-permitted STREAMAX video telematics, fitted across Kenya.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('How is this different from a dashcam?',
   'A dashcam records. Video telematics identifies. The AI picks out the events worth seeing — harsh driving, distraction, an incident — and surfaces them with the video and GPS position attached, because nobody in a real fleet watches hours of footage looking for the interesting minute.',
   1),
  ('Do I need to tell drivers they are being recorded?',
   'Yes, and you should. A driver-facing camera records an identifiable person throughout their working day, which is personal data under the Data Protection Act 2019. Drivers should be told what is recorded, why, who can access it and how long it is kept. Fleets that explain the system also get better cooperation from it.',
   2),
  ('Is the system KEBS certified?',
   'Nebsam holds a KEBS Permit to Use the Standardization Mark, SM#84618, covering vehicle cameras for video telematics under the STREAMAX brand — this product. It is a permit to use the standardization mark rather than a company-wide certification, and it is worth being precise about the difference.',
   3),
  ('Has the system been independently tested?',
   'A KEBS laboratory test report, reference BS202445237 dated 5 February 2025, records that the sampled system complies with KNWA 3006:2024, the performance requirements standard for vehicle video telematics systems.',
   4),
  ('What does road sign recognition do?',
   'The system can recognise supported road signs and provide additional information about road conditions and traffic requirements, which supports driver awareness during a journey.',
   5),
  ('Can I see live video from a vehicle?',
   'Yes. Live video streaming is available alongside event-based recording, so you can look at a vehicle now as well as review what the system flagged earlier.',
   6),
  ('Does it tell me who was driving?',
   'Yes, using the configured driver identification system. That connects events to a driver rather than to a vehicle, which is what makes coaching and accountability possible in a fleet where vehicles are shared.',
   7),
  ('Is the alcohol detection a legal test?',
   'No. It is available as an option and is a screening aid supporting an operator''s own procedures. It is not a legal or evidential test and does not substitute for one.',
   8),
  ('What is it actually useful for day to day?',
   'Two things, mostly. Settling incidents with evidence instead of argument, and coaching from specifics — a clip of one event on one day changes driving in a way that a general instruction never does.',
   9)
) as q(question, answer, sort_order)
where s.slug = 'ai-video-telematics';
