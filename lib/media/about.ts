import type { BandPhoto } from '@/lib/media/types';
import receptionPortrait from '@/assets/photos/about/nairobi-reception-portrait.jpg';
import receptionWide from '@/assets/photos/about/nairobi-reception-wide.jpg';

/**
 * PHOTOGRAPHS: the About page.
 *
 * One registry module per group, never a barrel (lib/media/types.ts says why).
 * A photograph of the real premises: the reception inside the Nairobi head
 * office, the right half of Kelvin's two-photo composite. The left half shows
 * a person whose face is visible, so it is not used (manifest.json).
 */
export const ABOUT_PHOTO: BandPhoto = {
  wide: receptionWide,
  portrait: receptionPortrait,
  alt: 'The reception inside the Nebsam head office in Nairobi: white desks with blue panels, computer screens and black chairs on a marble floor.',
};
