import 'server-only';
import { publicClient, isDatabaseConfigured } from '@/lib/supabase/server';
import type {
  PublicBlogPost,
  PublicBranch,
  PublicCertification,
  PublicClientLogo,
  PublicCoverageLocation,
  PublicDownload,
  PublicFaq,
  PublicIndustry,
  PublicProduct,
  PublicProductCategory,
  PublicSolution,
  PublicTestimonial,
} from '@/types/content';

/**
 * THE CONTENT ACCESS LAYER.
 *
 * Every database read in the application goes through this module. Components
 * never call Supabase directly (brief PART 7.2 / docs/PROJECT_ARCHITECTURE.md
 * §4). Three reasons that rule earns its keep:
 *
 *   1. RLS assumptions stay in one reviewable place instead of scattered across
 *      components where nobody audits them.
 *   2. Caching becomes a single change rather than fifty.
 *   3. Service-role usage cannot leak into a component by accident, because
 *      components have no Supabase import at all.
 *
 * Everything here reads the PUBLIC VIEWS from 0009, never a base table. The
 * publication gates — draft status, permission_confirmed,
 * cleared_for_publication, certificate expiry — live in those views, so a
 * forgotten filter here cannot publish something that should be hidden.
 *
 * ── Behaviour before the database exists ────────────────────────────────────
 * Until Supabase is provisioned (register V46) every function returns an empty
 * result rather than throwing. That keeps the site building and rendering while
 * the content layer is empty, which is exactly the state Sprints 4–6 start
 * from. It is NOT a silent failure: `isDatabaseConfigured()` is exported so a
 * page can say "not yet available" rather than pretending there is no content.
 */

type Result<T> = { data: T; configured: boolean };

async function query<T>(fn: (db: ReturnType<typeof publicClient>) => Promise<T>, fallback: T): Promise<Result<T>> {
  if (!isDatabaseConfigured()) return { data: fallback, configured: false };
  try {
    return { data: await fn(publicClient()), configured: true };
  } catch (error) {
    // A read failure must not take a page down. Log it and render the empty
    // state; the alternative is a 500 on a marketing page because a view was
    // renamed.
    console.error('[content] read failed', error);
    return { data: fallback, configured: true };
  }
}

export { isDatabaseConfigured };

// ── Solutions ───────────────────────────────────────────────────────────────

export async function getSolutions(): Promise<Result<PublicSolution[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_solutions')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicSolution[];
  }, []);
}

export async function getSolutionBySlug(slug: string): Promise<Result<PublicSolution | null>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_solutions')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as PublicSolution | null;
  }, null);
}

// ── Products ────────────────────────────────────────────────────────────────

export async function getProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
}): Promise<Result<PublicProduct[]>> {
  return query(async (db) => {
    let q = db.from('public_products').select('*').order('name', { ascending: true });
    if (options?.categorySlug) q = q.eq('category_slug', options.categorySlug);
    if (options?.featuredOnly) q = q.eq('featured', true);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as PublicProduct[];
  }, []);
}

export async function getProductBySlug(slug: string): Promise<Result<PublicProduct | null>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as PublicProduct | null;
  }, null);
}

export async function getProductCategories(): Promise<Result<PublicProductCategory[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_product_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicProductCategory[];
  }, []);
}

// ── Industries ──────────────────────────────────────────────────────────────

export async function getIndustries(): Promise<Result<PublicIndustry[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_industries')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicIndustry[];
  }, []);
}

export async function getIndustryBySlug(slug: string): Promise<Result<PublicIndustry | null>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_industries')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as PublicIndustry | null;
  }, null);
}

// ── Blog ────────────────────────────────────────────────────────────────────
// The view already filters `published_at <= now()`, so scheduled posts are
// invisible without any date handling here.

export async function getBlogPosts(options?: {
  categorySlug?: string;
  limit?: number;
}): Promise<Result<PublicBlogPost[]>> {
  return query(async (db) => {
    let q = db
      .from('public_blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    if (options?.categorySlug) q = q.eq('category_slug', options.categorySlug);
    if (options?.limit) q = q.limit(options.limit);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as PublicBlogPost[];
  }, []);
}

export async function getBlogPostBySlug(slug: string): Promise<Result<PublicBlogPost | null>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as PublicBlogPost | null;
  }, null);
}

// ── FAQs ────────────────────────────────────────────────────────────────────

export async function getFaqs(
  scope: 'global' | 'solution' | 'product' | 'industry' = 'global',
  scopeId?: string,
): Promise<Result<PublicFaq[]>> {
  return query(async (db) => {
    let q = db
      .from('public_faqs')
      .select('*')
      .eq('scope', scope)
      .order('sort_order', { ascending: true });
    if (scopeId) q = q.eq('scope_id', scopeId);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as PublicFaq[];
  }, []);
}

// ── Trust ───────────────────────────────────────────────────────────────────
// Each of these three is permission- or expiry-gated inside its view. If a
// result is empty, that is the correct, honest answer — brief 3.5 and PART 18
// both say an absent section beats a fabricated or lapsed one.

export async function getCertifications(): Promise<Result<PublicCertification[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_certifications')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicCertification[];
  }, []);
}

export async function getTestimonials(): Promise<Result<PublicTestimonial[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_testimonials')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicTestimonial[];
  }, []);
}

export async function getClientLogos(): Promise<Result<PublicClientLogo[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_client_logos')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicClientLogo[];
  }, []);
}

export async function getDownloads(): Promise<Result<PublicDownload[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_downloads')
      .select('*')
      .order('title', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicDownload[];
  }, []);
}

// ── Operations ──────────────────────────────────────────────────────────────
// NOTE: lib/company.ts remains the build-time source for branches — it is what
// schema, llms.txt and the sitemap read, because those must work without a
// database. These read the CMS-editable copies, for pages where staff need to
// change hours or a phone number without a deploy.

export async function getBranches(): Promise<Result<PublicBranch[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_branches')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicBranch[];
  }, []);
}

export async function getCoverageLocations(): Promise<Result<PublicCoverageLocation[]>> {
  return query(async (db) => {
    const { data, error } = await db
      .from('public_coverage_locations')
      .select('*')
      .order('town', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublicCoverageLocation[];
  }, []);
}
