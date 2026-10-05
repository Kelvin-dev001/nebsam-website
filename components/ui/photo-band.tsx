import { getImageProps } from 'next/image';
import { Shell } from '@/components/layout/section';
import { AfterLoad } from '@/components/ui/after-load';
import type { BandPhoto } from '@/lib/media/types';

/**
 * A page's photo band (plan D5, ADR-0009): on solution and industry pages and
 * About, placed one section below the title band.
 *
 * NOT DIRECTLY UNDER THE TITLE BAND, as the plan first said. On a phone that
 * slot is still in the first screen, and a photo there either costs LCP when
 * it is fetched early or becomes the largest element late if it is deferred.
 * One section down, it is below the fold on every phone, so AfterLoad can hold
 * it back and it never competes with the headline (12n measurements).
 *
 * Art-directed like the Home hero: 4:5 on phones, 3:2 from 640px, contained to
 * 56rem because the sources are only ~900-1,500px wide. Callers render it only
 * when the page has a photo; there is no placeholder band.
 */
export function PhotoBand({ photo }: { photo: BandPhoto }) {
  const common = { alt: photo.alt, sizes: '(min-width: 1024px) 56rem, 100vw' };
  const {
    props: { srcSet: wideSrcSet },
  } = getImageProps({ ...common, src: photo.wide });
  const {
    props: { srcSet: portraitSrcSet, ...img },
  } = getImageProps({ ...common, src: photo.portrait });

  return (
    <div className="bg-surface pb-section md:pb-section-lg" data-section="light">
      <Shell>
        <div className="zoom-frame zoom-whole photo-reveal aspect-[4/5] max-w-[56rem] rounded-panel sm:aspect-[3/2]">
          <AfterLoad fallback={null}>
            <picture>
              <source media="(min-width: 640px)" srcSet={wideSrcSet} sizes={common.sizes} />
              <img
                {...img}
                srcSet={portraitSrcSet}
                alt={photo.alt}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
          </AfterLoad>
        </div>
      </Shell>
    </div>
  );
}
