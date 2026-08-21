import * as React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

/**
 * Button — brief 3.7 conversion hierarchy: the primary action on a page must be
 * unmistakable. Only one `primary` per view.
 *
 * CONTRAST NOTE. brand-signal (#3D8BFF) fails as a fill: white on it is
 * 3.31:1. Every primary fill therefore uses brand-signal-ink (#1857C4), which
 * is 6.56:1 with white — on BOTH grounds, so the primary button looks the same
 * everywhere. On dark sections it gains a #3D8BFF hairline so the control
 * boundary is identifiable against the navy (5.61:1); a filled control needs
 * that under WCAG 1.4.11.
 *
 * Full variant table: docs/DESIGN_SYSTEM.md §4.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-control font-medium ' +
  'transition-colors duration-micro ease-in-out-quad ' +
  'active:translate-y-px motion-reduce:active:translate-y-0 ' +
  'disabled:pointer-events-none disabled:opacity-50';

const sizes: Record<Size, string> = {
  // 44px min touch target (PART 15)
  md: 'min-h-[44px] px-4 py-2.5 text-body',
  lg: 'min-h-[52px] px-6 py-3 text-body-lg',
};

const variants: Record<Variant, string> = {
  primary: 'bg-brand-signal-ink text-white hover:bg-[#134aa8]',
  secondary:
    'border border-border-strong text-text-primary hover:bg-surface-raised ' +
    '[[data-section=dark]_&]:border-border-strong-inverse [[data-section=dark]_&]:text-text-inverse ' +
    '[[data-section=dark]_&]:hover:bg-brand-navy-raised',
  ghost:
    'text-brand-signal-ink underline decoration-1 underline-offset-4 hover:decoration-2 ' +
    '[[data-section=dark]_&]:text-brand-signal',
};

const darkPrimaryBoundary = '[[data-section=dark]_&]:border [[data-section=dark]_&]:border-brand-signal';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'secondary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={[
        base,
        sizes[size],
        variants[variant],
        variant === 'primary' ? darkPrimaryBoundary : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={[
        base,
        sizes[size],
        variants[variant],
        variant === 'primary' ? darkPrimaryBoundary : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
