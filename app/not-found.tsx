import type { Metadata } from 'next';
import { Section, Shell, Eyebrow } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { LAUNCH_SOLUTIONS, ROUTES } from '@/lib/constants';
import { whatsappUrl } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * An empty screen is an invitation to act: this one offers the routes a lost
 * visitor most likely wanted rather than apologising. `follow: true` so link
 * equity still flows through to the real pages.
 *
 * Note this page is also what a *reserved but unbuilt* slug returns —
 * /solutions/fleet-management and /solutions/asset-tracking are deferred past
 * launch, and a 404 there is the honest answer.
 */
export default function NotFound() {
  return (
    <Section tone="dark">
      <Shell>
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 max-w-[20ch] font-display text-display md:text-md-display">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
          The link may be out of date, or the page may have moved during the site rebuild. Here is
          where most people are heading.
        </p>

        <nav aria-label="Solutions" className="mt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LAUNCH_SOLUTIONS.map((solution) => (
              <li key={solution.slug}>
                <a
                  href={ROUTES.solution(solution.slug)}
                  className="text-body text-brand-signal underline decoration-1 underline-offset-4 transition-all duration-micro ease-in-out-quad hover:decoration-2"
                >
                  {solution.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href={whatsappUrl()} variant="primary" size="lg">
            Talk to us on WhatsApp
          </ButtonLink>
          <ButtonLink href={ROUTES.home} variant="secondary" size="lg">
            Back to the homepage
          </ButtonLink>
        </div>
      </Shell>
    </Section>
  );
}
