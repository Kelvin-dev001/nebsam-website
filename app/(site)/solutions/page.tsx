import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { getSolutions } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';

/**
 * SOLUTIONS INDEX.
 *
 * Lists what is published, in `sort_order`. Nothing here is hard-coded, which
 * matters more than it looks: `school-bus-management` is seeded but held as a
 * draft until V17–V24 and legal review are resolved, and `fleet-management` and
 * `asset-tracking` are reserved slugs that are deliberately not built. A
 * hand-written list would have to remember all three; reading the published
 * view cannot forget.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Telematics Solutions in Kenya',
  description:
    'Vehicle tracking, security, recovery, fuel monitoring, video telematics, speed limiters, cargo security and radio communication, installed and supported across Kenya.',
  path: ROUTES.solutions,
});

export default async function SolutionsIndexPage() {
  const { data } = await getSolutions();
  /**
   * A VIEW drops the NOT NULL of its base table, so `slug` and `name` arrive
   * nullable in the generated types. Filtering rather than asserting: a row
   * missing either cannot be linked to, and silently dropping it is better than
   * rendering a link to `/solutions/null`.
   */
  const solutions = data.flatMap((s) =>
    s.slug && s.name ? [{ ...s, slug: s.slug, name: s.name }] : [],
  );

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Solutions', path: ROUTES.solutions },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              <li>
                <a href={ROUTES.home} className="underline underline-offset-4">
                  Home
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span aria-current="page">Solutions</span>
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 max-w-[22ch] font-display text-h1 text-text-inverse md:text-md-display">
            Solutions
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            What Nebsam installs and supports across Kenya, from branches in Nairobi, Mombasa and
            Nakuru. Each one starts from a problem rather than a device.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          {solutions.length === 0 ? (
            <div className="max-w-prose">
              <Eyebrow>Coming shortly</Eyebrow>
              <p className="mt-4 text-body text-text-secondary">
                Solution pages are being published. In the meantime, tell us what you need on
                WhatsApp and we will answer directly.
              </p>
            </div>
          ) : (
            /* A list with a real measure, not a uniform card grid — brief 6.6
               names that grid as the default answer to avoid. The summary is
               the point: a reader should be able to choose from this page. */
            <ul className="border-t border-border-hairline">
              {solutions.map((solution) => (
                <li key={solution.id} className="border-b border-border-hairline">
                  <a
                    href={ROUTES.solution(solution.slug)}
                    className="group grid gap-x-10 gap-y-2 py-8 md:grid-cols-[22rem_1fr]"
                  >
                    <h2 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                      {solution.name}
                    </h2>
                    {solution.summary ? (
                      <p className="max-w-prose text-body text-text-secondary">
                        {solution.summary}
                      </p>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Shell>
      </Section>
    </main>
  );
}
