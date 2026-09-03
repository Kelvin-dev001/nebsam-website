-- 0018  Solution content: vehicle-recovery.
--
-- DERIVED from content-source/02-products/trackers/recovery-tracker, per the
-- Sprint 5 criterion. There is no vehicle-recovery solution write-up.
--
-- THE MOST IMPORTANT DECISION ON THIS PAGE IS WHAT IT DOES NOT SAY.
--
-- The slug is "vehicle-recovery" and a reader could reasonably arrive expecting
-- a RECOVERY SERVICE — that Nebsam is told a vehicle is stolen, and Nebsam goes
-- and gets it back, with police coordination and a response time. The sources
-- describe none of that. They describe a recovery TRACKER: a portable, magnetic,
-- long-battery unit designed for stolen vehicle recovery and asset protection.
--
-- Whether Nebsam operates a recovery service, who attends, how it is escalated,
-- what hours it runs and what it costs are all unestablished. Inventing any of
-- them would be the most damaging fabrication available on this site, because a
-- customer would rely on it at the worst moment of their year and discover it
-- was never true. Register V48 records the gap.
--
-- So the page is written about the capability, and it says plainly that the
-- tracker supports a recovery rather than performing one. That sentence is the
-- page's accuracy, not its disclaimer, and it must not be softened into an
-- implied promise by a later edit.
--
-- HEDGES PRESERVED: "up to 3 years when configured for one location update per
-- day", "Battery performance depends on tracking frequency, network conditions,
-- operating environment, and configuration", "a suitable metallic surface",
-- "can detect unauthorized removal".

insert into solutions (slug, name, summary, sections, sort_order, status, last_reviewed_at, seo_title, seo_description)
values (
  'vehicle-recovery',
  'Vehicle and asset recovery tracking',
  'A wire-free magnetic tracker with up to three years of battery life, built for stolen vehicle recovery and asset protection — deployed in seconds, with removal alerts and configurable reporting.',
  jsonb_build_object(

    'what_it_is', jsonb_build_array(
      'A portable GPS tracker that attaches magnetically to a suitable metallic surface and starts reporting immediately. There is no wiring and no permanent installation, so it can be deployed in seconds, moved between assets, and placed where a hardwired unit could not go.',
      'It is built for recovery and asset protection rather than day-to-day fleet management: long battery life, configurable reporting intervals, multiple tracking modes, and an alert if the unit is removed. It supports a recovery by telling you where the asset is — the recovery itself is carried out by the vehicle''s owner and the police.'
    ),

    'problem', jsonb_build_array(
      'A hardwired tracker is the right answer for a vehicle you own and keep. It is the wrong answer for a container you have for a week, a generator on a site for a month, plant that moves between jobs, or a vehicle you want tracked without anyone knowing a tracker was fitted.',
      'Installation is also the moment of exposure. Wiring a unit into a vehicle takes time, leaves evidence, and cannot be done discreetly or at short notice. Sometimes the requirement is simply to attach something now.',
      'And when an asset is taken, the question is never general. It is a specific one — where is it, right now — and the value of a tracker at that moment depends entirely on whether it is still attached and still reporting.'
    ),

    'who_its_for', jsonb_build_array(
      jsonb_build_object('label', 'Owners of high-value vehicles',
        'detail', 'A second, independent unit that a thief who finds and removes the primary tracker does not know about.'),
      jsonb_build_object('label', 'Plant and machinery operators',
        'detail', 'Generators, compressors and equipment that move between sites and are rarely wired for anything.'),
      jsonb_build_object('label', 'Cargo and container operators',
        'detail', 'Temporary tracking on a consignment or a container, for the duration of a movement rather than permanently.'),
      jsonb_build_object('label', 'Anyone needing tracking at short notice',
        'detail', 'Where a unit has to be deployed now, discreetly, without a workshop visit or a wiring loom.'),
      jsonb_build_object('label', 'Fleets wanting a backup unit',
        'detail', 'A hardwired tracker and a magnetic one protect against different failures. The first survives a flat battery; the second survives being found.')
    ),

    'how_it_works', jsonb_build_array(
      jsonb_build_object('title', 'Attach',
        'detail', 'The magnetic mount holds the unit to a suitable metallic surface. No wiring, no workshop, no permanent modification to the asset.'),
      jsonb_build_object('title', 'Configure the interval',
        'detail', 'Reporting frequency is set to the job. Less frequent updates buy battery life; more frequent updates buy movement detail. The trade-off is yours to make, and it is the single decision that most affects how long the unit lasts.'),
      jsonb_build_object('title', 'Track',
        'detail', 'Location through the mobile app, the web platform or SMS, so you are not dependent on one channel at the moment you need it.'),
      jsonb_build_object('title', 'Get told if it moves off the asset',
        'detail', 'The unit can detect unauthorized removal or displacement and generate a removal alert — which matters most in exactly the case the unit exists for.'),
      jsonb_build_object('title', 'Support the recovery',
        'detail', 'Location information supports a recovery led by the owner and the police. The tracker tells you where the asset is; it does not retrieve it.')
    ),

    'what_you_get', jsonb_build_array(
      jsonb_build_object('group', 'Deployment',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Strong magnetic mount',
            'detail', 'Attaches to a suitable metallic surface and is ready to operate — significantly faster to deploy than a hardwired system, and movable between assets.'),
          jsonb_build_object('title', 'No installation required',
            'detail', 'No wiring into the electrical system, which is what makes temporary, portable and discreet deployment possible at all.')
        )),
      jsonb_build_object('group', 'Endurance',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Up to three years of battery life',
            'detail', 'Up to 3 years when configured for one location update per day. Battery performance depends on tracking frequency, network conditions, operating environment, and configuration — a unit reporting every few minutes will not approach that figure, and should not be expected to.'),
          jsonb_build_object('title', 'Configurable tracking intervals',
            'detail', 'Reporting frequency set per application, so the same hardware serves long-term asset monitoring and active movement tracking.')
        )),
      jsonb_build_object('group', 'Recovery features',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Removal and drop-off alert',
            'detail', 'Detection of unauthorized removal or displacement, with an alert — because a recovery tracker that has been taken off the asset is the failure mode that matters.'),
          jsonb_build_object('title', 'Tracking through app, web and SMS',
            'detail', 'Three channels to reach the same information, rather than one that has to be working on the day.'),
          jsonb_build_object('title', 'Multiple tracking modes',
            'detail', 'Modes suited to different recovery and asset monitoring requirements.')
        ))
    ),

    'installation_support', jsonb_build_array(
      'There is no installation in the usual sense — that is the point of the unit. What we do set up is the configuration: reporting interval, tracking mode and where alerts are delivered. Those choices determine both how long the battery lasts and whether the unit is useful on the day something happens.',
      'To be plain about what this is: the tracker provides location information that supports a recovery. It does not perform one. If a vehicle is stolen, the recovery is carried out by the owner and the police, and the tracker is evidence they can act on.',
      'Supplied and configured from the branches in Nairobi, Mombasa and Nakuru, and through agents and technicians elsewhere in the country.'
    )
  ),
  3,
  'published',
  now(),
  'Stolen Vehicle & Asset Recovery Tracking in Kenya',
  'Wire-free magnetic GPS tracker for stolen vehicle recovery and asset protection. Up to 3 years battery, removal alerts, and tracking by app, web or SMS.'
);

insert into faqs (question, answer, scope, scope_id, sort_order, status)
select q.question, q.answer, 'solution', s.id, q.sort_order, 'published'
from solutions s
cross join (values
  ('Does Nebsam recover the vehicle for me?',
   'No. The tracker provides location information that supports a recovery; the recovery itself is carried out by the owner and the police. We are clear about this because it is the wrong thing to discover at the moment you need it.',
   1),
  ('How is this different from a normal tracker?',
   'It is not wired in. A conventional tracker is installed into the vehicle''s electrical system and stays there; this one attaches magnetically to a suitable metallic surface, deploys in seconds and can be moved between assets. Many owners run both, because a thief who finds the wired unit does not know about the second one.',
   2),
  ('Does the battery really last three years?',
   'Up to 3 years when configured for one location update per day. Battery performance depends on tracking frequency, network conditions, operating environment, and configuration, so a unit reporting every few minutes will last a small fraction of that. The interval is the decision that determines the answer.',
   3),
  ('What if someone finds and removes it?',
   'The unit can detect unauthorized removal or displacement and generate a removal alert, so you are told rather than left watching a location that has stopped changing for a reason you cannot see.',
   4),
  ('Can it track things other than vehicles?',
   'Yes. It is designed for vehicles, containers, machinery and other valuable mobile assets — anything with a suitable metallic surface to attach to.',
   5),
  ('How do I see where it is?',
   'Through the mobile app, the web tracking platform or SMS. Having three channels matters more than it sounds: the one you can reach at 3am is the one that counts.',
   6),
  ('Can it be deployed discreetly?',
   'Yes. There is no wiring and no workshop visit, so the unit can be placed quickly and without the installation being evident.',
   7),
  ('How often should it report?',
   'It depends on what you are protecting and for how long. Long-term asset monitoring favours infrequent updates and years of battery; an active movement you want to watch favours frequent updates and a much shorter life. We set it with you rather than shipping a default.',
   8)
) as q(question, answer, sort_order)
where s.slug = 'vehicle-recovery';
