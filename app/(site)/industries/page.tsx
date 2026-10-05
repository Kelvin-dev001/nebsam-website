import { ZoomImage } from '@/components/ui/zoom-image';
import { INDUSTRY_PHOTOS } from '@/lib/media/industries';
import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { getIndustries } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';

/**
 * INDUSTRIES INDEX.
 *
 * Thirteen sectors, and only thirteen. The list is derived in
 * CONTENT_ARCHITECTURE §2.7 "only from industries the source documents actually
 * name — no invented sectors", and it is read from the database rather than
 * written here so it cannot quietly grow.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Fleet Telematics and Tracking by Industry in Kenya',
  description:
    'Vehicle tracking, security and fleet telematics for logistics, PSVs, security firms, construction, agriculture, mining and cross-border transport in Kenya.',
  path: ROUTES.industries,
});

export default async function IndustriesIndexPage() {
  const { data } = await getIndustries();
  const industries = data.flatMap((i) =>
    i.slug && i.name ? [{ ...i, slug: i.slug, name: i.name }] : [],
  );

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Industries', path: ROUTES.industries },
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
                <span aria-current="page">Industries</span>
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 max-w-[22ch] font-display text-h1 text-text-inverse md:text-md-display">
            Industries
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            The sectors Nebsam actually works in. Each page starts from how that sector operates and
            routes to the solutions that apply to it.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          {industries.length === 0 ? (
            <p className="max-w-prose text-body text-text-secondary">
              Industry pages are being published. In the meantime, tell us how you operate on
              WhatsApp and we will answer directly.
            </p>
          ) : (
            <ul className="border-t border-border-hairline">
              {industries.map((i) => (
                <li key={i.id} className="border-b border-border-hairline">
                  {/*
                    A small photo opens the row, as in the catalogue: still a
                    ruled list, not cards (ADR-0008). Empty alt, because the
                    link already names the page; AfterLoad keeps the photos out
                    of the first-paint window.
                  */}
                  <a
                    href={ROUTES.industry(i.slug)}
                    className="zoom-group group grid grid-cols-[4rem_minmax(0,1fr)] items-start gap-x-5 gap-y-2 py-7 md:grid-cols-[4rem_20rem_minmax(0,1fr)] md:gap-x-8"
                  >
                    <span className="row-span-2 md:row-span-1">
                      {INDUSTRY_PHOTOS[i.slug] ? (
                        <ZoomImage
                          afterLoad
                          src={INDUSTRY_PHOTOS[i.slug].portrait}
                          alt=""
                          sizes="4rem"
                          frameClassName="aspect-[4/5] rounded-control"
                        />
                      ) : (
                        <span className="block aspect-[4/5] rounded-control bg-surface-raised" />
                      )}
                    </span>
                    <h2 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                      {i.name}
                    </h2>
                    {i.summary ? (
                      <p className="max-w-prose text-body text-text-secondary">{i.summary}</p>
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
