import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * A Supabase client bound to the caller's session cookies, and ABLE TO WRITE
 * THEM BACK.
 *
 * ── Why this exists next to `adminActor()` ──────────────────────────────────
 *
 * `lib/admin/actor.ts` builds a similar client with `setAll: () => {}` — a
 * deliberate no-op, because it is called from pages and from actions that
 * cannot always set cookies, and swallowing there keeps a read-only lookup from
 * throwing. That is correct for reading.
 *
 * It is useless for signing in. `signInWithPassword` succeeds and returns a
 * session, the cookies are handed to `setAll`, `setAll` discards them, and the
 * next request has no session — a login form that reports success and leaves
 * the user signed out. The two clients differ in exactly one behaviour and the
 * difference is the entire feature, so they are separate functions rather than
 * one with a flag somebody will pass wrongly.
 *
 * Only call this from a server action or a route handler, which are the two
 * places Next permits a cookie write.
 */
export function sessionClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        for (const { name, value, options } of list) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
