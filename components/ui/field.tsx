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

/**
 * Shared chrome for every control.
 *
 * Label, hint and error are identical across input, textarea, select and
 * checkbox, and each of them is somewhere the accessible name or the error
 * association can be dropped by accident. Declaring the wrapper once means the
 * `aria-describedby` wiring is written once and cannot be forgotten in the
 * fourth control someone adds.
 */
function FieldShell({
  fieldId,
  label,
  hint,
  error,
  required,
  children,
}: {
  fieldId: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-body-sm font-medium">
        {label}
        {required ? (
          <span className="ml-1 font-normal text-text-secondary [[data-section=dark]_&]:text-text-secondary-inverse">
            (required)
          </span>
        ) : null}
      </label>

      {hint ? (
        <p
          id={`${fieldId}-hint`}
          className="text-body-sm text-text-secondary [[data-section=dark]_&]:text-text-secondary-inverse"
        >
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={`${fieldId}-error`}
          role="alert"
          className="text-body-sm text-state-alert-ink [[data-section=dark]_&]:text-state-alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlChrome = [
  'rounded-control border bg-surface px-3 py-2 text-body',
  'transition-colors duration-micro ease-in-out-quad',
  'placeholder:text-text-secondary',
  '[[data-section=dark]_&]:bg-brand-navy-raised [[data-section=dark]_&]:text-text-inverse',
  '[[data-section=dark]_&]:border-border-strong-inverse',
].join(' ');

function describedBy(fieldId: string, hint?: string, error?: string) {
  return [hint ? `${fieldId}-hint` : null, error ? `${fieldId}-error` : null]
    .filter(Boolean)
    .join(' ') || undefined;
}

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextareaField({ label, hint, error, id, className = '', ...props }: TextareaFieldProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell fieldId={fieldId} label={label} hint={hint} error={error} required={props.required}>
      <textarea
        id={fieldId}
        rows={props.rows ?? 5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        className={[
          controlChrome,
          error ? 'border-state-alert-ink' : 'border-border-strong',
          className,
        ].join(' ')}
        {...props}
      />
    </FieldShell>
  );
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  /**
   * Either plain strings, where the submitted value IS the visible text, or
   * explicit `{ value, label }` pairs where they differ.
   *
   * The pair form was added in Sprint 12 for the admin, where a status submits
   * `in_progress` and reads "In progress". The first attempt kept `string[]`
   * and mapped label back to value in an `onChange` handler — which works with
   * JavaScript and silently submits the LABEL without it, failing server-side
   * validation on exactly the path this project has already paid to keep
   * working. Putting the value on the `<option>` is what the element is for.
   */
  options: (string | { value: string; label: string })[];
}

export function SelectField({
  label,
  hint,
  error,
  options,
  id,
  className = '',
  ...props
}: SelectFieldProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell fieldId={fieldId} label={label} hint={hint} error={error} required={props.required}>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        className={[
          controlChrome,
          'min-h-[44px]',
          error ? 'border-state-alert-ink' : 'border-border-strong',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map((option) => {
          const { value, label: text } =
            typeof option === 'string' ? { value: option, label: option } : option;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </FieldShell>
  );
}

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

/**
 * A checkbox, laid out with the box beside its label rather than under it.
 *
 * The 44 px touch target lives on the LABEL, not on the 16 px box: a target that
 * small fails PART 15 on a phone, and enlarging the box itself would make it a
 * checkbox that does not look like one.
 */
export function CheckboxField({ label, hint, id, className = '', ...props }: CheckboxFieldProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="flex min-h-[44px] items-center gap-3 text-body-sm font-medium">
        <input
          id={fieldId}
          type="checkbox"
          aria-describedby={hint ? `${fieldId}-hint` : undefined}
          className={['h-5 w-5 rounded-data border border-border-strong', className].join(' ')}
          {...props}
        />
        {label}
      </label>
      {hint ? (
        <p
          id={`${fieldId}-hint`}
          className="text-body-sm text-text-secondary [[data-section=dark]_&]:text-text-secondary-inverse"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
