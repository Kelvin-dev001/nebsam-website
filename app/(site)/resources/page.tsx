import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getBlogPosts, getDownloads, getFaqs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { SHORT_DESCRIPTION } from '@/lib/company';

/**
 * RESOURCES HUB — the middle level the blog breadcrumb has been missing since
 * Sprint 9, and the parent of downloads and FAQs.
 *
 * ── Why this is a list and not three cards ──────────────────────────────────
 * Brief 6.6 prohibits "uniform rounded-card grids" and "three-column feature
 * blocks as the default answer", and a hub with exactly three children is the
 * single most likely place on the site to reach for one. So the three
 * destinations are rows in an index, each carrying a real count read from the
 * content layer rather than a decorative icon.
 *
 * The count is the point. "Downloads — nothing published yet" is more useful to
 * a visitor than a tile that looks identical whether the section has forty
 * documents or none, and it is honest about a section that is currently empty
 * on clearance grounds rather than on build grounds.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Telematics Resources, Guides & Downloads',
  description:
    'Guides, answers and documents on vehicle tracking, fuel monitoring and fleet telematics in Kenya, from the team that installs the equipment.',
  path: ROUTES.resources,
});

export default async function ResourcesPage() {
  const [{ data: posts }, { data: faqs }, { data: downloads }] = await Promise.all([
    getBlogPosts(),
    getFaqs('global'),
    getDownloads(),
  ]);

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Resources', path: ROUTES.resources },
  ];

  /**
   * `count` is rendered verbatim, so each entry states its own emptiness in its
   * own words. A shared "0 items" string would be shorter and would tell the
   * reader nothing about *why* a section is empty, which differs per section.
   */
  const entries = [
    {
      href: ROUTES.blog,
      name: 'Insights',
      count:
        posts.length > 0
          ? `${posts.length} article${posts.length === 1 ? '' : 's'}`
          : 'Being written',
      description:
        'Definitions and practical guidance — what telematics actually is, how a GSM jammer defeats an ordinary tracker, what fuel monitoring measures, and what an e-seal proves.',
    },
    {
      href: ROUTES.faqs,
      name: 'Questions',
      count:
        faqs.length > 0 ? `${faqs.length} question${faqs.length === 1 ? '' : 's'}` : 'Being written',
      description:
        'The questions we are actually asked before an installation — where we install, what the price includes, VAT and ongoing costs, and what a tracker can and cannot do.',
    },
    {
      href: ROUTES.downloads,
      name: 'Downloads',
      count:
        downloads.length > 0
          ? `${downloads.length} document${downloads.length === 1 ? '' : 's'}`
          : 'Nothing published yet',
      description:
        'Proposals, brochures and specification documents. Each one shows its file size before you tap it, because most of our visitors are paying for the data.',
    },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />

          <h1 className="mt-6 max-w-[24ch] font-display text-h1 text-text-inverse md:text-md-display">
            Resources
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            {SHORT_DESCRIPTION} This section is where we explain the terms, answer the questions we
            are asked most often, and publish the documents worth keeping.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <ul className="border-t border-border-hairline">
            {entries.map((entry) => (
              <li key={entry.href} className="border-b border-border-hairline">
                <a
                  href={entry.href}
                  className="group grid gap-x-10 gap-y-2 py-7 md:grid-cols-[22rem_1fr]"
                >
                  <div>
                    <h2 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                      {entry.name}
                    </h2>
                    <p className="mt-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                      {entry.count}
                    </p>
                  </div>
                  <p className="max-w-prose text-body text-text-secondary">{entry.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <div className="max-w-prose">
            <Eyebrow>Looking for specifications?</Eyebrow>
            <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
              The detail lives on the solution and product pages.
            </h2>
            <p className="mt-5 text-body text-text-secondary">
              Every solution page states what the system does, how it is installed and what it
              reports. Every product page carries its specifications in the page itself rather than
              in a document you have to download first.
            </p>
            <p className="mt-4 text-body text-text-secondary">
              <a href={ROUTES.solutions} className="underline underline-offset-4">
                Browse solutions
              </a>
              {' · '}
              <a href={ROUTES.products} className="underline underline-offset-4">
                Browse products
              </a>
              {' · '}
              <a href={ROUTES.industries} className="underline underline-offset-4">
                Browse industries
              </a>
            </p>
          </div>
        </Shell>
      </Section>
    </main>
  );
}
