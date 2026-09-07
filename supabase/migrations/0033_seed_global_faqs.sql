-- 0033  Global FAQs for /resources/faqs.
--
-- Scope 'global', so these serve the FAQ page and nothing else. The
-- solution-scoped questions seeded in 0013-0022 stay where they are: a question
-- answered in two scopes is a contradiction waiting to happen, and the SEO plan
-- is explicit that one page owns one intent.
--
-- ── EVERY ANSWER HERE TRACES TO A VERIFIED SOURCE ────────────────────────────
-- CLAUDE.md §5 forbids inventing prices, response times, warranty terms,
-- specifications, certifications or counts. Several obvious FAQ questions are
-- therefore NOT seeded, because answering them would mean making something up:
--
--   * "How long does an installation take?"  — no verified duration exists.
--   * "What warranty do you offer?"          — no verified terms exist.
--   * "How many technicians do you have?"    — CLAUDE.md §4 forbids stating a
--                                              count of agents or technicians.
--   * "Which vehicles can you fit?"          — no verified list exists.
--
-- They are better absent than guessed. When the client answers them they become
-- rows here, not edits to a page.
--
-- ── ONE DELIBERATE OMISSION WORTH RECORDING ──────────────────────────────────
-- No FAQ here restates the ODPC "registered Data Controller and Data Processor"
-- sentence. That claim lives in exactly ONE place, `CANONICAL_DESCRIPTION` in
-- lib/company.ts, which is what makes register item V28a a one-line fix if the
-- renewal does not land. Seeding a second copy into the database would quietly
-- destroy that property: the constant would be corrected and this row would go
-- on asserting a lapsed registration. The certifications page (Sprint 11) is
-- where registration detail belongs, with its display_status beside it.

insert into faqs (question, answer, scope, sort_order, status) values

-- Q1. Coverage. Three branches ONLY (CLAUDE.md §4). Everywhere else is agents
-- and technicians, and no count of them may be stated.
('Where in Kenya does Nebsam install and support systems?',
 'Nebsam has three branches — Nairobi, Mombasa and Nakuru — and installs and supports systems well beyond them through agents and technicians working across the country, including Kisumu, Eldoret, Thika, Meru, Kilifi, Malindi, Garissa and Lodwar. If your vehicles operate somewhere not listed, ask us: coverage is a question about who can reach the vehicle, not about where an office happens to be.',
 'global', 1, 'published'),

-- Q2. V05 — ANSWERED 4 Sep 2026: prices are INCLUSIVE of installation by a
-- Nebsam technician.
('Do your prices include installation?',
 'Yes. The price shown for a device includes installation by a Nebsam technician. You are not quoted for the hardware and then billed separately for fitting it.',
 'global', 2, 'published'),

-- Q3. V06 — ANSWERED: 16%. Every displayed price carries a visible
-- "excl. VAT" label, so the FAQ has to say the same thing the labels do.
('Do your prices include VAT?',
 'No. Prices on this site are quoted exclusive of VAT and are labelled as such on every product page. VAT is added at the current rate when you are invoiced.',
 'global', 3, 'published'),

-- Q4. V52 — recurring fees are RECORDED per product and rendered on the product
-- page. The figures are deliberately not repeated here: they are reviewed each
-- year, and a second copy in a general FAQ is a second thing to remember to
-- update.
('Are there ongoing costs after installation?',
 'Some systems carry an annual per-device fee and some do not, so the answer depends on what is fitted. Where a system has a recurring cost, it is stated on that product page rather than discovered at checkout. Radios also carry a licence renewal payable to the Communications Authority of Kenya.',
 'global', 4, 'published'),

-- Q5. The KEBS misconception, corrected. CLAUDE.md §5 forbids "KEBS
-- accredited": it is a Permit to Use the Standardization Mark, product-scoped.
-- The laboratory test report is quoted with its reference, date and result and
-- is NOT paraphrased into anything stronger.
('Is Nebsam KEBS certified?',
 'Not as a company, and it matters to say so precisely. Nebsam holds a Permit to Use the Standardization Mark from the Kenya Bureau of Standards, and that permit covers vehicle cameras for video telematics under the STREAMAX brand. It is a permit to use the standardization mark on those products, not a company-wide certification. The related KEBS laboratory test report, reference BS202445237 of 5 February 2025, returned the result "Complies".',
 'global', 5, 'published'),

-- Q6. Describes this site's own behaviour, built in Sprint 7. No claim about
-- payment processing, because the site takes no payment.
('Can I order from the website?',
 'Yes. Add what you need to the cart and submit the order, and the details reach us on WhatsApp so a person can confirm availability, the fitting appointment and the final total before anything is paid. The site does not take card payments, and it never asks for card details.',
 'global', 6, 'published'),

-- Q7. Definitional, and the distinction customers actually get wrong. Grounded
-- in the vehicle-tracking and vehicle-security solutions already published.
-- Product names are the confirmed ones: Standard Tracker, Hybrid Car Alarm.
('What is the difference between a tracker and a car alarm?',
 'A tracker reports where the vehicle is and what it is doing, so you can see it on a map, review where it has been and act when something is wrong. A car alarm defends the vehicle at the vehicle — sounding, warning and resisting an attempt to take it. They answer different questions, which is why many installations carry both: the Standard Tracker tells you what happened, and the Hybrid Car Alarm tries to stop it happening.',
 'global', 7, 'published'),

-- Q8. V48 — ANSWERED 4 Sep 2026: Nebsam does NOT operate a recovery service.
-- The published wording must not be softened into implying one.
('Do you recover stolen vehicles?',
 'Nebsam does not operate a recovery service. What the equipment does is support a recovery — it reports the vehicle''s position and, where configured, immobilises it according to the configured security logic, so that you and the police have something to act on. Recovery itself is carried out by the authorities.',
 'global', 8, 'published');
