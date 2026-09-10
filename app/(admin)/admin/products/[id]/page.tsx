import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { specsToText, featuresToText, parseSpecs, parseFeatures } from '@/lib/admin/product-fields';
import { PageHeader } from '@/components/admin/primitives';
import { ProductEditor, type ProductDraft } from '@/components/admin/product-editor';

/**
 * ADD OR EDIT A PRODUCT.
 *
 * `/admin/products/new` and `/admin/products/<uuid>` are the same screen. One
 * editor rather than a create form and an edit form, because two forms drift and
 * the second one is always the one missing the field somebody added last month.
 *
 * ── The parsed-back panel at the bottom ─────────────────────────────────────
 *
 * `specs` and `features` are edited as plain text against a convention
 * (`lib/admin/product-fields.ts`). Any convention a person types into is a
 * convention they can get slightly wrong, so the saved record is parsed and
 * shown BACK to them exactly as the public page will read it. They do not have
 * to trust the convention — they can see what the site received.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Product',
  robots: { index: false, follow: false, nocache: true },
};

const EMPTY: ProductDraft = {
  id: null,
  name: '',
  slug: '',
  family: '',
  sku: '',
  summary: '',
  body: '',
  specs_text: '',
  features_text: '',
  category_id: '',
  price_kes: '',
  price_visible: true,
  availability: 'in_stock',
  featured: false,
  recurring_fee_kes: '',
  recurring_fee_period: '',
  recurring_fee_note: '',
  installation_terms: '',
  status: 'draft',
  seo_title: '',
  seo_description: '',
};

export default async function AdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireStaff('editor');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const { id } = await params;
  const isNew = id === 'new';

  const [{ data: row }, { data: categories }] = await Promise.all([
    isNew
      ? Promise.resolve({ data: null })
      : serviceClient().from('products').select('*').eq('id', id).maybeSingle(),
    serviceClient().from('product_categories').select('id, name').order('sort_order'),
  ]);

  if (!isNew && !row) notFound();

  const draft: ProductDraft = row
    ? {
        id: row.id,
        name: row.name,
        slug: row.slug,
        family: row.family ?? '',
        sku: row.sku ?? '',
        summary: row.summary ?? '',
        body: row.body ?? '',
        specs_text: specsToText(row.specs),
        features_text: featuresToText(row.features),
        category_id: row.category_id ?? '',
        price_kes: row.price_kes === null ? '' : String(row.price_kes),
        price_visible: row.price_visible,
        availability: row.availability,
        featured: row.featured,
        recurring_fee_kes: row.recurring_fee_kes === null ? '' : String(row.recurring_fee_kes),
        recurring_fee_period: row.recurring_fee_period ?? '',
        recurring_fee_note: row.recurring_fee_note ?? '',
        installation_terms: row.installation_terms ?? '',
        status: row.status,
        seo_title: row.seo_title ?? '',
        seo_description: row.seo_description ?? '',
      }
    : EMPTY;

  // What the site actually holds, read back through the same parsers the save
  // action uses. Not the text the editor typed — the structure it became.
  const savedSpecs = row ? parseSpecs(specsToText(row.specs)) : {};
  const savedFeatures = row ? parseFeatures(featuresToText(row.features)) : [];

  return (
    <div className="max-w-[52rem]">
      <Link
        href="/admin/products"
        className="inline-flex min-h-11 items-center text-body-sm text-brand-signal-ink underline decoration-1 underline-offset-4"
      >
        ← Back to products
      </Link>

      <div className="mt-2">
        <PageHeader
          title={isNew ? 'New product' : draft.name}
          lead={
            isNew
              ? 'Create the record first, then add specifications and features to it.'
              : `Last changed ${row ? new Date(row.updated_at).toLocaleString('en-GB') : ''}`
          }
        />
      </div>

      <ProductEditor product={draft} categories={categories ?? []} />

      {!isNew ? (
        <section className="mt-12">
          <h2 className="font-display-tight text-h3">What the site is showing</h2>
          <p className="mt-1 max-w-prose text-body-sm text-text-secondary">
            Read back out of the saved record, so you can check the specifications and features came
            through the way you meant them. If a line is missing here, it did not match the
            convention above and was skipped rather than saved wrongly.
          </p>

          <h3 className="mt-6 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
            Specifications ({Object.keys(savedSpecs).length})
          </h3>
          {Object.keys(savedSpecs).length === 0 ? (
            <p className="mt-2 text-body-sm text-text-secondary">None saved.</p>
          ) : (
            <dl className="mt-2 border-t border-border-hairline">
              {Object.entries(savedSpecs).map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 border-b border-border-hairline py-2 sm:grid-cols-[14rem_1fr] sm:gap-4"
                >
                  <dt className="text-body-sm font-medium">{label}</dt>
                  <dd className="font-mono text-mono text-text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <h3 className="mt-8 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
            Features ({savedFeatures.length})
          </h3>
          {savedFeatures.length === 0 ? (
            <p className="mt-2 text-body-sm text-text-secondary">None saved.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-3">
              {savedFeatures.map((feature) => (
                <li key={feature.title} className="border-l-2 border-border-hairline pl-4">
                  <p className="text-body font-medium">{feature.title}</p>
                  {feature.detail ? (
                    <p className="text-body-sm text-text-secondary">{feature.detail}</p>
                  ) : (
                    <p className="text-body-sm text-state-warn-ink">
                      No explanation — a heading on its own tells a reader very little.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
