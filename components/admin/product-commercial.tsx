'use client';

import { VAT_LABEL, VAT_RATE } from '@/lib/constants';
import { formatKes } from '@/lib/format';

/**
 * THE COMMERCIAL PANEL.
 *
 * Price, VAT, recurring fee, availability, featured. `docs/CMS_ARCHITECTURE.md`
 * §3.2 is specific about the layout: the recurring-fee fields sit DIRECTLY
 * BENEATH the price, not in a collapsed advanced section, "because a field
 * nobody sees is a field nobody fills" — and brief 10.2 requires recurring
 * costs on the product page rather than at checkout.
 *
 * ── Two things this panel does that a plain form would not ──────────────────
 *
 * 1. It says the price is VAT-EXCLUSIVE, and shows what the customer will
 *    actually see including VAT, computed live. Brief 10.2 names a
 *    VAT-exclusive price shown without a label as "the most common source of
 *    order disputes in Kenyan e-commerce". The person typing the number is the
 *    last person who can prevent that, so they are shown both figures.
 *
 * 2. It explains what an EMPTY price means, next to the empty field. `NULL`
 *    renders "Request price" with a WhatsApp CTA and emits `Product` schema
 *    without an `Offer`. Someone clearing the field to "hide" a price is doing
 *    something specific and needs to know what.
 */

const AVAILABILITY = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'pre_order', label: 'Pre-order' },
] as const;

export function ProductCommercial({
  price,
  onPrice,
  recurringFee,
  onRecurringFee,
  recurringPeriod,
  onRecurringPeriod,
  recurringNote,
  onRecurringNote,
  availability,
  onAvailability,
  priceVisible,
  onPriceVisible,
  featured,
  onFeatured,
  installationTerms,
  onInstallationTerms,
  error,
}: {
  price: string;
  onPrice: (value: string) => void;
  recurringFee: string;
  onRecurringFee: (value: string) => void;
  recurringPeriod: string;
  onRecurringPeriod: (value: string) => void;
  recurringNote: string;
  onRecurringNote: (value: string) => void;
  availability: string;
  onAvailability: (value: string) => void;
  priceVisible: boolean;
  onPriceVisible: (value: boolean) => void;
  featured: boolean;
  onFeatured: (value: boolean) => void;
  installationTerms: string;
  onInstallationTerms: (value: string) => void;
  error: (name: string) => string | undefined;
}) {
  const numeric = /^\d+$/.test(price.trim()) ? Number(price.trim()) : null;
  const inclusive = numeric === null ? null : numeric + Math.round(numeric * VAT_RATE);

  return (
    <fieldset className="rounded-panel border border-border-hairline bg-surface p-5">
      <legend className="px-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
        Price and availability
      </legend>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">
            Price in KES — <strong>{VAT_LABEL}</strong>
          </span>
          <input
            name="price_kes"
            value={price}
            onChange={(event) => onPrice(event.target.value)}
            inputMode="numeric"
            placeholder="Leave empty for “request price”"
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono"
          />
          {/*
            The live inclusive figure. This is the number the customer says back
            to you on the phone, so the person entering the price sees it too.
          */}
          <span aria-live="polite" className="text-body-sm text-text-secondary">
            {numeric === null ? (
              <>
                Empty means <strong>“Request price”</strong>: the product page shows a WhatsApp
                enquiry button instead of add-to-cart, and its structured data carries no offer.
                There is deliberately no way to store a placeholder number.
              </>
            ) : (
              <>
                Stored as {formatKes(numeric)} {VAT_LABEL}. The customer is shown{' '}
                <strong>{formatKes(inclusive)}</strong> including VAT at{' '}
                {(VAT_RATE * 100).toFixed(0)}%.
              </>
            )}
          </span>
          {error('price_kes') ? (
            <span className="text-body-sm text-state-alert-ink">{error('price_kes')}</span>
          ) : null}
        </label>

        {/*
          Directly beneath the price. CMS_ARCHITECTURE §3.2 — not in a
          collapsed advanced section.
        */}
        <div className="rounded-data border border-border-hairline p-4">
          <p className="text-body-sm font-medium">Recurring cost of ownership</p>
          <p className="mt-1 text-body-sm text-text-secondary">
            Shown on the product page and carried into the WhatsApp order message. PoC radios carry
            a CAK licence renewal of KES 3,000 per device per year; speed governors KES 6,500 and
            fuel monitoring KES 10,000, both annual and per device.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-body-sm font-medium">Recurring fee in KES</span>
              <input
                name="recurring_fee_kes"
                value={recurringFee}
                onChange={(event) => onRecurringFee(event.target.value)}
                inputMode="numeric"
                placeholder="None"
                className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono"
              />
              {error('recurring_fee_kes') ? (
                <span className="text-body-sm text-state-alert-ink">
                  {error('recurring_fee_kes')}
                </span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-body-sm font-medium">
                Per{' '}
                {recurringFee.trim() ? (
                  <span className="font-normal text-text-secondary">(required)</span>
                ) : null}
              </span>
              <select
                name="recurring_fee_period"
                value={recurringPeriod}
                onChange={(event) => onRecurringPeriod(event.target.value)}
                className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
              >
                <option value="">—</option>
                <option value="year">year</option>
                <option value="month">month</option>
              </select>
              {error('recurring_fee_period') ? (
                <span className="text-body-sm text-state-alert-ink">
                  {error('recurring_fee_period')}
                </span>
              ) : null}
            </label>
          </div>

          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">What the fee is for</span>
            <input
              name="recurring_fee_note"
              value={recurringNote}
              onChange={(event) => onRecurringNote(event.target.value)}
              placeholder="CAK annual licence renewal, per device"
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
            />
            <span className="text-body-sm text-text-secondary">
              A figure with no explanation reads as a surprise charge. Say what it buys.
            </span>
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">Availability</span>
          <select
            name="availability"
            value={availability}
            onChange={(event) => onAvailability(event.target.value)}
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          >
            {AVAILABILITY.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">Installation and delivery terms</span>
          <input
            name="installation_terms"
            value={installationTerms}
            onChange={(event) => onInstallationTerms(event.target.value)}
            placeholder="Price includes installation by a Nebsam technician"
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          />
          <span className="text-body-sm text-text-secondary">
            Confirmed 4 September 2026: prices are inclusive of installation by a Nebsam
            technician. State it per product rather than leaving a customer to assume.
          </span>
        </label>

        <div className="flex flex-col gap-3">
          <label className="flex min-h-11 items-center gap-3 text-body-sm font-medium">
            <input
              type="checkbox"
              name="price_visible"
              checked={priceVisible}
              onChange={(event) => onPriceVisible(event.target.checked)}
              className="h-5 w-5 rounded-data border border-border-strong"
            />
            Show the price publicly
          </label>
          <label className="flex min-h-11 items-center gap-3 text-body-sm font-medium">
            <input
              type="checkbox"
              name="featured"
              checked={featured}
              onChange={(event) => onFeatured(event.target.checked)}
              className="h-5 w-5 rounded-data border border-border-strong"
            />
            Feature on the homepage
          </label>
        </div>
      </div>
    </fieldset>
  );
}
