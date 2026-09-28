import { Button } from '@/components/ui/button';

/**
 * Level 1 on both grounds. The real Button variants, so hover, press and the
 * section-following focus ring can be felt with the values the site ships.
 *
 * Since Sprint 12b T5 every Button presses with `press-feedback`
 * (components/motion/micro-interactions.css): colour at micro, and the 1px
 * press at DURATION.press (120ms) on outQuart. The side-by-side sample this
 * page used to carry, for comparing an instant press with a 120ms one, went
 * when Kelvin approved the 120ms press for every button.
 */
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
    </div>
  );
}
