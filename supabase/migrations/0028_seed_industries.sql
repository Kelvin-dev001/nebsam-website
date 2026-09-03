-- 0028  Industries — thirteen sectors, and only thirteen.
--
-- The list comes from CONTENT_ARCHITECTURE §2.7, which derives it "only from
-- industries the source documents actually name — no invented sectors". That
-- constraint is the whole point of the sprint criterion. An industry page is
-- the easiest page on a website to fabricate: nobody can disprove "we serve the
-- hospitality sector", and every competitor lists twenty sectors they have
-- never worked in. So the list is not extended, not rounded up to a nicer
-- number, and not padded with sectors that sound plausible for Kenya.
--
-- THE HONESTY RULE FOR THIS PAGE TYPE, also from §2.7: "An industry page earns
-- its place only if it says something specific about that sector's operations;
-- otherwise it is a link hub and should be honest about it."
--
-- Six of these have genuinely sector-specific operational content in the
-- sources — logistics, PSV, security companies, cross-border, fuel transport
-- and construction. The other seven do not, and rather than inflate them with
-- generic copy about "improving efficiency", their body says plainly what they
-- are: a starting point that routes you to the solutions that apply. A reader
-- who arrives from "vehicle tracking for NGOs" is better served by an honest
-- signpost than by three paragraphs that could have been written about any
-- sector.
--
-- SCHOOL TRANSPORT IS A CAREFUL CASE. The school bus SOLUTION is a draft
-- blocked on V17-V24 and legal review, so this page must not describe
-- attendance, biometrics, alcohol screening or anything else from that
-- write-up. It routes to speed limiters and tracking, which are documented and
-- which genuinely apply to a school bus, and says nothing about children's
-- data.

insert into industries (slug, name, summary, body, sort_order, status, seo_title, seo_description)
values
  (
    'logistics-and-transport', 'Logistics and transport',
    'Vehicles and cargo moving between the port, the ICDs and inland customers, where visibility ends at the yard gate unless something is fitted to provide it.',
    E'A load leaving Mombasa passes through several custodians before it reaches an inland customer, and the operator is accountable for all of it while being able to see none of it. The gap between dispatch and delivery is where cargo goes missing, where routes quietly lengthen, and where a customer asking "where is my delivery" gets an answer based on a phone call rather than a system.\n\nWhat changes that is a combination rather than one device: tracking on the vehicle, an electronic seal on the container, and a channel that reaches a driver hundreds of kilometres away without depending on him answering a phone. Fuel monitoring matters here too, because long-haul routes are where consumption discrepancies are largest and hardest to attribute.',
    1, 'published',
    'Telematics for Logistics & Transport in Kenya',
    'Vehicle tracking, cargo e-seals, fuel monitoring and PoC radios for logistics operators moving freight between Mombasa, the ICDs and inland Kenya.'
  ),
  (
    'public-service-vehicles', 'Public service vehicles',
    'Buses and matatus, where speed management is a legal requirement, passenger safety is the product, and the vehicle carries takings as well as people.',
    E'A PSV has obligations no other commercial vehicle has. Speed is capped by regulation and enforced through a governor that must report to the NTSA portal, the certificate has to be current at every roadside check, and the consequence of getting either wrong is the vehicle off the road rather than a fine.\n\nBeyond compliance, the operational questions are specific to the sector: is the vehicle running its route, is it stopping where it should, and is the day''s takings on board. Speed limiters answer the first obligation, tracking answers the second, and vehicle security answers the third.',
    2, 'published',
    'Telematics for PSVs & Matatus in Kenya',
    'Speed limiters with NTSA reporting, tracking and vehicle security for buses, matatus and PSV operators across Kenya.'
  ),
  (
    'security-companies', 'Security companies',
    'Guards, patrol teams and response vehicles, where the operational problem is knowing where people are and reaching them instantly.',
    E'A security operation is a communications problem before it is anything else. A guard who cannot raise the control room quickly has no backup, and a control room that cannot see where its patrols are is coordinating from memory.\n\nThis is the sector where PoC radios earn their keep most obviously: teams spread across a city share one channel, an SOS button reaches designated contacts, and the guard patrol function can be mapped so a route is verifiable rather than asserted. Location playback turns "the patrol was done" into something that can be checked.',
    3, 'published',
    'Radios & Tracking for Security Companies in Kenya',
    'PoC radios with SOS alerts and guard patrol mapping, plus vehicle tracking for security firms and response teams across Kenya.'
  ),
  (
    'cross-border-transport', 'Cross-border transport',
    'Cargo and vehicles that do not stop at a frontier, where visibility usually does.',
    E'Cross-border movement multiplies every problem of domestic transport: more custodians, longer gaps between checkpoints, and a much harder time establishing where something went wrong. Cargo that crosses a border and arrives short is difficult to attribute to any point in the chain.\n\nElectronic cargo seals and tracking both continue to work across borders, subject to network coverage and service availability in each area of operation. That last qualifier is the honest part: coverage, not distance, is the limit on any connected device, and it varies along a route in ways worth planning around rather than discovering.',
    4, 'published',
    'Cross-Border Cargo Tracking from Kenya',
    'Electronic cargo seals and vehicle tracking for regional and cross-border transport, subject to network coverage along the route.'
  ),
  (
    'fuel-and-hazardous-transport', 'Fuel and hazardous transport',
    'Tankers and hazardous loads, where what is in the tank is the cargo and every litre is accounted for.',
    E'When the load itself is fuel, the ordinary fuel-monitoring problem inverts: the discrepancy that matters is not consumption but delivery. A drop that does not correspond to a scheduled offload is the event worth alerting on, and it needs a time, a location and a quantity attached to it to be actionable.\n\nSpeed management matters more here than in general haulage, because the consequence of a collision is different. A governor, a tracker and fuel sensing are usually specified together for this work rather than chosen between.',
    5, 'published',
    'Fuel Tanker Monitoring & Tracking in Kenya',
    'Fuel monitoring, speed limiters and tracking for tanker fleets and hazardous goods transport in Kenya.'
  ),
  (
    'construction-and-heavy-equipment', 'Construction and heavy equipment',
    'Plant and vehicles that move between sites, are fuelled on site, and are rarely wired for anything.',
    E'Construction assets are hard to track for practical reasons rather than technical ones. Plant moves between jobs, often on a low-loader; it is fuelled from a bowser rather than a station; and much of it has no convenient power supply to wire a tracker into.\n\nThat is the case a magnetic, battery-powered unit is built for — attached in seconds, moved between assets, and reporting for a long period without maintenance. On-site fuelling is also where fuel accountability is weakest, which makes it the place monitoring repays fastest.',
    6, 'published',
    'Plant & Equipment Tracking for Construction in Kenya',
    'Wire-free asset tracking, fuel monitoring and site radios for construction fleets and heavy equipment operators in Kenya.'
  ),
  -- ── The link hubs. Honest about what they are. ─────────────────────────────
  (
    'school-transport', 'School transport',
    'Buses carrying children, where speed management and vehicle visibility are the baseline expectation of every parent.',
    E'School transport is subject to the same speed-limiter requirement as any other PSV, and controlled speed with a current certificate is the minimum a school is expected to demonstrate. Tracking answers the other routine question — where the bus is now — which is what most enquiries from parents actually amount to.\n\nThis page covers the vehicle. Nebsam''s dedicated school bus management offering, covering attendance and in-bus systems, is not described here and is not yet published.',
    7, 'published',
    'School Bus Tracking & Speed Limiters in Kenya',
    'Speed limiters and vehicle tracking for school transport operators in Kenya.'
  ),
  (
    'corporate-fleets', 'Corporate fleets',
    'Company vehicles and pool cars, where the vehicle is an asset on a balance sheet and a duty of care at the same time.',
    E'Corporate fleets need consistency more than any single capability: one policy applied to every vehicle regardless of who is driving it that week. Tracking and speed management provide the record; vehicle security protects the asset overnight.\n\nThis page is a starting point rather than a sector study. The relevant solutions are below.',
    8, 'published',
    'Fleet Tracking for Corporate Fleets in Kenya',
    'Vehicle tracking, speed management and security for company vehicles and pool fleets in Kenya.'
  ),
  (
    'government-and-institutions', 'Government and institutions',
    'Public fleets, where accountability has to be demonstrable rather than assumed.',
    E'The requirement in a public fleet is usually evidential: not only that vehicles are used properly, but that their use can be shown to have been proper, months later, to someone who was not there.\n\nTracking with retained history and speed management with certificate records both serve that. This page is a starting point; the relevant solutions are below.',
    9, 'published',
    'Vehicle Tracking for Government Fleets in Kenya',
    'Vehicle tracking, speed limiters and retained records for government and institutional fleets in Kenya.'
  ),
  (
    'ngos-and-humanitarian', 'NGOs and humanitarian organisations',
    'Vehicles and consignments moving through multiple locations and custodians, often to places with patchy coverage.',
    E'Humanitarian logistics shares the accountability problem of commercial cargo and adds a harder operating environment: longer distances, weaker network coverage and more handovers.\n\nCargo seals, tracking and radios all apply. Coverage is the honest constraint to plan around — a connected device cannot report from where there is no service, whatever is fitted. This page is a starting point; the relevant solutions are below.',
    10, 'published',
    'Fleet & Cargo Tracking for NGOs in Kenya',
    'Vehicle tracking, cargo seals and radio communication for NGO and humanitarian operations in Kenya and the region.'
  ),
  (
    'car-hire-and-rental', 'Car hire and rental',
    'Vehicles handed to people you do not employ, and expected back.',
    E'A rental operator''s exposure is concentrated in the period the vehicle is out of their control. Tracking answers where it is, geofencing answers whether it left the agreed area, and vehicle security matters because a rental vehicle is a known quantity to anyone planning a theft.\n\nThis page is a starting point rather than a sector study. The relevant solutions are below.',
    11, 'published',
    'Vehicle Tracking for Car Hire & Rental in Kenya',
    'Tracking, geofencing and vehicle security for car hire and rental operators in Kenya.'
  ),
  (
    'agriculture', 'Agriculture',
    'Farm vehicles, produce transport and equipment, often operating where coverage is thin.',
    E'Agricultural operations combine vehicles on public roads with equipment that rarely leaves a property, and the tracking answer differs between them. Produce transport is ordinary haulage with a time constraint; farm equipment is closer to a plant-tracking problem.\n\nThis page is a starting point rather than a sector study. The relevant solutions are below.',
    12, 'published',
    'Vehicle & Equipment Tracking for Agriculture in Kenya',
    'Vehicle tracking, fuel monitoring and asset tracking for agricultural operations in Kenya.'
  ),
  (
    'mining', 'Mining',
    'Site vehicles, plant and haulage in a fixed operating area with its own access control.',
    E'Mining operations run vehicles and plant inside a controlled perimeter, which changes what tracking is for: less about theft on the open road and more about utilisation, movement inside zones and fuel accountability at a site bowser.\n\nThis page is a starting point rather than a sector study. The relevant solutions are below.',
    13, 'published',
    'Vehicle & Plant Tracking for Mining in Kenya',
    'Tracking, geofencing and fuel monitoring for mining site vehicles, plant and haulage operations in Kenya.'
  );
