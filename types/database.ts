/**
 * Database types.
 *
 * ⚠️ THIS FILE IS GENERATED. Do not hand-edit it.
 *
 *   npx supabase gen types typescript --linked > types/database.ts
 *   # or, against a local stack:
 *   npx supabase gen types typescript --local > types/database.ts
 *
 * Brief PART 7.2: "database types generated from Supabase, not hand-written."
 * Hand-writing them guarantees they drift from the schema, and the drift is
 * silent — the compiler happily agrees with a type that no longer matches the
 * table.
 *
 * ── Why this file currently contains a placeholder ──────────────────────────
 * Generation requires either a linked Supabase project or a local stack, and
 * the local stack needs Docker. Neither is available on this machine yet
 * (Sprint 3 report, register V46), so the migrations in supabase/migrations/
 * are the source of truth and this placeholder keeps the access layer
 * compiling in the meantime.
 *
 * REPLACE THIS ENTIRE FILE with the generated output as the first act of the
 * session in which database access becomes available. Nothing else needs to
 * change: lib/content/ already imports its row types from here.
 */

/** Replaced wholesale by the generated `Database` type. */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ── Enum unions. These mirror the enums created in 0001 exactly. ────────────
export type UserRole = 'admin' | 'editor' | 'sales' | 'viewer';
export type ContentStatus = 'draft' | 'in_review' | 'published';
export type OrderStatus =
  | 'new'
  | 'contacted'
  | 'confirmed'
  | 'installed'
  | 'closed'
  | 'cancelled';
export type SubmissionType = 'contact' | 'quote' | 'demo' | 'installation' | 'suggestion';
export type CoverageType = 'agent' | 'technician' | 'both';
export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'pre_order';
export type VerificationOutcome = 'valid' | 'expired' | 'not_found' | 'factor_failed';

/**
 * Shapes of the PUBLIC VIEWS from 0009 — the only things the anon key may read.
 *
 * These are written against the view definitions rather than the base tables on
 * purpose: the access layer should not be able to name a column that a public
 * page is not allowed to see.
 */

export interface PublicSolution {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  body: string | null;
  hero_image: string | null;
  sort_order: number;
  last_reviewed_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  updated_at: string;
}

export interface PublicProduct {
  id: string;
  slug: string;
  name: string;
  family: string | null;
  summary: string | null;
  body: string | null;
  specs: Json;
  features: Json;
  gallery: Json;
  category_id: string | null;
  category_slug: string | null;
  category_name: string | null;
  sku: string | null;
  /** VAT-EXCLUSIVE. `null` means "Request price" — no Offer schema, no add-to-cart. */
  price_kes: number | null;
  price_visible: boolean;
  availability: AvailabilityStatus;
  featured: boolean;
  recurring_fee_kes: number | null;
  recurring_fee_period: string | null;
  recurring_fee_note: string | null;
  installation_terms: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  updated_at: string;
}

export interface PublicProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface PublicIndustry {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  body: string | null;
  hero_image: string | null;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  updated_at: string;
}

export interface PublicBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  featured_image: string | null;
  published_at: string;
  updated_at: string;
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  author_id: string | null;
  author_name: string | null;
  author_role: string | null;
  author_avatar: string | null;
  category_id: string | null;
  category_slug: string | null;
  category_name: string | null;
}

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  scope: 'global' | 'solution' | 'product' | 'industry';
  scope_id: string | null;
  sort_order: number;
}

export interface PublicCertification {
  id: string;
  name: string;
  issuer: string;
  description: string | null;
  reference_number: string | null;
  document_path: string | null;
  image: string | null;
  effective_on: string | null;
  expires_on: string;
  scope_note: string | null;
  sort_order: number;
}

export interface PublicTestimonial {
  id: string;
  author_name: string;
  company: string | null;
  industry: string | null;
  quote: string;
  logo: string | null;
  sort_order: number;
}

export interface PublicClientLogo {
  id: string;
  name: string;
  logo_path: string | null;
  sector: string | null;
  sort_order: number;
}

export interface PublicDownload {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  category: string | null;
  thumbnail: string | null;
  document_date: string | null;
  version: string | null;
}

export interface PublicBranch {
  id: string;
  slug: string;
  name: string;
  address: string;
  town: string;
  county: string | null;
  phones: Json;
  maps_url: string | null;
  hours: string;
  lat: number | null;
  lng: number | null;
  sort_order: number;
}

export interface PublicCoverageLocation {
  id: string;
  town: string;
  county: string | null;
  type: CoverageType;
  lat: number | null;
  lng: number | null;
}
