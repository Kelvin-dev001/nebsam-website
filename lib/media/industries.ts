import type { Photo } from '@/lib/media/types';
import industryConstruction from '@/assets/photos/industries/construction-and-heavy-equipment-portrait.jpg';
import industryFuel from '@/assets/photos/industries/fuel-and-hazardous-transport-portrait.jpg';
import industryLogistics from '@/assets/photos/industries/logistics-and-transport-portrait.jpg';
import industryPsv from '@/assets/photos/industries/public-service-vehicles-portrait.jpg';
import industrySchool from '@/assets/photos/industries/school-transport-portrait.jpg';
import industrySecurity from '@/assets/photos/industries/security-companies-portrait.jpg';

/**
 * PHOTOGRAPHS: the industry photographs.
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

/** Industry photographs by industry slug, 4:5. Generated scenes, gap-fill. */
export const INDUSTRY_PHOTOS: Readonly<Record<string, Photo>> = {
  'public-service-vehicles': {
    src: industryPsv,
    alt: 'A passenger minibus in yellow and blue livery driving down a busy city avenue.',
  },
  'logistics-and-transport': {
    src: industryLogistics,
    alt: 'A truck carrying a shipping container across a port yard stacked with containers.',
  },
  'fuel-and-hazardous-transport': {
    src: industryFuel,
    alt: 'A fuel tanker with flammable-liquid placards, seen from behind on a highway.',
  },
  'school-transport': {
    src: industrySchool,
    alt: 'A yellow school bus parked at a school gate while an adult in a reflective vest checks it.',
  },
  'construction-and-heavy-equipment': {
    src: industryConstruction,
    alt: 'An excavator loading earth into a tipper truck on a building site, watched by a site supervisor.',
  },
  'security-companies': {
    src: industrySecurity,
    alt: 'A patrol vehicle with roof lights on a quiet road, and a guard speaking into a radio.',
  },
};

/**
 * The six sectors the Home industries row shows, in order. An editorial pick
 * from the audiences docs/design/sets/home-BRIEF.md names (logistics, fuel
 * transport, construction, PSV, school transport), plus security companies.
 * Every slug here has a photo above; the row links on to all thirteen.
 */
export const HOME_INDUSTRY_SLUGS = [
  'logistics-and-transport',
  'public-service-vehicles',
  'fuel-and-hazardous-transport',
  'school-transport',
  'construction-and-heavy-equipment',
  'security-companies',
] as const;
