import { ZoomImage } from '@/components/ui/zoom-image';
import type { Photo } from '@/lib/media/types';

/**
 * The product photograph on a product page (plan D3, ADR-0009): square, on
 * white, with the 2x loupe so a buyer can read a port, a label or a key.
 *
 * AFTER LOAD. On a phone it follows the buy box, below the fold, and is held
 * back until the page has loaded so it never competes with the headline for
 * the connection (12n measurements). The frame keeps its square in the
 * meantime, so nothing moves when it arrives. Capped at 18rem on phones so
 * that, even where a tall phone shows its top edge, it is never the largest
 * thing on the first screen.
 *
 * The hint names the gesture only where the gesture exists: it is shown to
 * hover-capable pointers (media.css .hover-only), never on touch.
 */
export function ProductPhoto({ photo }: { photo: Photo }) {
  return (
    <figure className="m-0 mx-auto w-full max-w-[18rem] sm:max-w-[22rem] lg:mx-0 lg:max-w-none">
      <ZoomImage
        mode="area"
        afterLoad
        src={photo.src}
        alt={photo.alt}
        sizes="(min-width: 1024px) 26rem, 22rem"
        frameClassName="aspect-square rounded-panel bg-surface"
      />
      <figcaption className="hover-only mt-3 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
        Hover to magnify
      </figcaption>
    </figure>
  );
}
