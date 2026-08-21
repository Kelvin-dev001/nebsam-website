import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';

/**
 * Header. The logo is a PLAQUE, not a free-standing mark — the pale blue fill
 * is part of the artwork and only the corners are transparent (see
 * docs/ASSET_MAP.md, register V37). It therefore cannot sit directly on the
 * navy ground, so it is given its own light chip until mono variants exist.
 * That is a constraint being handled honestly, not a design flourish.
 */
const NAV = [
  { label: 'Solutions', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Industries', href: '#' },
  { label: 'Platform', href: '#' },
];

export function Header() {
  return (
    <header
      data-section="dark"
      className="border-b border-border-hairline-inverse bg-brand-navy text-text-inverse"
    >
      <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-6 px-5 py-3 md:px-8">
        <a href="#" className="flex shrink-0 items-center rounded-control bg-white/95 px-2 py-1.5">
          <Image
            src="/logo192.png"
            alt="Nebsam Digital Solutions"
            width={28}
            height={28}
            priority
            className="h-7 w-7 object-contain"
          />
          <span className="ml-2 font-display-tight text-body-sm text-brand-blue">Nebsam</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
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

        <ButtonLink
          href="https://wa.me/254759000111"
          variant="primary"
          className="shrink-0 text-body-sm"
        >
          WhatsApp
        </ButtonLink>
      </div>
    </header>
  );
}
