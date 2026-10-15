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

## Before Phase 2 (accounts, submissions, payments) goes live
- Auth: Auth.js (or similar) with Google and Microsoft OAuth, email + password with hashed passwords (argon2/bcrypt), email verification codes sent by a real mail service, session cookies `HttpOnly; Secure; SameSite=Lax`.
- Every form endpoint: server-side validation, CSRF protection, rate limiting (sign-in, sign-up, code entry, contact-a-company 5/day, comments), bot protection (Turnstile or hCaptcha), audit log.
- Uploads (images, PDFs, logos): size and MIME check on the server, re-encode images, strip EXIF, store outside the web root (Vercel Blob / S3) with private access until approved; virus scan PDFs.
- Payments: card data only on the processor's hosted page (Stripe Checkout / Customer Portal); verify webhooks by signature.
- Data protection: export and delete endpoints that match the Privacy Policy; retention jobs (unverified accounts after five days, logs after five months).
- Turn on Vercel deployment protection for preview URLs and keep production behind the custom domain.

### Demo-only shortcuts that must not survive into Phase 2
The /account preview runs entirely in the browser. When real accounts are wired, each of these moves to the server:
- Verification codes are generated and shown in the browser (src/components/ui/CodeVerify.tsx) → issue, store (hashed, 10-minute expiry, 5 attempts) and check on the server; send by email.
- Sign-in accepts any address and password, and the "provider" email is typed by hand (AuthForms.tsx, SocialSignIn.tsx) → real OAuth and password checks.
- Changing the password does not check the current one; changing the email needs no re-authentication → require the current password (or a fresh sign-in), and email the old address about any change.
- Roles (READER / AUTHOR / COMPANY, PRO) are hard-coded in the UI → read them from the session; never trust a role sent by the browser.
- /account has no guard → middleware that redirects to /signin/?next=/account/ without a session.
- Submission status, comment status and company change requests are set by the browser → only editors change status, through the CMS.

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
- /directory, /events, /standards, /letters, /market-data and /search render on the server per request (they read the query string). Add a Vercel WAF rate limit, or move filtering to the browser so these pages can be cached.
- HSTS `preload` commits every subdomain of wiremeshnews.com to HTTPS; confirm before submitting to the preload list.
- COOP `same-origin` blocks popup-based OAuth; switch to `same-origin-allow-popups` when Google/Microsoft sign-in is wired.
- `pnpm audit`: one dev-only advisory (braces via eslint-config-next), no patched release yet.
