import type { Photo } from '@/lib/media/types';
import productAntiJammer from '@/assets/photos/products/anti-jammer-tracker-square.jpg';
import productBf888s from '@/assets/photos/products/baofeng-bf-888s-square.jpg';
import productHybridAlarm from '@/assets/photos/products/hybrid-car-alarm-square.jpg';
import productHybridTracker from '@/assets/photos/products/hybrid-tracker-square.jpg';
import productPlusAlarm from '@/assets/photos/products/hybrid-plus-car-alarm-square.jpg';
import productProMaxAlarm from '@/assets/photos/products/hybrid-promax-car-alarm-square.jpg';
import productProMaxPlusAlarm from '@/assets/photos/products/hybrid-promax-plus-car-alarm-square.jpg';
import productProMaxTracker from '@/assets/photos/products/hybrid-pro-max-tracker-square.jpg';
import productProPlusAlarm from '@/assets/photos/products/hybrid-pro-plus-car-alarm-square.jpg';
import productProTracker from '@/assets/photos/products/hybrid-pro-tracker-square.jpg';
import productRecoveryTracker from '@/assets/photos/products/recovery-tracker-square.jpg';
import productS200 from '@/assets/photos/products/inrico-s-200-square.jpg';
import productStandardTracker from '@/assets/photos/products/standard-tracker-square.jpg';
import productT521 from '@/assets/photos/products/inrico-t-521-square.jpg';
import productTk3000 from '@/assets/photos/products/kenwood-tk-3000-square.jpg';
import productTm7 from '@/assets/photos/products/inrico-tm-7-square.jpg';
import productUv5r from '@/assets/photos/products/baofeng-uv-5r-square.jpg';
import productUv82 from '@/assets/photos/products/baofeng-uv-82-square.jpg';

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
 * the canonical ones (CLAUDE.md §5) whatever a box says, and alt text says what
 * a box actually reads where it differs (the Hybrid Pro Plus box reads "Hybrid
 * Pro"). The radios are the manufacturers' product shots.
 */
export const PRODUCT_PHOTOS: Readonly<Record<string, Photo>> = {
  'anti-jammer-tracker': {
    src: productAntiJammer,
    alt: 'The Anti-Jammer Tracker: a black tracking unit with its wiring harness, in front of its retail box.',
  },
  'hybrid-pro-tracker': {
    src: productProTracker,
    alt: 'The Hybrid Pro Tracker: a black tracking unit with its wiring harness, in front of a retail box listing its security features.',
  },
  'hybrid-pro-max-tracker': {
    src: productProMaxTracker,
    alt: 'The Hybrid Pro Max Tracker: the tracking unit, wiring, two key remotes with screens, and its retail box.',
  },
  'hybrid-tracker': {
    src: productHybridTracker,
    alt: 'The Hybrid Tracker: a black tracking unit with its wiring harness, in front of its retail box.',
  },
  'recovery-tracker': {
    src: productRecoveryTracker,
    alt: 'The Recovery Tracker: a compact black wireless unit beside its retail box.',
  },
  'standard-tracker': {
    src: productStandardTracker,
    alt: 'The Standard Tracker: a small tracking unit with its wiring and relay, in front of a brown retail box.',
  },
  'hybrid-car-alarm': {
    src: productHybridAlarm,
    alt: 'The Hybrid Car Alarm kit: a control unit, siren, wiring and two key remotes, with a phone showing the app and the retail box.',
  },
  'hybrid-plus-car-alarm': {
    src: productPlusAlarm,
    alt: 'The Hybrid Plus Car Alarm kit: a control unit, GPS unit, siren, wiring and two key remotes, with a phone showing the app and the retail box.',
  },
  'hybrid-pro-plus-car-alarm': {
    src: productProPlusAlarm,
    alt: 'The Hybrid Pro Plus Car Alarm kit: a control unit, GPS unit, siren and key remotes, in front of a retail box labelled Hybrid Pro Car Alarm System.',
  },
  'hybrid-promax-car-alarm': {
    src: productProMaxAlarm,
    alt: 'The Hybrid ProMax Car Alarm kit: the control unit, siren, wiring, two vibrating key remotes with screens, and its box.',
  },
  'hybrid-promax-plus-car-alarm': {
    src: productProMaxPlusAlarm,
    alt: 'The Hybrid ProMax Plus Car Alarm kit: the control unit, GPS unit, siren, wiring, two vibrating key remotes with screens, and its retail box.',
  },
  'inrico-s-200': {
    src: productS200,
    alt: 'The Inrico S-200 PoC radio: a black handset with an antenna, a touch screen and an orange SOS key.',
  },
  'inrico-t-521': {
    src: productT521,
    alt: 'The Inrico T-521 PoC radio, shown from the front and the back.',
  },
  'inrico-tm-7': {
    src: productTm7,
    alt: 'The Inrico TM-7 mobile radio: the front panel with its screen and keys, and the rear connectors.',
  },
  'baofeng-bf-888s': {
    src: productBf888s,
    alt: 'Two Baofeng BF-888s handheld radios standing in their chargers, beside the box.',
  },
  'baofeng-uv-5r': {
    src: productUv5r,
    alt: 'The Baofeng UV-5R handheld radio in its charging cradle.',
  },
  'baofeng-uv-82': {
    src: productUv82,
    alt: 'The Baofeng UV-82 handheld radio.',
  },
  'kenwood-tk-3000': {
    src: productTk3000,
    alt: 'The Kenwood TK-3000 handheld radio.',
  },
};
