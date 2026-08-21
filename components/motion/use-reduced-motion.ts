'use client';

import { useEffect, useState } from 'react';

/**
 * Reduced motion, read once and shared.
 *
 * Defaults to TRUE — reduced. Anything gated on this therefore renders in its
 * calm, complete state during SSR and before the first effect runs. Motion is
 * something we opt into after confirming it is wanted, not something we opt out
 * of after the fact.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
