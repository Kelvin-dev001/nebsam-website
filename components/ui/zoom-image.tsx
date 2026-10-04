import Image, { type ImageProps } from 'next/image';
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
 */
type ZoomImageProps = ImageProps & {
  mode?: 'whole' | 'area';
  /** Classes for the clipping frame: aspect ratio, radius, borders. */
  frameClassName?: string;
  /** Fill the frame and crop to it (photographs), or keep the image's own height (documents). */
  cover?: boolean;
};

export function ZoomImage({
  mode = 'whole',
  frameClassName = '',
  cover = true,
  className = '',
  alt,
  ...image
}: ZoomImageProps) {
  const fit = cover ? 'h-full w-full object-cover' : 'h-auto w-full';
  const img = <Image {...image} alt={alt} className={`${fit} ${className}`.trim()} />;

  if (mode === 'area') return <ZoomArea className={frameClassName}>{img}</ZoomArea>;

  return <div className={`zoom-frame zoom-whole ${frameClassName}`.trim()}>{img}</div>;
}
