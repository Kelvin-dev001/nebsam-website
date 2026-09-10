'use client';

import * as React from 'react';

/**
 * Removes `?t=…` from the address bar once the server has already consumed it.
 *
 * SECURITY_REQUIREMENTS §1.5 forbids a plate — or an outcome tied to one — in
 * URLs, analytics, logs or error messages. A signed QR token is not a plate, but
 * it is a bearer credential for one specific certificate, and a URL is the least
 * private place on the web: it lands in browser history, in a shared screenshot,
 * in the `Referer` header of anything the page links to, and in whatever the
 * visitor's browser syncs to their other devices.
 *
 * The token has already done its work server-side by the time this runs, so
 * removing it costs nothing and shortens its exposure to the length of one
 * paint. `replaceState`, not `pushState`: the visitor should not have to press
 * Back twice, and a Back that returns to the token URL would re-expose it.
 *
 * This narrows the window. It does not close it — the token was in the request
 * line, so a proxy or an access log between the visitor and Vercel has already
 * seen it. That is inherent to putting anything in a URL, and it is why the
 * token is signed and expiring rather than merely opaque.
 */
export function StripTokenFromUrl() {
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('t')) return;
    url.searchParams.delete('t');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return null;
}
