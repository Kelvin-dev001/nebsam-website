/**
 * "ON THIS PAGE" — jump links for the long pages (Sprint 16).
 *
 * Server-rendered links to section ids, so the list works without JavaScript,
 * reads as plain navigation to a crawler, and lets anyone skip to the part
 * they came for. Two layouts:
 *
 * - `inline`: one wrapped row, for the foot of a solution page's hero. Those
 *   pages are stacked full-width bands with no column for a sidebar, so the
 *   list sits where the reader starts.
 * - `aside`: for a long single-column document (the legal pages). On a phone
 *   it is a <details> above the text, closed until opened. From lg it is a
 *   sticky column BEFORE the text in both the DOM and on screen, so keyboard,
 *   screen-reader and visual order agree.
 *
 * ── No "current section" highlight, measured ───────────────────────────────
 * It was built, with a small client effect setting aria-current. It cost the
 * legal pages about 150ms of LCP under throttled 4G: one more script request on
 * the critical path, which took /legal/cookies from 2,394ms to 2,507, over the
 * budget. The links, the sticky column and the <details> all work without it,
 * so the enhancement was cut (CLAUDE.md §8: a sprint does not close over a
 * budget). This component ships no JavaScript at all.
 *
 * Every target offsets by the sticky header (`--header-h`, app/globals.css).
 */

export type TocItem = { id: string; label: string };

const linkClass =
  'inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:decoration-2';

export function OnThisPage({ items, variant }: { items: TocItem[]; variant: 'inline' | 'aside' }) {
  if (items.length < 2) return null;

  if (variant === 'inline') {
    return (
      <nav aria-label="On this page" className="mt-8">
        <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
          On this page
        </p>
        <ul className="mt-1 flex flex-wrap gap-x-5">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={`${linkClass} text-body-sm text-brand-signal`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  const list = (
    <ol className="mt-2 flex flex-col">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`${linkClass} border-l-2 border-border-hairline pl-3 text-body-sm text-text-secondary hover:border-brand-signal-ink hover:text-text-primary`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <details className="rounded-panel border border-border-strong bg-surface p-4 lg:hidden">
        <summary className="min-h-11 cursor-pointer content-center font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
          On this page
        </summary>
        <nav aria-label="On this page">{list}</nav>
      </details>
      <nav
        aria-label="On this page"
        className="sticky top-[calc(var(--header-h)+2rem)] hidden self-start lg:block"
      >
        <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
          On this page
        </p>
        {list}
      </nav>
    </>
  );
}
