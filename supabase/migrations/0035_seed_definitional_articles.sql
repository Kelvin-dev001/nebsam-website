-- 0035  Definitional content — the seven terms named in the sprint plan.
--
-- telematics · geofencing · immobilisation · anti-jamming · fuel siphoning
-- detection · PoC radio · e-seal
--
-- ── Why these are articles and not a new page type ───────────────────────────
-- docs/CONTENT_ARCHITECTURE.md gives the Article type the job of "acquisition
-- and definitional depth" with a question as its H1, and docs/ROUTE_MAP.md
-- mints no glossary route. Slugs are permanent, so inventing /resources/glossary
-- to hold seven definitions would be minting a URL the route map does not have
-- and the naming has not been confirmed. These live at /resources/blog/[slug],
-- which already exists and already emits Article schema with a real author and
-- real dates.
--
-- ── Sourcing ─────────────────────────────────────────────────────────────────
-- Every factual sentence traces to content-source/ or to copy already approved
-- and published in migrations 0013-0022. Nothing here introduces a
-- specification, a figure, a duration or a claim that is not already live
-- somewhere on this site. Source hedging is carried word for word:
--   "according to the configured security logic"
--   "subject to network and GPS availability"
--   "subject to network coverage and service availability"
--   "subject to the vehicle make, model and security system"
--
-- ── Shape ────────────────────────────────────────────────────────────────────
-- The title is the question a buyer types. The excerpt IS the definition, in one
-- or two sentences, and it renders as the first paragraph on the page — that is
-- the answer-shaped requirement in docs/SEO_LLM_STRATEGY.md §4, and it is the
-- sentence an assistant lifts. Everything after it elaborates.
--
-- Bodies are plain paragraphs separated by blank lines, because that is what the
-- article template renders. No markdown, no headings, no inline links: links out
-- to the relevant solution are rendered by the page from ARTICLE_SOLUTION in
-- lib/constants.ts, so the body cannot rot into a dead link.

insert into blog_posts
  (slug, title, excerpt, body, author_id, category_id, status, published_at,
   reading_time, seo_title, seo_description)
select
  v.slug, v.title, v.excerpt, v.body,
  (select id from authors order by created_at limit 1),
  (select id from blog_categories where slug = v.category),
  'published', timestamptz '2026-09-05 09:00:00+03',
  v.reading_time, v.seo_title, v.seo_description
from (values

-- ─────────────────────────────────────────────────────────────────────────────
('what-is-telematics',
 'What is telematics?',
 'Telematics is the combination of telecommunications and vehicle data: a device in the vehicle collects information about where it is and what it is doing, and sends it over a mobile network to somewhere you can read it.',
 'The word joins "telecommunications" and "informatics", which is accurate but unhelpful. In practice telematics means a unit fitted to a vehicle that knows things — position, speed, ignition state, sometimes fuel level, sometimes what the driver is doing — and reports them to a platform you can open on a phone or a computer.

What separates telematics from a plain GPS tracker is what happens to the data after it arrives. A tracker answers "where is it". A telematics system answers questions you did not ask at the moment the event happened: which vehicles idled for an hour yesterday, which route was taken instead of the assigned one, when the tank level dropped while the engine was off.

That distinction matters commercially, because the cost of a fleet is rarely in the thing you can see. It is in fuel that leaves the tank unexplained, in vehicles that take longer routes than they need to, in a driver whose habits will eventually cost an engine, and in the hours spent phoning people to ask where they are.

Everything a telematics system reports depends on the vehicle being reachable. The unit needs a GPS fix to know where it is and a mobile network to say so, so reporting is subject to network and GPS availability. A system that stops reporting has not necessarily failed — it may be in a place with no coverage — which is exactly why a serious installation treats unexplained silence as an event rather than a gap.

Nebsam Digital Solutions (K) Ltd installs and supports telematics systems across Kenya, from branches in Nairobi, Mombasa and Nakuru.',
 'vehicle-tracking', 2,
 'What is telematics? A plain explanation',
 'Telematics explained in plain terms: what the device collects, what separates it from a plain GPS tracker, and what it depends on to report at all.'),

-- ─────────────────────────────────────────────────────────────────────────────
('what-is-geofencing',
 'What is geofencing?',
 'A geofence is a boundary drawn on a map that a tracking system treats as meaningful: when a vehicle crosses it, the system records the crossing and can alert you.',
 'The boundary is not physical and there is nothing at the roadside. It exists only in the platform — a shape drawn around a depot, a customer site, a quarry, a route corridor or a border post — and the system compares the vehicle''s reported position against it.

What makes it useful is that it converts a continuous stream of positions into a small number of events a person can act on. Nobody watches a map all day. An alert that says a vehicle left the yard at 04:12, or entered a customer site it has no delivery for, is something a supervisor can respond to. A day of position reports is not.

Geofences are also how a system distinguishes normal from abnormal without anyone having to define "normal" in the abstract. A fuel drop inside the fuel station geofence is a fill. The same drop on a quiet stretch of road at night is not. A container leaving a bonded corridor matters in a way the same movement inside the yard does not.

They are configured per operation rather than shipped as defaults, because the boundaries that matter to a cargo operator running to the port are not the ones that matter to a school. As routes, customers and staff change, the geofences and permissions have to change with them, which is part of what ongoing support covers.

Geofence crossings depend on the vehicle reporting its position, so like everything else in a telematics system they are subject to network and GPS availability.',
 'vehicle-tracking', 2,
 'What is geofencing? Boundaries that raise alerts',
 'Geofencing explained: what a geofence actually is, why it turns position data into events a supervisor can act on, and how it is configured per operation.'),

-- ─────────────────────────────────────────────────────────────────────────────
('what-is-vehicle-immobilisation',
 'What is vehicle immobilisation?',
 'Immobilisation is the ability to prevent a vehicle''s engine from starting or continuing to run, either through the vehicle''s own factory immobiliser or through a fitted system that can be triggered remotely.',
 'Every modern vehicle already has an immobiliser. It is the reason a car will not start with a copied key that has no transponder in it: the key talks to the vehicle''s security system, and the engine is only permitted to run when that conversation succeeds. This is also why replacing a lost key means programming the key to the vehicle rather than cutting metal, subject to the vehicle make, model and security system.

The immobilisation people mean when they ask about tracking is the second kind — a relay fitted during installation that can cut the engine on command. Where configured and appropriate, the engine can be immobilised remotely and restored when authorised, according to the configured security logic.

Two things about it are commonly misunderstood, and both matter more than the feature itself.

The first is that it is not enabled by default. It is set up per installation, deliberately, because immobilising a moving vehicle is not something to make easy by accident. What the system does and when it does it is a decision taken at fitting, not a switch left on for anyone with the app.

The second is that immobilisation supports a recovery rather than performing one. Nebsam does not operate a recovery service. What the equipment does is report the vehicle''s position and, where configured, prevent it from being driven further, so that you and the police have something to act on.

It is also why anti-jamming matters: a system that can be silenced before it acts has not protected anything.',
 'vehicle-tracking', 2,
 'What is vehicle immobilisation? Two kinds explained',
 'Vehicle immobilisation explained: the factory immobiliser in every modern car, the remote kind fitted with a tracker, and why it is never on by default.'),

-- ─────────────────────────────────────────────────────────────────────────────
('what-is-an-anti-jamming-tracker',
 'What is an anti-jamming tracker?',
 'An anti-jamming tracker is one that treats the loss of its mobile signal as an event in its own right — alerting you and acting on it — instead of simply going quiet like an ordinary tracker does.',
 'A GSM jammer is a small device that floods the mobile frequencies a tracker uses to report. It does not break the tracker and it does not need to. The unit keeps working, keeps knowing where it is, and cannot say so.

The reason this defeats most installations is not technical, it is interpretive. On a typical platform, a tracker that has stopped reporting looks exactly like a tracker with a flat battery, a loose connection, or a vehicle in a coverage hole. All four produce the same thing on the screen: nothing. By the time anyone decides the silence is suspicious, the vehicle has been gone for an hour.

An anti-jamming tracker changes what that silence means. Losing the uplink is itself the alarm, so the system alerts you and immobilises the vehicle according to the configured security logic, rather than waiting for a report that is never going to arrive.

That behaviour is worth being precise about, because it is easy to oversell. It does not make a vehicle impossible to steal, and no equipment should be described as though it does. What it removes is the specific and very cheap attack of buying a jammer to make a tracked vehicle invisible for the twenty minutes it takes to move it.

It also has an ordinary-day consequence worth knowing about: a vehicle that regularly drives through areas with no coverage will produce silences that are not attacks. Which is why the response is configured per installation rather than applied uniformly.',
 'vehicle-tracking', 2,
 'What is an anti-jamming tracker?',
 'A GSM jammer makes a tracked vehicle go quiet, and silence looks like a flat battery. Here is what an anti-jamming tracker does differently, and its limits.'),

-- ─────────────────────────────────────────────────────────────────────────────
('how-fuel-siphoning-is-detected',
 'How is fuel siphoning detected?',
 'By measuring the fuel level in the tank continuously rather than at intervals, so that fuel leaving the tank appears as an event with a time and a place, rather than as an unexplained difference between two readings.',
 'Fuel loss is difficult to argue about after the fact. A tank that held less than it should at the end of a shift can be explained by consumption, by a heavier load, by traffic, by a longer route, or by siphoning, and a fortnightly reconciliation cannot separate them. That ambiguity is where the cost hides.

A fuel monitoring system removes the ambiguity by changing the sampling. An IoT-based sensor recognises the fuel level in the tank automatically, and by measuring fuel volume precisely it detects tank fill-up and fuel draining volumes continuously, rather than at intervals — which is what makes a siphoning event visible as an event rather than as an unexplained difference between two readings.

Once a drop has a timestamp and a position attached, it stops being a dispute and becomes a fact. A fall in level at a fuel station during a recorded stop is a fill. The same fall on a verge at 23:40, with the engine off, is not, and it can be raised with the person who was driving while they still remember the night in question.

The same measurement answers a quieter question. Not all fuel loss is theft — some is a leak, some is a sensor that needs attention, and some is a route that costs more than anyone realised. A system that reports what actually happened lets you tell those apart instead of assuming the worst about a driver.

Nebsam does not publish a figure for how much fuel a monitoring system saves. Savings depend on the fleet, the routes and what is being lost today, and a percentage borrowed from a vendor brochure is not a number anyone should plan against.',
 'fuel-monitoring', 2,
 'How is fuel siphoning detected?',
 'Fuel siphoning detection explained: why continuous tank measurement turns an unexplained shortfall into an event with a time, a place and a volume.'),

-- ─────────────────────────────────────────────────────────────────────────────
('what-is-a-poc-radio',
 'What is a PoC radio?',
 'A PoC radio — push-to-talk over cellular — is a handset that behaves like a two-way radio but carries the voice over a mobile data network instead of transmitting directly to another handset.',
 'It looks and works like a radio. You press a button, you talk, and everyone on the channel hears you immediately, without dialling anyone or waiting for them to answer. That instant, one-to-many behaviour is the reason radios never went away in operations where a phone call is the wrong tool.

What changes is what carries the voice. A conventional radio transmits to another radio, so the distance between the two is the limit and terrain and buildings interfere. A PoC radio sends the audio over the mobile network, so the distance between two users stops being the limit. A driver in Mombasa can talk to a dispatcher in Nairobi on the same channel.

What replaces distance as the limit is coverage. Communication with teams in other countries is possible, subject to network coverage and service availability. Where there is no mobile data service the handset cannot transmit or receive at all — which is the trade-off against a short-range radio, and the reason many fleets run both.

Range is bounded by network coverage, not by radio distance.

Two practical points usually decide the choice. PoC handsets need a data subscription, which is an ongoing cost a conventional radio does not have. And radio use in Kenya is licensed, so a radio deployment carries a licence renewal payable to the Communications Authority of Kenya. Both are stated on the product pages rather than discovered later.',
 'fleet-operations', 2,
 'What is a PoC radio? Push-to-talk over cellular',
 'PoC radio explained: how push-to-talk over cellular removes the distance limit, what replaces it, and the two ongoing costs that decide the choice.'),

-- ─────────────────────────────────────────────────────────────────────────────
('what-is-a-container-e-seal',
 'What is a container e-seal?',
 'An e-seal is an electronic seal fitted to a shipping container that locks it, tracks it and reports on it — combining an electronic lock, GPS tracking, door and tamper detection, geofencing and an inbuilt camera in one unit.',
 'A conventional bolt seal answers one question, once, at the end: was this container opened between here and there. If the number matches, nothing happened. If it does not, something did — and you find out at the destination, with no idea where or when.

An e-seal answers the same question continuously. Because the seal is also a tracking unit, an opening is recorded with a time and a position at the moment it happens, and can raise an alert rather than waiting to be discovered at delivery. Where the unit carries a camera, an event can also carry an image of what was in front of it.

That changes what the seal is for. A bolt seal is evidence, gathered after the fact and useful mainly in an argument about liability. An e-seal is an alarm — something that can be responded to while the container is still on the road and the cargo is still in it.

It matters most on the routes where the exposure is highest: transit cargo moving inland from the port, bonded goods that must arrive with their integrity provable, and any load that spends a night parked somewhere nobody is watching.

Like every connected unit, an e-seal depends on the network to report, so its alerting is subject to network and GPS availability. What it records does not depend on the network — the events are stored and arrive when the unit can send them — but an alert only reaches you when there is coverage to carry it.',
 'cargo-security', 2,
 'What is a container e-seal?',
 'Container e-seals explained: how an electronic seal differs from a bolt seal, what it records, and why it is an alarm rather than after-the-fact evidence.')

) as v(slug, title, excerpt, body, category, reading_time, seo_title, seo_description);
