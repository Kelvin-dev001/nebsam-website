import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { PRIMARY_NAV } from './nav-data';
import { ROUTES } from '@/lib/constants';
import { COMPANY, whatsappUrl } from '@/lib/company';

/**
 * Header.
 *
 * The logo is a PLAQUE, not a free-standing mark — the pale blue fill is part
 * of the artwork and only the corners are transparent (docs/ASSET_MAP.md,
 * register V37). It therefore cannot sit directly on the navy ground, so it is
 * given its own light chip until mono variants exist. A constraint handled
 * honestly, not a flourish.
 *
 * Desktop nav is a plain link row, not a hover mega menu: hover-only reveals
 * are the most common keyboard trap on a site this size, and the sub-links are
 * all reachable from the section index pages and the footer anyway.
 */
export function Header() {
  return (
    <header
      data-section="dark"
      className="border-b border-border-hairline-inverse bg-brand-navy text-text-inverse"
    >
      <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a
          href={ROUTES.home}
          className="flex shrink-0 items-center rounded-control bg-white/95 px-2 py-1.5"
        >
          <Image
            src="/logo192.png"
            alt={COMPANY.legalName}
            width={28}
            height={28}
            priority
            className="h-7 w-7 object-contain"
          />
          <span className="ml-2 font-display-tight text-body-sm text-brand-blue">
            {COMPANY.shortName}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {PRIMARY_NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-body-sm text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            href={whatsappUrl()}
            variant="primary"
            className="hidden shrink-0 text-body-sm sm:inline-flex"
          >
            WhatsApp
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
