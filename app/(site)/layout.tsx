import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { CookieNotice } from '@/components/consent/cookie-notice';
import { JsonLd } from '@/components/seo/json-ld';
import { jsonLdGraph, organizationSchema, websiteSchema } from '@/lib/seo/schema';

/**
 * PUBLIC SITE CHROME.
 *
 * Everything the marketing site shares and the admin must NOT inherit: header,
 * footer, the floating WhatsApp action, the cookie bar, and the global
 * Organization + WebSite JSON-LD.
 *
 * The schema is server-rendered here rather than injected after hydration,
 * because structured data has to be in the HTML the crawler receives — the
 * exact failure this rebuild exists to fix.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const graph = jsonLdGraph([organizationSchema(), websiteSchema()]);

  return (
    <>
      <JsonLd json={graph} />
      {/* site-shell: navy behind the glass header at rest (components/ui/surfaces.css).
          A plain div, no transform or filter, so the fixed WhatsApp button and
          cookie notice keep the viewport as their containing block. */}
      <div className="site-shell">
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
        <CookieNotice />
      </div>
    </>
  );
}
