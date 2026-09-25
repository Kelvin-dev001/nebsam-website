import type { Config } from 'tailwindcss';
import base, { CONTENT_ALL } from './tailwind.config';

/**
 * Tailwind for DEVELOPMENT-ONLY routes (/dev/*), used through `@config` in
 * each dev route's own stylesheet. Next loads a stylesheet imported by a page
 * only on that route, so none of this reaches a public page.
 *
 * It scans the WHOLE codebase, not just the dev files, on purpose. This sheet
 * loads after the global one, so a partial sheet would re-emit a base utility
 * (say `px-5`) after the global `md:px-8` and silently override it on the dev
 * page. A superset, generated in Tailwind's own deterministic order, keeps the
 * cascade on that page exactly as if there were one stylesheet.
 *
 * Preflight stays off: the global sheet has already applied it once.
 */
const config: Config = {
  ...base,
  content: CONTENT_ALL,
  corePlugins: { preflight: false },
};

export default config;
