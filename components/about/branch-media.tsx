import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { ZoomImage } from '@/components/ui/zoom-image';
import { BRANCH_PHOTOS } from '@/lib/media';

/**
 * The photograph at the top of a branch card, or the branch placeholder where
 * Nebsam has not supplied one yet (lib/media.ts says which is which).
 *
 * It bleeds to the card's edges: the negative margins cancel the card's 1.5rem
 * padding (components/ui/surfaces.css) and the top corners follow its radius,
 * less the 1px border, so the photograph sits inside the outline rather than
 * over it. Put `zoom-group` on the card and hovering anywhere on it eases the
 * photograph in, the same gesture as the links inside.
 *
 * Every branch card shows the same 16:9 frame, photo or not, so the three
 * cards keep one shape and their headings stay level.
 */
export function BranchMedia({ slug, town }: { slug: string; town: string }) {
  const photo = BRANCH_PHOTOS[slug];
  const frame = '-mx-6 -mt-6 mb-5 aspect-[16/9] rounded-t-[calc(var(--radius-panel)-1px)]';

  if (!photo) {
    return (
      <ImagePlaceholder
        kind="branch"
        caption={`${town} branch`}
        note={`${town} branch exterior or showroom, 2000 × 1333, no recognisable people or readable plates`}
        className={`${frame} overflow-hidden`}
      />
    );
  }

  return (
    <ZoomImage
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes="(min-width: 768px) 33vw, 100vw"
      frameClassName={frame}
    />
  );
}
