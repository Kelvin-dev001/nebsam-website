/**
 * PHOTOGRAPHS THE SITE SHIPS WITH — the one place a page looks one up.
 *
 * These are developer-managed files in public/, not CMS media: they change when
 * Nebsam supplies a new photograph, which is a deploy, not an edit. Keeping
 * them in one typed table means alt text is written once, every image carries
 * its real dimensions (next/image needs them, and CLS depends on them), and
 * docs/ASSET_MAP.md can be checked against a single list.
 *
 * WHAT MAY GO IN HERE (Kelvin, 4 Oct 2026): photographs Nebsam supplies, and
 * the old site's premises photographs. Never the old site's product photos.
 * No people who have not agreed to appear, and no readable vehicle plates.
 */
export interface Photo {
  src: string;
  /** Written for a person who cannot see it: what is there, not what it means. */
  alt: string;
  width: number;
  height: number;
}

/**
 * Branch photographs, by branch slug (lib/company.ts BRANCHES).
 *
 * MOMBASA: the old site's premises set shows the Mombasa branch (Kelvin, 4 Oct
 * 2026). The entrance is used because the sign names the company and nobody is
 * in frame; the reception photo shows a customer through the glass, so it is
 * not used. Nairobi and Nakuru have no photograph yet, and their cards show
 * the branch ImagePlaceholder until they do.
 */
export const BRANCH_PHOTOS: Readonly<Record<string, Photo>> = {
  mombasa: {
    src: '/images/branches/mombasa-branch-entrance.jpg',
    alt: 'The Nebsam Mombasa branch: open gates onto a paved forecourt, and a blue and white building with the Nebsam Digital Solutions (K) Ltd sign above the entrance.',
    width: 1280,
    height: 720,
  },
};
