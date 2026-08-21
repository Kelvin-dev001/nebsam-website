import * as React from 'react';

/**
 * Form field — label is always visible and programmatically associated.
 * Placeholder text is never the label (PART 15 §5).
 *
 * Errors are inline, specific and adjacent, announced via role="alert", and
 * referenced by aria-describedby. `aria-invalid` drives the visual state so the
 * error is never carried by colour alone.
 */
export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Field({ label, hint, error, id, className = '', ...props }: FieldProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-body-sm font-medium">
        {label}
        {props.required ? (
          <span className="ml-1 font-normal text-text-secondary [[data-section=dark]_&]:text-text-secondary-inverse">
            (required)
          </span>
        ) : null}
      </label>

      {hint ? (
        <p
          id={hintId}
          className="text-body-sm text-text-secondary [[data-section=dark]_&]:text-text-secondary-inverse"
        >
          {hint}
        </p>
      ) : null}

      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={[
          'min-h-[44px] rounded-control border bg-surface px-3 py-2 text-body',
          'transition-colors duration-micro ease-in-out-quad',
          'placeholder:text-text-secondary',
          error ? 'border-state-alert-ink' : 'border-border-strong',
          '[[data-section=dark]_&]:bg-brand-navy-raised [[data-section=dark]_&]:text-text-inverse',
          '[[data-section=dark]_&]:border-border-strong-inverse',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-body-sm text-state-alert-ink [[data-section=dark]_&]:text-state-alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
