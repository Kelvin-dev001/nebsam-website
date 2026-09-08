import { BRANCHES, COVERAGE_TOWNS } from '@/lib/company';

/**
 * GEOGRAPHY. Not company data — that lives in lib/company.ts and stays there.
 *
 * This module exists so the coverage map can plot real positions rather than an
 * arrangement that looks about right. Brief 3.4 requires a branch and a service
 * town to be visually distinguishable and forbids implying an office where there
 * is none. A map with towns in invented positions fails that more quietly than a
 * wrong label does, because nobody checks a map.
 *
 * ── The outline ─────────────────────────────────────────────────────────────
 * Kenya's border, lifted verbatim from `public/africa-mappp.svg` — an asset
 * already in this repository since the CRA site, whose embedded RDF metadata
 * declares it public domain (`cc:license` → PublicDomain, permitting
 * reproduction, distribution and derivative works). The path is that file's
 * `id="ke"` element, unmodified. No new dependency and nothing traced by hand.
 *
 * It is a coarse outline — 55 nodes — and that is the right weight here. A
 * detailed coastline would cost kilobytes on a page whose job is to say which
 * towns are covered, for an audience paying for data by the megabyte.
 *
 * ── The projection, and why it is Mercator ──────────────────────────────────
 * DERIVED, not assumed. The path's bounding box is 60.435 × 80.484 units, a
 * height-to-width ratio of 1.332. Kenya spans 7.989° of longitude. Over that
 * extent an equirectangular projection gives a ratio of 1.215–1.274 depending on
 * where the northern edge is taken; Mercator gives 1.321. The source map is
 * therefore Mercator, and treating it as equirectangular would have pushed every
 * marker out of place — worst at the extremes, which is Lodwar and Mombasa.
 *
 * The northern bound is 5.506°N rather than the 5.03°N sometimes quoted, because
 * this outline draws the Ilemi Triangle inside Kenya. That is a property of the
 * source file, not a position on the boundary, and it is written down here so
 * the two are never confused.
 *
 * Marker positions were checked against the rendered outline rather than trusted
 * from the arithmetic: Kisumu on the Winam Gulf, Mombasa and Malindi on the
 * coast, Lodwar in the north-west, Garissa east of the Tana.
 */

/** The `id="ke"` path from public/africa-mappp.svg, verbatim. */
export const KENYA_OUTLINE_PATH = 'm 1530.7577,768.59905 c 1.5185,-1.1064 -2.2831,-5.71204 2.9841,-4.63075 0.011,-0.287 0.3004,-0.88103 -0.02,-1.4253 l 3.1286,-0.40576 c -2.0772,-3.1457 -2.9699,-0.6774 -3.9578,0.18585 -0.8442,0.73775 -2.9105,-2.52738 -2.8034,-4.51717 0.8008,-1.44363 0.2702,-2.10005 1.762,-3.45337 1.1071,-1.00439 1.9867,-4.31693 3.784,-5.126 0.8528,-0.38387 0.727,-0.515 0.68,-1.269 -0.072,-1.164 1.284,-1.724 1.581,-2.76 0.353,-1.231 0.4543,-2.437 0.5763,-3.672 0.109,-1.111 -1.0083,-1.89728 -1.2413,-3.143 -0.5228,-2.79483 -2.243,-3.402 -2.5,-4.633 -0.202,-0.977 -0.746,-1.806 -1.074,-2.736 -0.219,-0.409 -0.342,-0.844 -0.37,-1.307 0,-0.623 0.698,-0.977 0.51,-1.646 -0.167,-0.59 -0.813,-0.745 -1.311,-0.931 -1.13,-0.421 -0.303,-1.279 -1.499,-1.157 0.4889,-1.121 -0.906,-2.199 -0.7721,-2.982 0.1343,-0.78526 1.0911,-1.4 1.6251,-1.96 1.863,-1.955 4.146,-1.394 6.59,-1.394 1.402,0 2.807,-0.116 4.209,-0.131 0.687,-0.007 1.402,-0.041 2.084,0.067 0.59,0.093 0.771,1.127 1.479,1.401 2.181,0.847 4.615,-0.187 6.841,0.846 2.327,1.081 4.817,3.071 6.632,4.849 0.925,0.906 1.66,1.542 2.994,1.688 0.867,0.095 2.842,-0.443 3.523,-0.008 1.904,1.218 4.825,0.136 6.483,1.729 0.229,-1.133 1.788,-2.782 2.49,-3.758 1.248,-1.736 3.917,-2.431 5.761,-3.291 1.968,-0.917 2.313,1.242 3.783,2.101 1.009,0.59 2.102,0.205 3.151,0.015 0.85,-0.155 1.865,0.406 2.664,-0.035 -1.225,2.101 -2.353,4.397 -3.845,6.322 -1.576,2.032 -2.989,3.163 -2.984,5.893 0.011,6.449 0.068,12.897 0.062,19.347 -0.01,4.833 -0.968,9.416 2.277,13.365 1.1,1.339 2.757,3.068 1.576,4.823 -0.695,1.035 -2.766,2.925 -4.065,1.73 -0.104,0.26 -0.202,0.523 -0.29,0.79 -0.208,-0.25 -0.398,-0.514 -0.57,-0.79 0.34,0.786 1.21,2.235 0.43,3.029 -0.135,-1.958 -0.944,0.285 -1.141,0.736 -0.403,0.926 -1.179,1.104 -2.063,1.229 -1.962,0.276 -2.753,2.009 -2.128,3.662 0.286,0.757 -1.098,2.947 -1.668,3.41 -0.972,0.789 -1.788,6.098 -2.87,5.644 0.472,2.056 -1.584,3.517 -1.94,5.399 -0.837,-0.609 -0.741,0.456 -1.44,0.291 -0.882,-0.208 -2.0071,-1.74671 -2.688,-2.265 -3.0091,-2.29047 -6.7841,-4.78239 -8.6364,-7.25562 -0.4895,-0.65357 -1.3886,-0.75838 -0.3636,-1.89038 1.449,-1.6 -1.0866,-3.52808 -2.3914,-4.34413 l -25.0733,-15.68043';

/** The path's own coordinate space. The rendered viewBox adds margin; this does not. */
export const KENYA_BOUNDS = {
  minX: 1530.0892,
  maxX: 1590.5242,
  minY: 719.50555,
  maxY: 799.98955,
} as const;

/** The geographic extent those bounds correspond to. See the projection note. */
export const KENYA_EXTENT = {
  west: 33.9098,
  east: 41.8994,
  south: -4.6796,
  north: 5.506,
} as const;

export interface LatLng {
  lat: number;
  lng: number;
}

/** Web Mercator's y, in radians. Undefined at the poles; Kenya is nowhere near them. */
function mercatorY(latDegrees: number): number {
  return Math.log(Math.tan(Math.PI / 4 + (latDegrees * Math.PI) / 360));
}

const MERC_NORTH = mercatorY(KENYA_EXTENT.north);
const MERC_SOUTH = mercatorY(KENYA_EXTENT.south);

/** A coordinate, in the outline's own units. */
export function project({ lat, lng }: LatLng): { x: number; y: number } {
  const { minX, maxX, minY, maxY } = KENYA_BOUNDS;
  const { west, east } = KENYA_EXTENT;
  return {
    x: minX + ((lng - west) / (east - west)) * (maxX - minX),
    y: minY + ((MERC_NORTH - mercatorY(lat)) / (MERC_NORTH - MERC_SOUTH)) * (maxY - minY),
  };
}

/**
 * Town centres.
 *
 * These are the towns, not the offices. The Nairobi branch is on Kiambu Road and
 * the Mombasa branch at Makupa; plotting either to street precision would be
 * false precision on a map of the whole country, and the page says so in as many
 * words. The addresses themselves are in lib/company.ts and are what a visitor
 * navigates by.
 *
 * The type is the enforcement: this record is keyed by the union of every branch
 * town and every coverage town, so adding a town to lib/company.ts without a
 * coordinate here is a TYPE ERROR rather than a marker that silently never
 * renders.
 */
type BranchTown = (typeof BRANCHES)[number]['town'];
type CoverageTown = (typeof COVERAGE_TOWNS)[number];

export const TOWN_COORDINATES: Record<BranchTown | CoverageTown, LatLng> = {
  // Branch towns
  Nairobi: { lat: -1.2864, lng: 36.8172 },
  Mombasa: { lat: -4.0435, lng: 39.6682 },
  Nakuru: { lat: -0.3031, lng: 36.08 },
  // Coverage towns
  Kisii: { lat: -0.6817, lng: 34.7667 },
  Kisumu: { lat: -0.0917, lng: 34.768 },
  'Homa Bay': { lat: -0.5273, lng: 34.4571 },
  Eldoret: { lat: 0.5143, lng: 35.2698 },
  Malindi: { lat: -3.2175, lng: 40.1191 },
  Kilifi: { lat: -3.6305, lng: 39.8499 },
  Kericho: { lat: -0.3689, lng: 35.2861 },
  Thika: { lat: -1.0333, lng: 37.0693 },
  Isiolo: { lat: 0.3546, lng: 37.5822 },
  Meru: { lat: 0.05, lng: 37.65 },
  Marsabit: { lat: 2.3284, lng: 37.9899 },
  Lodwar: { lat: 3.1191, lng: 35.5973 },
  Busia: { lat: 0.4608, lng: 34.1115 },
  Garissa: { lat: -0.4569, lng: 39.6583 },
  Nanyuki: { lat: 0.0167, lng: 37.0733 },
  Embu: { lat: -0.531, lng: 37.4575 },
};

/** Undefined rather than a guess: a town with no coordinate is not plotted. */
export function coordinatesFor(town: string): LatLng | undefined {
  return (TOWN_COORDINATES as Record<string, LatLng | undefined>)[town];
}
