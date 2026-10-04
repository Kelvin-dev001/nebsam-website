import type { Photo } from '@/lib/media/types';
import heroPortrait from '@/assets/photos/home/hero-dusk-highway-portrait.jpg';
import heroWide from '@/assets/photos/home/hero-dusk-highway-wide.jpg';
import solutionsVan from '@/assets/photos/home/solutions-coastal-van-portrait.jpg';

/**
 * PHOTOGRAPHS: the Home hero and the Home Solutions photo.
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

/** The Home hero, art-directed: 4:5 for phones, 16:9 from 640px. */
export const HERO_PHOTO = {
  wide: heroWide,
  portrait: heroPortrait,
  alt: 'An articulated truck with its headlights on, driving along a highway at dusk, with more traffic behind it.',
} as const;

export const HOME_SOLUTIONS_PHOTO: Photo = {
  src: solutionsVan,
  alt: 'A white panel van driving along a coastal road lined with palm trees, with a map pin marking its position.',
};
