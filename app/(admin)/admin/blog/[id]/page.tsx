import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/admin/post-editor';
import { serviceClient } from '@/lib/supabase/server';

/**
 * ADMIN — post editor.
 *
 * `/admin/blog/new` creates; `/admin/blog/<uuid>` edits. Dynamic rather than
 * prerendered: an editor must never be served a cached version of the thing
 * they are editing.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Edit post',
  robots: { index: false, follow: false, nocache: true },
};

const EMPTY = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  seo_title: '',
  seo_description: '',
  status: 'draft' as const,
  published_at: '',
  author_id: '',
  category_id: '',
};

export default async function AdminPostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = serviceClient();

  const [{ data: authors }, { data: categories }] = await Promise.all([
    db.from('authors').select('id, name').order('name'),
    db.from('blog_categories').select('id, name').order('name'),
  ]);

  let post = EMPTY as React.ComponentProps<typeof PostEditor>['post'];

  if (id !== 'new') {
    const { data } = await db
      .from('blog_posts')
      .select('id, title, slug, excerpt, body, seo_title, seo_description, status, published_at, author_id, category_id')
      .eq('id', id)
      .maybeSingle();
    if (!data) notFound();
    post = {
      id: data.id,
      title: data.title ?? '',
      slug: data.slug ?? '',
      excerpt: data.excerpt ?? '',
      body: data.body ?? '',
      seo_title: data.seo_title ?? '',
      seo_description: data.seo_description ?? '',
      status: (data.status ?? 'draft') as 'draft' | 'in_review' | 'published',
      published_at: data.published_at ?? '',
      author_id: data.author_id ?? '',
      category_id: data.category_id ?? '',
    };
  }

  return (
    <div className="mx-auto w-full max-w-[52rem] px-5 py-section md:px-8">
      <Link
        href="/admin/blog"
        className="font-mono text-label uppercase tracking-[0.08em] underline underline-offset-4"
      >
        Back to posts
      </Link>
      <h1 className="mt-4 font-display text-h1">{id === 'new' ? 'New post' : 'Edit post'}</h1>

      <PostEditor
        post={post}
        authors={(authors ?? []).flatMap((a) => (a.id && a.name ? [{ id: a.id, name: a.name }] : []))}
        categories={(categories ?? []).flatMap((c) => (c.id && c.name ? [{ id: c.id, name: c.name }] : []))}
      />
    </div>
  );
}
