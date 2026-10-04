import { getImageProps } from 'next/image';
import { Shell } from '@/components/layout/section';
import { AfterLoad } from '@/components/ui/after-load';
import { SOLUTION_PHOTOS } from '@/lib/media/solutions';

/**
 * The photo band on a solution page (plan D5, ADR-0009), between "What it is"
 * and "The problem it solves".
 *
 * NOT DIRECTLY UNDER THE TITLE BAND, as the plan first said. On a phone that
 * slot is still in the first screen, and a photo there either costs LCP when
 * it is fetched early or becomes the largest element late if it is deferred.
 * One section down, it is below the fold on every phone, so AfterLoad can hold
 * it back and it never competes with the headline (12n measurements).
 *
 * Art-directed like the Home hero: 4:5 on phones, 3:2 from 640px, contained to
 * 56rem because the sources are only ~900-1,500px wide. Renders nothing for a
 * solution without a photo (seven of nine, register V90).
 */
export function SolutionPhoto({ slug }: { slug: string }) {
  const photo = SOLUTION_PHOTOS[slug];
  if (!photo) return null;

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
