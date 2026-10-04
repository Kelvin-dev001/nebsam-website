'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';

/**
 * The loupe half of ZoomImage (components/ui/media.css explains both).
 *
 * WHY THIS IS A CLIENT COMPONENT: the enlarged area has to follow the pointer,
 * and CSS cannot read a pointer position. Everything else is CSS. The handlers
 * write two custom properties straight onto the frame and never set React
 * state, so moving the mouse re-renders nothing.
 *
 * Mouse and pen only. A touch pointer is ignored, so a scroll that starts on a
 * product photo stays a scroll.
 */
export function ZoomArea({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);

  function follow(event: PointerEvent<HTMLDivElement>) {
    const el = frame.current;
    if (!el || event.pointerType === 'touch') return;
    const box = el.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    el.style.setProperty('--zoom-x', `${Math.min(100, Math.max(0, x))}%`);
    el.style.setProperty('--zoom-y', `${Math.min(100, Math.max(0, y))}%`);
    el.dataset.zooming = '';
  }

  function leave() {
    delete frame.current?.dataset.zooming;
  }

  return (
    <div
      ref={frame}
      className={`zoom-frame zoom-area ${className}`.trim()}
      onPointerMove={follow}
      onPointerLeave={leave}
      onPointerCancel={leave}
    >
      {children}
    </div>
  );
}
