import { BRANCHES, COMPANY } from '@/lib/company';
import { ROUTES } from '@/lib/constants';

/** "Nairobi, Mombasa and Nakuru", from the one place branch facts live. */
const branchList = (() => {
  const names = BRANCHES.map((b) => b.name);
  const last = names[names.length - 1];
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${last}` : last;
})();

/**
 * COPY for the homepage set piece "One vehicle, instrumented" (Sprint 12b T4,
 * memo D3 = H1). Brief: docs/design/sets/home-BRIEF.md.
 *
 * Every block names its source. Source hedges are kept WORD FOR WORD; the
 * sentences around them are rewritten for the web (nebsam-content §1). Never
 * used: the 90% fuel claim, "unprecedented", "instant", the NTSA transmission
 * claim (V01), road-sign recognition, or any paraphrase of the rejected
 * Sprint 1 headline.
 */

export interface SetPieceStep {
  label: string;
  heading: string;
  body: string;
  link: { href: string; text: string };
}

/**
 * Intro. Eyebrow and first sentence are the Thesis section's approved copy
 * (components/home/thesis.tsx, Sprint 4, removed in T4 — see git history),
 * which this set piece replaces.
 */
export const INTRO = {
  eyebrow: 'What Nebsam does',
  heading: 'One vehicle, instrumented.',
  // Company name and branches come from lib/company.ts (CLAUDE.md §4: never
  // hard-coded in a component), so this sentence cannot drift from the NAP.
  body:
    `${COMPANY.legalName} installs and supports vehicle tracking, fleet telematics and vehicle ` +
    `security across Kenya, from branches in ${branchList}. Follow one vehicle through what ` +
    'those systems report.',
};

export const STEPS: SetPieceStep[] = [
  {
    // 02-products/trackers/standard-tracker/write-up.md §01 (smartphone or
    // tracking platform; town, country, international route). thesis.tsx
    // "Visibility": position, speed, ignition state; the stale-position line.
    // Hedge: "subject to network and GPS availability" (brief 2.3).
    label: 'Position',
    heading: 'Where the vehicle is, as it moves.',
    body:
      'Position, speed and ignition state, on your smartphone or the tracking platform, subject to ' +
      'network and GPS availability — in town, across the country or on an international route. ' +
      'When a unit stops reporting you see that plainly, rather than a stale position shown as ' +
      'though it were current.',
    link: { href: ROUTES.solution('vehicle-tracking'), text: 'Vehicle tracking' },
  },
  {
    // standard-tracker write-up §02 route playback (review trips, verify routes,
    // investigate movement) and §04 geofence alerts (depots, customer sites,
    // restricted areas; alert on enter or leave).
    label: 'History and boundaries',
    heading: 'Where it has been, and where it may not go.',
    body:
      'Route playback replays past journeys — to review a trip, verify the route taken or ' +
      'investigate a movement. Geofences draw virtual boundaries around a depot, a customer site ' +
      'or a restricted area, and you are alerted when the vehicle enters or leaves one.',
    link: { href: ROUTES.solution('vehicle-tracking'), text: 'Route history and geofences' },
  },
  {
    // 01-solutions/fuel-monitoring/write-up.md §02 ("identifies abnormal fuel
    // level drops and generates alerts when unauthorized fuel draining is
    // detected"; how much, when, where, which vehicle; "don't discover fuel
    // theft at the end of the month") and §03 (refills recorded; verify
    // purchases against actual usage). Sensor placement deliberately not
    // described: audit item C03 is open.
    label: 'Fuel',
    heading: 'Fuel that goes missing is reported, not discovered at month end.',
    body:
      'With fuel monitoring fitted, the system identifies abnormal fuel level drops and generates ' +
      'alerts when unauthorised fuel draining is detected — how much was lost, when and where it ' +
      'happened, and which vehicle was affected. Refills are recorded too, so reported fuel can be ' +
      'checked against what actually went into the tank.',
    link: { href: ROUTES.solution('fuel-monitoring'), text: 'Fuel monitoring' },
  },
  {
    // 01-solutions/ai-video-telematics/write-up.md "How it works", steps 01-03
    // and 06. Hedge: "according to the configured system". KEBS wording per
    // brief 3.5: the SAMPLED video telematics system, KNWA 3006:2024, report
    // BS202445237, 5 Feb 2025, "Complies" — never paraphrased, never widened
    // to trackers or alarms. NTSA absent (V01).
    label: 'Driver and road',
    heading: 'What happens on the road, on camera.',
    body:
      "AI video telematics cameras monitor the driver, the road and the vehicle's surroundings " +
      'according to the configured system, identify supported driving, road and safety events, and ' +
      "record them with the vehicle's details for review. A sample of the video telematics system " +
      'was tested by KEBS against KNWA 3006:2024: laboratory test report BS202445237, 5 February ' +
      '2025 — Complies.',
    link: { href: ROUTES.solution('ai-video-telematics'), text: 'AI video telematics' },
  },
  {
    // THE PEAK. thesis.tsx "Protection" (approved first sentence).
    // 02-products/trackers/anti-jammer-tracker/write-up.md line 79 ("designed to
    // detect GSM/GPS jamming attempts and automatically immobilize the vehicle
    // according to its configured security logic") and line 81 (verbatim).
    // Hedges: "according to its configured security logic"; "where supported by
    // the vehicle" (memo Appendix B).
    label: 'Signal',
    heading: 'Someone switches on a jammer.',
    body:
      'A GSM jammer is cheap and defeats an ordinary tracker by cutting the uplink, so the unit ' +
      'simply goes quiet — indistinguishable from a flat battery or a coverage hole. The ' +
      'Anti-Jammer Tracker is designed to detect GSM/GPS jamming attempts and automatically ' +
      'immobilise the vehicle according to its configured security logic, where supported by the ' +
      'vehicle. A jamming attempt can trigger a security response rather than simply leaving the ' +
      'vehicle unprotected.',
    link: { href: ROUTES.solution('vehicle-security'), text: 'Vehicle security and anti-jamming' },
  },
];

/** Scroll room per beat while pinned, in viewports. The peak gets most. */
export const SPANS = [1, 1, 1, 1, 1.8];

/**
 * The close. Branches from lib/company.ts facts; "agents and technicians"
 * without a count (CLAUDE.md §4). The action label is the site's one label.
 */
export const CLOSE = {
  body:
    'Tracking, fuel monitoring, video telematics and anti-jamming protection — installed and ' +
    `supported from ${branchList}, and through agents and technicians beyond them.`,
  action: 'Talk to us on WhatsApp',
  message: 'Hello Nebsam, I would like to ask about vehicle tracking for my vehicle or fleet.',
} as const;

/** Brief 6.5: illustrative telemetry is labelled, visibly, every time. */
export const STAGE_CAPTION = 'Illustration — not live customer data';
