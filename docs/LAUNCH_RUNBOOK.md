# Launch runbook — nebsamdigital.com

How production works, how to deploy and roll back, and what to check after every deploy. Written in
Sprint 15 (6 October 2026). Keep it true: a runbook that describes last month's setup is worse than
none.

## 1. How production works now

- **Live since 5 October 2026.** The Next.js site replaced the Create React App site that day, when
  a build of `develop` (`ff7ee63`, Sprint 12o) was promoted to production in Vercel.
- **6 October 2026 (Sprint 15):** `main` was fast-forwarded to `develop` (`b5ade7a`), so `main` and
  production carry the same code again. Vercel builds production from `main`.
- **Deploy = merge to `main`.** Never promote a preview deployment: previews are built with no
  environment variables, so a promoted preview would serve a site with no content.
- **Hosting:** Vercel project `nebsam-website`, domains `nebsamdigital.com` and
  `www.nebsamdigital.com`. Node 22. `vercel.json` sets the framework to Next.js; the project's own
  preset still says Create React App and is overridden.
- **Database:** one Supabase project, shared by local development and production. Migrations go
  through `npm run db:apply`, one at a time by name.

## 2. Deploying

1. Every change reaches `develop` through a sprint branch, verified (CLAUDE.md §13).
2. On `develop`: `npm run typecheck && npm run lint && npm run format:check`, and a production build
   (`npm run build`) with `.next/cache/fetch-cache` moved aside first (V54b).
3. `git push origin develop:main` (a fast-forward; `main` has no commits of its own and is never
   ahead of `develop`).
4. Watch the production deployment in Vercel until it is **READY**.
5. Run the checks in §4 against the live domain.

**If content changed in the database but not on the site after a deploy:** redeploy in Vercel with
"Use existing build cache" unticked. That is V54b: a build can reuse a stale data-cache entry.

## 3. Rolling back

- **Instant:** Vercel → Deployments → a previous production deployment marked as a rollback
  candidate → **Instant Rollback**. It takes seconds and needs no build.
- **The old Create React App site is not a rollback candidate.** Its last deployment (`dcd15b5`,
  February 2026) can no longer be restored instantly. Bringing it back means deploying that commit
  again, and every new URL on the site would 404.
- After a rollback, fix forward on `develop` and deploy as in §2.

## 4. After every deploy (against `https://nebsamdigital.com`)

```bash
node scripts/check-redirects.mjs https://nebsamdigital.com   # every old URL, one hop, live
node scripts/check-sitemap.mjs   https://nebsamdigital.com   # every sitemap URL returns 200
node scripts/crawl-audit.mjs     https://nebsamdigital.com   # the Sprint 13 gate, live
```

Then by hand, or with the Playwright scripts kept for this:
- The response carries `Content-Security-Policy`, not `-Report-Only`.
- One honeypot submission per form reaches the success view. It writes nothing: the action answers a
  filled honeypot before the rate limiter or any insert.
- A staff member signs in to `/admin` and opens the inbox.

**Run browser checks in real Chrome** (Playwright `channel: 'chrome'`), not Playwright's headless
shell. Since Sprint 16's page transitions, the headless shell stalls on the second form navigation
with JavaScript off: it cannot draw a view transition, and the next navigation never completes.
Real Chrome, and the headless shell under reduced motion, both pass (measured 6 Oct 2026).

## 5. Monitoring

- **Errors:** Vercel → the deployment → Runtime Logs. Server errors are logged without personal
  data (CLAUDE.md §10).
- **New enquiries and orders:** the admin inbox and orders pages. Until the email key is set
  (V103), **someone must open `/admin/inbox` and `/admin/orders` every working day**. Nothing else
  tells staff that something arrived.
- **Uptime:** not monitored yet. A free external check of `https://nebsamdigital.com` every few
  minutes is enough (V104).
- **Backups:** the Supabase plan decides them; see V104.

## 6. Still open at launch

Each is in `docs/NEEDS_VERIFICATION.md` with its owner.

| What | Why it matters | Owner |
|---|---|---|
| Legal text for the privacy notice and terms (V66–V70) | 6 `[[NEEDS_VERIFICATION]]` tokens are visible to the public; brief PART 2.2 forbids that | Kelvin, legal adviser |
| `SUBMISSION_IP_HMAC_SECRET` in Vercel Production | Unset, the enquiry forms have **no rate limiting** (they fail open) | Kelvin |
| Remove `SUPABASE_ACCESS_TOKEN` and `CERT_VERIFY_RATE_LIMIT_*` from Vercel | A personal account token has no business on a server; the other two are dead | Kelvin |
| Search Console: properties, the sitemap, the indexed-URL check (V10, V25) | Any old URL missing from the 301 map is lost for good | Kelvin |
| The email key and a verified sending domain (V103) | Until then, enquiries and orders only appear in the admin | Kelvin |
| Backups and uptime (V104) | Nobody has confirmed what happens if the database is lost or the site goes down | Kelvin |
| NVDA and iPhone VoiceOver (V101) | The last Sprint 14 criterion | A person with both |
| A new Supabase access token in `.env.local` (V98) | Needed to apply 0050 (a ledger record) | Kelvin |
| GA4 measurement ID (optional) | No analytics until it is set; the cookie bar appears when it is | Kelvin |

## 7. Deploy log

| When | Commit | What was verified live |
|---|---|---|
| 5 Oct 2026 | `ff7ee63` (develop, Sprint 12o) | Promoted to production in Vercel, outside this runbook. Found in Sprint 15: report-only CSP, the header linking `/platform` (404), `/team` and `/clients` redirecting to 404s, old product photos and a client logo downloadable, `llms.txt` naming five 404s |
| 6 Oct 2026 | `b5ade7a` (main = develop, Sprints 12p to 15) | **Enforced CSP** on the live response. `/platform` no longer linked. `/team` and `/clients` → `/about`. Legacy files return 404. `check-redirects`: 13 redirects and 4 direct routes. `check-sitemap`: clean. `audit:crawl`: 67 URLs, all 200; the only problems are the 6 legal tokens. All four forms, with JavaScript on and off, by refusal and honeypot (no rows written, confirmed by `verify:db`). No runtime errors or error-level logs. Lighthouse through the edge: Home 2,092 ms, `/contact` 2,036, `/products` 2,166, Performance 98, A11y/BP/SEO 100 |
| 6 Oct 2026 | `8276696` (main = develop, Sprint 16) | Live within about 2 minutes of the push. **The five items, live** (20 of 20): the page transition runs in real Chrome and does not under reduced motion; the chooser's 4 cards, 10 internal links all 200, thumbnails loaded; no logo row; the buy bar opens, closes, and "Add to cart" becomes "View cart" on both product types; every "On this page" target exists on 5 pages; 0 console errors, 0 CSP violations. Enforced CSP. `check-redirects`: 13 and 4. `check-sitemap`: 66, clean. `audit:crawl`: 67 URLs, all 200; still only the 6 legal tokens. All four forms with JavaScript on and off, by refusal and honeypot, in real Chrome; `verify:db` clean, no enquiry or order rows. No runtime errors. Lighthouse through the edge: products 1,963 and 1,983 ms, privacy notice 2,125, Performance 99; Home 1,494–2,188 ms over four runs, Performance 99 and 100 in the two clean runs. The other two (83, TBT 587 and 627) were slower in every category at once, the machine-load pattern of PERFORMANCE_BASELINE §14; one of them had a 0.050 font-swap shift |

Docs-only commits wait on `develop` for the next real deploy: pushing them to `main` would rebuild
the live site for nothing.
