import type { Photo } from '@/lib/media/types';
import coverESeal from '@/assets/photos/blog/what-is-a-container-e-seal-wide.jpg';
import coverFuelSiphoning from '@/assets/photos/blog/how-fuel-siphoning-is-detected-wide.jpg';
import coverPocRadio from '@/assets/photos/blog/what-is-a-poc-radio-wide.jpg';

/**
 * PHOTOGRAPHS: the article covers.
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
 * Article covers by post slug, 16:9. Generated scenes. A post without a cover
 * is shown without one, never with a stand-in.
 */
export const ARTICLE_COVERS: Readonly<Record<string, Photo>> = {
  'how-fuel-siphoning-is-detected': {
    src: coverFuelSiphoning,
    alt: 'Two figures in silhouette beside a fuel tanker at dusk, one holding a hose.',
  },
  'what-is-a-container-e-seal': {
    src: coverESeal,
    alt: 'A port worker in a reflective vest checking a phone beside an electronic seal fitted to a container door.',
  },
  'what-is-a-poc-radio': {
    src: coverPocRadio,
    alt: 'Two depot workers in reflective vests talking on handheld radios, with a row of trucks behind them.',
  },
};
