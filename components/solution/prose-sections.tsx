import { Eyebrow, Section, Shell } from '@/components/layout/section';
import type { SolutionSections } from '@/types/content';

/**
 * The prose half of the eleven-section solution model — sections 1, 2, 3, 4, 5
 * and 7 (CONTENT_ARCHITECTURE §1.1).
 *
 * Every section is optional and renders nothing when absent. A solution with
 * nothing truthful to say under a heading omits the heading, rather than
 * printing it over an empty space. That is what makes it possible to ship a
 * page whose source write-up carries unresolved verification tokens: the
 * unanswered facts are simply not asserted.
 *
 * SECTION RHYTHM. Brief 6.6 prohibits identical section rhythm, and a solution
 * page is where that risk is highest — eleven sections in a fixed order, ten
 * times over. So the grounds alternate and, more importantly, the *shapes*
 * differ: prose measure, a definition list, a numbered sequence, and grouped
 * subheads are four different structures, not one component with four titles.
 */

export function ProseSections({ sections }: { sections: SolutionSections }) {
  const { what_it_is, problem, who_its_for, how_it_works, what_you_get, installation_support } =
    sections;

  return (
    <>
      {/* 1 — What it is. Light, wide measure: this is the paragraph a reader
          who arrived from a search result reads before deciding to stay. */}
      {what_it_is?.length ? (
        <Section tone="light">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>What it is</Eyebrow>
              {what_it_is.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'mt-4 text-body-lg text-text-primary'
                      : 'mt-4 text-body text-text-secondary'
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </Shell>
        </Section>
      ) : null}

      {/* 2 — The problem, on paper. Deliberately the quiet ground: this section
          is describing a loss, and it should not look like a feature. */}
      {problem?.length ? (
        <Section tone="paper">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>The problem it solves</Eyebrow>
              <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
                What this is actually for.
              </h2>
              {problem.map((para, i) => (
                <p key={i} className="mt-4 text-body text-text-secondary">
                  {para}
                </p>
              ))}
            </div>
          </Shell>
        </Section>
      ) : null}

      {/* 3 — Who it is for. A definition list, so a reader can find themselves
          by scanning the left column rather than reading every line. */}
      {who_its_for?.length ? (
        <Section tone="light">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>Who it is for</Eyebrow>
              <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
                Who this is built for.
              </h2>
            </div>
            <dl className="mt-10 border-t border-border-hairline">
              {who_its_for.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-x-10 gap-y-2 border-b border-border-hairline py-6 md:grid-cols-[16rem_1fr]"
                >
                  <dt className="font-display-tight text-h3 text-text-primary">{row.label}</dt>
                  <dd className="max-w-prose text-body text-text-secondary">{row.detail}</dd>
                </div>
              ))}
            </dl>
          </Shell>
        </Section>
      ) : null}

      {/* 4 — How it works. Genuinely a sequence, so it is numbered. Brief 6.6
          prohibits 01/02/03 markers where the content is NOT a sequence; here
          the order is the meaning. */}
      {how_it_works?.length ? (
        <Section tone="dark">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 font-display text-h2 text-text-inverse md:text-md-h2">
                What actually happens.
              </h2>
            </div>
            <ol className="mt-10 border-t border-border-hairline-inverse">
              {how_it_works.map((step, i) => (
                <li
                  key={step.title}
                  className="grid gap-x-10 gap-y-2 border-b border-border-hairline-inverse py-7 md:grid-cols-[3rem_16rem_1fr]"
                >
                  <span aria-hidden="true" className="font-mono text-mono text-brand-signal">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display-tight text-h3 text-text-inverse">{step.title}</h3>
                  <p className="max-w-prose text-body text-text-secondary-inverse">{step.detail}</p>
                </li>
              ))}
            </ol>
          </Shell>
        </Section>
      ) : null}

      {/* 5 — What you get. Grouped and explained, never bulleted flatly: the
          content skill is explicit, and a flat list is how a capability page
          stops telling anyone anything. */}
      {what_you_get?.length ? (
        <Section tone="light">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
                What is included.
              </h2>
            </div>
            <div className="mt-10 flex flex-col gap-10">
              {what_you_get.map((group) => (
                <div key={group.group}>
                  <h3 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                    {group.group}
                  </h3>
                  <dl className="mt-4 border-t border-border-hairline">
                    {group.items.map((item) => (
                      <div
                        key={item.title}
                        className="grid gap-x-10 gap-y-1 border-b border-border-hairline py-5 md:grid-cols-[18rem_1fr]"
                      >
                        <dt className="text-body font-medium text-text-primary">{item.title}</dt>
                        <dd className="max-w-prose text-body text-text-secondary">{item.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </Shell>
        </Section>
      ) : null}

      {/* 7 — Installation and support. */}
      {installation_support?.length ? (
        <Section tone="paper">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>Installation and support</Eyebrow>
              <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
                What happens after you decide.
              </h2>
              {installation_support.map((para, i) => (
                <p key={i} className="mt-4 text-body text-text-secondary">
                  {para}
                </p>
              ))}
            </div>
          </Shell>
        </Section>
      ) : null}
    </>
  );
}
