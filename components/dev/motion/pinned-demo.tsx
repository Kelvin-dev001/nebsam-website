import { PinnedSequence } from '@/components/motion/pinned-sequence';
import { STAGE } from '@/lib/motion';

/**
 * Level 4 on the playground: the real pinned-stage primitive with placeholder
 * content, so its behaviour can be felt and the scroll-craft harness can walk
 * it before the homepage set piece exists (T4). Nothing here makes a claim.
 *
 * Five steps, because five is what the H1 story will use. Each frame is a
 * static instrument face — step number and a gauge — so which frame the stage
 * is showing is readable at a glance in a contact sheet.
 */
const COUNT = 5;

function DemoStep({ n }: { n: number }) {
  return (
    <div>
      <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
        Sample step {n} of {COUNT}
      </p>
      <h3 className="mt-3 font-display-tight text-h3 text-text-inverse md:text-md-h3">
        Placeholder heading {n}
      </h3>
      <p className="mt-3 max-w-prose text-body text-text-secondary-inverse">
        Placeholder body copy. Inactive steps sit at opacity {STAGE.inactiveOpacity}, which keeps
        this text at 4.86:1 on the navy ground.
      </p>
    </div>
  );
}

function DemoFrame({ n }: { n: number }) {
  return (
    <div className="rounded-data border border-border-strong-inverse bg-brand-navy-raised p-6">
      <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
        Stage frame
      </p>
      <p className="mt-2 font-mono text-md-display tabular text-text-inverse">
        {String(n).padStart(2, '0')}
      </p>
      <div className="mt-4 h-2 rounded-data bg-border-hairline-inverse">
        <div
          className="h-full rounded-data bg-text-secondary-inverse"
          style={{ width: `${(n / COUNT) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function PinnedDemo() {
  const numbers = Array.from({ length: COUNT }, (_, i) => i + 1);
  return (
    <PinnedSequence
      id="dev-pinned-demo"
      steps={numbers.map((n) => (
        <DemoStep key={n} n={n} />
      ))}
      frames={numbers.map((n) => (
        <DemoFrame key={n} n={n} />
      ))}
      caption="Illustration — sample stage for the pinned primitive, not the homepage set piece."
    />
  );
}
