# Phase 2 — Directus collections

Generated from `scripts/directus-schema.mjs` by `node scripts/directus-doc.mjs`. Do not edit by hand.

The easiest way to create all of this is `DIRECTUS_URL=… DIRECTUS_ADMIN_TOKEN=… node scripts/directus-setup.mjs` (see PHASE2.md). The tables below are for review, or for adding fields by hand.

## `members`

Website users. Created on first sign-in; sign-in itself is handled by the website (Better Auth).

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `auth_user_id` | string(255) | required, unique | Better Auth user id (set by the website, do not edit) |
| `email` | string(320) |  | Sign-in email (copied from the sign-in system) |
| `name` | string(80) |  | Display name; used as the by-line on new submissions |
| `job_title` | string(80) |  |  |
| `company_name` | string(120) |  | As the user typed it (free text) |
| `country` | string(2) |  | ISO alpha-2 code |
| `city` | string(80) |  |  |
| `avatar` | uuid → directus_files |  | Profile photo |
| `author_bio` | text |  | Author page bio (max 400 characters) |
| `author_public_email` | string(320) |  | Optional, shown on the author page |
| `author_linkedin` | string(255) |  |  |
| `author_x` | string(255) |  |  |
| `author_website` | string(255) |  |  |
| `author_expertise` | json |  | Up to 5 short tags |
| `author_visible` | boolean | required, default true | Public author page |
| `prefs` | json |  | Email preferences: {brief, reviewResults, commentReplies, standardAlerts, companyEnquiries, productNews} |
| `roles` | json |  | Set by editors: ["reader","author","company"] |
| `company_slug` | string(120) |  | Claimed company (directory slug), set by the directory editor when a claim is approved |
| `terms_accepted_at` | timestamp |  | When the user accepted the Terms and Privacy Policy |
| `deletion_requested_at` | timestamp |  | Account deletion requested; data is removed 30 days later unless the user signs in and cancels |
| `stripe_customer_id` | string(64) |  | Stripe customer (set by the website) |
| `trial_used` | boolean | required, default false | Has had a free trial (one per account) |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `submissions`

Articles, edits to published articles, and letters sent by users. Editors review here.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Author |
| `kind` | string(40) | required, default "article" | article or letter · values: article / letter |
| `status` | string(40) | required, default "draft" | Only editors move a submission to changes_requested, rejected or published · values: draft / pending / changes_requested / rejected / published / withdrawn |
| `title` | string(200) |  |  |
| `excerpt` | text |  | Standfirst or letter text |
| `words` | integer | default 0 | Word count of the body |
| `section` | string(40) |  | Section code (vocabulary: section) |
| `draft` | json |  | The full editor draft (title, body, section, sub-section, type, facets, files, sources, declarations) |
| `pending_draft` | json |  | Published pieces only: the proposed new version |
| `edit_pending` | boolean | required, default false | Published pieces only: an edit is waiting for review |
| `editor_note` | text |  | Shown to the author (changes requested / reason for not accepting) |
| `submitted_at` | timestamp |  | Set by the website when sent for review |
| `reviewed_at` | timestamp |  | Set when an editor decides |
| `published_href` | string(255) |  | Live article path once published, e.g. /news/slug/ |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `comments`

Reader comments. Shown under the article once approved.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Writer |
| `article_slug` | string(160) | required |  |
| `article_title` | string(255) |  |  |
| `article_href` | string(255) |  |  |
| `text` | text |  | Max 1,500 characters |
| `status` | string(40) | required, default "pending" | values: pending / approved / rejected / removed |
| `reason` | text |  | Shown to the writer when not approved |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `bookmarks`

Saved articles, companies, standards and events.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | The site user this belongs to |
| `kind` | string(40) | required, default "article" | values: article / company / standard / event |
| `href` | string(255) | required | Site path |
| `title` | string(255) |  |  |
| `meta` | string(120) |  |  |
| `date_created` | timestamp |  |  |

## `standard_follows`

Users following a standard; they are emailed when its status changes.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | The site user this belongs to |
| `standard_slug` | string(120) | required |  |
| `date_created` | timestamp |  |  |

## `enquiries`

Messages sent through "Contact this company". The website forwards each one by email.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Sender |
| `company_slug` | string(120) | required |  |
| `company_name` | string(160) |  |  |
| `subject` | string(200) |  |  |
| `body` | text |  | Max 3,000 characters |
| `product` | string(160) |  |  |
| `quantity` | string(80) |  |  |
| `status` | string(40) | required, default "sent" | values: sent / awaiting_reply / replied / no_reply |
| `replied_at` | timestamp |  |  |
| `date_created` | timestamp |  |  |

## `notifications`

In-account notices. Created by the website and by Directus flows (review results).

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | The site user this belongs to |
| `kind` | string(40) | required, default "submission" | values: submission / comment / company / billing / standard |
| `text` | text |  |  |
| `href` | string(255) |  | Optional site path |
| `read` | boolean | required, default false |  |
| `archived` | boolean | required, default false |  |
| `date_created` | timestamp |  |  |

## `company_claims`

Requests to manage a directory profile. Approving one: set the member's company_slug and add "company" to roles.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Requested by |
| `company_slug` | string(120) | required |  |
| `work_email` | string(320) |  | Verified by a code before the claim is sent |
| `work_email_verified` | boolean | required, default false |  |
| `note` | text |  |  |
| `status` | string(40) | required, default "pending" | values: pending / approved / rejected / withdrawn |
| `editor_note` | text |  |  |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `company_change_requests`

Profile edits and "Request a change" items from claimed companies. The public page stays as it is until approved.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Requested by |
| `company_slug` | string(120) | required |  |
| `kind` | string(40) |  | profile_edit, or the locked field asked about (orgType, categories, applications, coverage, notes, cert) |
| `changes` | json |  | Proposed values |
| `reason` | text |  |  |
| `evidence` | uuid → directus_files |  | Optional document |
| `status` | string(40) | required, default "pending" | values: pending / approved / rejected / withdrawn |
| `editor_note` | text |  |  |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `newsletter_subscribers`

Weekly brief and alert sign-ups (double opt-in).

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `email` | string(320) | required, unique |  |
| `lists` | json |  | ["brief", …] |
| `status` | string(40) | required, default "pending" | values: pending / active / unsubscribed |
| `confirm_hash` | string(128) |  | Hash of the confirmation token (website only) |
| `source` | string(60) |  | Which form |
| `confirmed_at` | timestamp |  |  |
| `date_created` | timestamp |  |  |

## `contact_messages`

Contact and advertising enquiries from the site forms.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | If signed in |
| `name` | string(120) |  |  |
| `email` | string(320) | required |  |
| `organisation` | string(160) |  |  |
| `reason` | string(40) |  | Code from contact_subject, or advertising |
| `message` | text |  | Max 4,000 characters |
| `source` | string(40) |  | contact / advertise |
| `status` | string(40) | required, default "new" | values: new / handled |
| `date_created` | timestamp |  |  |

## `subscriptions`

Paid plans. Written by the website from Stripe webhooks — change plans in Stripe, not here.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Owner (who pays) |
| `plan` | string(40) | required, default "pro" | sponsor = Directory Sponsor (yearly) · values: pro / team / company / sponsor |
| `cycle` | string(40) | required, default "monthly" | values: monthly / yearly |
| `status` | string(40) | required, default "incomplete" | Stripe status · values: trialing / active / past_due / unpaid / canceled / incomplete / incomplete_expired / paused |
| `stripe_subscription` | string(64) | required, unique |  |
| `stripe_customer` | string(64) |  |  |
| `seats` | integer | default 1 | Team: people included |
| `trial_end` | timestamp |  |  |
| `period_end` | timestamp |  | Current period ends / renews |
| `cancel_at_period_end` | boolean | required, default false | Cancelled; access runs to period_end |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `team_seats`

People added to a Team subscription by its owner. Matched to members by email.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `subscription` | uuid → subscriptions |  | Team subscription |
| `email` | string(320) | required |  |
| `date_created` | timestamp |  |  |

## `purchases`

One-off purchases (reports). Written by the website from Stripe webhooks.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Buyer |
| `product` | string(120) | required | Report slug |
| `stripe_session` | string(128) | unique |  |
| `amount` | integer | default 0 | Minor units (cents) |
| `currency` | string(3) |  |  |
| `date_created` | timestamp |  |  |

## `reports`

Paid reports sold one by one on /reports/. The file is only downloadable by buyers.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `slug` | string(120) | required, unique | URL name |
| `status` | string(40) | required, default "draft" | draft = found automatically, waiting for an editor · published = live on the site · rejected = not relevant · values: draft / published / rejected |
| `title` | string(200) | required |  |
| `summary` | text |  | Shown on the shop page |
| `contents` | json |  | Table of contents: ["…"] |
| `price_usd` | integer | default 299 | Whole US dollars |
| `stripe_price` | string(64) |  | Stripe price id (one-off) |
| `pages` | integer | default 0 |  |
| `published_at` | timestamp |  |  |
| `file` | uuid → directus_files |  | The report PDF (private) |
| `cover` | uuid → directus_files |  | Cover image (public) |
| `sample` | uuid → directus_files |  | Free sample pages PDF (public) |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `tenders`

Tenders and project leads. The website's fetchers add drafts (TED, World Bank, SAM.gov); editors check, add products and publish.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `status` | string(40) | required, default "draft" | draft = found automatically, waiting for an editor · published = live on the site · rejected = not relevant · values: draft / published / rejected |
| `title` | string(300) | required |  |
| `summary` | text |  | Plain-English summary written or checked by the editor |
| `buyer` | string(255) |  | Contracting authority / owner |
| `country` | string(2) |  | ISO alpha-2 |
| `city` | string(120) |  |  |
| `products` | json |  | Product codes (vocabulary: product), e.g. ["welded_mesh_panel"] |
| `kind` | string(40) | required, default "tender" | values: tender / prequalification / award / project |
| `quantity` | string(255) |  | As stated |
| `value` | decimal |  | Estimated value |
| `currency` | string(3) |  |  |
| `published_on` | timestamp |  | Date the notice was published |
| `deadline` | timestamp |  | Submission deadline |
| `source` | string(40) |  | ted / worldbank / sam / manual |
| `source_id` | string(120) |  | Notice id at the source |
| `url` | string(500) |  | Original notice |
| `language` | string(8) |  |  |
| `raw` | json |  | What the fetcher found (for the editor) |
| `published_at` | timestamp |  | Set by the website when an editor publishes it (used for alerts) |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `tender_alerts`

Saved tender searches (Pro). A daily email lists new matches.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | The site user this belongs to |
| `name` | string(80) |  |  |
| `products` | json |  |  |
| `countries` | json |  |  |
| `last_sent` | timestamp |  |  |
| `date_created` | timestamp |  |  |

## `trade_cases`

Anti-dumping, countervailing and safeguard cases on wire, mesh, fencing and grating.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `status` | string(40) | required, default "draft" | draft = found automatically, waiting for an editor · published = live on the site · rejected = not relevant · values: draft / published / rejected |
| `slug` | string(160) | unique |  |
| `importing_country` | string(8) |  | Country or bloc imposing the measure (ISO, or EU) |
| `origins` | json |  | Exporting countries (ISO) ["CN", …] |
| `product` | string(255) |  | Product as named in the case |
| `hs_codes` | json |  | ["7314.20", …] |
| `products` | json |  | Product codes (vocabulary) |
| `measure` | string(40) | required, default "anti_dumping" | values: anti_dumping / countervailing / safeguard / anti_circumvention |
| `stage` | string(40) | required, default "initiation" | values: initiation / provisional / definitive / expiry_review / interim_review / terminated / expired |
| `rates` | json |  | Duty rates: [{"company":"…","country":"CN","rate":"35.2%"}] |
| `summary` | text |  | Editor summary |
| `next_date` | timestamp |  | Next key date (expiry, review deadline) |
| `authority` | string(160) |  | e.g. US Commerce / EU Commission |
| `case_no` | string(80) |  |  |
| `url` | string(500) |  | Official page |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## `trade_case_updates`

Notices about a case (initiation, duties, reviews). Fetchers add drafts from official journals; editors link them to a case and publish.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `status` | string(40) | required, default "draft" | draft = found automatically, waiting for an editor · published = live on the site · rejected = not relevant · values: draft / published / rejected |
| `case` | uuid → trade_cases |  | Case this notice belongs to |
| `title` | string(400) | required |  |
| `summary` | text |  |  |
| `date` | timestamp |  | Publication date |
| `source` | string(40) |  | federal_register / eu_oj / rss / manual |
| `source_id` | string(160) |  |  |
| `url` | string(500) |  |  |
| `raw` | json |  |  |
| `published_at` | timestamp |  | Set by the website when an editor publishes it (used for alerts) |
| `date_created` | timestamp |  |  |

## `case_follows`

Members following a trade case (Pro); emailed when a published update is added.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | The site user this belongs to |
| `case` | uuid → trade_cases |  | Followed case |
| `date_created` | timestamp |  |  |

## `company_extras`

Extra profile content for companies on the Company plan (catalogue, video, contacts). Reviewed before it shows.

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `id` | uuid (primary key) | required |  |
| `member` | uuid → members |  | Submitted by |
| `company_slug` | string(120) | required |  |
| `status` | string(40) | required, default "pending" | values: pending / approved / rejected |
| `catalogue` | uuid → directus_files |  | Product catalogue PDF |
| `video_url` | string(255) |  | YouTube or Vimeo link |
| `contacts` | json |  | [{"name":"…","role":"…","email":"…","phone":"…"}] |
| `editor_note` | text |  |  |
| `date_created` | timestamp |  |  |
| `date_updated` | timestamp |  |  |

## Extra fields on `directus_files`

| Field | Type | Notes |
| --- | --- | --- |
| `owner_member` | uuid | Member who uploaded this (website uploads only) |
| `visibility` | string | private = only the uploader and editors (until approved) · values: public / private |

## Folders

- `website-avatars`
- `website-submissions`
- `website-company`
- `website-reports`

## Access

Role and policy **Website server** (created by the setup script): create, read, update and delete on every collection above and on `directus_files`; read on `directus_folders`. Its user `website-server@wiremeshnews.com` has a static token that goes into Vercel as `DIRECTUS_SERVER_TOKEN`. It has no admin access and no access to content collections it does not need.
