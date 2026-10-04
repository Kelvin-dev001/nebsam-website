import type { Photo } from '@/lib/media/types';
import productAntiJammer from '@/assets/photos/products/anti-jammer-tracker-square.jpg';
import productProMaxAlarm from '@/assets/photos/products/hybrid-promax-car-alarm-square.jpg';
import productProMaxTracker from '@/assets/photos/products/hybrid-pro-max-tracker-square.jpg';
import productS200 from '@/assets/photos/products/inrico-s-200-square.jpg';

/**
 * PHOTOGRAPHS: the product photographs.
 *
 * One registry module per group, not one file for every photo: Next bundles
 * each statically imported image a page's code touches (dimensions and blur
 * placeholder) into that page's client chunk, so a single registry made every
 * page that shows one photo carry all of them (Contact gained ~2.5 kB for its
 * three branch photos; measured in 12n). Import the group a page needs, never
 * a barrel.
 *
 * Rules for what may go in, and the review of each photo:
 * lib/media/types.ts and assets/photos/manifest.json (ADR-0009).
 */

/**
 * Product photographs by product slug, square, on white. Kelvin confirmed on
 * 4 Oct 2026 that the boxes shown are Nebsam's real packaging, so text and
 * marks printed on them are the packaging's own. The site's product names stay
 * the canonical ones (CLAUDE.md §5) whatever a box says.
 */
export const PRODUCT_PHOTOS: Readonly<Record<string, Photo>> = {
  'anti-jammer-tracker': {
    src: productAntiJammer,
    alt: 'The Anti-Jammer Tracker: a black tracking unit with its wiring harness, in front of its retail box.',
  },
  'hybrid-pro-max-tracker': {
    src: productProMaxTracker,
    alt: 'The Hybrid Pro Max Tracker: the tracking unit, wiring, two key remotes with screens, and its retail box.',
  },
  'hybrid-promax-car-alarm': {
    src: productProMaxAlarm,
    alt: 'The Hybrid ProMax Car Alarm kit: the control unit, siren, wiring, two vibrating key remotes with screens, and its box.',
  },
  'inrico-s-200': {
    src: productS200,
    alt: 'The Inrico S-200 PoC radio: a black handset with an antenna, a touch screen and an orange SOS key.',
  },
};
