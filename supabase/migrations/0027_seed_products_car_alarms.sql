-- 0027  Products: the four car alarms with no open audit item.
--
-- The fifth, Hybrid Car Alarm, is blocked by A07 and stays a draft (0025).
--
-- CONFIRMED NAMES, EXACTLY (CLAUDE.md §5). "Hybrid Alarm" is a retired name and
-- must never reach rendered output. The ProMax is the vibrating key remote; the
-- ProMax Plus is the vibrating remote PLUS Anti-Jammer GPS. The source document
-- for the Plus was itself mis-titled and carries a correction note.
--
-- THE RANGE IS A LADDER, and the pages say so. Hybrid Plus adds GPS and app
-- control to an alarm; Hybrid Pro Plus adds anti-jamming to that; ProMax adds
-- the vibrating remote; ProMax Plus has both the vibrating remote and
-- anti-jamming. A buyer landing on one of these needs to know which rung it is,
-- or the range reads as four similar products at four prices.
--
-- NO ABSOLUTE SECURITY CLAIMS. The source material for this family contains
-- "the strongest active vehicle protection system in Kenya" and "no way a thief
-- will drive away with your car"; both are on the never-publish list and
-- neither appears here in any form.
--
-- NO PRICES. None is confirmed for this family (SHOP_ARCHITECTURE §2.1), so
-- every one renders "Request price" and emits Product schema without an Offer.

insert into products (slug, name, family, summary, body, features, specs, category_id, price_kes, availability, featured, status, seo_title, seo_description)
select v.slug, v.name, 'Car alarms', v.summary, v.body, v.features, v.specs, c.id, null, 'in_stock', v.featured, 'published', v.seo_title, v.seo_description
from (values
  (
    'hybrid-plus-car-alarm',
    'Hybrid Plus Car Alarm',
    'A smart alarm with built-in GPS tracking and smartphone door control — alarm protection, live vehicle visibility and remote access in one system.',
    'The entry point to the hybrid range. It combines a conventional alarm with the things an alarm on its own cannot give you: where the vehicle is, where it has been, and the ability to act remotely rather than only be told.',
    jsonb_build_array(
      jsonb_build_object('title', 'Smart alarm with GPS tracking', 'detail', 'Alarm protection and live vehicle visibility in one system, rather than an alarm and a tracker bought separately.'),
      jsonb_build_object('title', 'Mobile app door control', 'detail', 'Smartphone-controlled door access, so the remote is not the only way in.'),
      jsonb_build_object('title', 'Remote engine immobilisation', 'detail', 'Stop the engine remotely when required and restore it when authorised.'),
      jsonb_build_object('title', 'Route history', 'detail', 'Where the vehicle travelled, the routes taken, previous movements and trip activity.'),
      jsonb_build_object('title', 'Geofencing', 'detail', 'Boundaries around the places that matter — home, office, school, workplace — with alerts on entry and exit.')
    ),
    jsonb_build_object('Alarm', 'Smart intrusion alarm', 'Tracking', 'Built-in GPS with route history', 'Control', 'Mobile app door control; remote immobilisation', 'Anti-jamming', 'Not included — see Hybrid Pro Plus or ProMax Plus'),
    false,
    'Hybrid Plus Car Alarm | Alarm with GPS Tracking',
    'A smart car alarm with built-in GPS tracking, route history, geofencing and smartphone door control. Fitted across Kenya.'
  ),
  (
    'hybrid-pro-plus-car-alarm',
    'Hybrid Pro Plus Car Alarm',
    'The Hybrid Plus with Anti-Jammer GPS added — alarm, tracking and smartphone control that keep working when someone tries to jam the signal.',
    'A jammer defeats an ordinary tracker by cutting the uplink, and the unit simply goes quiet. The Pro Plus adds anti-network jamming to the Hybrid Plus set, so interference triggers the configured security response instead of silence.',
    jsonb_build_array(
      jsonb_build_object('title', 'Anti-Jammer GPS tracking', 'detail', 'Anti-network jamming technology, so an attempt to interfere with the tracking signal becomes an event rather than a gap in reporting.'),
      jsonb_build_object('title', 'Smart alarm and intrusion alerts', 'detail', 'Alarm protection with alerts when unauthorised access is detected.'),
      jsonb_build_object('title', 'Mobile app door control', 'detail', 'Smartphone-based access and remote vehicle control.'),
      jsonb_build_object('title', 'Live tracking and route history', 'detail', 'Where the vehicle is now, where it travelled, the routes taken and previous movements.'),
      jsonb_build_object('title', 'Remote immobilisation', 'detail', 'Remote engine control as part of the security response.')
    ),
    jsonb_build_object('Alarm', 'Smart intrusion alarm', 'Tracking', 'Built-in Anti-Jammer GPS', 'Anti-jamming', 'Included', 'Control', 'Mobile app door control; remote immobilisation'),
    false,
    'Hybrid Pro Plus Car Alarm | Anti-Jammer GPS Security',
    'Car alarm with Anti-Jammer GPS tracking, smartphone door control and remote immobilisation. Protection that survives a jamming attempt.'
  ),
  (
    'hybrid-promax-car-alarm',
    'Hybrid ProMax Car Alarm',
    'A car alarm with a vibrating key remote — so the alert reaches you in a noisy mall, at an event, or asleep, rather than reaching a street that has stopped listening.',
    'A siren warns everyone and reaches no one in particular. The ProMax puts the alert on the remote in your pocket: it vibrates the moment the alarm is triggered, which is a discreet and immediate indication that reaches exactly the person who can act on it.',
    jsonb_build_array(
      jsonb_build_object('title', 'Vibrating key remote', 'detail', 'The remote vibrates whenever the alarm is triggered, so you know even when you are far from the vehicle, indoors, in a noisy environment or asleep.'),
      jsonb_build_object('title', 'Intelligent car alarm', 'detail', 'Alarm protection designed to detect unauthorised access or disturbance, activating the audible alarm and alerting you at the same time.'),
      jsonb_build_object('title', 'Discreet alerting', 'detail', 'A vibration draws no attention from anyone but you — which matters when the sensible response is to look rather than to confront.')
    ),
    jsonb_build_object('Alarm', 'Intelligent intrusion alarm', 'Owner alert', 'Vibrating key remote', 'Anti-jamming', 'Not included — see ProMax Plus'),
    true,
    'Hybrid ProMax Car Alarm | Vibrating Remote Alert',
    'A car alarm with a vibrating key remote that alerts you even in a noisy environment or when far from the vehicle. Fitted across Kenya.'
  ),
  (
    'hybrid-promax-plus-car-alarm',
    'Hybrid ProMax Plus Car Alarm',
    'The flagship — a vibrating key remote and built-in Anti-Jammer GPS, layered so defeating one line of defence does not defeat the rest.',
    'Six layers rather than one: the alarm detects, the remote vibrates in your pocket, anti-jamming watches for interference, GPS maintains visibility, immobilisation can stop the vehicle through configured security functions, and the location history supports a recovery afterwards.',
    jsonb_build_array(
      jsonb_build_object('title', 'Vibrating key remote', 'detail', 'Feel the alarm activation directly through the remote, rather than depending on hearing a siren.'),
      jsonb_build_object('title', 'Built-in Anti-Jammer GPS', 'detail', 'Designed to detect attempts to interfere with GSM/GPS communication and activate the configured anti-jamming security response.'),
      jsonb_build_object('title', 'Layered security', 'detail', 'Smart alarm, remote vibration, anti-jamming, GPS tracking, immobilisation and recovery support — so one defeated layer does not end the protection.'),
      jsonb_build_object('title', 'Remote immobilisation', 'detail', 'Immobilise the vehicle remotely or automatically through configured security functions.'),
      jsonb_build_object('title', 'Live tracking and route history', 'detail', 'Location and movement visibility, with history to support an investigation.')
    ),
    jsonb_build_object('Alarm', 'Smart intrusion alarm', 'Owner alert', 'Vibrating key remote', 'Tracking', 'Built-in Anti-Jammer GPS', 'Anti-jamming', 'Included', 'Security layers', 'Six, from detection through recovery support'),
    true,
    'Hybrid ProMax Plus Car Alarm | Vibrating Remote + Anti-Jammer',
    'The flagship car alarm: vibrating key remote, Anti-Jammer GPS, remote immobilisation and layered anti-theft protection. Fitted across Kenya.'
  )
) as v(slug, name, summary, body, features, specs, featured, seo_title, seo_description)
cross join (select id from product_categories where slug = 'car-alarms') c;

-- Join the alarms to vehicle-security, and the two anti-jamming models to
-- vehicle-tracking as well, since they carry a tracker.
insert into product_solutions (product_id, solution_id)
select p.id, s.id
from (values
  ('hybrid-plus-car-alarm',        'vehicle-security'),
  ('hybrid-pro-plus-car-alarm',    'vehicle-security'),
  ('hybrid-promax-car-alarm',      'vehicle-security'),
  ('hybrid-promax-plus-car-alarm', 'vehicle-security'),
  ('hybrid-pro-plus-car-alarm',    'vehicle-tracking'),
  ('hybrid-promax-plus-car-alarm', 'vehicle-tracking')
) as v(product_slug, solution_slug)
join products  p on p.slug = v.product_slug and p.status = 'published'
join solutions s on s.slug = v.solution_slug and s.status = 'published'
on conflict do nothing;
