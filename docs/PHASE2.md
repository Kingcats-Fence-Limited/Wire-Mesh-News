# Phase 2 — accounts, Directus and going live

Everything for Phase 2 is in the code on the `phase2` branch. It stays switched off until the
environment variables below are set, so the same code runs the current preview site unchanged.
Payments run on Stripe (the Hong Kong company account) and are off until the Stripe variables
are set too.

## What Phase 2 turns on

| Area | What visitors get | Where the data lives |
| --- | --- | --- |
| Sign-in | Google, Microsoft (personal and work accounts) or a 6-digit email code. No passwords. The first sign-in creates the account; the same email via any method is the same account. Google One Tap on the sign-in page. | Postgres, schema `auth` (Better Auth) |
| Account centre | The /account/ panels work on real data: profile and photo, author profile, submissions with the full editor and uploads, comments, bookmarks, messages to companies, notifications, email preferences, signed-in devices, email change, data download, account deletion. | Directus collections (docs/PHASE2-DIRECTUS.md) |
| Company profiles | Claim a profile with a verified work email; editors approve in Directus. Claimed companies edit their profile (logo, photos, products, contacts) and send it for review; locked fields by request with evidence. | `company_claims`, `company_change_requests` |
| Public pages | Save buttons, Follow a standard, article comments (reviewed first), Contact a company, contact and advertising forms, newsletter (double opt-in) — all live. Header shows "My account" when signed in. Pages stay static and cached. | Directus |
| Paid plans | Pro, Team, Company (monthly or yearly, 14-day free trial with a card) and Directory Sponsor (yearly). Stripe Checkout and the Stripe customer portal; webhook keeps `subscriptions` in sync. | Stripe + Directus `subscriptions`, `team_seats` |
| Pro content | Pro analysis articles (opening free, 2 a month free for signed-in readers), tenders & project leads with alerts, trade-defence tracker with case alerts, trade statistics with CSV, templates library, ad-free site. | Directus `tenders`, `trade_cases`, `trade_case_updates`; Postgres `wmn_trade` |
| Companies | Company plan: profile analytics, matched tenders, catalogue/video/contacts on the profile. Directory Sponsor: ★ SPONSOR mark, highlighted card with website button, labelled rotating sponsor spots — never a higher place in the list. | Directus `company_extras`; Postgres `wmn_company_views` |
| Reports | One-off reports sold on /reports/ (Stripe Checkout, invoice, download in the account). | Directus `reports`, `purchases` |
| Editors | Review everything in Directus. A Directus Flow calls the site, which notifies the member in their account and by email. Fetchers add tenders and trade-defence notices as **drafts** every morning. | — |

## Switch

Accounts are **live** only when all four are set: `BETTER_AUTH_SECRET`, `DATABASE_URL`,
`DIRECTUS_URL`, `DIRECTUS_SERVER_TOKEN`. With any missing, the site stays in preview mode
(sample account, nothing sent). The switch is read at **build** time, so set the variables, then
redeploy.

Tip — test without going live: in Vercel, add the variables to the **Preview** environment
only. Deployments of the `phase2` branch are then live; production stays as it is.

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable | Required | What it is |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | yes | 32+ random characters: `openssl rand -base64 32`. Changing it signs everyone out. |
| `DATABASE_URL` | yes | Postgres connection string for sign-in data. Can be the same Postgres server as Directus (a separate schema is used), or Neon / Supabase. Use the **pooled** URL on serverless. |
| `AUTH_DB_SCHEMA` | no | Schema for the sign-in tables, default `auth`. |
| `BETTER_AUTH_URL` | yes for production | Public site address, e.g. `https://wiremeshnews.com` (no trailing slash). Preview deployments work it out themselves. |
| `DIRECTUS_URL` | yes | e.g. `https://cms.wiremeshnews.com` |
| `DIRECTUS_SERVER_TOKEN` | yes | Static token printed by `scripts/directus-setup.mjs` (role "Website server"). Never the admin token. |
| `RESEND_API_KEY` | yes | Email sending (sign-in codes, notices). resend.com → API Keys. |
| `MAIL_FROM` | no | Default `Wire Mesh News <no-reply@wiremeshnews.com>`. The domain must be verified in Resend. |
| `EDITORS_INBOX` | no | Where claims, enquiries, contact forms and new comments are emailed. Default `hello@wiremeshnews.com`. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | for Google | See below. |
| `GOOGLE_ONE_TAP` | no | `off` hides the One Tap card. |
| `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | for Microsoft | See below. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | recommended | Cloudflare Turnstile ("are you human") on the email-code and contact forms. |
| `DIRECTUS_HOOK_SECRET` | yes | Random string; the Directus Flow sends it so only Directus can call the review hook. |
| `CRON_SECRET` | yes | Random string; Vercel Cron sends it to the daily jobs (clean-up, fetchers, alerts). |
| `STRIPE_SECRET_KEY` | for payments | Stripe → Developers → API keys → Secret key (`sk_live_…`; `sk_test_…` on Preview). |
| `STRIPE_WEBHOOK_SECRET` | for payments | Stripe → Developers → Webhooks → your endpoint → Signing secret (`whsec_…`). |
| `STRIPE_PRICE_PRO_MONTHLY` / `_YEARLY` | for payments | Price ids (`price_…`) from the product catalogue — see "Payments" below. |
| `STRIPE_PRICE_TEAM_MONTHLY` / `_YEARLY` | for payments | Team base price (includes 5 people). |
| `STRIPE_PRICE_TEAM_SEAT_MONTHLY` / `_YEARLY` | for payments | Extra Team seat (per person). |
| `STRIPE_PRICE_COMPANY_MONTHLY` / `_YEARLY` | for payments | Company plan. |
| `STRIPE_PRICE_SPONSOR_YEARLY` | for payments | Directory Sponsor (yearly only). |
| `STRIPE_TAX` | recommended | `on` = Stripe Tax calculates VAT/sales tax at checkout (turn on Stripe Tax and add your registrations first). |
| `SELLER_NAME` | no | Legal seller shown on the pricing page; default `KINGCATS FENCE LIMITED`. |
| `SAM_API_KEY` | optional | Free key from sam.gov (Account → API key) for US federal tenders. |
| `CENSUS_API_KEY` | optional | Free key from api.census.gov/data/key_signup.html for US trade statistics. |
| `TRADE_RSS_FEEDS` | optional | Extra trade-defence feeds (RSS/Atom URLs, one per line), e.g. EU Official Journal search feeds or national authorities. |

Never set `MAIL_SINK_FILE` on Vercel (local testing only; it is ignored there anyway).

## Setup, in order

### 1. Directus collections (5 minutes)

On any computer with Node 20+ and this repository:

```
DIRECTUS_URL=https://cms.wiremeshnews.com DIRECTUS_ADMIN_TOKEN=<an admin's static token> node scripts/directus-setup.mjs --dry-run
DIRECTUS_URL=https://cms.wiremeshnews.com DIRECTUS_ADMIN_TOKEN=<an admin's static token> node scripts/directus-setup.mjs
```

It creates the 11 collections, two fields on `directus_files`, three folders, and the role
"Website server", and prints that user's token **once** → Vercel `DIRECTUS_SERVER_TOKEN`.
Running it again adds only what is missing. `--rotate-token` issues a new token.
The full field list is in docs/PHASE2-DIRECTUS.md if you prefer to add fields by hand.

### 2. Sign-in tables in Postgres

```
DATABASE_URL=postgres://… node scripts/auth-migrate.mjs --sql   # review
DATABASE_URL=postgres://… node scripts/auth-migrate.mjs         # create
```

Creates schema `auth` with `user`, `session`, `account`, `verification`, `rateLimit` and the
site's `wmn_rate_limit` and `wmn_email_code`. Same SQL: docs/auth-schema.sql.

### 3. Email (Resend)

resend.com → Domains → add `wiremeshnews.com` → add the DNS records it shows (SPF, DKIM, and
DMARC if not present) at your DNS host → wait for "Verified" → API Keys → create a "Sending"
key → `RESEND_API_KEY`.

### 4. Google sign-in

console.cloud.google.com → new project "Wire Mesh News" → APIs & Services:

1. OAuth consent screen: External; app name, support email, logo; authorised domain
   `wiremeshnews.com`; scopes `openid`, `email`, `profile` only. Publish the app.
2. Credentials → Create credentials → OAuth client ID → Web application.
   - Authorised JavaScript origins: `https://wiremeshnews.com` (and your preview domain for tests,
     e.g. `https://wire-mesh-news-git-phase2-….vercel.app`)
   - Authorised redirect URIs: `https://wiremeshnews.com/api/auth/callback/google` (plus the same
     path on the preview domain)
3. Copy Client ID / Client secret → `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
   One Tap uses the same client ID.

### 5. Microsoft sign-in

entra.microsoft.com → Applications → App registrations → New registration:

- Name "Wire Mesh News"; Supported account types: **Accounts in any organizational directory
  and personal Microsoft accounts**.
- Redirect URI (Web): `https://wiremeshnews.com/api/auth/callback/microsoft` (add the preview
  one too under Authentication).
- Certificates & secrets → New client secret (note the expiry date; renew before it).
- Client ID = "Application (client) ID" → `MICROSOFT_CLIENT_ID`; secret value → `MICROSOFT_CLIENT_SECRET`.
- API permissions: Microsoft Graph `openid`, `email`, `profile`, `User.Read` (delegated) — default.

### 6. Turnstile (recommended)

dash.cloudflare.com → Turnstile → Add widget → domain `wiremeshnews.com` (and the preview
domain) → mode "Managed" → site key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, secret →
`TURNSTILE_SECRET_KEY`. The widget is invisible for most people.

### 7. Directus Flow for review results

Directus → Settings → Flows → Create flow "Notify website":

- Trigger: **Event Hook**, type **Action (non-blocking)**, scope `items.update`, collections
  `submissions`, `comments`, `company_claims`, `company_change_requests`.
- Operation: **Webhook / Request URL**, method POST, URL
  `https://wiremeshnews.com/api/hooks/directus/`
  - Headers: `x-wmn-hook: <DIRECTUS_HOOK_SECRET>`, `Content-Type: application/json`
  - Body: `{ "collection": "{{$trigger.collection}}", "keys": {{$trigger.keys}} }`

The site re-reads the items itself and acts only on decisions (published / changes requested /
rejected / approved). Approving a company claim links the company to the member and adds the
"company" role automatically. Publishing a submission adds the "author" role.

Editor workflow in Directus:

| To | Do |
| --- | --- |
| Return a submission | `status` = `changes_requested`, write `editor_note` |
| Publish | create the article as usual, then on the submission set `status` = `published` and `published_href` |
| Approve / reject a comment | `status` = `approved` / `rejected` (+ `reason`) |
| Approve a claim | `status` = `approved` |
| Approve a company edit | apply the values to the company, then `status` = `approved` |

Add to the same Flow (or a second one) the collections `tenders`, `trade_case_updates` and
`company_extras`: publishing a tender or notice stamps its publish time (alerts use it), and
approving company extras notifies the company.

More editor work in Directus:

| To | Do |
| --- | --- |
| Publish a tender | open a **draft** found by the fetcher, check it against the original notice, fix the title, write a one-paragraph `summary`, tick `products`, add `quantity` / `value` if stated, set `status` = `published` (or `rejected`) |
| Track a trade-defence case | create a `trade_cases` row (country, origins, product, HS codes, stage, `rates` as a list of company/country/rate), `status` = `published` |
| Publish a case notice | open a **draft** `trade_case_updates` row from the fetcher, link it to its `case`, add a short summary, `status` = `published` — followers get an email the next morning |
| Mark a Pro article | in the content file set `premium: true` (all `analysis` articles are Pro by default; `premium: false` frees one) |
| Sell a report | create a `reports` row: slug, title, summary, contents, `price_usd`, upload `file` (PDF, kept private), `cover` and optional `sample`; `status` = `published`. Optional: a Stripe price id in `stripe_price` |
| Approve company extras | `company_extras` → check catalogue, video, contacts → `status` = `approved` / `rejected` (+ `editor_note`) |

### 8. Cron

`vercel.json` schedules three daily jobs (Vercel Pro), all protected by `CRON_SECRET`:

| Path | When (UTC) | What |
| --- | --- | --- |
| `/api/cron/purge/` | 03:17 | Removes accounts 30 days after deletion was requested (published work keeps its by-line), expired codes and sessions, unconfirmed newsletter sign-ups after 7 days |
| `/api/cron/fetch/` | 05:07 | New tenders (EU TED, World Bank, US SAM.gov) and trade-defence notices (US Federal Register, `TRADE_RSS_FEEDS`) → **drafts** in Directus; on Mondays also trade statistics (Eurostat, US Census) → Postgres `wmn_trade` |
| `/api/cron/alerts/` | 06:37 | Emails Pro readers new published tenders matching their alerts and new notices on cases they follow |

Run one by hand (e.g. to backfill 30 days of tenders):
`curl -H "Authorization: Bearer $CRON_SECRET" "https://wiremeshnews.com/api/cron/fetch/?only=tenders&days=30"` —
`only` = `tenders`, `defence` or `stats`. Each run is logged in the Postgres table `wmn_fetch_log`
(source, time, found, added, error).

### 8b. Payments (Stripe, Hong Kong account)

1. Stripe dashboard → **Product catalogue** → create these products and recurring prices in USD:

   | Product | Prices |
   | --- | --- |
   | Wire Mesh News Pro | US$29 / month · US$290 / year |
   | Wire Mesh News Team (5 people) | US$99 / month · US$990 / year |
   | Team extra seat | US$15 / month · US$150 / year (per unit) |
   | Wire Mesh News Company | US$49 / month · US$490 / year |
   | Directory Sponsor | US$1,990 / year |

   Copy each price id (`price_…`) into the matching `STRIPE_PRICE_…` variable. Reports need no
   product (the price is taken from Directus) unless you want one.
2. **Settings → Billing → Customer portal**: allow updating payment methods, viewing invoices,
   cancelling at period end, switching between the Pro/Team/Company prices; add the Terms and
   Privacy links.
3. **Developers → Webhooks → Add endpoint** `https://wiremeshnews.com/api/hooks/stripe/` with
   events `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `customer.subscription.trial_will_end`,
   `checkout.session.completed`, `invoice.payment_failed`. Copy the signing secret to
   `STRIPE_WEBHOOK_SECRET`. Use a separate test-mode endpoint and `sk_test_` keys on Preview.
4. **Tax**: turn on Stripe Tax, add the registrations you have, then set `STRIPE_TAX=on`. Without
   it, checkout still collects the customer's address and tax id for the invoice.
5. **Payment methods**: Settings → Payment methods — cards, Apple Pay and Google Pay are on by
   default; WeChat Pay and Alipay can be added on a Hong Kong account.
6. Test on Preview with test cards (4242 4242 4242 4242): start a trial, open the portal, cancel,
   buy a report.

Trial rules: 14 days, card required, one trial per account (`members.trial_used`), no trial on
Directory Sponsor. Stripe emails receipts; the site sends trial, end and failed-payment notices.

### 9. Test on the preview, then go live

1. Set the variables for **Preview** only; push `phase2`; open its preview URL.
2. Sign in by email code, Google and Microsoft; edit profile; upload a photo; write and submit a
   draft; approve it in Directus and check the notice and email; claim a company; post a comment
   and approve it; save an article; follow a standard; send a contact form; subscribe to the
   newsletter and click the confirmation link.
3. When it is right: add the same variables for **Production** (with `BETTER_AUTH_URL` =
   production address), merge `phase2` into `main`, deploy.

## Security notes

- Sessions: httpOnly, Secure, SameSite=Lax cookies (`__Secure-wmn.*`), 30 days, refreshed daily.
  Every account API checks the session table (no cookie-cache shortcut), so signing out a device
  or deleting an account takes effect at once.
- All writes require same-origin requests. Rate limits are in Postgres (work across instances).
- Uploads: type decided from the file's bytes; images re-encoded to WebP (strips EXIF and anything
  hidden), SVG logos rasterised to PNG, 4 MB per request (Vercel's limit; photos are scaled down
  in the browser first). Private until approved; served through `/api/files/<id>/` with
  `nosniff` and a sandbox CSP — Directus is never exposed.
- The Directus token is a narrow role (the website's collections + files), not an admin.
- Payments: card data only on Stripe's pages; webhooks verified by signature; plan and access are
  read from the mirrored subscription on every request, never from the browser.
- No passwords are stored. Email codes are hashed, 5 minutes, 5 tries.

## Known limits (by design, for now)

- **Companies and articles still come from the site's content files.** A claim approved in
  Directus links the account at once, but the public "Claimed" badge and "Contact this company"
  follow the content files until companies move to Directus. Until then enquiries go to
  `EDITORS_INBOX`, which forwards them.
- Public contact / advertising / RFQ forms do not upload attachments; the success message says
  the file will be requested by reply.
- **Tax registrations are yours to make.** Stripe is not a merchant of record: it calculates and
  collects tax (Stripe Tax) but the company files the returns where it is registered.
- **Market prices stay non-downloadable** under the data-licence terms on the Methodology page;
  the CSV download is only for the official trade statistics (Eurostat, US Census), which may be
  reused with attribution.
- Tender and trade-defence sources other than TED, World Bank, SAM.gov and the Federal Register
  are added as RSS feeds (`TRADE_RSS_FEEDS`) or entered by editors.
- Paying readers see no display advertising (banners, in-article ads). Labelled Directory Sponsor
  spots are not display ads and are shown to everyone, paying readers included.

## Local end-to-end test

Postgres 16 + Directus running locally, then:

```
export BETTER_AUTH_SECRET=… DATABASE_URL=postgres://…/directus DIRECTUS_URL=http://127.0.0.1:8055 \
       DIRECTUS_SERVER_TOKEN=… MAIL_SINK_FILE=/tmp/mail.jsonl BETTER_AUTH_URL=http://localhost:3100
pnpm build && pnpm start -p 3100
```

Sign-in codes are written to `MAIL_SINK_FILE` instead of being emailed. Stripe webhooks can be
tested locally with `stripe listen --forward-to localhost:3100/api/hooks/stripe/`.
