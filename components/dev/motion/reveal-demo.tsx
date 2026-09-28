import { Reveal } from '@/components/motion/reveal';
import { DURATION, REVEAL_TRAVEL_PX, STAGGER_CAP, STAGGER_MS } from '@/lib/motion';

/**
 * Level 2 with the real Reveal component. Eight items, so the stagger cap is
 * visible: items 7 and 8 share item 6's delay. It fires once — reload the
 * page to see it again. If this block is already on screen at load, Reveal
 * leaves it alone by design and nothing animates.
 */
const ITEMS = Array.from({ length: 8 }, (_, i) => ({
  n: i + 1,
  delay: Math.min(i, STAGGER_CAP) * STAGGER_MS,
}));

export function RevealDemo() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {ITEMS.map((item) => (
        <Reveal
          key={item.n}
          as="li"
          index={item.n - 1}
          className="flex items-baseline justify-between rounded-data border border-border-strong bg-surface px-4 py-3"
        >
          <span className="text-body">Sample item {item.n}</span>
          <span className="font-mono text-mono tabular text-text-secondary">
            +{item.delay}ms · {DURATION.reveal}ms · {REVEAL_TRAVEL_PX}px
          </span>
        </Reveal>
      ))}
    </ol>
  );
}
