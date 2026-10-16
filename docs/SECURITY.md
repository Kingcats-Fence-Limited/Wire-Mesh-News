# Security notes

## In place (Phase 1)
- **Headers** (next.config.ts): Content-Security-Policy (same-origin; inline script/style allowed for Next.js and the boards; frame-ancestors none), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP; `X-Powered-By` removed.
- **Indexing** (src/lib/indexing.ts): every deployment is `noindex` (robots.txt, meta robots, X-Robots-Tag) until the production domain is wiremeshnews.com. /account is always noindex and `Cache-Control: private, no-store`.
- **HTML from content** is sanitized on the server (src/lib/sanitize.ts, sanitize-html): inline formatting and http(s)/mailto links only; external links get `rel="noopener noreferrer nofollow"`.
- **Search highlighting** escapes text before adding `<mark>`, and escapes query tokens before building RegExps.
- **Redirect after sign-in** accepts same-site paths only (src/lib/safe-redirect.ts), checked again after URL normalisation so dot segments (`/.//evil.com`) cannot collapse into `//evil.com`. Regression check: `node --experimental-strip-types scripts/check-safe-redirect.mjs`.
- **Query strings** go through src/lib/params.ts (first value only, 200 characters max), so repeated parameters cannot crash a page.
- **CMS content** (scripts/pull-content.mjs) is validated at the pull: slugs `[a-z0-9-]`, links http(s) only, `DIRECTUS_URL` must be https. RSS links and ICS lines are escaped.
- **CSP**: the Vercel toolbar hosts (vercel.live, pusher) are allowed on preview deployments only; production has `frame-src 'none'`.
- **ICS feed** escapes commas, semicolons, backslashes and newlines (RFC 5545).
- **Vocabulary API** (/api/vocab/subdivisions/{CC}/) is prebuilt per country; unknown codes are 404, not new cached pages.
- **No secrets in the repo**; `.env*` is ignored. `DIRECTUS_TOKEN` must be a read-only role token, set in Vercel env only.
- **Account preview data** (localStorage) is shape-checked on load and falls back to the sample if it does not match; a failed write (storage full) is reported, not hidden. CSV exports neutralise cells that start with = + - @.
- **Dependencies**: sanitize-html 2.18.1 (fixes GHSA-jxwj-j7wr-gfrw); `pnpm audit --prod` clean. One dev-only advisory (braces, via eslint-config-next) has no patched release and is not shipped to the site.

## Phase 2 (built on branch `phase2`, off until configured — see docs/PHASE2.md)
- Auth: Better Auth, passwordless — Google, Microsoft and 6-digit email codes (hashed, 5 minutes, 5 tries); no passwords stored. Session cookies `HttpOnly; Secure; SameSite=Lax`, 30 days; every account API re-checks the session table, so revoking a device or deleting an account is immediate. Email change needs a recent sign-in plus a code to the new address.
- Endpoints: same-origin check on every write, server-side validation, rate limits in Postgres (codes 3/min, sign-in 10/5 min, enquiries 5/day, comments 10/day, uploads 60/hour, contact 5/hour per IP, newsletter 10/hour per IP), Turnstile on email-code and contact forms, honeypots on public forms.
- Roles and statuses are set only by the server and editors (Directus); the browser's copy is never trusted. Directus is reached with a narrow "Website server" token, never an admin token.
- Uploads: type sniffed from bytes; images re-encoded to WebP (EXIF stripped), SVG rasterised, 4 MB per request; private until approved; served through /api/files/<id>/ with nosniff and a sandbox CSP.
- Data protection: download-my-data in the account; deletion closes the account and a daily cron removes private data after 30 days.
- Still to do before payments: card data only on the processor's hosted page; verify billing webhooks by signature.
- Turn on Vercel deployment protection for preview URLs and keep production behind the custom domain.

### Preview-mode shortcuts (only when accounts are not configured)
Without the Phase 2 variables the /account preview still runs entirely in the browser (codes shown on screen, any address accepted, sample data in localStorage). With the variables set, none of these paths are used.

## SEO (in place)
- Every public page sets a canonical URL (query strings never canonical), Open Graph and X card tags through src/lib/seo.ts; share images are rendered at build time (/og/ and /og/<article>/).
- JSON-LD: NewsMediaOrganization + WebSite (home), NewsArticle/AnalysisNewsArticle/Article + BreadcrumbList (articles), Organization + BreadcrumbList (companies), ProfilePage/Person (authors), Event (upcoming events).
- robots.txt blocks only /api/ and /search/ on the live domain; private pages (account, sign-in, register, submit, company contact forms) are crawlable but carry noindex, so search engines can see the noindex. Empty sub-sections are noindex and left out of the sitemap.

## Performance (in place)
- The search index is no longer bundled into every page: it loads from /search-index.json the first time search opens. Shared JavaScript per page dropped from about 219 KB to about 120 KB.
- Vocabulary imports are per file, so the 450 KB subdivision list never reaches the browser.
- Demo photos are WebP in two sizes (640 px thumbnails, 1400 px heroes), about 75% smaller than the JPEGs; header and hero photos are preloaded.
- Fonts are self-hosted through next/font with metric-matched fallbacks (no layout shift when they load); CSS is inlined; title/description/canonical always render in <head>.

## Still to decide or do
- CSP still allows inline scripts (Next.js bootstrap). Removing it needs nonces from middleware, which makes every page dynamic; revisit when real accounts arrive.
- Done: every page is now static and CDN-cached. Directory, events, standards, letters, market data, search, contact, sign-in/register and author pages render their default view on the server and apply the query string (filters, sort, paging, ?next=, ?claim=) in the browser. Unknown slugs return the prerendered 404.
- HSTS `preload` commits every subdomain of wiremeshnews.com to HTTPS; confirm before submitting to the preload list.
- COOP `same-origin` blocks popup-based OAuth; switch to `same-origin-allow-popups` when Google/Microsoft sign-in is wired.
- `pnpm audit`: one dev-only advisory (braces via eslint-config-next), no patched release yet.
