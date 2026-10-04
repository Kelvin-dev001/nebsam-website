import type { StaticImageData } from 'next/image';
import radioPortrait from '@/assets/photos/solutions/radio-communication-portrait.jpg';
import radioWide from '@/assets/photos/solutions/radio-communication-wide.jpg';
import trackingPortrait from '@/assets/photos/solutions/vehicle-tracking-portrait.jpg';
import trackingWide from '@/assets/photos/solutions/vehicle-tracking-wide.jpg';

/**
 * PHOTOGRAPHS: the solution page bands.
 *
 * One registry module per group, not one file for every photo: Next bundles
 * each statically imported image a page's code touches into that page's
 * client chunk (measured in 12n). Import the group a page needs, never a
 * barrel. Rules and the review of each photo: lib/media/types.ts and
 * assets/photos/manifest.json (ADR-0009).
 */
export interface BandPhoto {
  /** 3:2, from 640px. */
  wide: StaticImageData;
  /** 4:5, phones. */
  portrait: StaticImageData;
  alt: string;
}

/**
 * Two of nine. The other seven images Kelvin supplied were left out on
 * 4 Oct 2026 (ADR-0009, register V90): those pages keep their layout until a
 * real photo, or a regenerated scene without Nebsam branding, arrives.
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
};
