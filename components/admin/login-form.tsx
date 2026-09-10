'use client';

import { useActionState } from 'react';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { signIn, type LoginResult } from '@/app/(admin)/admin/login/actions';

/**
 * The sign-in form.
 *
 * `useActionState` with a real `action`, so it submits without JavaScript —
 * the same construction as `components/support/verify-form.tsx`, for the same
 * reason: the endpoint must be reachable the way it will actually be reached.
 *
 * The action is UNBOUND. Register item V59 records a bound server action
 * hanging the production server outright on the no-JavaScript path under Next
 * 15.5.23, and `next` therefore travels as a hidden field rather than through
 * `.bind()`. It is untrusted input and the action validates it as such —
 * `credentials.next` rejects anything that is not a path under /admin, because
 * an open redirect on a login form is how a phishing link borrows a real domain.
 */
export function LoginForm({ next, disabled }: { next: string; disabled: boolean }) {
  const [result, formAction, pending] = useActionState<LoginResult, FormData>(signIn, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        disabled={disabled}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        disabled={disabled}
      />

      {/*
        A live region present from FIRST PAINT, not one that appears with the
        error inside it. A region added to the DOM at the same moment as its
        content is frequently not announced at all — the failure is silent, and
        the person it fails is the one who most needs to be told the password
        was wrong.
      */}
      <div role="status" aria-live="polite">
        {result && !result.ok ? (
          <p className="rounded-panel border border-state-alert-ink/40 bg-surface p-3 text-body-sm text-state-alert-ink">
            {result.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={disabled || pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
