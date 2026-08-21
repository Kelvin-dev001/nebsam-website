'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client — ANON KEY ONLY.
 *
 * This exists for authenticated staff sessions in the admin (Sprint 9/12). It
 * is deliberately a separate module from lib/supabase/server.ts, which is
 * marked `server-only`, so there is no path by which a service-role key can be
 * reached from here.
 *
 * Public pages do not use this. They are server-rendered and read through
 * lib/content/, because content that matters must be in the HTML the crawler
 * receives — that is the failure this whole rebuild exists to fix.
 */
export function browserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Supabase is not configured. See .env.example.');
  }
  return createBrowserClient(url, key);
}
