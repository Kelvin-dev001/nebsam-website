-- 0011  Seed the regulatory instruments.
--
-- Every value here is transcribed from the inspection record in
-- content-source/05-certifications/README.md §4A, where all six scans were
-- opened, viewed and OCR-scanned. Nothing is inferred and nothing is rounded.
--
-- WHY THIS SEEDS EXPIRED INSTRUMENTS DELIBERATELY
--
-- Three of these have lapsed and one has an unconfirmed renewal. They are
-- seeded anyway, with their real dates, because `public_certifications` (0009)
-- filters on `expires_on > current_date`. The database is therefore the thing
-- that decides what is displayable, not a developer remembering to check.
--
-- Consequence today: only the KEBS permit is visible. When operations renew
-- CAK, the two ODPC registrations or PSRA and update `expires_on`, those rows
-- begin appearing on the site with no code change and no deployment. Brief 3.5
-- — "the site must never display a lapsed permit" — is enforced by data rather
-- than by discipline.
--
-- PSRA carries `expires_on = null` on purpose. Its certificate states a
-- five-year term to 2029 but is expressly "subject to annual license renewal",
-- and that renewal is unconfirmed (register V30). A null is honest: we have no
-- confirmed current expiry. 0004 already treats null as not displayable, and
-- writing 2029 here would publish an instrument nobody has verified is live.
--
-- NO IMAGES ARE SET. Every scan needs work before it can be published
-- (README §4A): kebs.jpg carries the unpublished phone number, the
-- administrative email, a postal and physical address, a handwritten signature
-- and an unread QR code, and must be cropped to the right-hand column first.
-- The others need the named official and signature removed. Until cropped
-- files exist, these render as data, never as scans.

insert into certifications
  (name, issuer, description, reference_number, effective_on, expires_on, scope_note, sort_order)
values
  (
    'Permit to Use the Standardization Mark',
    'Kenya Bureau of Standards',
    'Issued under the Standards Act (Cap. 496) against KNWA 3006:2024 — Video telematics system for motor vehicle: Performance Requirements.',
    'SM#84618',
    date '2025-02-26',
    date '2027-02-26',
    -- The trap this column exists to prevent. The permit is PRODUCT-scoped, not
    -- company-scoped, and "accredited" is the wrong word for it (README §1).
    'Product-scoped: vehicle cameras for video telematics, STREAMAX brand. It does not certify Nebsam as a company, and does not cover trackers, alarms, speed governors or radios.',
    1
  ),
  (
    'Compliance Certificate',
    'Communications Authority of Kenya',
    -- Corrects brief 3.5, which calls this an "Application Service Provider
    -- (AS) licence". The document contradicts that on its face (register V31).
    'The certificate states on its face that it is proof of compliance and not a licence.',
    '04-00274-00-09-0372',
    null,
    date '2025-06-30',
    null,
    2
  ),
  (
    'Data Controller registration',
    'Office of the Data Protection Commissioner',
    'Registration under the Data Protection Act 2019.',
    '05634',
    null,
    date '2026-05-27',
    null,
    3
  ),
  (
    'Data Processor registration',
    'Office of the Data Protection Commissioner',
    'Registration under the Data Protection Act 2019.',
    '05626',
    null,
    date '2026-05-27',
    null,
    4
  ),
  (
    'Private security service provider registration',
    'Private Security Regulatory Authority',
    'Registered under Section 28 of the Private Security Regulation Act No. 13 of 2016.',
    'PSRA/NDSKL/19/00',
    date '2024-06-28',
    -- Null, not 2029. See the header note.
    null,
    'Five-year term stated to 2029, expressly subject to annual licence renewal.',
    5
  );
