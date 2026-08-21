/**
 * Server-rendered JSON-LD.
 *
 * Deliberately a plain <script> in a Server Component rather than next/script:
 * structured data must be in the HTML the crawler receives, not injected after
 * hydration. That is the exact failure this rebuild exists to fix.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own typed builders and JSON.stringify'd,
      // never from user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
