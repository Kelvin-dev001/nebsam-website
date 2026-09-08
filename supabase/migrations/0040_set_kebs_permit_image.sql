-- ============================================================================
-- 0040 — Point the KEBS permit row at its cleared derivative.
--
-- 0011 deliberately set NO image on any certification: every scan carried
-- something that could not be published, and a row with no image renders as
-- data rather than as a document. That was correct then and stays correct for
-- the other four rows.
--
-- Sprint 11 produced the one cleared derivative. public/certificates/
-- kebs-permit-terms.jpg is CROPPED from the permit, not redacted — the postal
-- and physical addresses, the telephone number, the email address, the QR code
-- and the Managing Director's signature are ABSENT FROM THE FILE rather than
-- covered over. The six originals moved out of public/ entirely; see
-- source-assets/README.md.
--
-- The other four rows keep a null image, and it is not the image that hides
-- them: `public_certifications` (0009) filters on `expires_on > current_date`
-- and treats a null expiry as not displayable, so CAK, both ODPC registrations
-- and PSRA cannot render however many files exist. Renewing them is an
-- operations task (V27-V30), and when a renewal lands the row appears with no
-- deploy.
--
-- Idempotent: safe to re-run.
-- ============================================================================

update certifications
   set image = '/certificates/kebs-permit-terms.jpg'
 where reference_number = 'SM#84618';
