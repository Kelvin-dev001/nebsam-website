import { Hero } from '@/components/home/hero';
import { ProofBand } from '@/components/home/proof-band';
import { OneVehicle } from '@/components/home/one-vehicle';
import { KebsResult } from '@/components/home/kebs-result';
import { HowWeWork } from '@/components/home/how-we-work';
import { Coverage } from '@/components/home/coverage';
import { ConversionClose } from '@/components/home/conversion-close';
import { SolutionsPreview } from '@/components/home/solutions-preview';
import { ShopPreview } from '@/components/home/shop-preview';
import { IndustriesPreview } from '@/components/home/industries-preview';
import { ResourcesPreview } from '@/components/home/resources-preview';
import { SetupChooser } from '@/components/home/setup-chooser';
import {
  getBlogPosts,
  getBranches,
  getCertifications,
  getClientLogos,
  getCoverageLocations,
  getIndustries,
  getProductCategories,
  getProducts,
  getSolutions,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/lib/constants';

/**
 * HOMEPAGE — production. Sprint 4.
 *
 * Brief 9.1 lists thirteen candidate sections and the acceptance criterion caps
 * the page at twelve, "cut rather than pad". Seven ship. What happened to the
 * other six is recorded here rather than in a commit message, because the next
 * person to open this file will otherwise assume they were forgotten:
 *
 *   §2  Proof band      — SHIPS, without client logos. Six exist in
 *                         public/clients/ and none has written permission (V12),
 *                         so the band carries approved figures and the branch
 *                         and coverage counts instead.
 *   §5  Solutions       — DEFERRED to Sprint 5. `solutions` holds 0 rows and
 *                         /solutions/* does not exist, so the section would
 *                         render nothing and link to 404s.
 *   §6  The platform    — CUT. Every available screenshot carries third-party
 *                         branding (V13). The criterion is explicit: cut, not
 *                         filled with placeholders.
 *   §7  Shop            — DEFERRED to Sprint 6, as §5.
 *   §8  Industries      — DEFERRED to Sprint 5, as §5.
 *   §11 Customer proof  — ABSENT. No testimonial has attribution and permission
 *                         (V15). The criterion: real, or the section is absent.
 *   §12 Resources       — DEFERRED to Sprint 9, as §5.
 *
 * The four deferrals are one decision, not four. Each depends on content that
 * a later sprint creates, and building them blind now would mean designing
 * against imagined data and shipping code nobody can verify in a browser —
 * which is the "verify, don't claim" rule inverted. They are added by the
 * sprint that creates their content, when they can be designed against the
 * real thing and reviewed.
 *
 * TONE RHYTHM: dark → paper → dark → paper → dark → light → dark. Brief 6.6
 * prohibits identical section rhythm, so no two adjacent sections share a
 * ground and the page alternates weight as well as colour.
 *
 * SPRINT 12b T4: section 3 (the Thesis) became "One vehicle, instrumented" —
 * brief 9.1 §3 and §4 in one pinned set piece (ADR-0006), which must sit on
 * the dark ground. The Thesis copy seeds its beats; the hero's jamming readout
 * is its peak. Still seven sections. Brief: docs/design/sets/home-BRIEF.md.
 *
 * SPRINT 12n (ADR-0009): THE FOUR DEFERRALS LAND, now that their content and
 * Nebsam's photographs exist: §5 Solutions, §7 Shop, §8 Industries and §12
 * Resources. Eleven sections. §6 Platform is still cut (V13) and §11 Customer
 * proof still absent (V15): real, or absent. The hero gains its photograph.
 *
 * TONE RHYTHM since 12n: dark → paper → dark → paper → light → dark → light →
 * dark → light → paper → dark. No two neighbours share a ground.
 *
 * SPRINT 16: "Find your setup" (SetupChooser, light) between the proof band
 * and the pinned set piece: the task-first entry for a visitor who knows what
 * they drive and not what they need. TWELVE sections, the brief's cap, so the
 * client logo wall lives INSIDE the proof band next to "70+ corporate
 * clients", not as a thirteenth. Rhythm: dark → paper → light → dark → paper →
 * light → dark → light → dark → light → paper → dark.
 */

/**
 * Revalidate hourly.
 *
 * This is not a performance tweak, it is a correctness requirement. The page is
 * statically prerendered, so every database read here — including
 * `public_certifications`, whose whole purpose is the filter
 * `expires_on > current_date` — would otherwise be evaluated once at BUILD time
 * and frozen into the HTML.
 *
 * The consequence of leaving it static: the KEBS permit expires on 26 Feb 2027
 * and the page keeps displaying it until somebody happens to redeploy. That is
 * exactly the lapsed permit brief 3.5 forbids, reintroduced by the rendering
 * strategy after the database had already prevented it.
 *
 * An hour also means an admin edit in Sprint 11 appears without a deploy.
 * Sprint 12 should replace this with on-demand revalidation on write, at which
 * point this becomes the safety net rather than the mechanism.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Vehicle Tracking & Fleet Telematics in Kenya',
  description:
    'Anti-jamming vehicle tracking, fleet telematics and vehicle security, installed and supported across Kenya from branches in Nairobi, Mombasa and Nakuru.',
  path: ROUTES.home,
});

export default async function HomePage() {
  // Fetched in parallel. These are independent reads against three public
  // views, and awaiting them in sequence would add two round trips to the
  // server render for no reason — on a page whose LCP budget is 2.5s on a
  // throttled mobile connection.
  const [
    certifications,
    branches,
    coverage,
    solutions,
    featured,
    categories,
    industries,
    posts,
    logos,
  ] = await Promise.all([
    getCertifications(),
    getBranches(),
    getCoverageLocations(),
    getSolutions(),
    getProducts({ featuredOnly: true }),
    getProductCategories(),
    getIndustries(),
    getBlogPosts({ limit: 3 }),
    // Permission-confirmed only (public_client_logos); empty until V12.
    getClientLogos(),
  ]);

  return (
    <main id="main">
      <Hero />
      <ProofBand logos={logos.data} />
      <SetupChooser industries={industries.data} />
      <OneVehicle />
      <KebsResult certifications={certifications.data} />
      <SolutionsPreview solutions={solutions.data} />
      <ShopPreview featured={featured.data} categories={categories.data} />
      <IndustriesPreview industries={industries.data} />
      <HowWeWork />
      <Coverage branches={branches.data} coverage={coverage.data} />
      <ResourcesPreview posts={posts.data} />
      <ConversionClose />
    </main>
  );
}
