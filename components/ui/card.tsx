import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/**
 * CARD — ADR-0008.
 *
 * For a discrete, self-contained thing the reader acts on: a branch, the buy
 * box on a product page, a download. Not for lists meant to be compared line
 * by line — the catalogue, the blog, specifications and FAQs stay ruled lists,
 * because brief 6.6 names "uniform rounded-card grids" as a failure and a grid
 * of text-only cards is exactly that.
 *
 * `tone` follows the GROUND the card sits on: `light` on white or paper,
 * `dark` on navy. The styles are in components/ui/surfaces.css, where the
 * contrast figures for each are recorded.
 *
 * A Server Component: no client JavaScript. `as` renders it as the element the
 * content needs (`li` in a list of branches, `section` for a buy box).
 */
type CardProps<T extends ElementType> = {
  as?: T;
  tone?: 'light' | 'dark';
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export function Card<T extends ElementType = 'div'>({
  as,
  tone = 'light',
  className = '',
  children,
  ...rest
}: CardProps<T>) {
  const Tag: ElementType = as ?? 'div';
  return (
    <Tag className={`card card-${tone} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
