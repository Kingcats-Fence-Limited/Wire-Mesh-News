# Security notes

## In place (Phase 1)
- **Headers** (next.config.ts): Content-Security-Policy (same-origin; inline script/style allowed for Next.js and the boards; frame-ancestors none), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP; `X-Powered-By` removed.
- **Indexing** (src/lib/indexing.ts): every deployment is `noindex` (robots.txt, meta robots, X-Robots-Tag) until the production domain is wiremeshnews.com. /account is always noindex and `Cache-Control: private, no-store`.
- **HTML from content** is sanitized on the server (src/lib/sanitize.ts, sanitize-html): inline formatting and http(s)/mailto links only; external links get `rel="noopener noreferrer nofollow"`.
- **Search highlighting** escapes text before adding `<mark>`, and escapes query tokens before building RegExps.
- **Redirect after sign-in** accepts same-site paths only (src/lib/safe-redirect.ts): `//host`, `/\host` and absolute URLs fall back to /account/.
- **ICS feed** escapes commas, semicolons, backslashes and newlines (RFC 5545).
- **Vocabulary API** (/api/vocab/subdivisions/{CC}/) is prebuilt per country; unknown codes are 404, not new cached pages.
- **No secrets in the repo**; `.env*` is ignored. `DIRECTUS_TOKEN` must be a read-only role token, set in Vercel env only.
- **Dependencies**: `pnpm audit --prod` clean. One dev-only advisory (braces, via eslint-config-next) has no patched release and is not shipped to the site.

## Before Phase 2 (accounts, submissions, payments) goes live
- Auth: Auth.js (or similar) with Google and Microsoft OAuth, email + password with hashed passwords (argon2/bcrypt), email verification codes sent by a real mail service, session cookies `HttpOnly; Secure; SameSite=Lax`.
- Every form endpoint: server-side validation, CSRF protection, rate limiting (sign-in, sign-up, code entry, contact-a-company 5/day, comments), bot protection (Turnstile or hCaptcha), audit log.
- Uploads (images, PDFs, logos): size and MIME check on the server, re-encode images, strip EXIF, store outside the web root (Vercel Blob / S3) with private access until approved; virus scan PDFs.
- Payments: card data only on the processor's hosted page (Stripe Checkout / Customer Portal); verify webhooks by signature.
- Data protection: export and delete endpoints that match the Privacy Policy; retention jobs (unverified accounts after five days, logs after five months).
- Turn on Vercel deployment protection for preview URLs and keep production behind the custom domain.
