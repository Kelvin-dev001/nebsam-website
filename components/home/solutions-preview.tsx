import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ZoomImage } from '@/components/ui/zoom-image';
import { ROUTES } from '@/lib/constants';
import { HOME_SOLUTIONS_PHOTO } from '@/lib/media/home';
import type { PublicSolution } from '@/types/content';

/**
 * SOLUTIONS — homepage section 5 (brief 9.1), added in Sprint 12n.
 *
 * "Deliberately composed, not a uniform card grid": one photograph and a ruled
 * list, the same list language as /solutions, so the nine read as a set to
 * scan rather than nine boxes to compare. The photo holds its place beside the
 * list on desktop while the list scrolls past it. On a phone the heading comes
 * first, so the photo is never met before the reader knows what it is for:
 * one set of elements, placed by grid areas, rather than markup duplicated
 * per breakpoint.
 *
 * Every name and summary is the solution's own, from the database. Nothing is
 * restated here, so a summary corrected in the admin is corrected on Home too.
 */
export function SolutionsPreview({ solutions }: { solutions: PublicSolution[] }) {
  const listed = solutions.filter((s) => s.slug && s.name);
  if (listed.length === 0) return null;

  return (
    <Section tone="light">
      <Shell>
        <div className="grid items-start gap-x-16 gap-y-10 [grid-template-areas:'head'_'photo'_'list'] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-y-0 lg:[grid-template-areas:'photo_head'_'photo_list']">
          <div className="[grid-area:photo] lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <ZoomImage
              src={HOME_SOLUTIONS_PHOTO.src}
              alt={HOME_SOLUTIONS_PHOTO.alt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              frameClassName="photo-reveal aspect-[4/5] max-h-[70vh] w-full rounded-panel lg:max-h-none"
            />
          </div>

          <div className="[grid-area:head]">
            <Eyebrow>Solutions</Eyebrow>
            <h2 className="mt-4 max-w-prose font-display text-h2 text-text-primary md:text-md-h2">
              What we do, solution by solution.
            </h2>
            {/*
              A claim about the site, not the company: "installed" would be
              wrong for key programming, which is a service, not a fitting.
            */}
            <p className="mt-4 max-w-prose text-body text-text-secondary">
              Each one links to how it works and the questions people ask before they buy.
            </p>
          </div>

          <div className="[grid-area:list]">
            <ul className="border-t border-border-hairline lg:mt-8">
              {listed.map((s) => (
                <li key={s.slug} className="border-b border-border-hairline">
                  <a
                    href={ROUTES.solution(s.slug as string)}
                    className="group grid gap-x-6 gap-y-1 py-5 md:grid-cols-[14rem_minmax(0,1fr)]"
                  >
                    <span className="font-display-tight text-body-lg text-text-primary underline-offset-4 group-hover:underline">
                      {s.name}
                    </span>
                    {s.summary ? (
                      <span className="text-body-sm text-text-secondary">{s.summary}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-body">
              <a
                href={ROUTES.solutions}
                className="text-brand-signal-ink underline underline-offset-4"
              >
                Compare all solutions
              </a>
            </p>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
