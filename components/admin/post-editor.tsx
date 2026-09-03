'use client';

import * as React from 'react';
import { autosavePost, savePost, unpublishPost, type ActionResult } from '@/app/(admin)/admin/blog/actions';
import { ROUTES } from '@/lib/constants';

/**
 * POST EDITOR.
 *
 * Built against CMS_ARCHITECTURE §3, where each requirement is paired with the
 * specific way a CMS loses its users. The ones this component implements:
 *
 *   Autosave                 -> "A staff member losing 40 minutes of writing
 *                               and never returning." Losing work once is
 *                               usually enough to lose the user permanently.
 *   Live SEO character counts-> titles truncating in the SERP, found months later
 *   Preview before publish   -> publishing to find out what it looks like
 *   Slug locks after save    -> a permanent URL quietly changed
 *   Helpful validation       -> `duplicate key value violates unique
 *                               constraint` shown to a salesperson
 *
 * NO RICH TEXT EDITOR LIBRARY. The body is a plain textarea and paragraphs are
 * split on blank lines when rendered. That is a deliberate limit: it keeps the
 * admin bundle small, and it means an editor cannot introduce arbitrary
 * structure that breaks the design system — which §3 asks for explicitly.
 *
 * THE SLUG LOCK IS A COURTESY, NOT A CONTROL. Disabling the input stops an
 * accident; it stops nothing else, because the request can be replayed with any
 * value. The server compares the incoming slug against the stored one and
 * creates the 301 itself.
 */

type Post = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'in_review' | 'published';
  published_at: string;
  author_id: string;
  category_id: string;
};

/** SERP truncation points. Warn, do not block — the schema enforces the ceiling. */
const TITLE_IDEAL = 60;
const DESC_IDEAL = 155;

function Counter({ value, ideal }: { value: string; ideal: number }) {
  const n = value.length;
  const over = n > ideal;
  return (
    <span
      className={`font-mono text-label ${over ? 'text-state-alert-ink' : 'text-text-secondary'}`}
      aria-live="polite"
    >
      {n}/{ideal}
      {over ? ' — will truncate' : ''}
    </span>
  );
}

export function PostEditor({
  post,
  authors,
  categories,
}: {
  post: Post;
  authors: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  const [form, setForm] = React.useState<Post>(post);
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [autoState, setAutoState] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const dirty = React.useRef(false);

  const set = <K extends keyof Post>(key: K, value: Post[K]) => {
    dirty.current = true;
    setForm((f) => ({ ...f, [key]: value }));
  };

  /**
   * Autosave, debounced to 4 seconds after typing stops. Only runs on a post
   * that already exists — there is nothing to autosave into before the first
   * explicit save, and creating rows from keystrokes would fill the table with
   * abandoned drafts.
   */
  React.useEffect(() => {
    if (!form.id || !dirty.current) return;
    const t = setTimeout(async () => {
      setAutoState('saving');
      const fd = new FormData();
      fd.set('id', form.id as string);
      fd.set('title', form.title);
      fd.set('excerpt', form.excerpt);
      fd.set('body', form.body);
      const r = await autosavePost(fd);
      setAutoState(r.ok ? 'saved' : 'idle');
      if (r.ok) dirty.current = false;
    }, 4000);
    return () => clearTimeout(t);
  }, [form.id, form.title, form.excerpt, form.body]);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    const r = await savePost(new FormData(e.currentTarget));
    setResult(r);
    setSaving(false);
    if (r.ok) {
      dirty.current = false;
      if (!form.id) setForm((f) => ({ ...f, id: r.id }));
    }
  }

  const fieldError = (name: string) =>
    result && !result.ok ? result.fieldErrors?.[name]?.[0] : undefined;

  return (
    <form onSubmit={onSave} className="mt-8 flex flex-col gap-6">
      {form.id ? <input type="hidden" name="id" value={form.id} /> : null}

      {result ? (
        <div
          role="status"
          className={`rounded-panel border p-4 text-body-sm ${
            result.ok
              ? 'border-state-ok-ink/30 bg-surface text-text-primary'
              : 'border-state-alert-ink/30 bg-surface text-text-primary'
          }`}
        >
          {result.message}
        </div>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-medium">Title</span>
        <input
          name="title"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
        />
        {fieldError('title') ? (
          <span className="text-body-sm text-state-alert-ink">{fieldError('title')}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="flex items-center justify-between text-body-sm font-medium">
          Slug
          {post.id ? (
            <span className="font-mono text-label text-text-secondary">
              locked — changing it creates a 301
            </span>
          ) : null}
        </span>
        <input
          name="slug"
          value={form.slug}
          onChange={(e) => set('slug', e.target.value)}
          required
          readOnly={Boolean(post.id) && form.status === 'published'}
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono read-only:bg-surface-raised read-only:text-text-secondary"
        />
        {fieldError('slug') ? (
          <span className="text-body-sm text-state-alert-ink">{fieldError('slug')}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-medium">Excerpt</span>
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          rows={3}
          className="rounded-control border border-border-strong bg-surface p-3 text-body"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="flex items-center justify-between text-body-sm font-medium">
          Body
          <span className="font-mono text-label text-text-secondary">
            {autoState === 'saving' ? 'Saving…' : autoState === 'saved' ? 'Draft saved' : ''}
          </span>
        </span>
        <textarea
          name="body"
          value={form.body}
          onChange={(e) => set('body', e.target.value)}
          rows={18}
          className="rounded-control border border-border-strong bg-surface p-3 text-body"
        />
        <span className="text-body-sm text-text-secondary">
          Leave a blank line between paragraphs.
        </span>
      </label>

      {/* ── SEO panel, with the live counts §3 asks for ──────────────────── */}
      <fieldset className="rounded-panel border border-border-hairline p-5">
        <legend className="px-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
          Search appearance
        </legend>

        <label className="flex flex-col gap-1.5">
          <span className="flex items-center justify-between text-body-sm font-medium">
            SEO title
            <Counter value={form.seo_title || form.title} ideal={TITLE_IDEAL} />
          </span>
          <input
            name="seo_title"
            value={form.seo_title}
            onChange={(e) => set('seo_title', e.target.value)}
            placeholder={form.title}
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          />
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="flex items-center justify-between text-body-sm font-medium">
            Meta description
            <Counter value={form.seo_description} ideal={DESC_IDEAL} />
          </span>
          <textarea
            name="seo_description"
            value={form.seo_description}
            onChange={(e) => set('seo_description', e.target.value)}
            rows={2}
            className="rounded-control border border-border-strong bg-surface p-3 text-body"
          />
        </label>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">Author</span>
          <select
            name="author_id"
            value={form.author_id}
            onChange={(e) => set('author_id', e.target.value)}
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          >
            <option value="">— none —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {authors.length === 0 ? (
            <span className="text-body-sm text-text-secondary">
              No authors exist yet. A post cannot be published without a real byline.
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">Category</span>
          <select
            name="category_id"
            value={form.category_id}
            onChange={(e) => set('category_id', e.target.value)}
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          >
            <option value="">— none —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">Status</span>
          <select
            name="status"
            value={form.status}
            onChange={(e) => set('status', e.target.value as Post['status'])}
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          >
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-medium">Publish date</span>
        <input
          type="datetime-local"
          name="published_at_local"
          value={form.published_at ? form.published_at.slice(0, 16) : ''}
          onChange={(e) =>
            set('published_at', e.target.value ? new Date(e.target.value).toISOString() : '')
          }
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
        />
        {/* The server needs a full ISO string; the visible control is local time. */}
        <input type="hidden" name="published_at" value={form.published_at} />
        <span className="text-body-sm text-text-secondary">
          A future date schedules the post. It stays invisible until then.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center rounded-control bg-brand-signal-ink px-5 text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>

        {/* Preview: the real page, before anyone else can see it. */}
        {form.id && form.slug ? (
          <a
            href={ROUTES.blogPost(form.slug)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center text-body text-brand-signal-ink underline underline-offset-4"
          >
            Preview
          </a>
        ) : null}

        {form.id && post.status === 'published' ? (
          <button
            type="button"
            onClick={async () => {
              const r = await unpublishPost(form.id as string);
              setResult(r);
              if (r.ok) setForm((f) => ({ ...f, status: 'draft' }));
            }}
            className="inline-flex min-h-11 items-center text-body text-state-alert-ink underline underline-offset-4"
          >
            Unpublish
          </button>
        ) : null}
      </div>
    </form>
  );
}
