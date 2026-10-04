import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ZoomImage } from '@/components/ui/zoom-image';
import { ROUTES } from '@/lib/constants';
import { HOME_INDUSTRY_SLUGS, INDUSTRY_PHOTOS } from '@/lib/media/industries';
import type { PublicIndustry } from '@/types/content';

/**
 * INDUSTRIES — homepage section 8 (brief 9.1: "entry points by sector"),
 * added in Sprint 12n.
 *
 * Six sectors, each a photograph and its name, and a link on to all of them.
 * Below lg the row scrolls sideways with native scrolling and CSS scroll snap:
 * no carousel script, no autoplay, no arrows to miss. The next tile showing at
 * the edge is the affordance. Every tile is a link, so a keyboard user tabs
 * through them and the browser scrolls each into view; nothing is reachable
 * only by swiping. From lg all six sit in one row.
 */
export function IndustriesPreview({ industries }: { industries: PublicIndustry[] }) {
  const bySlug = new Map(industries.map((i) => [i.slug, i]));
  const shown = HOME_INDUSTRY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (i): i is PublicIndustry => Boolean(i?.slug && i.name),
  );
  if (shown.length === 0) return null;

  return (
    <Section tone="light">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-prose">
            <Eyebrow>Industries</Eyebrow>
            <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
              Start from the work your vehicles do.
            </h2>
          </div>
          <a
            href={ROUTES.industries}
            className="text-body text-brand-signal-ink underline underline-offset-4"
          >
            All {industries.length} industries
          </a>
        </div>

        <ul className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {shown.map((industry) => {
            const photo = INDUSTRY_PHOTOS[industry.slug as string];
            return (
              <li
                key={industry.slug}
                className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto"
              >
                <a
                  href={ROUTES.industry(industry.slug as string)}
                  className="zoom-group group block"
                >
                  {photo ? (
                    <ZoomImage
                      src={photo.src}
                      alt={photo.alt}
                      sizes="(min-width: 1024px) 13rem, (min-width: 640px) 40vw, 68vw"
                      frameClassName="photo-reveal aspect-[4/5] rounded-panel"
                    />
                  ) : null}
                  <h3 className="mt-3 font-display-tight text-body-lg text-text-primary underline-offset-4 group-hover:underline">
                    {industry.name}
                  </h3>
                </a>
              </li>
            );
          })}
        </ul>
      </Shell>
    </Section>
  );
}
