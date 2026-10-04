import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ZoomImage } from '@/components/ui/zoom-image';
import { ROUTES } from '@/lib/constants';
import { ARTICLE_COVERS } from '@/lib/media/articles';
import type { PublicBlogPost } from '@/types/content';

/**
 * RESOURCES — homepage section 12 (brief 9.1: "latest articles"), added in
 * Sprint 12n.
 *
 * Three articles, unequal on purpose: the newest leads with its cover, the
 * next two follow as rows (brief 6.6, no uniform grid). An article without a
 * cover is shown without one, never with a stand-in picture.
 */
function Cover({ slug, sizes, className }: { slug: string; sizes: string; className: string }) {
  const cover = ARTICLE_COVERS[slug];
  if (!cover) return null;
  return (
    <ZoomImage
      src={cover.src}
      alt={cover.alt}
      sizes={sizes}
      frameClassName={`photo-reveal aspect-video rounded-panel ${className}`}
    />
  );
}

export function ResourcesPreview({ posts }: { posts: PublicBlogPost[] }) {
  const listed = posts.filter((p) => p.slug && p.title).slice(0, 3);
  if (listed.length === 0) return null;
  const [lead, ...rest] = listed;

  return (
    <Section tone="paper">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-prose">
            <Eyebrow>Resources</Eyebrow>
            <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
              Questions we are asked, answered in full.
            </h2>
          </div>
          <a
            href={ROUTES.blog}
            className="text-body text-brand-signal-ink underline underline-offset-4"
          >
            All articles
          </a>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <article>
            <a href={ROUTES.blogPost(lead.slug as string)} className="zoom-group group block">
              <Cover
                slug={lead.slug as string}
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="w-full"
              />
              {lead.category_name ? (
                <p className="mt-5 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                  {lead.category_name}
                </p>
              ) : null}
              <h3 className="mt-2 font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                {lead.title}
              </h3>
              {lead.excerpt ? (
                <p className="mt-3 max-w-prose text-body text-text-secondary">{lead.excerpt}</p>
              ) : null}
            </a>
          </article>

          <ul className="flex flex-col gap-8 border-t border-border-hairline pt-8 lg:border-t-0 lg:pt-0">
            {rest.map((post) => (
              <li key={post.slug}>
                <article>
                  <a
                    href={ROUTES.blogPost(post.slug as string)}
                    className="zoom-group group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-5"
                  >
                    <Cover
                      slug={post.slug as string}
                      sizes="(min-width: 1024px) 12rem, 40vw"
                      className="w-full"
                    />
                    <span>
                      {post.category_name ? (
                        <span className="block font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                          {post.category_name}
                        </span>
                      ) : null}
                      <span className="mt-1 block font-display-tight text-body-lg text-text-primary underline-offset-4 group-hover:underline">
                        {post.title}
                      </span>
                    </span>
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </Section>
  );
}
