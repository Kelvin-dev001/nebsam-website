import type { StaticImageData } from 'next/image';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { Card } from '@/components/ui/card';
import { ZoomImage } from '@/components/ui/zoom-image';
import { whatsappUrl } from '@/lib/company';
import { LINKED_SOLUTIONS, ROUTES } from '@/lib/constants';
import { INDUSTRY_PHOTOS } from '@/lib/media/industries';
import { SOLUTION_PHOTOS } from '@/lib/media/solutions';
import type { PublicIndustry } from '@/types/content';

/**
 * "FIND YOUR SETUP" — the homepage's task-first entry (Sprint 16).
 *
 * Most visitors do not know whether they need a tracker, an alarm or a speed
 * limiter; they know what they drive. Four choices, each opening the solutions
 * and the sector page that fit it, with WhatsApp one tap away and a message
 * that tells sales which choice was made.
 *
 * ── Cards, and why not a uniform grid of them (ADR-0008) ────────────────────
 * Each card is a discrete thing the reader acts on, which is what a Card is
 * for. They carry a photograph each, so this is not the text-only card grid
 * brief 6.6 warns against.
 *
 * ── What the words may say ──────────────────────────────────────────────────
 * Every line restates a published solution summary; nothing here is new.
 * Solution names come from LINKED_SOLUTIONS and sector names from the
 * database, so a renamed page renames its link. A link whose page is not
 * published is left out, never pointed at a 404.
 *
 * ── Speed ───────────────────────────────────────────────────────────────────
 * The photos are 88px thumbnails of crops the site already ships, and they
 * render after `load` (ADR-0009 §4), so they can never become the LCP element.
 */

type Choice = {
  title: string;
  text: string;
  solutions: string[];
  industry?: string;
  photo?: StaticImageData;
  whatsapp: string;
};

const CHOICES: Choice[] = [
  {
    title: 'A private car',
    text: 'Car alarms with a vibrating key remote, anti-jamming, GPS tracking and remote immobilisation.',
    solutions: ['vehicle-security', 'vehicle-tracking'],
    photo: SOLUTION_PHOTOS['vehicle-security']?.portrait,
    whatsapp: 'Hello Nebsam, I would like to protect my car.',
  },
  {
    title: 'A matatu or PSV',
    text: 'Speed limiters for NTSA compliance, with tracking, and cameras on the road and the driver.',
    solutions: ['speed-governors', 'ai-video-telematics'],
    industry: 'public-service-vehicles',
    photo: SOLUTION_PHOTOS['speed-governors']?.portrait,
    whatsapp: 'Hello Nebsam, I am asking about a matatu or PSV.',
  },
  {
    title: 'Trucks and a fleet',
    text: 'Live GPS tracking, route playback, trip reports and fuel monitoring, for one vehicle or many.',
    solutions: ['vehicle-tracking', 'fuel-monitoring'],
    industry: 'logistics-and-transport',
    photo: SOLUTION_PHOTOS['ai-video-telematics']?.portrait,
    whatsapp: 'Hello Nebsam, I am asking about tracking for my trucks.',
  },
  {
    title: 'Cargo and containers',
    text: 'Electronic access control, GPS tracking and tamper detection on a container, for the whole journey.',
    solutions: ['container-e-seal'],
    industry: 'cross-border-transport',
    photo: INDUSTRY_PHOTOS['cross-border-transport']?.portrait,
    whatsapp: 'Hello Nebsam, I am asking about cargo and container security.',
  },
];

const linkClass =
  'inline-flex min-h-11 items-center text-body-sm text-brand-signal-ink underline decoration-1 underline-offset-4 hover:decoration-2';

export function SetupChooser({ industries }: { industries: PublicIndustry[] }) {
  const industryName = new Map(industries.map((i) => [i.slug, i.name]));
  const solutionName = new Map(LINKED_SOLUTIONS.map((s) => [s.slug as string, s.name as string]));

  return (
    <Section tone="light" aria-labelledby="setup-heading">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>Find your setup</Eyebrow>
          <h2
            id="setup-heading"
            className="mt-4 font-display text-h2 text-text-primary md:text-md-h2"
          >
            What are you protecting?
          </h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            Pick the closest match. Each opens the solutions that fit it, and WhatsApp is one tap
            away.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {CHOICES.map((choice) => {
            const links = [
              ...choice.solutions.flatMap((slug) =>
                solutionName.has(slug)
                  ? [{ href: ROUTES.solution(slug), label: solutionName.get(slug) as string }]
                  : [],
              ),
              ...(choice.industry && industryName.get(choice.industry)
                ? [
                    {
                      href: ROUTES.industry(choice.industry),
                      label: industryName.get(choice.industry) as string,
                    },
                  ]
                : []),
            ];
            return (
              <Card as="li" key={choice.title} className="zoom-group flex gap-5">
                {choice.photo ? (
                  <ZoomImage
                    afterLoad
                    src={choice.photo}
                    alt=""
                    sizes="88px"
                    frameClassName="aspect-[4/5] w-[5.5rem] shrink-0 self-start rounded-data"
                  />
                ) : null}
                <div className="min-w-0">
                  <h3 className="font-display-tight text-h3 text-text-primary">{choice.title}</h3>
                  <p className="mt-2 text-body-sm text-text-secondary">{choice.text}</p>
                  <ul className="mt-2 flex flex-wrap gap-x-5">
                    {links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a href={whatsappUrl(choice.whatsapp)} className={`${linkClass} font-medium`}>
                    Ask about this on WhatsApp
                  </a>
                </div>
              </Card>
            );
          })}
        </ul>
      </Shell>
    </Section>
  );
}
