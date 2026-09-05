/**
 * Visible breadcrumb trail.
 *
 * The SEO checklist requires breadcrumbs to be visible **and** marked up as
 * `BreadcrumbList`. This renders the visible half; the schema half is emitted
 * by the page from `breadcrumbSchema(trail)` using the same array, so the two
 * cannot drift apart. Schema that contradicts the visible page is worse than no
 * schema at all.
 *
 * ── Why this exists now ─────────────────────────────────────────────────────
 * Eight pages had already inlined this identical markup by the end of Sprint 9.
 * Sprint 10 adds three more and has to edit a fourth, at which point copying it
 * a twelfth time stops being consistency and starts being a liability: the
 * `aria-current` and the separator's `aria-hidden` are easy to drop, and a
 * screen reader is what notices, not a reviewer.
 *
 * The seven older pages are deliberately NOT migrated in this sprint — that is
 * a mechanical change across templates this sprint has no other reason to
 * touch, and it is recorded in the sprint report instead.
 *
 * The last crumb is the current page and is never a link.
 */
export type Crumb = { name: string; path: string };

export function Breadcrumbs({
  trail,
  tone = 'dark',
}: {
  trail: Crumb[];
  /** The ground it sits on. Every current header is dark. */
  tone?: 'dark' | 'light';
}) {
  if (trail.length === 0) return null;

  const colour = tone === 'dark' ? 'text-text-secondary-inverse' : 'text-text-secondary';

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={`flex flex-wrap items-center gap-x-2 font-mono text-label uppercase tracking-[0.08em] ${colour}`}
      >
        {trail.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {i < trail.length - 1 ? (
              <a href={crumb.path} className="underline underline-offset-4">
                {crumb.name}
              </a>
            ) : (
              <span aria-current="page">{crumb.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
