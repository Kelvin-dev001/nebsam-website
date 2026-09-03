import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';

/**
 * BLOG INDEX.
 *
 * BREADCRUMB IS Home / Blog, NOT Home / Resources / Blog. `/resources` is a
 * Sprint 10 route and does not exist yet, and a breadcrumb linking to a 404 is
 * the same self-authored error the sitemap kept producing. The trail gains its
 * middle level when the hub is built.
 *
 * The index will be empty until posts are published, and publishing is blocked:
 * every post needs a real byline and V09 — author names, roles and bios — is
 * unanswered. An empty state that says so plainly is the honest rendering, not
 * a placeholder article.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Telematics Insights & Fleet Guides',
  description:
    'Practical guidance on vehicle tracking, fleet telematics, jamming, fuel monitoring and vehicle security in Kenya, from the team that installs it.',
  path: ROUTES.blog,
});

export default async function BlogIndexPage() {
  const { data } = await getBlogPosts();
  const posts = data.flatMap((p) => (p.slug && p.title ? [{ ...p, slug: p.slug, title: p.title }] : []));

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Blog', path: ROUTES.blog },
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
                <span aria-current="page">Blog</span>
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 max-w-[24ch] font-display text-h1 text-text-inverse md:text-md-display">
            Insights
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            Practical guidance on tracking, jamming, fuel and fleet operations in Kenya — written by
            the people who fit the equipment.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          {posts.length === 0 ? (
            <div className="max-w-prose">
              <p className="text-body-lg text-text-primary">The first articles are being written.</p>
              <p className="mt-4 text-body text-text-secondary">
                In the meantime, the solution pages carry the detail — how jamming defeats an
                ordinary tracker, what fuel monitoring actually measures, and what a speed limiter
                has to report. If you have a question we have not answered, ask us on WhatsApp.
              </p>
            </div>
          ) : (
            <ul className="border-t border-border-hairline">
              {posts.map((post) => (
                <li key={post.id} className="border-b border-border-hairline">
                  <a
                    href={ROUTES.blogPost(post.slug)}
                    className="group grid gap-x-10 gap-y-2 py-7 md:grid-cols-[22rem_1fr]"
                  >
                    <div>
                      <h2 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                        {post.title}
                      </h2>
                      {post.published_at ? (
                        <p className="mt-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                          {new Date(post.published_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                          {post.author_name ? ` · ${post.author_name}` : ''}
                        </p>
                      ) : null}
                    </div>
                    {post.excerpt ? (
                      <p className="max-w-prose text-body text-text-secondary">{post.excerpt}</p>
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
