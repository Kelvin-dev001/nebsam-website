import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/reveal';
import type { PublicCertification } from '@/types/content';

/**
 * "COMPLIES." — the third-party test result. Built in Sprint 1, promoted here
 * to its own component and wired to the database.
 *
 * No marketing heading. It opens with the word the laboratory wrote, because
 * brief 3.5 forbids paraphrasing "Complies" into anything stronger, and because
 * the unadorned word is more convincing than any sentence built around it.
 *
 * TWO DIFFERENT INSTRUMENTS, easily confused:
 *
 *   - The TEST REPORT (BS202445237, 5 Feb 2025) — a laboratory result. A fact
 *     about a past test, which does not expire, so it is a constant here.
 *   - The PERMIT (SM#84618) — a licence to use the standardization mark. It
 *     DOES expire, on 26 Feb 2027, so it comes from the database and is
 *     rendered only while `public_certifications` still returns it.
 *
 * That split is the point. When the permit lapses the badge disappears on its
 * own and the test result correctly remains, because the laboratory's finding
 * is still true. Hardcoding the badge would have published a lapsed permit the
 * day after expiry, which is precisely what brief 3.5 prohibits.
 */

/** KEBS laboratory test report BS202445237, 5 February 2025. Verified. */
const KEBS_PARAMETERS = [
  'ADAS camera detection',
  'Driver alerts',
  'DSM camera detection',
  'G-sensor detection',
  'Power supply — in-built battery sustaining the system for a minimum of 30 minutes',
  'System tampering detection',
  'Ignition-triggered power-on',
] as const;

/** The mark number as printed on the permit. Matched, never assumed. */
const PERMIT_REFERENCE = 'SM#84618';

export function KebsResult({ certifications }: { certifications: PublicCertification[] }) {
  const permit = certifications.find((c) => c.reference_number === PERMIT_REFERENCE) ?? null;

  return (
    <Section tone="paper">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal index={0}>
              <Eyebrow>Third-party test result</Eyebrow>
            </Reveal>
            <Reveal index={1}>
              <p className="mt-4 font-display text-display text-brand-blue md:text-md-display">
                Complies.
              </p>
            </Reveal>
            <Reveal index={2}>
              <p className="mt-5 max-w-prose text-body text-text-secondary">
                KEBS laboratory test report{' '}
                <span className="font-mono text-mono text-text-primary">BS202445237</span>,
                5&nbsp;February&nbsp;2025. Tested against KNWA&nbsp;3006:2024 — Video telematics
                system for motor vehicle: Performance Requirements.
              </p>
            </Reveal>
          </div>

          <Reveal index={3}>
            <dl className="border-t border-border-hairline">
              {KEBS_PARAMETERS.map((parameter) => (
                <div
                  key={parameter}
                  className="flex items-baseline justify-between gap-6 border-b border-border-hairline py-3.5"
                >
                  <dt className="text-body">{parameter}</dt>
                  <dd className="shrink-0 font-mono text-mono uppercase tracking-[0.06em] text-state-ok-ink">
                    Complies
                  </dd>
                </div>
              ))}
            </dl>

            {/*
              Scope stated on the face of the page. Presenting a product-scoped
              permit as company-wide certification is the accuracy trap named in
              brief 3.5, and the scope note is read from the database rather
              than retyped so it cannot drift from what admin publishes.
            */}
            {permit ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge>Permit {permit.reference_number}</Badge>
                {permit.scope_note ? (
                  <p className="max-w-prose text-body-sm text-text-secondary">
                    {permit.scope_note}
                  </p>
                ) : null}
              </div>
            ) : null}
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
