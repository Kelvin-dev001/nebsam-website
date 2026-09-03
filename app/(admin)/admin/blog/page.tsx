import Link from 'next/link';
import { serviceClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants';

/**
 * ADMIN — post list.
 *
 * Reads through the SERVICE ROLE rather than the public view, because an editor
 * needs to see drafts and scheduled posts, which the public view exists to
 * hide. The route is behind the middleware auth gate and RLS; this page renders
 * nothing a signed-out request can reach.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog',
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published',
};

export default async function AdminBlogListPage() {
  const { data: posts } = await serviceClient()
    .from('blog_posts')
    .select('id, title, slug, status, published_at, updated_at')
    .order('updated_at', { ascending: false });

  const { count: authorCount } = await serviceClient()
    .from('authors')
    .select('*', { head: true, count: 'exact' });

  return (
    <div className="mx-auto w-full max-w-shell px-5 py-section md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-h1">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex min-h-11 items-center rounded-control bg-brand-signal-ink px-5 text-white"
        >
          New post
        </Link>
      </div>

      {/*
        Stated up front rather than discovered at the publish step. V09 — real
        author names, roles and bios — is unanswered, so no author records exist,
        and the Sprint 9 criterion is explicit that there are no anonymous
        bylines. Writing and reviewing work; publishing does not.
      */}
      {!authorCount ? (
        <div
          role="status"
          className="mt-6 max-w-prose rounded-panel border border-state-warn-ink/30 bg-surface p-5"
        >
          <h2 className="font-display-tight text-h3">No authors yet</h2>
          <p className="mt-2 text-body text-text-secondary">
            Posts can be written, reviewed and previewed, but none can be published until at least
            one author exists. A post carries a real byline or none at all — there is deliberately no
            &ldquo;Nebsam Team&rdquo; fallback.
          </p>
        </div>
      ) : null}

      {!posts || posts.length === 0 ? (
        <p className="mt-8 max-w-prose text-body text-text-secondary">
          No posts yet. Start one with <strong>New post</strong>.
        </p>
      ) : (
        <ul className="mt-8 border-t border-border-hairline">
          {posts.map((p) => (
            <li key={p.id} className="border-b border-border-hairline">
              <a
                href={`/admin/blog/${p.id}`}
                className="grid gap-x-6 gap-y-1 py-4 md:grid-cols-[1fr_10rem_12rem]"
              >
                <span className="text-body font-medium">{p.title}</span>
                <span className="font-mono text-mono text-text-secondary">
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
                <span className="font-mono text-mono text-text-secondary">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString('en-GB')
                    : '—'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-body-sm text-text-secondary">
        Published posts appear at <code className="font-mono text-mono">{ROUTES.blog}</code>.
      </p>
    </div>
  );
}
