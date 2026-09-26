import { notFound } from 'next/navigation';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { DataDemo } from '@/components/dev/motion/data-demo';
import { EasingDemo } from '@/components/dev/motion/easing-demo';
import { MotionStatus } from '@/components/dev/motion/motion-status';
import { PressDemo } from '@/components/dev/motion/press-demo';
import { RevealDemo } from '@/components/dev/motion/reveal-demo';
import { PinnedDemo } from '@/components/dev/motion/pinned-demo';
import { TokenTable } from '@/components/dev/motion/token-table';
import { ROUTES } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo/metadata';
// Route-scoped utilities: the dev files are excluded from the global sheet.
import './playground.css';

/**
 * /dev/motion — the Sprint 12b motion playground. DEVELOPMENT ONLY.
 *
 * Every motion token and level with the values the site ships, so a change to
 * lib/motion.ts can be felt before it reaches a public page. Three guards keep
 * it out of the public site, and each is independent of the others:
 *
 *  1. It 404s in production unless MOTION_PLAYGROUND=1. Read per request
 *     (force-dynamic), so the same build can be measured locally with the
 *     flag and deployed without it.
 *  2. noindex, nofollow — for any environment where the flag is set.
 *  3. It is absent from app/sitemap.ts and app/llms.txt/route.ts, which are
 *     explicit lists; nothing links to it.
 *
 * Its client components are imported only here, so none of their JavaScript
 * reaches the shared bundle or any public route.
 */
export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Motion playground (development only)',
  description:
    'Development-only reference for the Nebsam motion system: every duration, easing and level, the pinned-stage dim, the pin query and reduced motion.',
  path: ROUTES.devMotion,
  noindex: true,
});

function playgroundEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.MOTION_PLAYGROUND === '1';
}

const REDUCED = [
  ['1 Micro', 'Colour and border changes kept; the press translate is disabled.'],
  ['2 Reveal', 'Content rendered complete, full opacity, no inline style.'],
  ['3 Data', 'The readout shows the resolved state and never runs the sequence.'],
  ['4 Cinematic', 'No pin: stacked flow, every step at full opacity, no inline style.'],
  ['5 Transition', 'Instant.'],
] as const;

export default function MotionPlaygroundPage() {
  if (!playgroundEnabled()) notFound();

  return (
    <main id="main">
      <Section tone="dark">
        <Shell>
          <Eyebrow dot>Development only · Sprint 12b</Eyebrow>
          <h1 className="mt-4 font-display text-h1 md:text-md-h1">Motion playground</h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            Every motion token and level, rendered with the values in <code>lib/motion.ts</code> and{' '}
            <code>app/globals.css</code>. This page returns 404 in production unless{' '}
            <code>MOTION_PLAYGROUND=1</code>, and is never indexed.
          </p>
          <div className="mt-8">
            <MotionStatus />
          </div>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Tokens</h2>
          <p className="mt-3 max-w-prose text-body text-text-secondary">
            Read from the code at render time, so this table cannot drift from what ships.
          </p>
          <div className="mt-8">
            <TokenTable />
          </div>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Easings, compared</h2>
          <p className="mt-3 mb-8 max-w-prose text-body text-text-secondary">
            All four over the same duration, so the curves can be read against each other.
          </p>
          <EasingDemo />
        </Shell>
      </Section>

      <Section tone="dark">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Level 1 — micro, on navy</h2>
          <p className="mt-3 mb-8 max-w-prose text-body text-text-secondary-inverse">
            Hover, press and focus. Tab through to see the ring follow the section. The primary
            gains its signal hairline on this ground. The last button adds transform to its
            transition at the 120ms press token; the others press instantly.
          </p>
          <PressDemo />
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Level 1 — micro, on paper</h2>
          <p className="mt-3 mb-8 max-w-prose text-body text-text-secondary">
            The same controls on the light ground, where the focus ring switches to the
            light-section colour.
          </p>
          <PressDemo />
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Level 2 — reveal</h2>
          <p className="mt-3 mb-8 max-w-prose text-body text-text-secondary">
            Fires once, below the fold only. Items 7 and 8 share item 6&apos;s delay because the
            stagger is capped. Reload to see it again.
          </p>
          <RevealDemo />
        </Shell>
      </Section>

      <Section tone="dark">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Level 3 — data</h2>
          <p className="mt-3 mb-8 max-w-prose text-body text-text-secondary-inverse">
            The signature readout. Data motion is linear on purpose: eased telemetry looks
            performed.
          </p>
          <DataDemo />
        </Shell>
      </Section>

      <Section tone="dark" className="border-t border-border-hairline-inverse">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Level 4 — the pinned stage</h2>
          <p className="mt-3 mb-8 max-w-prose text-body text-text-secondary-inverse">
            The real primitive (ADR-0006). At 768 px and wider, with a fine pointer and no
            reduced-motion preference, the stage pins while the steps scroll past it; the active
            step is full strength and the rest dim. Anywhere else it is this same content as stacked
            flow. It will not pin if it was already on screen when the page loaded — scroll up and
            reload above it to see it pin.
          </p>
          <PinnedDemo />
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <h2 className="font-display-tight text-h2 md:text-md-h2">Level 5, and reduced motion</h2>
          <p className="mt-3 max-w-prose text-body text-text-secondary">
            Level 5 (page transitions) is reserved and unused: it must never delay content paint.
            Under <code>prefers-reduced-motion: reduce</code> every level is complete and still:
          </p>
          <dl className="mt-6 max-w-prose divide-y divide-border-hairline border-y border-border-hairline">
            {REDUCED.map(([level, behaviour]) => (
              <div key={level} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                <dt className="font-mono text-mono">{level}</dt>
                <dd className="text-body">{behaviour}</dd>
              </div>
            ))}
          </dl>
        </Shell>
      </Section>
    </main>
  );
}
