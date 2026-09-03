-- 0015  Solution content: radio-communication.
--
-- Rewritten out of content-source/01-solutions/radio-communication/write-up.md.
--
-- THIS IS THE PAGE THE CONTENT SKILL USES AS ITS WORKED EXAMPLE, and the
-- headline claim is on the prohibited list. "Unlimited distances without
-- interference" must be rewritten as bounded by network coverage, so the
-- treatment here is deliberate: distance stops being the limit, and COVERAGE
-- becomes the limit. Saying only the first half is the marketing claim; saying
-- both is the truth, and it is also the more useful sentence, because the
-- no-coverage consequence is exactly what a buyer needs to plan around.
--
-- HEDGES PRESERVED WORD FOR WORD, and they matter more here than on any other
-- solution page because this is where the source makes its most specific
-- physical claims:
--   "under specified operating conditions"
--   "Battery performance varies depending on usage, network conditions, GPS
--    activity, transmission frequency, and device configuration"
--   "Compatible radios can provide" / "Supported devices and configurations"
--   "within the supported operating range"
--
-- The 5200mAh / 30-hour figures are the source's own and are published WITH
-- their qualifier attached. A battery figure quoted without its conditions is
-- how a spec sheet becomes a complaint.
--
-- "Selected radio configurations" is preserved too: the battery belongs to some
-- models, not to the range.

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'radio-communication',
  'Radio communication — PTT and PoC',
  'Two-way radio for teams that need to talk instantly: short-range radios for a site, and PoC radios that carry voice over 4G so a driver in Mombasa and a dispatcher in Nairobi share one channel.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'Push-to-talk radio in two forms. Short-range radios communicate directly with each other within the supported operating range, for teams working inside one site. Long-range PoC radios carry voice over 4G or Wi-Fi instead, so teams in different cities share a channel.',
      'Both give you the thing a phone call does not: instant, hands-available, one-to-many speech. A supervisor presses one button and forty people hear the instruction at once, which is not something a phone can do at any price.'
    ),

    'problem', jsonb_build_array(
      'A phone call reaches one person, takes several seconds to connect, and requires a free hand. On a construction site, a security patrol or a loading bay, all three of those are the wrong properties. What the work needs is a channel that is already open.',
      'Conventional radio solves that but adds its own limit: two handsets have to be near enough to reach each other. A security company with teams in Nairobi and Mombasa cannot run them on one channel, so it ends up running two systems and a phone bill to bridge them.',
      'PoC removes the distance limit by using the mobile network instead of a direct radio link — and replaces it with a different one. Where there is no mobile data service, a PoC handset cannot transmit or receive at all. That is the real trade-off against a short-range radio, and it is why many operations run both.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'Security companies',
        'detail', 'Guards and patrol teams who need instant contact and a way to raise an alarm. On short-range radios for a single site, on PoC where the teams are spread across a city or several towns.'),
      jsonb_build_object('label', 'Construction and industrial sites',
        'detail', 'Crews working across a site where a phone call is impractical and the message usually needs to reach a group rather than a person.'),
      jsonb_build_object('label', 'Transport and logistics operators',
        'detail', 'Drivers and dispatchers separated by hundreds of kilometres. This is where PoC earns its keep: one channel from the yard to the road, without either end being in radio range of the other.'),
      jsonb_build_object('label', 'Hotels, events and shopping centres',
        'detail', 'Site operations where staff move constantly and coordination is continuous rather than scheduled.'),
      jsonb_build_object('label', 'Field service teams',
        'detail', 'Technicians and delivery crews working away from an office, where location and communication are useful together.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Choose the type for the operation',
        'detail', 'Short-range for a defined area with no dependence on a cellular network; PoC where teams are distributed and a mobile data connection is available. Many operations use both, for the reasons above.'),
      jsonb_build_object('title', 'Short-range: radio to radio',
        'detail', 'Handsets communicate directly with each other within the supported operating range. Nothing sits between them, so nothing else has to be working for them to talk.'),
      jsonb_build_object('title', 'PoC: radio to network',
        'detail', 'The handset connects to an available 4G or Wi-Fi network and voice travels over it. Distance between users stops being the limit; network coverage becomes the limit instead.'),
      jsonb_build_object('title', 'Press to talk',
        'detail', 'One button opens the channel to an individual or a group. No dialling, no waiting for an answer, and a free hand throughout.'),
      jsonb_build_object('title', 'Monitor and review',
        'detail', 'Where the devices support it, managers can see live location, review location playback, and play back recorded audio after an incident.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Talking',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Instant push-to-talk',
            'detail', 'Press, speak, release. Valuable wherever workers need to keep their hands available and cannot stop to place a conventional call.'),
          jsonb_build_object('title', 'Individual and group talk',
            'detail', 'Speak privately to one team member, or send an instruction to a whole group at once — the difference between coordinating a team and telephoning it one person at a time.')
        )),
      jsonb_build_object('group', 'Knowing where people are',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Real-time GPS location',
            'detail', 'Compatible radios can provide GPS location information, so an authorised manager can see where radio users are — useful for patrol teams, field technicians and transport crews.'),
          jsonb_build_object('title', 'Location playback history',
            'detail', 'Historical location information for reviewing field activity, verifying movement, checking patrol routes and investigating incidents after the event.'),
          jsonb_build_object('title', 'Geofence monitoring',
            'detail', 'Defined zones with alerts when radio users enter or leave them, or move outside an approved area.')
        )),
      jsonb_build_object('group', 'Safety and record',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Emergency SOS button',
            'detail', 'A dedicated button that sends an emergency alert to designated contacts or monitoring personnel — an additional safety layer for lone workers and teams in remote or high-risk locations.'),
          jsonb_build_object('title', 'Audio recording and playback',
            'detail', 'Supported devices and configurations can record audio communication for later playback, for reviewing instructions, investigating incidents and training.')
        )),
      jsonb_build_object('group', 'Hardware',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'High-capacity battery on selected models',
            'detail', 'Selected radio configurations carry a 5200mAh battery providing up to 30 hours of standby time under specified operating conditions. Battery performance varies depending on usage, network conditions, GPS activity, transmission frequency, and device configuration.'),
          jsonb_build_object('title', 'Rugged construction',
            'detail', 'Built for demanding environments where equipment takes regular field use — construction, security, logistics, warehousing and outdoor operations.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'Radios are supplied, configured and programmed by Nebsam. Configuration is most of the value: which handsets share a channel, who can hear which group, where an SOS alert is delivered and which zones raise a geofence alert are all set per operation.',
      'PoC radios need a SIM and a data plan, and coverage along the routes your teams actually work matters more than headline coverage. Tell us where the teams operate and we will tell you honestly where the handsets will and will not have service.',
      'Supply, configuration and support are available from the branches in Nairobi, Mombasa and Nakuru, and through agents and technicians elsewhere in the country.'
    )
  ),
  9,
  'published',
  now(),
  'Two-Way Radio & PoC Communication in Kenya',
  'Push-to-talk radios for security, construction, transport and site teams. Short-range radios and 4G PoC radios with GPS, SOS alerts and group talk, supplied across Kenya.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('How far can a PoC radio actually reach?',
   'A PoC radio carries voice over a mobile data network instead of transmitting directly to another handset, so the distance between two users stops being the limit. A driver in Mombasa can talk to a dispatcher in Nairobi on the same channel. What replaces distance as the limit is coverage: where there is no mobile data service, the handset cannot transmit or receive at all.',
   1),
  ('What is the difference between a short-range radio and a PoC radio?',
   'A short-range radio talks directly to another radio within the supported operating range and needs no cellular network to do it. A PoC radio talks over 4G or Wi-Fi, which removes the distance limit but makes it dependent on network coverage. Sites use short-range; distributed teams use PoC; many operations run both.',
   2),
  ('Do PoC radios need a SIM card?',
   'Yes. A PoC radio communicates over a mobile data network, so it needs a SIM and an active data plan. Coverage along the routes your teams actually work is what determines whether it will perform, rather than coverage in general.',
   3),
  ('Can I see where my team is?',
   'Compatible radios can provide GPS location information, so an authorised manager can see where radio users are and review location playback afterwards. Whether a given handset supports it depends on the model, so confirm before ordering.',
   4),
  ('Is there an emergency button?',
   'Yes. A dedicated SOS button sends an emergency alert to designated contacts or monitoring personnel. Where that alert is delivered is part of the configuration, and it is worth deciding deliberately rather than accepting a default.',
   5),
  ('How long does the battery last?',
   'Selected radio configurations carry a 5200mAh battery providing up to 30 hours of standby time under specified operating conditions. Battery performance varies depending on usage, network conditions, GPS activity, transmission frequency, and device configuration — standby time and heavy-transmission time are very different numbers.',
   6),
  ('Can conversations be recorded?',
   'Supported devices and configurations can record audio communication for later playback, which is used for reviewing instructions, investigating incidents and training. Recording people at work carries obligations under the Data Protection Act 2019, so decide the policy before switching it on.',
   7),
  ('Can radios talk to each other across borders?',
   'PoC radios can, subject to network coverage and service availability, because the connection is made over the mobile network rather than between handsets. Short-range radios cannot — their limit is physical distance.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'radio-communication';
