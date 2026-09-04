import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { serviceClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/content';

/**
 * WHO IS PERFORMING AN ADMIN ACTION, AND WHETHER THEY ARE ALLOWED TO.
 *
 * ── The gap this file closes ────────────────────────────────────────────────
 *
 * The design in Sprint 3 was: middleware gives an unauthenticated visitor a
 * redirect, and RLS is the real security boundary via `is_staff()`. That holds
 * only while the admin reads through a client bound to the user's session.
 *
 * It stopped holding in Sprint 9. The admin pages and server actions use the
 * SERVICE ROLE, which bypasses RLS entirely — so `is_staff()` never ran, and
 * the only actual gate was the middleware's "is there any authenticated user".
 * Any person who could sign up to the Supabase project could reach the CMS and
 * publish. Found while checking why `profiles` had no rows.
 *
 * So authorisation moves to where the authority is used. `requireStaff()` reads
 * `profiles.role` on every call and refuses anyone who is not staff. A session
 * is now necessary but not sufficient.
 *
 * ── Two rules that do not bend ──────────────────────────────────────────────
 *
 * 1. The actor comes from the SESSION, never from a form. A server action is a
 *    public HTTP endpoint; an `actorId` field would let one staff member
 *    attribute an edit to another, and audit_log would record the lie
 *    faithfully.
 * 2. The role is read from the DATABASE on each call, not from a JWT claim. A
 *    claim can be stale — someone demoted five minutes ago still carries the old
 *    token. `profiles.role` cannot be stale.
 */

export interface AdminActor {
  id: string;
  email: string | null;
  role: UserRole;
}

/** Rank order. Higher number outranks lower. Mirrors is_staff() in 0001. */
const RANK: Record<UserRole, number> = { viewer: 1, sales: 2, editor: 3, admin: 4 };

/**
 * The signed-in user, or null. Does NOT check authorisation — use
 * `requireStaff` for anything that reads or writes admin data.
 */
export async function adminActor(): Promise<AdminActor | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      // A server action cannot always set cookies; refreshing the session is
      // the middleware's job. Swallowing here keeps a read-only lookup from
      // throwing inside an action.
      setAll: () => {},
    },
  });

  // getUser() revalidates against the auth server. getSession() reads the
  // cookie and would trust a forged one.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // The role lives in `profiles`, which the service role reads. A confirmed
  // auth user with NO profile row is deliberately not staff: creating an
  // account must not by itself grant access to anything.
  const { data: profile } = await serviceClient()
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.role) return null;

  return { id: user.id, email: user.email ?? null, role: profile.role as UserRole };
}

/**
 * The actor, if they hold at least `minRole`. Null otherwise.
 *
 * Callers treat null as a refusal. Pages redirect to the login screen; server
 * actions return an error result rather than throwing, so a signed-out session
 * produces a readable message instead of a stack trace.
 */
export async function requireStaff(minRole: UserRole = 'viewer'): Promise<AdminActor | null> {
  const actor = await adminActor();
  if (!actor) return null;
  return RANK[actor.role] >= RANK[minRole] ? actor : null;
}
