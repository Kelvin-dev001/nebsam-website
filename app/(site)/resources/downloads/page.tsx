import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ButtonLink } from '@/components/ui/button';
import { getDownloads } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { formatDate, formatFileSize, formatFileType } from '@/lib/format';
import { SHORT_DESCRIPTION, whatsappUrl } from '@/lib/company';

/**
 * DOWNLOAD CENTRE.
 *
 * ── The publication gate is not in this file, and that is the point ─────────
 * `getDownloads()` reads `public_downloads`, whose WHERE clause is
 * `status = 'published' AND cleared_for_publication`. Both conditions, in the
 * view, in the database. This page cannot show an uncleared document even if
 * every line of it were wrong, because it never sees one — and the table's own
 * CHECK constraint refuses a clearance that has no `cleared_by` and
 * `cleared_at`, so a clearance is always attributable to a person.
 *
 * That layering is deliberate. Brief 9.4: never publish a document not
 * supplied, and never one not cleared. A gate implemented in a component is a
 * gate that the next component forgets.
 *
 * ── Why the page is empty today ─────────────────────────────────────────────
 * Four documents are prepared in `content-source/06-downloads/` and none has
 * passed content clearance. That is recorded in the register and in the sprint
 * report; it is NOT recorded on this page, because the reasons are internal —
 * a visitor does not need to be told which retired addresses a draft proposal
 * still contains. The public empty state points at where the information
 * actually lives instead.
 *
 * ── File size before the click ──────────────────────────────────────────────
 * Required by brief 9.4 and by the download-centre notes in the source folder.
 * Three of the four prepared documents exceed the 1.0 MB page budget on their
 * own. Most visitors arrive on a mid-range Android paying for data by the
 * megabyte, and the size is what they decide on. It renders in the metadata
 * line and is repeated in the link's accessible name, so a screen-reader user
 * gets it before activating the link rather than after.
 *
 * ── File delivery is Sprint 12 ──────────────────────────────────────────────
 * No storage bucket exists yet. `file_path` is rendered as the href when a row
 * has one, but no row does, and signed-URL delivery from a private bucket is
 * the uploads sprint's job. A cleared row arriving before then would render
 * without a link rather than with a broken one.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Downloads — brochures and proposals',
  description:
    'Where Nebsam publishes brochures, proposals and specification documents. Specifications also live on the product and solution pages themselves.',
  path: ROUTES.downloads,
});

export default async function DownloadsPage() {
  const { data: downloads } = await getDownloads();

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Resources', path: ROUTES.resources },
    { name: 'Downloads', path: ROUTES.downloads },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} />

          <h1 className="mt-6 max-w-[26ch] font-display text-h1 text-text-inverse md:text-md-display">
            Downloads
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            {SHORT_DESCRIPTION} Every document here shows its file size before you tap it.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          {downloads.length === 0 ? (
            <div className="max-w-prose">
              <p className="text-body-lg text-text-primary">
                There are no documents to download yet.
              </p>
              <p className="mt-4 text-body text-text-secondary">
                The specifications are on the pages themselves rather than behind a download. Every
                product page carries what the device does, what it reports and what it costs, and
                every solution page explains how the system is installed and supported — all of it
                readable without downloading anything or filling in a form.
              </p>
              <p className="mt-4 text-body text-text-secondary">
                <a href={ROUTES.products} className="underline underline-offset-4">
                  Browse products
                </a>
                {' · '}
                <a href={ROUTES.solutions} className="underline underline-offset-4">
                  Browse solutions
                </a>
                {' · '}
                <a href={ROUTES.faqs} className="underline underline-offset-4">
                  Read the FAQs
                </a>
              </p>
              <p className="mt-8 text-body text-text-secondary">
                If you need a written proposal for a specific fleet, ask us and we will prepare one.
              </p>
              <div className="mt-6">
                <ButtonLink
                  href={whatsappUrl(
                    'Hello Nebsam, I would like a written proposal for my vehicle or fleet.',
                  )}
                  variant="primary"
                  size="lg"
                >
                  Request a proposal on WhatsApp
                </ButtonLink>
              </div>
            </div>
          ) : (
            <ul className="border-t border-border-hairline">
              {downloads.map((item) => {
                const size = formatFileSize(item.file_size);
                const type = formatFileType(item.file_type);
                const dated = formatDate(item.document_date);

                /**
                 * The metadata line, assembled from what the row actually has.
                 * A missing field is omitted rather than rendered as "unknown"
                 * — an undated document is a clearance failure upstream, not
                 * something to paper over here.
                 */
                const meta = [type, size, dated, item.version ? `v${item.version}` : null].filter(
                  Boolean,
                );

                /** Size repeated in the accessible name, so it precedes activation. */
                const label = [item.title, type, size].filter(Boolean).join(', ');

                return (
                  <li key={item.id} className="border-b border-border-hairline py-7">
                    <div className="grid gap-x-10 gap-y-3 md:grid-cols-[22rem_1fr]">
                      <div>
                        <h2 className="font-display-tight text-h3 text-text-primary">
                          {item.title}
                        </h2>
                        {meta.length > 0 ? (
                          <p className="mt-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                            {meta.join(' · ')}
                          </p>
                        ) : null}
                      </div>

                      <div className="max-w-prose">
                        {item.description ? (
                          <p className="text-body text-text-secondary">{item.description}</p>
                        ) : null}

                        {item.file_path ? (
                          <p className="mt-4">
                            <a
                              href={item.file_path}
                              aria-label={label}
                              className="inline-flex min-h-[44px] items-center underline underline-offset-4"
                            >
                              Download{size ? ` (${size})` : ''}
                            </a>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Shell>
      </Section>
    </main>
  );
}
