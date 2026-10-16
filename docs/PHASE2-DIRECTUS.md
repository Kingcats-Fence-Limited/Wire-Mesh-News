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

## Extra fields on `directus_files`

| Field | Type | Notes |
| --- | --- | --- |
| `owner_member` | uuid | Member who uploaded this (website uploads only) |
| `visibility` | string | private = only the uploader and editors (until approved) · values: public / private |

## Folders

- `website-avatars`
- `website-submissions`
- `website-company`

## Access

Role and policy **Website server** (created by the setup script): create, read, update and delete on every collection above and on `directus_files`; read on `directus_folders`. Its user `website-server@wiremeshnews.com` has a static token that goes into Vercel as `DIRECTUS_SERVER_TOKEN`. It has no admin access and no access to content collections it does not need.
