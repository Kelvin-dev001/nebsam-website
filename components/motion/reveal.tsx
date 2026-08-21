'use client';

import * as React from 'react';
import { useReducedMotion } from './use-reduced-motion';
import { DURATION, EASE, REVEAL_TRAVEL_PX, STAGGER_CAP, STAGGER_MS } from '@/lib/motion';

/**
 * Level 2 — Reveal. Scroll-triggered entrance, fires ONCE, never on re-scroll.
 *
 * ── The bug this is written to avoid ────────────────────────────────────────
 * The obvious implementation starts at opacity 0 and fades in on intersection.
 * With SSR that produces a visible flash → element HIDES after hydration →
 * fades back. The reader watches content disappear. A screenshot taken ~300ms
 * after load showed an empty hero.
 *
 * So: the element is ALWAYS visible in the server HTML and is never hidden
 * retroactively. Hiding happens only in useLayoutEffect (before paint) and only
 * for elements that are BELOW the fold, which the reader has not seen yet.
 * Anything already on screen at load simply stays put and never animates.
 *
 * That keeps the PART 17 rule literally true: content is never gated behind an
 * animation, for anyone, at any connection speed.
 */
export function Reveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  /** Position among siblings, for stagger. Capped at STAGGER_CAP. */
  index?: number;
  as?: 'div' | 'li' | 'section';
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  /** null = never animate (visible, untouched). false = hidden, waiting. */
  const [shown, setShown] = React.useState<boolean | null>(null);

  React.useLayoutEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    // Only ever decide once.
    if (el.dataset.revealDecided === '1') return;
    el.dataset.revealDecided = '1';

    const box = el.getBoundingClientRect();
    const alreadyVisible = box.top < window.innerHeight && box.bottom > 0;

    if (alreadyVisible) {
      // Above the fold at load: the reader can already see it. Leave it alone.
      setShown(null);
      return;
    }

    setShown(false);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // once, never again
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const delay = Math.min(index, STAGGER_CAP) * STAGGER_MS;
  const animating = shown !== null;

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        animating
          ? {
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : `translateY(${REVEAL_TRAVEL_PX}px)`,
              transition: `opacity ${DURATION.reveal}ms ${EASE.outQuart} ${delay}ms, transform ${DURATION.reveal}ms ${EASE.outQuart} ${delay}ms`,
            }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
