import { Section, Shell } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ProductPhoto } from '@/components/product/product-photo';
import { ProductPrice } from '@/components/product/product-price';
import { Card } from '@/components/ui/card';
import type { Photo } from '@/lib/media/types';
import type { PublicProduct } from '@/types/content';

/**
 * The product page's title band: breadcrumbs, name, summary, the buy box and,
 * where Nebsam has supplied one, the photo (Sprint 12n/12o, ADR-0009). Split
 * out of the page to keep it one component per file under ~200 lines.
 */
export function ProductHero({
  product,
  name,
  photo,
  trail,
}: {
  product: PublicProduct;
  name: string;
  photo: Photo | undefined;
  trail: { name: string; path: string }[];
}) {
  return (
    <Section tone="dark" bleed>
      <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
        <Breadcrumbs trail={trail} tone="dark" />

        {/*
          With a photo: on desktop the photo holds the left column and the
          name, summary and buy box the right; on a phone the text and the
          buy box come first and the photo follows (product-photo.tsx says
          why). Without one, the original two-column summary and buy box.
        */}
        <div
          className={
            photo
              ? "mt-6 grid gap-10 [grid-template-areas:'copy'_'photo'] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-14 lg:[grid-template-areas:'photo_copy']"
              : 'mt-6'
          }
        >
          {photo ? (
            <div className="[grid-area:photo]">
              <ProductPhoto photo={photo} />
            </div>
          ) : null}

          <div className={photo ? '[grid-area:copy]' : ''}>
            <h1 className="max-w-[26ch] font-display text-h1 text-text-inverse md:text-md-display">
              {name}
            </h1>

            {/* The buy box is a card (ADR-0008): price, renewal, installation
                and the action belong together. Beside the summary on desktop
                when there is no photo; under it when the photo takes the
                left column. */}
            <div
              className={
                photo
                  ? 'mt-6 grid gap-8'
                  : 'mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start'
              }
            >
              {product.summary ? (
                <p className="max-w-prose text-body-lg text-text-secondary-inverse">
                  {product.summary}
                </p>
              ) : (
                <span />
              )}
              <Card tone="dark" className={photo ? 'max-w-[34rem]' : ''}>
                <ProductPrice product={product} />
              </Card>
            </div>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
