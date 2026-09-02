import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Server-side Supabase clients.
 *
 * `import 'server-only'` at the top is the enforcement, not the comment: if any
 * client component ever imports this module, the BUILD FAILS rather than
 * quietly shipping a service-role key to a browser. That is the single most
 * expensive mistake available in this file, so it is made impossible rather
 * than discouraged.
 *
 * Two clients, two jobs:
 *
 *   publicClient()  — anon key. Reads the public views from 0009 and nothing
 *                     else. Used for ordinary page data.
 *   serviceClient() — service-role key. BYPASSES RLS. Used only for writes and
 *                     for the certificate lookup, always inside a server action
 *                     that has already validated its input with Zod.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. See .env.example — every variable is documented there.`,
    );
  }
  return value;
}

/**
 * Anon-key client. Cannot write anything: 0008 grants the anon role no policy
 * on any base table, and 0009 grants SELECT only on the public views.
 */
export function publicClient() {
  return createClient<Database>(
    required('NEXT_PUBLIC_SUPABASE_URL'),
    required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    { auth: { persistSession: false } },
  );
}

/**
 * Service-role client. RLS DOES NOT APPLY TO THIS CLIENT.
 *
 * Every call site is responsible for its own authorisation check, because the
 * database will not do it for you here. Use it for:
 *   - creating an order (the row must exist before WhatsApp opens)
 *   - the certificate lookup (never queried from a browser, brief 9.2)
 *   - writing audit_log and verification_attempts
 *
 * Never use it to serve ordinary page content — that is what publicClient is
 * for, and routing reads through it keeps the publication gates in 0009 doing
 * their job.
 */
export function serviceClient() {
  return createClient<Database>(
    required('NEXT_PUBLIC_SUPABASE_URL'),
    required('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** True when Supabase is configured. Lets pages degrade rather than crash. */
export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
