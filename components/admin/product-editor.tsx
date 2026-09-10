'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { saveProduct, type ProductResult } from '@/app/(admin)/admin/products/actions';
import { ProductCommercial } from '@/components/admin/product-commercial';
import { SeoPanel } from '@/components/admin/seo-panel';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

/**
 * PRODUCT EDITOR.
 *
 * ── The two rules it inherits from the blog editor ──────────────────────────
 *
 * No rich-text library. The body is a plain textarea and paragraphs split on
 * blank lines when rendered, which keeps the admin bundle inside the 180 KB
 * route budget and means an editor cannot introduce structure that breaks the
 * design system — `docs/CMS_ARCHITECTURE.md` §3 asks for a constrained toolbar
 * and this is the most constrained one there is.
 *
 * The slug lock is a COURTESY, not a control. Making the input read-only stops
 * an accident and stops nothing else, because the request can be replayed with
 * any value. The server compares the incoming slug against the stored one and
 * writes the 301 itself.
 *
 * ── Why `useActionState` rather than the blog's onSubmit ────────────────────
 *
 * Because it submits without JavaScript. The blog editor calls
 * `savePost(new FormData(...))` from an `onSubmit` handler, which is fine but
 * inert with scripts off. Every form Sprint 11 and 12 added works either way,
 * and the action is UNBOUND with the id in a hidden field — register item V59.
 */

export interface ProductDraft {
  id: string | null;
  name: string;
  slug: string;
  family: string;
  sku: string;
  summary: string;
  body: string;
  specs_text: string;
  features_text: string;
  category_id: string;
  price_kes: string;
  price_visible: boolean;
  availability: string;
  featured: boolean;
  recurring_fee_kes: string;
  recurring_fee_period: string;
  recurring_fee_note: string;
  installation_terms: string;
  status: 'draft' | 'in_review' | 'published';
  seo_title: string;
  seo_description: string;
}

/** Lowercase, hyphenated, no punctuation. Only ever used to SUGGEST a slug. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function ProductEditor({
  product,
  categories,
}: {
  product: ProductDraft;
  categories: { id: string; name: string }[];
}) {
  const [form, setForm] = React.useState<ProductDraft>(product);
  const [result, action, pending] = useActionState<ProductResult | null, FormData>(
    saveProduct,
    null,
  );

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const error = (name: string) =>
    result && !result.ok ? result.fieldErrors?.[name]?.[0] : undefined;

  // The slug is suggested from the name only while the record is NEW and the
  // slug has not been touched. Once a row exists the slug is permanent policy
  // and must never move on its own.
  const slugTouched = React.useRef(Boolean(product.id) || Boolean(product.slug));
  const onName = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: slugTouched.current ? current.slug : slugify(value),
    }));
  };

  const locked = Boolean(product.id) && product.status === 'published';

  return (
    <form action={action} className="mt-8 flex flex-col gap-6">
      {form.id ? <input type="hidden" name="id" value={form.id} /> : null}

      <div role="status" aria-live="polite">
        {result ? (
          <div
            className={[
              'rounded-panel border p-4 text-body-sm',
              result.ok ? 'border-state-ok-ink/40 bg-surface' : 'border-state-alert-ink/40 bg-surface',
            ].join(' ')}
          >
            {result.message}
            {result.ok && !product.id ? (
              <>
                {' '}
                <a
                  href={`/admin/products/${result.id}`}
                  className="text-brand-signal-ink underline decoration-1 underline-offset-4"
                >
                  Open it to add specifications
                </a>
                .
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <fieldset className="rounded-panel border border-border-hairline bg-surface p-5">
        <legend className="px-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
          The product
        </legend>

        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">
              Name <span className="font-normal text-text-secondary">(required)</span>
            </span>
            <input
              name="name"
              value={form.name}
              onChange={(event) => onName(event.target.value)}
              required
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
            />
            <span className="text-body-sm text-text-secondary">
              Use the confirmed name exactly — Standard Tracker, Hybrid Car Alarm, Hybrid ProMax
              Car Alarm. Retired names must never appear.
            </span>
            {error('name') ? (
              <span className="text-body-sm text-state-alert-ink">{error('name')}</span>
            ) : null}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="flex flex-wrap items-center justify-between gap-2 text-body-sm font-medium">
              Web address
              {locked ? (
                <span className="font-mono text-label text-text-secondary">
                  published — changing this creates a redirect
                </span>
              ) : null}
            </span>
            <input
              name="slug"
              value={form.slug}
              onChange={(event) => {
                slugTouched.current = true;
                set('slug', event.target.value);
              }}
              required
              readOnly={locked}
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono read-only:bg-surface-raised read-only:text-text-secondary"
            />
            <span className="text-body-sm text-text-secondary">
              The page will be at <code className="font-mono">{ROUTES.product(form.slug || '…')}</code>.
              Web addresses are permanent; renaming one leaves a redirect behind, which works but
              costs a little of the page&rsquo;s standing in search.
            </span>
            {error('slug') ? (
              <span className="text-body-sm text-state-alert-ink">{error('slug')}</span>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-body-sm font-medium">Family</span>
              <input
                name="family"
                value={form.family}
                onChange={(event) => set('family', event.target.value)}
                placeholder="Trackers"
                className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-body-sm font-medium">Category</span>
              <select
                name="category_id"
                value={form.category_id}
                onChange={(event) => set('category_id', event.target.value)}
                className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
              >
                <option value="">Uncategorised</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Stock code</span>
            <input
              name="sku"
              value={form.sku}
              onChange={(event) => set('sku', event.target.value)}
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Summary</span>
            <textarea
              name="summary"
              value={form.summary}
              onChange={(event) => set('summary', event.target.value)}
              rows={3}
              className="rounded-control border border-border-strong bg-surface px-3 py-2 text-body"
            />
            <span className="text-body-sm text-text-secondary">
              One or two sentences. It appears in the product list and at the top of the page.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Description</span>
            <textarea
              name="body"
              value={form.body}
              onChange={(event) => set('body', event.target.value)}
              rows={8}
              className="rounded-control border border-border-strong bg-surface px-3 py-2 text-body"
            />
            <span className="text-body-sm text-text-secondary">
              Plain paragraphs, separated by a blank line. Never state a figure, a certification or
              a warranty term that has not been confirmed.
            </span>
          </label>
        </div>
      </fieldset>

      <ProductCommercial
        price={form.price_kes}
        onPrice={(value) => set('price_kes', value)}
        recurringFee={form.recurring_fee_kes}
        onRecurringFee={(value) => set('recurring_fee_kes', value)}
        recurringPeriod={form.recurring_fee_period}
        onRecurringPeriod={(value) => set('recurring_fee_period', value)}
        recurringNote={form.recurring_fee_note}
        onRecurringNote={(value) => set('recurring_fee_note', value)}
        availability={form.availability}
        onAvailability={(value) => set('availability', value)}
        priceVisible={form.price_visible}
        onPriceVisible={(value) => set('price_visible', value)}
        featured={form.featured}
        onFeatured={(value) => set('featured', value)}
        installationTerms={form.installation_terms}
        onInstallationTerms={(value) => set('installation_terms', value)}
        error={error}
      />

      <fieldset className="rounded-panel border border-border-hairline bg-surface p-5">
        <legend className="px-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
          Specifications and features
        </legend>

        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Specifications</span>
            <textarea
              name="specs_text"
              value={form.specs_text}
              onChange={(event) => set('specs_text', event.target.value)}
              rows={8}
              className="rounded-control border border-border-strong bg-surface px-3 py-2 font-mono text-mono"
            />
            <span className="text-body-sm text-text-secondary">
              One per line, as <code className="font-mono">Label: value</code> — for example{' '}
              <code className="font-mono">Network: 4G LTE</code>. These are rendered as a real
              table on the page, never behind a tab.{' '}
              <strong>Leave a specification out rather than guessing it.</strong>
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Features</span>
            <textarea
              name="features_text"
              value={form.features_text}
              onChange={(event) => set('features_text', event.target.value)}
              rows={10}
              className="rounded-control border border-border-strong bg-surface px-3 py-2 text-body"
            />
            <span className="text-body-sm text-text-secondary">
              One feature per block, separated by a blank line. The first line is the heading and
              everything after it is the explanation. Keep any hedging exactly as written — “according
              to the configured security logic”, “subject to network and GPS availability”, “where
              supported by the vehicle”.
            </span>
          </label>
        </div>
      </fieldset>

      <SeoPanel
        title={form.seo_title}
        description={form.seo_description}
        onTitle={(value) => set('seo_title', value)}
        onDescription={(value) => set('seo_description', value)}
        fallbackTitle={form.name}
        slugPreview={`nebsamdigital.com${ROUTES.product(form.slug || '…')}`}
        titleError={error('seo_title')}
        descriptionError={error('seo_description')}
      />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">Status</span>
          <select
            name="status"
            value={form.status}
            onChange={(event) => set('status', event.target.value as ProductDraft['status'])}
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          >
            <option value="draft">Draft — not public</option>
            <option value="in_review">In review — not public</option>
            <option value="published">Published — live on the site</option>
          </select>
        </label>

        <Button type="submit" variant="primary" size="lg" disabled={pending}>
          {pending ? 'Saving…' : form.id ? 'Save' : 'Create product'}
        </Button>

        {form.id && form.status === 'published' ? (
          <a
            href={ROUTES.product(form.slug)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center text-body-sm text-brand-signal-ink underline decoration-1 underline-offset-4"
          >
            View the live page
          </a>
        ) : null}
      </div>
    </form>
  );
}
