'use client';

import * as React from 'react';

/**
 * THE SEO PANEL, with live character counts.
 *
 * `docs/CMS_ARCHITECTURE.md` §3 pairs this requirement with the failure it
 * prevents: "titles truncating at 60 chars in the SERP, discovered months
 * later". A count that only appears after saving is a count that does not
 * prevent anything.
 *
 * ── Warn, never block ──────────────────────────────────────────────────────
 *
 * The counter turns red past the ideal and the field keeps accepting text. The
 * Zod schema enforces a HARD ceiling well above the ideal (70 and 200 against
 * 60 and 155), so a long title cannot reach the database and truncate in a
 * search result — but an editor mid-sentence must not have characters silently
 * refused. Sprint 11 shipped with seven meta descriptions over the limit and it
 * took a script to find them; this is the surface that stops the eighth.
 *
 * Lifted out of the blog's post editor in Sprint 12 so products get the same
 * counts rather than a second implementation that drifts.
 */

/** SERP truncation points. `nebsam-seo` and docs/SEO_LLM_STRATEGY.md §2. */
const TITLE_IDEAL = 60;
const TITLE_MIN = 50;
const DESC_IDEAL = 155;
const DESC_MIN = 140;

function Counter({ value, min, ideal }: { value: string; min: number; ideal: number }) {
  const n = value.length;
  const over = n > ideal;
  // Short is a real problem too — a 30-character description gets rewritten by
  // Google from page text, which is exactly the control this field exists to
  // take back. It is a note rather than an alarm.
  const short = n > 0 && n < min;
  return (
    <span
      aria-live="polite"
      className={[
        'font-mono text-label',
        over ? 'text-state-alert-ink' : short ? 'text-state-warn-ink' : 'text-text-secondary',
      ].join(' ')}
    >
      {n}/{ideal}
      {over ? ' — will truncate' : short ? ` — aim for ${min}+` : ''}
    </span>
  );
}

export function SeoPanel({
  title,
  description,
  onTitle,
  onDescription,
  fallbackTitle,
  slugPreview,
  titleError,
  descriptionError,
}: {
  title: string;
  description: string;
  onTitle: (value: string) => void;
  onDescription: (value: string) => void;
  /** What the page will use if the SEO title is left empty. */
  fallbackTitle: string;
  /** The URL this record will live at, so the editor can see it. */
  slugPreview: string;
  titleError?: string;
  descriptionError?: string;
}) {
  const effectiveTitle = title || fallbackTitle;

  return (
    <fieldset className="rounded-panel border border-border-hairline bg-surface p-5">
      <legend className="px-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
        Search and social
      </legend>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="flex flex-wrap items-center justify-between gap-2 text-body-sm font-medium">
            Search title
            <Counter value={effectiveTitle} min={TITLE_MIN} ideal={TITLE_IDEAL} />
          </span>
          <input
            name="seo_title"
            value={title}
            onChange={(event) => onTitle(event.target.value)}
            placeholder={fallbackTitle}
            maxLength={70}
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          />
          <span className="text-body-sm text-text-secondary">
            Left empty, the page uses its own name. The count above measures whichever will
            actually be used.
          </span>
          {titleError ? (
            <span className="text-body-sm text-state-alert-ink">{titleError}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="flex flex-wrap items-center justify-between gap-2 text-body-sm font-medium">
            Search description
            <Counter value={description} min={DESC_MIN} ideal={DESC_IDEAL} />
          </span>
          <textarea
            name="seo_description"
            value={description}
            onChange={(event) => onDescription(event.target.value)}
            rows={3}
            maxLength={200}
            className="rounded-control border border-border-strong bg-surface px-3 py-2 text-body"
          />
          {descriptionError ? (
            <span className="text-body-sm text-state-alert-ink">{descriptionError}</span>
          ) : null}
        </label>

        {/*
          A rough SERP preview. Not pixel-accurate and does not pretend to be —
          Google rewrites both fields often enough that a precise mock would be
          a lie. It shows the truncation point, which is the decision the editor
          is actually making.
        */}
        <div className="rounded-data border border-border-hairline p-3">
          <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
            Roughly how it will read
          </p>
          <p className="mt-2 truncate text-body text-brand-signal-ink">{effectiveTitle}</p>
          <p className="font-mono text-mono text-state-ok-ink">{slugPreview}</p>
          <p className="mt-1 text-body-sm text-text-secondary">
            {description.length > DESC_IDEAL
              ? `${description.slice(0, DESC_IDEAL)}…`
              : description || 'No description set — search engines will write their own.'}
          </p>
        </div>
      </div>
    </fieldset>
  );
}
