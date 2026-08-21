/**
 * No magic strings. Routes, analytics event names, statuses and VAT live here
 * (brief PART 7.2), so a rename is one edit and a typo is a type error.
 */

/** Canonical routes. Slugs are permanent — a change costs a 301. */
export const ROUTES = {
  home: '/',
  solutions: '/solutions',
  solution: (slug: string) => `/solutions/${slug}`,
  products: '/products',
  productCategory: (slug: string) => `/products/category/${slug}`,
  product: (slug: string) => `/products/${slug}`,
  cart: '/cart',
  order: (orderNumber: string) => `/orders/${orderNumber}`,
  industries: '/industries',
  industry: (slug: string) => `/industries/${slug}`,
  platform: '/platform',
  resources: '/resources',
  blog: '/resources/blog',
  blogCategory: (slug: string) => `/resources/blog/category/${slug}`,
  blogPost: (slug: string) => `/resources/blog/${slug}`,
  downloads: '/resources/downloads',
  faqs: '/resources/faqs',
  about: '/about',
  team: '/about/team',
  certifications: '/about/certifications',
  coverage: '/about/coverage',
  partners: '/about/partners',
  support: '/support',
  verifyInstallation: '/support/verify-installation',
  suggestions: '/support/suggestions',
  bookInstallation: '/support/book-installation',
  contact: '/contact',
  quote: '/quote',
  privacy: '/legal/privacy-policy',
  terms: '/legal/terms',
  cookies: '/legal/cookies',
} as const;

/**
 * The ten solutions shipping at launch.
 *
 * fleet-management and asset-tracking are DEFERRED past launch for want of
 * source material (Sprint 0, client decision). Their slugs are reserved, not
 * minted — a reserved slug that 404s is honest; a stub page that ranks for an
 * intent it cannot satisfy is worse than nothing. They are therefore absent
 * from navigation and from the sitemap.
 */
export const LAUNCH_SOLUTIONS = [
  { slug: 'vehicle-tracking', name: 'Vehicle Tracking' },
  { slug: 'vehicle-security', name: 'Vehicle Security & Anti-Theft' },
  { slug: 'vehicle-recovery', name: 'Vehicle Recovery' },
  { slug: 'fuel-monitoring', name: 'Fuel Monitoring' },
  { slug: 'ai-video-telematics', name: 'AI Video Telematics & Driver Safety' },
  { slug: 'school-bus-management', name: 'School Bus Management' },
  { slug: 'speed-governors', name: 'Speed Limiters (NTSA Compliance)' },
  { slug: 'container-e-seal', name: 'Cargo & Container Security' },
  { slug: 'radio-communication', name: 'Radio Communication (PTT / PoC)' },
  { slug: 'vehicle-key-programming', name: 'Vehicle Key Programming & Diagnostics' },
] as const;

/** Reserved but NOT built and NOT in the sitemap. See ADR-0002 and SPRINT_PLAN. */
export const DEFERRED_SOLUTION_SLUGS = ['fleet-management', 'asset-tracking'] as const;

export const PRODUCT_CATEGORIES = [
  { slug: 'gps-trackers', name: 'GPS Trackers' },
  { slug: 'car-alarms', name: 'Car Alarms' },
  { slug: 'dashcams-video', name: 'Dashcams & Video Telematics' },
  { slug: 'radios', name: 'Radios' },
  { slug: 'systems', name: 'Systems' },
] as const;

/**
 * Analytics events. No PII in any payload, ever — and for certificate
 * verification, the OUTCOME only, never the plate (brief 9.2).
 */
export const EVENTS = {
  whatsappClick: 'whatsapp_click',
  phoneClick: 'phone_click',
  quoteSubmitted: 'quote_submitted',
  installationBookingSubmitted: 'installation_booking_submitted',
  demoRequested: 'demo_requested',
  contactSubmitted: 'contact_submitted',
  suggestionSubmitted: 'suggestion_submitted',
  downloadStarted: 'download_started',
  viewItem: 'view_item',
  addToCart: 'add_to_cart',
  beginCheckout: 'begin_checkout',
  whatsappOrderSubmitted: 'whatsapp_order_submitted',
  certificateVerified: 'certificate_verified',
  blogReadComplete: 'blog_read_complete',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export const ORDER_STATUSES = [
  'new',
  'contacted',
  'confirmed',
  'installed',
  'closed',
  'cancelled',
] as const;

export const CONTENT_STATUSES = ['draft', 'in_review', 'published'] as const;

/**
 * VAT.
 *
 * All stored prices are VAT-EXCLUSIVE (brief PART 1.5 #10) and every displayed
 * price carries a visible "excl. VAT" label. Keeping the rate as one constant
 * means a VAT-inclusive display toggle can be added later without touching data.
 *
 * [[NEEDS_VERIFICATION: confirm the current VAT rate before launch]] — V06
 */
export const VAT_RATE = Number(process.env.NEXT_PUBLIC_VAT_RATE ?? 0.16);
export const VAT_LABEL = 'excl. VAT';

/** Consent cookie for the analytics gate. GA4 never fires before this is granted. */
export const CONSENT_COOKIE = 'nebsam_consent';
export const CONSENT_VERSION = 1;
