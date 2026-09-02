import * as React from 'react';

/**
 * Section wrapper — carries the light/dark rhythm from brief 6.2.
 *
 * `data-section` is the hook the whole system keys off: the focus ring, the
 * secondary button border and the ghost link colour all read it, so a component
 * never has to be told which ground it is sitting on.
 *
 * PART 6.6 prohibits identical section rhythm, so `tone` and `bleed` exist to
 * make sections structurally different, not just differently coloured.
 */
type Tone = 'light' | 'paper' | 'dark';

const tones: Record<Tone, string> = {
  light: 'bg-surface text-text-primary',
  paper: 'bg-surface-raised text-text-primary',
  dark: 'bg-brand-navy text-text-inverse',
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  as?: 'section' | 'header' | 'footer' | 'div';
  /** Full-bleed background with the inner shell still constrained. */
  bleed?: boolean;
}

export function Section({
  tone = 'light',
  as: Tag = 'section',
  bleed = false,
  className = '',
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      data-section={tone === 'dark' ? 'dark' : 'light'}
      className={[tones[tone], bleed ? '' : 'py-section md:py-section-lg', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Does `className` already carry a utility of this family, at any breakpoint?
 *
 * Matches `px-4` and `md:px-4`, and does not match a different family that
 * merely contains the prefix — `max-w-md` is not a `px-` utility.
 */
function overrides(className: string, prefix: string): boolean {
  return new RegExp(`(^|\\s)(\\w+:)*${prefix}`).test(className);
}

/**
 * The measure. Everything sits inside this unless it is deliberately bleeding.
 *
 * Shell owns exactly two utilities a caller might reasonably want to change —
 * the measure (`max-w-*`) and the gutter (`px-*`) — and it DROPS its own
 * default when the caller supplies one of those. Without that, both classes
 * land on the element and Tailwind's source order, not the caller, picks the
 * winner: a silent failure where the markup reads correctly and the layout is
 * wrong. The admin sign-in page hit exactly this, passing `max-w-md` and
 * rendering at `max-w-shell`.
 *
 * This is deliberately a local guard rather than `tailwind-merge`. A general
 * merge is a runtime dependency on a route budget of 180 KB, for an audience
 * paying for data by the megabyte, to arbitrate two utilities in one component.
 * If several components later need real merging, revisit it then — with the
 * evidence to justify the bytes.
 */
export function Shell({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const classes = ['mx-auto w-full'];
  if (!overrides(className, 'max-w-')) classes.push('max-w-shell');
  if (!overrides(className, 'px-')) classes.push('px-5', 'md:px-8');
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')} {...props}>
      {children}
    </div>
  );
}

/** Mono eyebrow. Structural device — it labels a section, it does not decorate. */
export function Eyebrow({
  children,
  dot = false,
  className = '',
}: {
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <p
      className={[
        'flex items-center gap-2 font-mono text-label uppercase tracking-[0.08em]',
        'text-text-secondary [[data-section=dark]_&]:text-text-secondary-inverse',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot ? (
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-state-warn" />
      ) : null}
      {children}
    </p>
  );
}
