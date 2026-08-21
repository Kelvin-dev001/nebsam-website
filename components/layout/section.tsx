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

/** The measure. Everything sits inside this unless it is deliberately bleeding. */
export function Shell({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['mx-auto w-full max-w-shell px-5 md:px-8', className].filter(Boolean).join(' ')} {...props}>
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
