'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Renders `children` only once the page has finished loading; until then,
 * `fallback`. For a photo that is not the point of the page and sits near the
 * top: a branch card on Contact (Sprint 12n).
 *
 * WHY. A lazy image near the viewport is still fetched at first layout, before
 * first paint, and on a phone paying for slow 4G it competes with the fonts
 * and the text that matter. Measured: the three branch photos cost Contact
 * ~560 ms of Lighthouse LCP (2,239 ms without, 2,802 ms with), pushing it past
 * the 2.5 s budget. Waiting for `load` moves them out of that window, and on a
 * real slow connection puts the bandwidth where the reader is looking first.
 *
 * NO LAYOUT SHIFT: the caller's frame has its size already, so the photo
 * arrives into a box that does not move. WITHOUT JAVASCRIPT the photo is still
 * there, in <noscript>, so nothing depends on the script but the timing.
 */
export function AfterLoad({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoaded(true);
      return;
    }
    const done = () => setLoaded(true);
    window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, []);

  if (loaded) return <>{children}</>;
  return (
    <>
      {fallback}
      <noscript>{children}</noscript>
    </>
  );
}
