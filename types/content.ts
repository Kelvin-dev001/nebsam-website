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
