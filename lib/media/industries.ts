import type { BandPhoto } from '@/lib/media/types';
import agriculturePortrait from '@/assets/photos/industries/agriculture-portrait.jpg';
import agricultureWide from '@/assets/photos/industries/agriculture-wide.jpg';
import carHirePortrait from '@/assets/photos/industries/car-hire-and-rental-portrait.jpg';
import carHireWide from '@/assets/photos/industries/car-hire-and-rental-wide.jpg';
import constructionPortrait from '@/assets/photos/industries/construction-and-heavy-equipment-portrait.jpg';
import constructionWide from '@/assets/photos/industries/construction-and-heavy-equipment-wide.jpg';
import corporatePortrait from '@/assets/photos/industries/corporate-fleets-portrait.jpg';
import corporateWide from '@/assets/photos/industries/corporate-fleets-wide.jpg';
import crossBorderPortrait from '@/assets/photos/industries/cross-border-transport-portrait.jpg';
import crossBorderWide from '@/assets/photos/industries/cross-border-transport-wide.jpg';
import fuelPortrait from '@/assets/photos/industries/fuel-and-hazardous-transport-portrait.jpg';
import fuelWide from '@/assets/photos/industries/fuel-and-hazardous-transport-wide.jpg';
import governmentPortrait from '@/assets/photos/industries/government-and-institutions-portrait.jpg';
import governmentWide from '@/assets/photos/industries/government-and-institutions-wide.jpg';
import logisticsPortrait from '@/assets/photos/industries/logistics-and-transport-portrait.jpg';
import logisticsWide from '@/assets/photos/industries/logistics-and-transport-wide.jpg';
import miningPortrait from '@/assets/photos/industries/mining-portrait.jpg';
import miningWide from '@/assets/photos/industries/mining-wide.jpg';
import ngoPortrait from '@/assets/photos/industries/ngos-and-humanitarian-portrait.jpg';
import ngoWide from '@/assets/photos/industries/ngos-and-humanitarian-wide.jpg';
import psvPortrait from '@/assets/photos/industries/public-service-vehicles-portrait.jpg';
import psvWide from '@/assets/photos/industries/public-service-vehicles-wide.jpg';
import schoolPortrait from '@/assets/photos/industries/school-transport-portrait.jpg';
import schoolWide from '@/assets/photos/industries/school-transport-wide.jpg';
import securityPortrait from '@/assets/photos/industries/security-companies-portrait.jpg';
import securityWide from '@/assets/photos/industries/security-companies-wide.jpg';

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

/**
 * Industry photographs by industry slug: 4:5 for phones and the Home row, 3:2
 * for the band on each industry page. All thirteen are generated scenes
 * (gap-fill, brief 3.6); manifest.json records what each review removed.
 */
export const INDUSTRY_PHOTOS: Readonly<Record<string, BandPhoto>> = {
  'logistics-and-transport': {
    wide: logisticsWide,
    portrait: logisticsPortrait,
    alt: 'A truck carrying a shipping container across a port yard stacked with containers.',
  },
  'public-service-vehicles': {
    wide: psvWide,
    portrait: psvPortrait,
    alt: 'A passenger minibus in yellow and blue livery driving down a busy city avenue.',
  },
  'fuel-and-hazardous-transport': {
    wide: fuelWide,
    portrait: fuelPortrait,
    alt: 'A fuel tanker with flammable-liquid placards on a highway.',
  },
  'school-transport': {
    wide: schoolWide,
    portrait: schoolPortrait,
    alt: 'A yellow school bus parked at a school gate while an adult in a reflective vest checks it.',
  },
  'construction-and-heavy-equipment': {
    wide: constructionWide,
    portrait: constructionPortrait,
    alt: 'An excavator loading earth into a tipper truck on a building site, watched by a site supervisor.',
  },
  'security-companies': {
    wide: securityWide,
    portrait: securityPortrait,
    alt: 'A patrol vehicle with roof lights on a quiet road, and a guard speaking into a radio.',
  },
  'cross-border-transport': {
    wide: crossBorderWide,
    portrait: crossBorderPortrait,
    alt: 'A container truck stopped at a border post under a Kenyan flag, with officials checking its papers.',
  },
  'corporate-fleets': {
    wide: corporateWide,
    portrait: corporatePortrait,
    alt: 'Company cars and 4x4s parked in a row outside an office block, with a man checking a tablet.',
  },
  'government-and-institutions': {
    wide: governmentWide,
    portrait: governmentPortrait,
    alt: 'A convoy of white 4x4s at an official compound with a Kenyan flag, staff standing by.',
  },
  'ngos-and-humanitarian': {
    wide: ngoWide,
    portrait: ngoPortrait,
    alt: 'A white 4x4 driving along a dusty village road past homes and people.',
  },
  'car-hire-and-rental': {
    wide: carHireWide,
    portrait: carHirePortrait,
    alt: 'A row of rental cars in a forecourt, with an attendant checking a tablet.',
  },
  agriculture: {
    wide: agricultureWide,
    portrait: agriculturePortrait,
    alt: 'A pickup parked on a farm track beside cabbage fields, with a tractor working behind it.',
  },
  mining: {
    wide: miningWide,
    portrait: miningPortrait,
    alt: 'A haul truck on a track in an open-pit mine.',
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
