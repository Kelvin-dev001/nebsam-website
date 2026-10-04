import type { Photo } from '@/lib/media/types';
import mombasaBranch from '@/assets/photos/branches/mombasa-branch-entrance-wide.jpg';
import nairobiBranch from '@/assets/photos/branches/nairobi-branch-hq-wide.jpg';
import nakuruBranch from '@/assets/photos/branches/nakuru-branch-front-wide.jpg';

/**
 * PHOTOGRAPHS: the branch photographs.
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
 * Branch photographs, by branch slug (lib/company.ts BRANCHES). All three are
 * photographs of the real premises.
 *
 * MOMBASA is the old site's entrance photo (Kelvin: its premises set is the
 * Mombasa branch); the reception photo shows a customer, so it is not used.
 * NAKURU's fascia prints 0769 063 333, which is a Mombasa number in
 * lib/company.ts (register V89).
 */
export const BRANCH_PHOTOS: Readonly<Record<string, Photo>> = {
  nairobi: {
    src: nairobiBranch,
    alt: 'The Nebsam head office in Nairobi: a white two-storey building with a blue roof edge and the sign "Nebsam HQ", a reception entrance, and a gravel car park in front.',
  },
  mombasa: {
    src: mombasaBranch,
    alt: 'The Nebsam Mombasa branch: open gates onto a paved forecourt, and a blue and white building with the Nebsam Digital Solutions (K) Ltd sign above the entrance.',
  },
  nakuru: {
    src: nakuruBranch,
    alt: 'The Nebsam Nakuru branch shopfront: a blue fascia sign reading Nebsam Digital Solutions (K) Ltd above an open doorway, with product posters on either side.',
  },
};
