import type { Photo } from '@/lib/media/types';
import coverAntiJamming from '@/assets/photos/blog/what-is-an-anti-jamming-tracker-wide.jpg';
import coverESeal from '@/assets/photos/blog/what-is-a-container-e-seal-wide.jpg';
import coverFuelSiphoning from '@/assets/photos/blog/how-fuel-siphoning-is-detected-wide.jpg';
import coverGeofencing from '@/assets/photos/blog/what-is-geofencing-wide.jpg';
import coverImmobilisation from '@/assets/photos/blog/what-is-vehicle-immobilisation-wide.jpg';
import coverPocRadio from '@/assets/photos/blog/what-is-a-poc-radio-wide.jpg';
import coverTelematics from '@/assets/photos/blog/what-is-telematics-wide.jpg';

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
 * Article covers by post slug, 16:9, with each article's social-share image:
 * the same picture cut to 40:21 by scripts/images/prepare-photos.py, served from
 * public/og/articles/ at a stable URL. Dimensions are the real ones (two
 * sources are narrower than 1,200px and are never upscaled). All are generated
 * scenes; manifest.json records what each review cut or blurred.
 */
export interface ArticleCover extends Photo {
  og: { path: string; width: number; height: number };
}

export const ARTICLE_COVERS: Readonly<Record<string, ArticleCover>> = {
  'how-fuel-siphoning-is-detected': {
    src: coverFuelSiphoning,
    alt: 'Two figures in silhouette beside a fuel tanker at dusk, one holding a hose.',
    og: { path: '/og/articles/how-fuel-siphoning-is-detected.jpg', width: 1200, height: 630 },
  },
  'what-is-a-container-e-seal': {
    src: coverESeal,
    alt: 'A port worker in a reflective vest checking a phone beside an electronic seal fitted to a container door.',
    og: { path: '/og/articles/what-is-a-container-e-seal.jpg', width: 1200, height: 630 },
  },
  'what-is-a-poc-radio': {
    src: coverPocRadio,
    alt: 'Two depot workers in reflective vests talking on handheld radios, with a row of trucks behind them.',
    og: { path: '/og/articles/what-is-a-poc-radio.jpg', width: 1200, height: 630 },
  },
  'what-is-an-anti-jamming-tracker': {
    src: coverAntiJamming,
    alt: 'A 4x4 on a highway under a drawn dome of protected GPS signal, with red jamming waves coming from a mast and a close-up of a small tracker.',
    og: { path: '/og/articles/what-is-an-anti-jamming-tracker.jpg', width: 1200, height: 630 },
  },
  'what-is-geofencing': {
    src: coverGeofencing,
    alt: 'A container truck on a road, with a boundary drawn around the industrial area it is entering.',
    og: { path: '/og/articles/what-is-geofencing.jpg', width: 936, height: 491 },
  },
  'what-is-vehicle-immobilisation': {
    src: coverImmobilisation,
    alt: 'A parked silver 4x4 with a lock symbol and a glowing ring drawn beneath it.',
    og: { path: '/og/articles/what-is-vehicle-immobilisation.jpg', width: 1187, height: 623 },
  },
  'what-is-telematics': {
    src: coverTelematics,
    alt: 'An articulated truck with its headlights on, on a coastal highway at sunset.',
    og: { path: '/og/articles/what-is-telematics.jpg', width: 1200, height: 630 },
  },
};
