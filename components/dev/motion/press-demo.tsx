import { Button } from '@/components/ui/button';

/**
 * Level 1 on both grounds. The real Button variants, so hover, press and the
 * section-following focus ring can be felt with the values the site ships —
 * plus one sample showing DURATION.press, which no component uses yet.
 *
 * Why the sample exists: Button's press is `active:translate-y-px` under
 * `transition-colors`, and transition-colors does not cover transform, so
 * today's press is INSTANT. The sample adds transform to the transition at
 * --dur-press (120ms) so the two can be compared side by side. Whether any
 * shipped component adopts it is Sprint 12b T5's decision, not this page's.
 */
const pressSample =
  'inline-flex min-h-[44px] items-center justify-center rounded-control bg-brand-signal-ink px-4 py-2.5 ' +
  'text-body font-medium text-white hover:bg-[#134aa8] ' +
  'transition-[transform,background-color] duration-press ease-in-out-quad ' +
  'active:translate-y-px motion-reduce:active:translate-y-0 ' +
  '[[data-section=dark]_&]:border [[data-section=dark]_&]:border-brand-signal';

export function PressDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="button" variant="primary">
        Primary
      </Button>
      <Button type="button" variant="secondary">
        Secondary
      </Button>
      <Button type="button" variant="ghost">
        Ghost
      </Button>
      <button type="button" className={pressSample}>
        Press at 120ms
      </button>
    </div>
  );
}
