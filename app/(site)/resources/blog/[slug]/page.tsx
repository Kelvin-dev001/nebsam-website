import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { articleSchema, breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';

/**
 * BLOG POST.
 *
 * NO ANONYMOUS BYLINES. The Sprint 9 criterion requires real author profiles,
 * and V09 — names, roles, bios, photos — is unanswered, so no author records
 * exist and nothing can be published yet. This template renders the byline when
 * an author exists and simply omits it otherwise; it never falls back to
 * "Nebsam Team" or an empty attribution, because an invented byline is exactly
 * the fabrication CLAUDE.md §5 forbids and it weakens the E-E-A-T signal the
 * blog exists to build.
 *
 * `Article` schema needs genuine datePublished and dateModified (brief 13.3).
 * The public view already refuses to surface a post without `published_at`, so
 * a post cannot reach this template without a real date.
 *
 * Body is stored as text and rendered as paragraphs split on blank lines. No
 * markdown renderer, for the same reason the solution sections avoid one: a
 * runtime dependency on a 180 KB route budget, and arbitrary structure an
 * editor can use to break the design system.
 */
export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const { data } = await getBlogPosts();
  return data.flatMap((p) => (p.slug ? [{ slug: p.slug }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await getBlogPostBySlug(slug);
  const title = post?.seo_title ?? post?.title;
  if (!post || !title) return {};
  return buildMetadata({
    title,
    description: post.seo_description ?? post.excerpt ?? '',
    path: ROUTES.blogPost(slug),
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await getBlogPostBySlug(slug);
  if (!post || !post.title || !post.published_at) notFound();
  const title = post.title;

  const paragraphs = (post.body ?? '').split(/\n{2,}/).filter((p) => p.trim() !== '');

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Blog', path: ROUTES.blog },
    { name: title, path: ROUTES.blogPost(slug) },
  ];

  /**
   * ARTICLE SCHEMA ONLY WHEN THERE IS A REAL AUTHOR.
   *
   * `articleSchema` requires `authorName`, and that is deliberate — an Article
   * without an author is incomplete markup, and inventing a byline to satisfy
   * the type would be worse than omitting the node. So a post with no author
   * emits breadcrumbs alone rather than an Article asserting an authorship the
   * page does not show. It cannot happen today anyway: V09 is unanswered, no
   * author records exist, and nothing is published.
   */
  const graph = jsonLdGraph([
    ...(post.author_name
      ? [
          articleSchema({
            headline: title,
            description: post.excerpt ?? '',
            path: ROUTES.blogPost(slug),
            authorName: post.author_name,
            datePublished: post.published_at,
            dateModified: post.updated_at ?? post.published_at,
          }),
        ]
      : []),
    breadcrumbSchema(trail),
  ]);

  return (
    <main id="main">
      <JsonLd json={graph} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              {trail.slice(0, 2).map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  <a href={crumb.path} className="underline underline-offset-4">
                    {crumb.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <h1 className="mt-6 max-w-[28ch] font-display text-h1 text-text-inverse md:text-md-display">
            {title}
          </h1>

          <p className="mt-6 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            {/* Byline only when a real author exists. Never a fallback. */}
            {post.author_name ? (
              <>
                {' · '}
                {post.author_name}
                {post.author_role ? `, ${post.author_role}` : ''}
              </>
            ) : null}
            {post.reading_time ? ` · ${post.reading_time} min read` : ''}
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="max-w-prose">
            {post.excerpt ? (
              <p className="text-body-lg text-text-primary">{post.excerpt}</p>
            ) : null}
            {paragraphs.map((para, i) => (
              <p key={i} className="mt-4 text-body text-text-secondary">
                {para}
              </p>
            ))}
          </div>
        </Shell>
      </Section>
    </main>
  );
}
