import { Eyebrow, Section, Shell } from '@/components/layout/section';

/**
 * WHAT NEBSAM ACTUALLY DOES — homepage section 3 (brief 9.1).
 *
 * The visibility / control / protection thesis, in one screen.
 *
 * Written as three stacked rows separated by hairlines, NOT as a three-column
 * feature block — that pattern is named in the prohibited list (brief 6.6) and
 * it also reads wrong here, because these three are sequential rather than
 * parallel. You cannot control what you cannot see, and protection is what
 * control is for. Stacked rows carry that order; three equal columns destroy it.
 *
 * Every hedge below is preserved word for word from the source write-ups, per
 * the content skill §1: "according to the configured security logic", "subject
 * to network and GPS availability", "where supported by the vehicle". They are
 * accuracy, not padding, and they are the difference between a description and
 * a promise this business cannot keep.
 */

const STRANDS = [
  {
    term: 'Visibility',
    lead: 'Where the vehicle is, and where it has been.',
    body: 'Position, speed, ignition state and trip history for each vehicle, subject to network and GPS availability. A fleet manager sees the same picture whether the vehicle is on Mombasa Road or on a murram road outside Isiolo — and sees plainly when a unit has stopped reporting, rather than being shown a stale position as though it were current.',
  },
  {
    term: 'Control',
    lead: 'Acting on what you see, without being in the vehicle.',
    body: 'Geofences, speed and idling thresholds, and remote immobilisation according to the configured security logic, where supported by the vehicle. Control is what makes tracking operational rather than merely informative: an alert nobody can act on is a notification, not a safeguard.',
  },
  {
    term: 'Protection',
    lead: 'What happens when someone is actively working against you.',
    body: 'A GSM jammer is cheap and defeats an ordinary tracker by cutting the uplink, so the unit simply goes quiet — indistinguishable from a flat battery or a coverage hole. An anti-jamming tracker treats that silence as an event in its own right, alerting you and immobilising the vehicle according to the configured security logic.',
  },
] as const;

export function Thesis() {
  return (
    // `light`, not `paper` — the proof band above is already paper, and two
    // identical grounds in sequence is the flat rhythm brief 6.6 prohibits.
    <Section tone="light">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>What Nebsam does</Eyebrow>
          <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
            Visibility, control, and what happens when someone is working against you.
          </h2>
          <p className="mt-5 text-body-lg text-text-secondary">
            Nebsam Digital Solutions (K) Ltd installs and supports vehicle tracking, fleet
            telematics and vehicle security across Kenya, from branches in Nairobi, Mombasa and
            Nakuru. Three things have to hold, in this order.
          </p>
        </div>

        <dl className="mt-12 border-t border-border-hairline">
          {STRANDS.map((strand) => (
            <div
              key={strand.term}
              className="grid gap-x-10 gap-y-3 border-b border-border-hairline py-8 md:grid-cols-[14rem_1fr] md:py-10"
            >
              <dt>
                <span className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                  {strand.term}
                </span>
                <p className="mt-2 font-display-tight text-h3 text-text-primary">{strand.lead}</p>
              </dt>
              <dd className="max-w-prose text-body text-text-secondary">{strand.body}</dd>
            </div>
          ))}
        </dl>
      </Shell>
    </Section>
  );
}
