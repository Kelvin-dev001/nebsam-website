import { PhotoBand } from '@/components/ui/photo-band';
import { SOLUTION_PHOTOS } from '@/lib/media/solutions';

/**
 * The solution page's band (PhotoBand), between "What it is" and "The problem
 * it solves". Renders nothing for a solution without a photo (vehicle recovery
 * and container e-seal, register V90).
 */
export function SolutionPhoto({ slug }: { slug: string }) {
  const photo = SOLUTION_PHOTOS[slug];
  return photo ? <PhotoBand photo={photo} /> : null;
}
