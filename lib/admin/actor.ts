import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * WHO IS PERFORMING AN ADMIN ACTION.
 *
 * Read from the SESSION, never from a form field. A server action is a public
 * HTTP endpoint: anything in the request body is attacker-controlled, so an
 * `actorId` input would let one staff member attribute an edit to another — and
 * audit_log would faithfully record the lie.
 *
 * `getUser()` rather than `getSession()`, for the same reason the admin
 * middleware uses it: getSession reads the cookie and would trust a forged one,
 * while getUser revalidates against the auth server.
 *
 * Returns null when there is no valid session. Every caller treats that as a
 * refusal rather than as an anonymous action.
 */
export async function adminActor(): Promise<{ id: string; email: string | null } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      // A server action cannot always set cookies; refresh is the middleware's
      // job. Swallowing here keeps a read-only actor lookup from throwing.
      setAll: () => {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return { id: user.id, email: user.email ?? null };
}
