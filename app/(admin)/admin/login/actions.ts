'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { sessionClient } from '@/lib/admin/session';
import { serviceClient } from '@/lib/supabase/server';

/**
 * SIGN IN.
 *
 * Sprint 3 shipped the login FORM with no action behind it, correctly — there
 * was no Supabase project to sign into. There is one now, and an admin nobody
 * can enter fails the Sprint 12 gate before the first click.
 *
 * ── The message is deliberately vague, and that is not laziness ─────────────
 *
 * Wrong password and unknown address return the SAME sentence. Distinguishing
 * them turns the login form into an account-existence oracle: an attacker
 * submits addresses and reads which ones say "wrong password". It is the same
 * argument as the certificate endpoint's identical copy for unknown-plate and
 * wrong-factor (ADR-0005), applied to the other end of the site.
 *
 * ── Why a signed-in non-staff user is signed straight back out ──────────────
 *
 * Supabase Auth and `profiles` are separate. An auth user with no profile row
 * is not staff — `adminActor()` already refuses them. But leaving their session
 * in place means they hold a valid cookie for a site they may not use, and every
 * subsequent request pays a database round trip to refuse them again. Signing
 * them out at the door is cheaper and clearer.
 */

const credentials = z.object({
  email: z.string().min(3).max(160).email('Enter the email address on your staff account.'),
  password: z.string().min(1, 'Enter your password.').max(200),
  /**
   * Where to go after signing in. Untrusted — the middleware puts it there, but
   * so can anyone with a link. Only a path on this site is accepted, and only
   * one under /admin: an open redirect on a login form is how a phishing link
   * borrows a real domain.
   */
  next: z
    .string()
    .optional()
    .transform((value) => (value && /^\/admin(?:\/|$)/.test(value) ? value : '/admin')),
});

export type LoginResult = { ok: false; message: string } | null;

export async function signIn(_previous: LoginResult, formData: FormData): Promise<LoginResult> {
  const parsed = credentials.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') ?? undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the form and try again.' };
  }

  const cookieStore = await cookies();
  const supabase = sessionClient(cookieStore);
  if (!supabase) {
    return { ok: false, message: 'Authentication is not configured on this deployment.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { ok: false, message: 'That email address and password do not match an account.' };
  }

  // Authentication is not authorisation. A confirmed auth user with no
  // `profiles` row has no role, and creating an account must not by itself
  // grant access to anything.
  const { data: profile } = await serviceClient()
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile?.role) {
    await supabase.auth.signOut();
    return { ok: false, message: 'That account has no staff role. Ask an administrator for access.' };
  }

  redirect(parsed.data.next);
}
