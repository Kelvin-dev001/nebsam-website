import type { Metadata } from 'next';
import { Shell } from '@/components/layout/section';
import { LoginForm } from '@/components/admin/login-form';
import { isDatabaseConfigured } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Admin sign-in.
 *
 * Sprint 3 shipped the FORM with no flow behind it, because there was no
 * Supabase project to sign into and a half-wired auth form that appears to work
 * is worse than one that says plainly it is not connected. Sprint 12 wires it:
 * an admin nobody can enter fails the staff-walkthrough gate before the first
 * click.
 *
 * Deliberately excluded from the middleware matcher — if the gate covered this
 * page, an unauthenticated visitor would redirect here, match, and redirect
 * again forever.
 *
 * Note the absence of a "forgot password" link and a sign-up link. Staff
 * accounts are created by an admin, not self-served: an auth user with no
 * `profiles` row has no role, and only an admin can grant one (policy in 0008).
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

      {params.reason === 'forbidden' ? (
        <div
          role="status"
          className="mt-6 rounded-panel border border-state-warn-ink/30 bg-surface p-4"
        >
          <p className="text-body-sm">
            That page needs a role your account does not hold. Sign in with an account that has it,
            or ask an administrator.
          </p>
        </div>
      ) : null}

      <LoginForm next={params.next ?? '/admin'} disabled={unconfigured} />

      <p className="mt-6 text-body-sm text-text-secondary">
        Sessions are validated against the auth server on every admin request, and permissions are
        enforced in row level security rather than in this interface.
      </p>
    </Shell>
  );
}
