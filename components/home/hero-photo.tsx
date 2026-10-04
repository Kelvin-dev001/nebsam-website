import { getImageProps } from 'next/image';
import { TelemetryPanel } from '@/components/home/telemetry-panel';
import { HERO_PHOTO } from '@/lib/media/home';

/**
 * The hero photograph and its telemetry overlay (brief 9.1: "real cinematic
 * vehicle/fleet photography, telemetry overlay"). ADR-0009.
 *
 * ART-DIRECTED, ONE ELEMENT. A <picture> serves the 4:5 crop to phones and the
 * 16:9 crop from 640px, so a phone never downloads the landscape and squashes
 * it. The same element changes its role by breakpoint, in CSS only:
 *
 *   below lg   in the flow, UNDER the headline and actions: the text is read
 *              first, and the headline stays the page's LCP element.
 *   lg and up  absolutely positioned behind the whole hero, full bleed, with
 *              a navy scrim over the text side.
 *
 * WHY LAZY. Measured against Lighthouse's model on this page (PERFORMANCE_
 * BASELINE §14): every request started before first paint costs LCP, at about
 * 8 ms per KB, and Home had ~140 ms of headroom. An eager photo is fetched
 * during parsing. Lazy waits for layout, so on a phone, where it starts below
 * the fold, it no longer competes with the headline's font. getImageProps
 * cannot carry a blur placeholder (it would never be removed), and the navy
 * ground already stands in while the file arrives.
 *
 * THE OVERLAY IS AN ILLUSTRATION (brief 6.5): the illustrative plate, the
 * visible caption, and aria-hidden, so a screen reader is not read invented
 * values as if they were live. Nothing a reader needs is only here.
 */
export function HeroPhoto() {
  const common = { alt: HERO_PHOTO.alt, sizes: '100vw' };
  const {
    props: { srcSet: wideSrcSet },
  } = getImageProps({ ...common, src: HERO_PHOTO.wide });
  const {
    props: { srcSet: portraitSrcSet, ...img },
  } = getImageProps({ ...common, src: HERO_PHOTO.portrait });

  return (
    <div className="relative mb-24 aspect-[4/5] sm:aspect-video lg:absolute lg:inset-0 lg:mb-0 lg:aspect-auto">
      <picture>
        <source media="(min-width: 640px)" srcSet={wideSrcSet} sizes="100vw" />
        <img
          {...img}
          srcSet={portraitSrcSet}
          alt={HERO_PHOTO.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[74%_55%] lg:object-[68%_55%]"
        />
      </picture>

      {/* Scrims: decorative, no text is ever on an unscreened part of the photo. */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0" />

      {/*
        Below lg the panel straddles the photo's bottom edge, so it never sits
        on the truck; from lg it floats in the sky at the shell's right edge.
      */}
      <div aria-hidden="true" className="hero-overlay absolute w-[14.5rem]">
        <TelemetryPanel
          solid
          context="Live position"
          rows={[
            { label: 'Ignition', value: 'On' },
            { label: 'Speed', value: '62 km/h' },
            { label: 'GPS', value: 'Fix OK' },
          ]}
          status={{ text: 'Reporting', ok: true }}
          caption="Illustration — not live customer data"
        />
      </div>
    </div>
  );
}
