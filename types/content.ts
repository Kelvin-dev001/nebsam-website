/**
 * Content types — DERIVED, not declared.
 *
 * `types/database.ts` is generated output and is overwritten wholesale by
 * `npm run db:types`. Nothing may be hand-added to it, so the convenience
 * aliases the application actually reads live here instead and are derived
 * from the generated `Database` type.
 *
 * That indirection is the point. These are not a parallel description of the
 * schema that could drift from it — every alias below resolves through
 * `Database`, so a column renamed in a migration becomes a type error here the
 * moment the types are regenerated. Brief PART 7.2 forbids hand-written
 * database types precisely because a hand-written one agrees with the compiler
 * long after it has stopped agreeing with the database.
 *
 * Everything the application reads is a PUBLIC VIEW from migration 0009, never
 * a base table. The publication gates — draft status, permission_confirmed,
 * cleared_for_publication, certificate expiry — live in those views.
 */

import type { Database } from '@/types/database';

type Views = Database['public']['Views'];
type Enums = Database['public']['Enums'];

// ── Row types for the public views ──────────────────────────────────────────

export type PublicSolution = Views['public_solutions']['Row'];
export type PublicProduct = Views['public_products']['Row'];
export type PublicProductCategory = Views['public_product_categories']['Row'];
export type PublicIndustry = Views['public_industries']['Row'];
export type PublicBlogPost = Views['public_blog_posts']['Row'];
export type PublicBlogCategory = Views['public_blog_categories']['Row'];
export type PublicAuthor = Views['public_authors']['Row'];
export type PublicFaq = Views['public_faqs']['Row'];
export type PublicCertification = Views['public_certifications']['Row'];
export type PublicTestimonial = Views['public_testimonials']['Row'];
export type PublicClientLogo = Views['public_client_logos']['Row'];
export type PublicDownload = Views['public_downloads']['Row'];
export type PublicBranch = Views['public_branches']['Row'];
export type PublicCoverageLocation = Views['public_coverage_locations']['Row'];

// Join views, for pages that resolve a product's solutions or industries.
export type PublicProductSolution = Views['public_product_solutions']['Row'];
export type PublicProductIndustry = Views['public_product_industries']['Row'];
export type PublicSolutionIndustry = Views['public_solution_industries']['Row'];

// ── Enums, as they are defined in the database ──────────────────────────────

export type UserRole = Enums['user_role'];
export type ContentStatus = Enums['content_status'];
export type OrderStatus = Enums['order_status'];
export type SubmissionType = Enums['submission_type'];
export type CoverageType = Enums['coverage_type'];
export type AvailabilityStatus = Enums['availability_status'];
export type VerificationOutcome = Enums['verification_outcome'];

export type { Json } from '@/types/database';

// ── Solution page sections ──────────────────────────────────────────────────

/**
 * The prose half of the eleven-section solution model, stored in
 * `solutions.sections` (migration 0012).
 *
 * Every key is optional and a missing one simply does not render. That is
 * deliberate: a solution with nothing truthful to say under a heading should
 * omit the heading, not print it above an empty space or a placeholder.
 *
 * The other five sections are NOT here and must not be duplicated into the
 * JSON, or the two copies will drift: hardware comes from `product_solutions`,
 * coverage from the branch tables, FAQs from `faqs` scoped to the solution,
 * related from the join tables, and the conversion block from the template.
 */
export interface SolutionSections {
  /** 1 — What it is. One paragraph a non-specialist understands. */
  what_it_is?: string[];
  /** 2 — The problem it solves, in Kenyan operational terms. */
  problem?: string[];
  /** 3 — Who it is for: industries, fleet sizes, vehicle types. */
  who_its_for?: { label: string; detail: string }[];
  /** 4 — How it works. Four to six concrete steps, in order. */
  how_it_works?: { title: string; detail: string }[];
  /** 5 — What you get. Grouped and explained, never bulleted flatly. */
  what_you_get?: { group: string; items: { title: string; detail: string }[] }[];
  /** 7 — Installation and support: what happens, where, how long. */
  installation_support?: string[];
}

/**
 * Read `sections` off a solution row.
 *
 * The column arrives typed as `Json`, because that is what it is at the
 * database boundary. This is the single place that assertion is made, so a
 * malformed row degrades to "no sections" — every section is optional, so the
 * page still renders its database-driven parts — rather than throwing inside a
 * server component and taking the whole route down with it.
 */
export function solutionSections(value: PublicSolution['sections']): SolutionSections {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as SolutionSections;
}

// ── Product features ────────────────────────────────────────────────────────

/** One feature on a product page: a short label and an explanation. */
export interface ProductFeature {
  title: string;
  detail: string;
}

/**
 * Read `features` off a product row.
 *
 * Stored as a jsonb array and typed as `Json` at the database boundary, so the
 * assertion is made here once. Malformed entries are dropped rather than
 * rendered, because a feature with no title is a bullet with no text.
 */
export function productFeatures(value: PublicProduct['features']): ProductFeature[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((f) =>
    f && typeof f === 'object' && !Array.isArray(f) && 'title' in f && 'detail' in f
      ? [{ title: String((f as Record<string, unknown>).title), detail: String((f as Record<string, unknown>).detail) }]
      : [],
  );
}
