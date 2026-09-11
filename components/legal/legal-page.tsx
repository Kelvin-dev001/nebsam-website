import * as React from 'react';
import { Section, Shell } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/format';

/**
 * THE SHELL THE THREE LEGAL PAGES SHARE.
 *
 * Breadcrumbs, one H1, a reviewed date, a scope statement, and — where one is
 * outstanding — a legal-review banner. The three pages differ in their words,
 * not their structure, and writing the structure once means the scope statement
 * cannot be forgotten on the page that most needs it.
 *
 * ── Why every page carries a SCOPE line, prominently ────────────────────────
 *
 * Because the dangerous failure on a legal page is not being wrong, it is being
 * INCOMPLETE while looking complete. A privacy notice that covers a contact
 * form and says nothing about vehicle tracking reads, to someone skimming it,
 * as though tracking were not happening. Stating what a document does and does
 * not cover, above the fold, is the one thing that makes a partial document
 * honest rather than misleading.
 *
 * ── Why the reviewed date is a real date and not "last updated" ─────────────
 *
 * "Last updated" invites a bump whenever a typo is fixed. What a reader of a
 * policy actually wants to know is when a human last checked that it still
 * describes reality — so the field is named for that, and it is a constant in
 * the page rather than a build timestamp. A date that moves on every deploy
 * tells nobody anything.
 */

export interface LegalSection {
  heading: string;
  /** Paragraphs, rendered in order. */
  body?: React.ReactNode;
}

export function LegalPage({
  title,
  lead,
  path,
  reviewedOn,
  scope,
  reviewStatus,
  children,
}: {
  title: string;
  lead: string;
  path: string;
  /** ISO date a human last confirmed this still describes what happens. */
  reviewedOn: string;
  /** What this document covers, and what it does not. Never optional. */
  scope: React.ReactNode;
  /**
   * Set when the page has NOT been through legal review, which is a fact a
   * reader is entitled to and which stops the document being relied on as
   * though it had.
   */
  reviewStatus?: React.ReactNode;
  children: React.ReactNode;
}) {
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: title, path },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} />

          <h1 className="mt-6 max-w-[26ch] font-display text-h1 text-text-inverse md:text-md-display">
            {title}
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">{lead}</p>

          <p className="mt-6 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
            Last reviewed {formatDate(reviewedOn)}
          </p>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          {/*
            The scope statement, above everything. See the header on why this is
            structural rather than a note somebody remembers to add.
          */}
          <div className="max-w-prose rounded-panel border border-border-strong bg-surface p-5">
            <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
              What this covers
            </h2>
            <div className="mt-3 flex flex-col gap-3 text-body">{scope}</div>
          </div>

          {reviewStatus ? (
            <div
              role="note"
              className="mt-6 max-w-prose rounded-panel border border-state-warn-ink/40 bg-surface p-5"
            >
              <h2 className="font-mono text-label uppercase tracking-[0.08em] text-state-warn-ink">
                Status of this document
              </h2>
              <div className="mt-3 flex flex-col gap-3 text-body">{reviewStatus}</div>
            </div>
          ) : null}

          <div className="mt-12 flex max-w-prose flex-col gap-10">{children}</div>
        </Shell>
      </Section>
    </main>
  );
}

/**
 * One section of a policy: an H2 and its prose.
 *
 * `id` is required, not optional. A policy is a document people cite — a
 * customer asking "under section 6 you say…" needs section 6 to have an
 * address, and a support agent needs to be able to send a link that lands on
 * the right paragraph.
 */
export function LegalSectionBlock({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <h2 id={id} className="font-display-tight text-h3">
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-body text-text-secondary">{children}</div>
    </section>
  );
}

/** A definition-style row for the cookie and data tables. */
export function LegalTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    /**
     * Scrolls inside its own container rather than pushing the page sideways.
     *
     * The explicit width at `lg` lets the table out of the surrounding
     * `max-w-prose` column. Left inside it, a three-column table with real
     * sentences in two of them was 36rem of content in a 36rem box, so it
     * scrolled horizontally on a 1456px desktop — technically contained, and
     * still the wrong answer. The prose column is left-aligned in a 1248px
     * shell, so the extra width extends into space that was empty anyway.
     */
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="mt-4 w-full overflow-x-auto rounded-panel border border-border-hairline bg-surface lg:w-[46rem] lg:max-w-none"
    >
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-border-hairline px-4 py-3 font-mono text-label uppercase tracking-[0.08em] text-text-secondary"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-border-hairline px-4 py-3 align-top text-body-sm"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
