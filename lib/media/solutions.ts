import type { BandPhoto } from '@/lib/media/types';
import fuelPortrait from '@/assets/photos/solutions/fuel-monitoring-portrait.jpg';
import fuelWide from '@/assets/photos/solutions/fuel-monitoring-wide.jpg';
import keyPortrait from '@/assets/photos/solutions/vehicle-key-programming-portrait.jpg';
import keyWide from '@/assets/photos/solutions/vehicle-key-programming-wide.jpg';
import radioPortrait from '@/assets/photos/solutions/radio-communication-portrait.jpg';
import radioWide from '@/assets/photos/solutions/radio-communication-wide.jpg';
import securityPortrait from '@/assets/photos/solutions/vehicle-security-portrait.jpg';
import securityWide from '@/assets/photos/solutions/vehicle-security-wide.jpg';
import speedPortrait from '@/assets/photos/solutions/speed-governors-portrait.jpg';
import speedWide from '@/assets/photos/solutions/speed-governors-wide.jpg';
import trackingPortrait from '@/assets/photos/solutions/vehicle-tracking-portrait.jpg';
import trackingWide from '@/assets/photos/solutions/vehicle-tracking-wide.jpg';
import videoPortrait from '@/assets/photos/solutions/ai-video-telematics-portrait.jpg';
import videoWide from '@/assets/photos/solutions/ai-video-telematics-wide.jpg';

/**
 * PHOTOGRAPHS: the solution page bands.
 *
 * One registry module per group, not one file for every photo: Next bundles
 * each statically imported image a page's code touches into that page's
 * client chunk (measured in 12n). Import the group a page needs, never a
 * barrel. Rules and the review of each photo: lib/media/types.ts and
 * assets/photos/manifest.json (ADR-0009).
 */

/**
 * Seven of nine. Five of these were left out on 4 Oct 2026 and reused at
 * Kelvin's instruction on 5 Oct (register V90), each cut so it no longer
 * breaks brief 3.6: no Nebsam lettering on an AI figure, no police, no
 * control room, no readable plate or operator name. Vehicle recovery and
 * container e-seal stay without one: in those two the police yard and the
 * customs post are the scene itself, and no cut leaves a usable photo.
 */
export const SOLUTION_PHOTOS: Readonly<Record<string, BandPhoto>> = {
  'vehicle-tracking': {
    wide: trackingWide,
    portrait: trackingPortrait,
    alt: 'A white panel van driving along a coastal road lined with palm trees, with a map pin marking its position.',
  },
  'radio-communication': {
    wide: radioWide,
    portrait: radioPortrait,
    alt: 'Two depot workers in reflective vests talking on handheld radios, with a row of trucks parked behind them.',
  },
  'fuel-monitoring': {
    wide: fuelWide,
    portrait: fuelPortrait,
    alt: "A technician kneeling beside a truck's fuel tank, fitting a fuel level sensor into the top of the tank.",
  },
  'vehicle-security': {
    wide: securityWide,
    portrait: securityPortrait,
    alt: "A technician reaching behind a car's opened dashboard panel, connecting wires to a module in the wiring harness.",
  },
  'vehicle-key-programming': {
    wide: keyWide,
    portrait: keyPortrait,
    alt: 'A technician holding a remote car key beside a key-programming tablet that is cabled to the car.',
  },
  'speed-governors': {
    wide: speedWide,
    portrait: speedPortrait,
    alt: 'A silver PSV minibus with Mombasa and Nairobi route boards driving along a highway, with hills and a town behind.',
  },
  'ai-video-telematics': {
    wide: videoWide,
    portrait: videoPortrait,
    alt: 'A truck pulling a container trailer along a highway at dusk, with a ring marking the camera at the top of its windscreen.',
  },
};
