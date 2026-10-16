# Phase 2 — accounts, Directus and going live

Everything for Phase 2 is in the code on the `phase2` branch. It stays switched off until the
environment variables below are set, so the same code runs the current preview site unchanged.
Nothing here charges money: payments are not connected yet (see the end).

## What Phase 2 turns on

| Area | What visitors get | Where the data lives |
| --- | --- | --- |
| Sign-in | Google, Microsoft (personal and work accounts) or a 6-digit email code. No passwords. The first sign-in creates the account; the same email via any method is the same account. Google One Tap on the sign-in page. | Postgres, schema `auth` (Better Auth) |
| Account centre | The /account/ panels work on real data: profile and photo, author profile, submissions with the full editor and uploads, comments, bookmarks, messages to companies, notifications, email preferences, signed-in devices, email change, data download, account deletion. | Directus collections (docs/PHASE2-DIRECTUS.md) |
| Company profiles | Claim a profile with a verified work email; editors approve in Directus. Claimed companies edit their profile (logo, photos, products, contacts) and send it for review; locked fields by request with evidence. | `company_claims`, `company_change_requests` |
| Public pages | Save buttons, Follow a standard, article comments (reviewed first), Contact a company, contact and advertising forms, newsletter (double opt-in) — all live. Header shows "My account" when signed in. Pages stay static and cached. | Directus |
| Editors | Review everything in Directus. A Directus Flow calls the site, which notifies the member in their account and by email. | — |

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
| `CRON_SECRET` | yes | Random string; Vercel Cron sends it to the daily clean-up. |

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

### 8. Cron

`vercel.json` already schedules `/api/cron/purge/` daily at 03:17 UTC (Vercel Pro). It removes
accounts 30 days after deletion was requested (published work keeps its by-line), expired codes
and sessions, and unconfirmed newsletter sign-ups after 7 days. Needs `CRON_SECRET`.

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
- The Directus token is a narrow role (11 collections + files), not an admin.
- No passwords are stored. Email codes are hashed, 5 minutes, 5 tries.

## Known limits (by design, for now)

- **Companies and articles still come from the site's content files.** A claim approved in
  Directus links the account at once, but the public "Claimed" badge and "Contact this company"
  follow the content files until companies move to Directus. Until then enquiries go to
  `EDITORS_INBOX`, which forwards them.
- Public contact / advertising / RFQ forms do not upload attachments; the success message says
  the file will be requested by reply.
- **Payments are not connected.** The billing panel shows "Free · Pro opens soon". When the
  provider is chosen (Paddle as merchant of record handles VAT/sales tax worldwide; Stripe is
  cheaper but you handle tax with Stripe Tax), the plan is: hosted checkout page → webhook to
  `/api/hooks/billing/` → `members.roles` gets `pro` and a `subscriptions` collection keeps the
  status; the customer portal of the provider handles cards, invoices and cancellation. Card
  numbers never touch this site.

## Local end-to-end test

Postgres 16 + Directus running locally, then:

```
export BETTER_AUTH_SECRET=… DATABASE_URL=postgres://…/directus DIRECTUS_URL=http://127.0.0.1:8055 \
       DIRECTUS_SERVER_TOKEN=… MAIL_SINK_FILE=/tmp/mail.jsonl BETTER_AUTH_URL=http://localhost:3100
pnpm build && pnpm start -p 3100
```

Sign-in codes are written to `MAIL_SINK_FILE` instead of being emailed.
