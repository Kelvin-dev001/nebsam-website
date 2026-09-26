import * as React from 'react';
import { Reveal } from './reveal';
import { PinnedSequenceLoader } from './pinned-sequence-loader';
import styles from './pinned-sequence.module.css';

/**
 * The pinned stage — ADR-0006, Level 4, at most one per page, Tier A pages only.
 *
 * A server component. What it renders IS the complete content: the stage, then
 * an ordinary ordered list of steps in normal flow, every step fully visible.
 * That is what crawlers, LLM retrieval, no-JS visitors, reduced-motion visitors
 * and phones receive. The pinned layout is layered on by CSS once the loader
 * sets `data-pinned="on"`.
 *
 * Steps carry the argument. Frames are ILLUSTRATION of it: the stage shows one
 * frame per step, the active one while pinned and the resting one otherwise,
 * and is aria-hidden except for its caption. Anything a reader must know goes
 * in a step, never only in a frame.
 *
 * Emits the scroll-craft harness contract: `data-sc-act="pin"`,
 * `data-sc-span`, `data-sc-stage`, `data-sc-cue` on each step and the caption.
 */
export interface PinnedSequenceProps {
  /** Unique on the page: the loader finds the act by it. */
  id: string;
  /** One node per step. Rendered in order inside <li>. */
  steps: React.ReactNode[];
  /** One illustrative frame per step, same order. */
  frames: React.ReactNode[];
  /** Visible caption under the frames, e.g. the illustration label. */
  caption?: React.ReactNode;
  /** The frame shown when not pinned. Defaults to the last, the resolved state. */
  restingFrame?: number;
}

export function PinnedSequence({ id, steps, frames, caption, restingFrame }: PinnedSequenceProps) {
  const resting = restingFrame ?? frames.length - 1;

  return (
    <>
      <div
        id={id}
        className={styles.act}
        data-sc-act="pin"
        data-sc-span={steps.length}
        data-pinned="off"
      >
        <div className={styles.stage} data-sc-stage>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} data-pinned-rail-fill />
          </div>
          <div>
            <div className={styles.frames} aria-hidden="true">
              {frames.map((frame, i) => (
                <div
                  key={i}
                  className={styles.frame}
                  data-pinned-frame
                  data-active={i === 0 ? '' : undefined}
                  data-resting={i === resting ? '' : undefined}
                >
                  {frame}
                </div>
              ))}
            </div>
            {caption ? (
              <p className="mt-4 text-body-sm text-text-secondary-inverse" data-sc-cue="">
                {caption}
              </p>
            ) : null}
          </div>
        </div>

        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <li
              key={i}
              className={styles.step}
              data-pinned-step
              data-sc-cue=""
              data-active={i === 0 ? '' : undefined}
            >
              <Reveal skipWhenPinned>{step}</Reveal>
            </li>
          ))}
        </ol>
      </div>
      <PinnedSequenceLoader actId={id} />
    </>
  );
}
