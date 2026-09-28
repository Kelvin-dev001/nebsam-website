-- ============================================================================
-- 0044 — Installation-certificate verification is removed.
--
-- ADR-0007. Kelvin decided on 28 September 2026 to remove the feature
-- completely (register V03/V04). The route, admin screens, library and
-- scripts went on the same branch; this drops what the database held for it.
--
-- ── Why dropping is safe ────────────────────────────────────────────────────
--
-- installation_certificates held ZERO rows, counted read-only on 28 September
-- 2026: nothing was ever imported, so no real certificate and no printed QR
-- link depends on it. installation_plates_restricted hangs off it and is
-- therefore empty too. verification_attempts holds only keyed digests of IPs
-- and plates from testing, which are useless without the server secret and
-- which no retention promise covers.
--
-- ── What is NOT touched ─────────────────────────────────────────────────────
--
--   * certifications / public_certifications — the COMPANY's registrations
--     (KEBS, CAK, ODPC, PSRA). A different thing, one letter apart.
--   * set_updated_at() — shared by every table with an updated_at.
--   * audit_log rows that mention an installation_certificate. The log is
--     append-only by design; those rows stay as history.
--
-- ── Order ───────────────────────────────────────────────────────────────────
--
-- The function reads verification_attempts; installation_plates_restricted
-- references installation_certificates; verification_attempts uses the
-- verification_outcome type. Dropping in that dependency order means no
-- CASCADE is needed, so nothing is removed that this file does not name.
-- Policies, indexes and the updated_at trigger go with their tables.
--
-- NOT YET APPLIED when written: applying needs SUPABASE_ACCESS_TOKEN, which is
-- expired (register V61). Regenerate types/database.ts when it is applied.
-- ============================================================================

drop function if exists verification_attempt_counts(bytea, bytea);

drop table if exists verification_attempts;
drop table if exists installation_plates_restricted;
drop table if exists installation_certificates;

drop type if exists verification_outcome;
