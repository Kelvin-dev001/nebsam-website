import type { Metadata } from 'next';
import { Shell } from '@/components/layout/section';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { isDatabaseConfigured } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Admin sign-in.
 *
 * Sprint 3 ships the FORM, not the flow. Wiring Supabase Auth needs a real
 * project (register V46), and a half-wired auth form that appears to work is
 * worse than one that says plainly it is not connected.
 *
 * Deliberately excluded from the middleware matcher — if the gate covered this
 * page, an unauthenticated visitor would redirect here, match, and redirect
 * again forever.
 *
 * Note the absence of a "forgot password" link and a sign-up link. Staff
 * accounts are created by an admin, not self-served: `profiles.role` defaults
 * to `viewer` and only an admin can raise it (policy in 0008).
 */
export default async function AdminLogin({
  searchParams,
}: {
  // Next 15 makes searchParams a Promise. `tsc --noEmit` does not catch this —
  // only `next build`'s generated route type-check does, which is why the DoD
  // runs the build and not just the typechecker.
  searchParams?: Promise<{ reason?: string; next?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const configured = isDatabaseConfigured();
  const unconfigured = !configured || params.reason === 'unconfigured';

  return (
    // `max-w-md` overrides Shell's own measure. Shell drops `max-w-shell` when
    // a caller supplies a max-width, so this renders as a 448px centred column
    // rather than the full 1248px shell.
    <Shell className="flex min-h-screen max-w-md flex-col justify-center py-section">
      <h1 className="font-display text-h1">Sign in</h1>
      <p className="mt-2 text-body-sm text-text-secondary">
        Nebsam staff accounts only. Ask an administrator if you need access.
      </p>

      {unconfigured ? (
        <div
          role="status"
          className="mt-6 rounded-panel border border-state-warn-ink/30 bg-surface p-4"
        >
          <p className="text-body-sm">
            <span className="font-medium">Authentication is not connected yet.</span> Supabase has
            not been provisioned for this project, so this form cannot sign anyone in. The schema
            and policies are written and waiting in{' '}
            <code className="font-mono text-mono">supabase/migrations/</code>.
          </p>
        </div>
      ) : null}

      <form className="mt-8 flex flex-col gap-5" aria-describedby="login-status">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={unconfigured}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={unconfigured}
        />
        <Button type="submit" variant="primary" size="lg" disabled={unconfigured}>
          Sign in
        </Button>
      </form>

      <p id="login-status" className="mt-6 text-body-sm text-text-secondary">
        Sessions are validated against the auth server on every admin request, and permissions are
        enforced in row level security rather than in this interface.
      </p>
    </Shell>
  );
}
