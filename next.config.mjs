/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // The 301 map (docs/ROUTE_MAP.md §2) lands in Sprint 2, not here.
  // Sprint 1 is the design system and one homepage screen only.
};

export default nextConfig;
