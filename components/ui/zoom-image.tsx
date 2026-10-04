import Image, { type ImageProps } from 'next/image';
import { AfterLoad } from '@/components/ui/after-load';
import { ZoomArea } from '@/components/ui/zoom-area';

/**
 * ZOOM IMAGE — a next/image inside a clipping frame that zooms on hover.
 *
 *   mode="whole"  the photograph eases in by 5%. A Server Component: no
 *                 client JavaScript at all. Put `zoom-group` on a link or
 *                 card around it and the picture answers that link's hover
 *                 and keyboard focus too.
 *   mode="area"   a 2x loupe that follows the pointer, for product shots.
 *                 Ships the small ZoomArea client component.
 *
 * Mouse and trackpad only; touch and keyboard see the whole, unzoomed image,
 * which is everything, because nothing is hidden behind the zoom. Behaviour
 * and the reduced-motion rule are in components/ui/media.css.
 *
 * `alt` is required by ImageProps, and the brief requires it on every image.
 * With `cover` (the default) the photograph fills a frame sized by
 * `frameClassName`, usually an aspect-ratio class. A document, which must not
 * be cropped, passes `cover={false}` and keeps its own height.
 *
 * `afterLoad` holds the photo back until the page has loaded, showing its own
 * blur in the frame meanwhile (components/ui/after-load.tsx says why). Only for
 * a static import, which is what carries the blur.
 */
type ZoomImageProps = ImageProps & {
  mode?: 'whole' | 'area';
  /** Classes for the clipping frame: aspect ratio, radius, borders. */
  frameClassName?: string;
  /** Fill the frame and crop to it (photographs), or keep the image's own height (documents). */
  cover?: boolean;
  /** Fetch the photo only after the page has loaded (AfterLoad). Static imports only. */
  afterLoad?: boolean;
};

export function ZoomImage({
  mode = 'whole',
  frameClassName = '',
  cover = true,
  afterLoad = false,
  className = '',
  alt,
  ...image
}: ZoomImageProps) {
  const fit = cover ? 'h-full w-full object-cover' : 'h-auto w-full';
  // A static import carries its own blur placeholder (lib/media/*), so the
  // frame shows the photo's colours while the file arrives.
  const placeholder = typeof image.src === 'object' ? 'blur' : undefined;
  const photo = (
    <Image
      placeholder={placeholder}
      {...image}
      alt={alt}
      className={`${fit} ${className}`.trim()}
    />
  );
  const blur =
    typeof image.src === 'object' && 'blurDataURL' in image.src ? image.src.blurDataURL : undefined;
  // The stand-in is the photo's own 8px blur, softened and overscaled so its
  // edges never show, filling the same frame: no layout shift when it swaps.
  const img =
    afterLoad && blur ? (
      <AfterLoad
        fallback={
          <div
            aria-hidden="true"
            className="h-full w-full scale-110 bg-cover bg-center blur-lg"
            style={{ backgroundImage: `url(${blur})` }}
          />
        }
      >
        {photo}
      </AfterLoad>
    ) : (
      photo
    );

  if (mode === 'area') return <ZoomArea className={frameClassName}>{img}</ZoomArea>;

  return <div className={`zoom-frame zoom-whole ${frameClassName}`.trim()}>{img}</div>;
}
