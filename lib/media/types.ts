import type { StaticImageData } from 'next/image';

/**
 * PHOTOGRAPHS THE SITE SHIPS WITH. Look one up in the group module for its
 * kind (home, branches, industries, products, articles), never by path.
 *
 * Every file is made by scripts/images/prepare-photos.py from
 * assets/photos/manifest.json, which records where each came from and what
 * its review found. Static imports give next/image the real dimensions (CLS)
 * and a blur placeholder, and a missing file is a build error, not a broken
 * image in production.
 *
 * WHAT MAY GO IN HERE (Kelvin, 4 Oct 2026, and brief 3.6): photographs Nebsam
 * supplies; AI-generated scenes only to fill a gap, and never showing Nebsam
 * staff, premises, vehicles or the platform; never the old site's product
 * photos. No identifiable person without consent, no readable plate, no
 * children.
 *
 * ALT TEXT describes what is in the picture, for someone who cannot see it.
 * It never claims an event happened: most scenes are generated.
 */
export interface Photo {
  src: StaticImageData;
  alt: string;
}

/**
 * A photograph that is art-directed: a 4:5 crop for phones and a 3:2 crop from
 * 640px. The page bands on solution, industry and About pages (PhotoBand).
 */
export interface BandPhoto {
  wide: StaticImageData;
  portrait: StaticImageData;
  alt: string;
}
