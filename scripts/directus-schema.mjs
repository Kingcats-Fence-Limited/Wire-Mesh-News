/**
 * The Directus collections the website writes to in Phase 2 (accounts, submissions, comments …).
 * Single source of truth: scripts/directus-setup.mjs builds them from this file, and
 * docs/PHASE2-DIRECTUS.md lists the same fields for anyone adding them by hand.
 *
 * Conventions
 * - Every collection has a uuid primary key `id` and Directus' own date_created / date_updated.
 * - `member` is a many-to-one link to `members` (the site user). Codes from the vocabulary
 *   (country, section, contact subject …) are stored as codes, never as names.
 * - Status fields are plain strings with the values listed in `choices`.
 */

const uuidPk = { field: "id", type: "uuid", meta: { hidden: true, readonly: true, interface: "input", special: ["uuid"] }, schema: { is_primary_key: true, length: 36, has_auto_increment: false } };
const created = { field: "date_created", type: "timestamp", meta: { special: ["date-created"], interface: "datetime", readonly: true, hidden: true, width: "half" }, schema: {} };
const updated = { field: "date_updated", type: "timestamp", meta: { special: ["date-updated"], interface: "datetime", readonly: true, hidden: true, width: "half" }, schema: {} };

const str = (field, note, opts = {}) => ({ field, type: "string", meta: { interface: "input", note, width: opts.width ?? "full", ...(opts.meta ?? {}) }, schema: { is_nullable: !opts.required, max_length: opts.max ?? 255, is_unique: !!opts.unique, ...(opts.default !== undefined ? { default_value: opts.default } : {}) } });
const text = (field, note) => ({ field, type: "text", meta: { interface: "input-multiline", note }, schema: { is_nullable: true } });
const bool = (field, note, def = false) => ({ field, type: "boolean", meta: { interface: "boolean", note, width: "half" }, schema: { default_value: def, is_nullable: false } });
const int = (field, note, def = 0) => ({ field, type: "integer", meta: { interface: "input", note, width: "half" }, schema: { default_value: def, is_nullable: true } });
const json = (field, note) => ({ field, type: "json", meta: { interface: "input-code", options: { language: "JSON" }, note, special: ["cast-json"] }, schema: { is_nullable: true } });
const ts = (field, note) => ({ field, type: "timestamp", meta: { interface: "datetime", note, width: "half" }, schema: { is_nullable: true } });
const choice = (field, note, values, def) => ({ field, type: "string", meta: { interface: "select-dropdown", note, width: "half", options: { choices: values.map((v) => ({ text: v, value: v })) }, display: "labels" }, schema: { default_value: def, is_nullable: false, max_length: 40 } });
const member = (note = "The site user this belongs to") => ({ field: "member", type: "uuid", meta: { interface: "select-dropdown-m2o", special: ["m2o"], note, width: "half", options: { template: "{{name}} · {{email}}" } }, schema: { is_nullable: true }, relation: { related_collection: "members", on_delete: "CASCADE" } });
const file = (field, note) => ({ field, type: "uuid", meta: { interface: "file", special: ["file"], note, width: "half" }, schema: { is_nullable: true }, relation: { related_collection: "directus_files", on_delete: "SET NULL" } });

const rel = (field, related, note, onDelete = "CASCADE") => ({ field, type: "uuid", meta: { interface: "select-dropdown-m2o", special: ["m2o"], note, width: "half" }, schema: { is_nullable: true }, relation: { related_collection: related, on_delete: onDelete } });
const num = (field, note) => ({ field, type: "decimal", meta: { interface: "input", note, width: "half" }, schema: { is_nullable: true, numeric_precision: 18, numeric_scale: 4 } });
/* Items found by the website's fetchers start as "draft"; an editor checks and publishes them. */
const review = (def = "draft") => choice("status", "draft = found automatically, waiting for an editor · published = live on the site · rejected = not relevant", ["draft", "published", "rejected"], def);

export const COLLECTIONS = [
  {
    collection: "members",
    icon: "person",
    note: "Website users. Created on first sign-in; sign-in itself is handled by the website (Better Auth).",
    display_template: "{{name}} · {{email}}",
    fields: [
      uuidPk,
      str("auth_user_id", "Better Auth user id (set by the website, do not edit)", { required: true, unique: true, meta: { readonly: true } }),
      str("email", "Sign-in email (copied from the sign-in system)", { max: 320 }),
      str("name", "Display name; used as the by-line on new submissions", { max: 80 }),
      str("job_title", "", { max: 80, width: "half" }),
      str("company_name", "As the user typed it (free text)", { max: 120, width: "half" }),
      str("country", "ISO alpha-2 code", { max: 2, width: "half" }),
      str("city", "", { max: 80, width: "half" }),
      file("avatar", "Profile photo"),
      text("author_bio", "Author page bio (max 400 characters)"),
      str("author_public_email", "Optional, shown on the author page", { max: 320, width: "half" }),
      str("author_linkedin", "", { max: 255, width: "half" }),
      str("author_x", "", { max: 255, width: "half" }),
      str("author_website", "", { max: 255, width: "half" }),
      json("author_expertise", "Up to 5 short tags"),
      bool("author_visible", "Public author page", true),
      json("prefs", "Email preferences: {brief, reviewResults, commentReplies, standardAlerts, companyEnquiries, productNews}"),
      json("roles", "Set by editors: [\"reader\",\"author\",\"company\"]"),
      str("company_slug", "Claimed company (directory slug), set by the directory editor when a claim is approved", { max: 120, width: "half" }),
      ts("terms_accepted_at", "When the user accepted the Terms and Privacy Policy"),
      ts("deletion_requested_at", "Account deletion requested; data is removed 30 days later unless the user signs in and cancels"),
      str("stripe_customer_id", "Stripe customer (set by the website)", { max: 64, width: "half", meta: { readonly: true } }),
      bool("trial_used", "Has had a free trial (one per account)"),
      created, updated,
    ],
  },
  {
    collection: "submissions",
    icon: "edit_note",
    note: "Articles, edits to published articles, and letters sent by users. Editors review here.",
    display_template: "{{title}} · {{status}}",
    fields: [
      uuidPk,
      member("Author"),
      choice("kind", "article or letter", ["article", "letter"], "article"),
      choice("status", "Only editors move a submission to changes_requested, rejected or published", ["draft", "pending", "changes_requested", "rejected", "published", "withdrawn"], "draft"),
      str("title", "", { max: 200 }),
      text("excerpt", "Standfirst or letter text"),
      int("words", "Word count of the body"),
      str("section", "Section code (vocabulary: section)", { max: 40, width: "half" }),
      json("draft", "The full editor draft (title, body, section, sub-section, type, facets, files, sources, declarations)"),
      json("pending_draft", "Published pieces only: the proposed new version"),
      bool("edit_pending", "Published pieces only: an edit is waiting for review"),
      text("editor_note", "Shown to the author (changes requested / reason for not accepting)"),
      ts("submitted_at", "Set by the website when sent for review"),
      ts("reviewed_at", "Set when an editor decides"),
      str("published_href", "Live article path once published, e.g. /news/slug/", { max: 255 }),
      created, updated,
    ],
  },
  {
    collection: "comments",
    icon: "forum",
    note: "Reader comments. Shown under the article once approved.",
    display_template: "{{article_title}} · {{status}}",
    fields: [
      uuidPk,
      member("Writer"),
      str("article_slug", "", { required: true, max: 160, width: "half" }),
      str("article_title", "", { max: 255 }),
      str("article_href", "", { max: 255 }),
      text("text", "Max 1,500 characters"),
      choice("status", "", ["pending", "approved", "rejected", "removed"], "pending"),
      text("reason", "Shown to the writer when not approved"),
      created, updated,
    ],
  },
  {
    collection: "bookmarks",
    icon: "bookmark",
    note: "Saved articles, companies, standards and events.",
    fields: [uuidPk, member(), choice("kind", "", ["article", "company", "standard", "event"], "article"), str("href", "Site path", { required: true, max: 255 }), str("title", "", { max: 255 }), str("meta", "", { max: 120 }), created],
  },
  {
    collection: "standard_follows",
    icon: "notifications_active",
    note: "Users following a standard; they are emailed when its status changes.",
    fields: [uuidPk, member(), str("standard_slug", "", { required: true, max: 120 }), created],
  },
  {
    collection: "enquiries",
    icon: "mail",
    note: "Messages sent through \"Contact this company\". The website forwards each one by email.",
    display_template: "{{subject}} → {{company_name}}",
    fields: [
      uuidPk, member("Sender"),
      str("company_slug", "", { required: true, max: 120, width: "half" }),
      str("company_name", "", { max: 160, width: "half" }),
      str("subject", "", { max: 200 }),
      text("body", "Max 3,000 characters"),
      str("product", "", { max: 160, width: "half" }),
      str("quantity", "", { max: 80, width: "half" }),
      choice("status", "", ["sent", "awaiting_reply", "replied", "no_reply"], "sent"),
      ts("replied_at", ""),
      created,
    ],
  },
  {
    collection: "notifications",
    icon: "notifications",
    note: "In-account notices. Created by the website and by Directus flows (review results).",
    fields: [uuidPk, member(), choice("kind", "", ["submission", "comment", "company", "billing", "standard"], "submission"), text("text", ""), str("href", "Optional site path", { max: 255 }), bool("read", ""), bool("archived", ""), created],
  },
  {
    collection: "company_claims",
    icon: "verified",
    note: "Requests to manage a directory profile. Approving one: set the member's company_slug and add \"company\" to roles.",
    display_template: "{{company_slug}} · {{status}}",
    fields: [uuidPk, member("Requested by"), str("company_slug", "", { required: true, max: 120, width: "half" }), str("work_email", "Verified by a code before the claim is sent", { max: 320, width: "half" }), bool("work_email_verified", ""), text("note", ""), choice("status", "", ["pending", "approved", "rejected", "withdrawn"], "pending"), text("editor_note", ""), created, updated],
  },
  {
    collection: "company_change_requests",
    icon: "rule",
    note: "Profile edits and \"Request a change\" items from claimed companies. The public page stays as it is until approved.",
    display_template: "{{company_slug}} · {{kind}} · {{status}}",
    fields: [uuidPk, member("Requested by"), str("company_slug", "", { required: true, max: 120, width: "half" }), str("kind", "profile_edit, or the locked field asked about (orgType, categories, applications, coverage, notes, cert)", { max: 40, width: "half" }), json("changes", "Proposed values"), text("reason", ""), file("evidence", "Optional document"), choice("status", "", ["pending", "approved", "rejected", "withdrawn"], "pending"), text("editor_note", ""), created, updated],
  },
  {
    collection: "newsletter_subscribers",
    icon: "outgoing_mail",
    note: "Weekly brief and alert sign-ups (double opt-in).",
    display_template: "{{email}} · {{status}}",
    fields: [uuidPk, str("email", "", { required: true, unique: true, max: 320 }), json("lists", "[\"brief\", …]"), choice("status", "", ["pending", "active", "unsubscribed"], "pending"), str("confirm_hash", "Hash of the confirmation token (website only)", { max: 128, meta: { hidden: true } }), str("source", "Which form", { max: 60 }), ts("confirmed_at", ""), created],
  },
  {
    collection: "contact_messages",
    icon: "contact_mail",
    note: "Contact and advertising enquiries from the site forms.",
    display_template: "{{reason}} · {{email}}",
    fields: [uuidPk, member("If signed in"), str("name", "", { max: 120, width: "half" }), str("email", "", { required: true, max: 320, width: "half" }), str("organisation", "", { max: 160, width: "half" }), str("reason", "Code from contact_subject, or advertising", { max: 40, width: "half" }), text("message", "Max 4,000 characters"), str("source", "contact / advertise", { max: 40, width: "half" }), choice("status", "", ["new", "handled"], "new"), created],
  },
  /* ---------------- Subscriptions (Stripe) ---------------- */
  {
    collection: "subscriptions",
    icon: "workspace_premium",
    note: "Paid plans. Written by the website from Stripe webhooks — change plans in Stripe, not here.",
    display_template: "{{plan}} · {{status}} · {{member.email}}",
    fields: [
      uuidPk, member("Owner (who pays)"),
      choice("plan", "", ["pro", "team", "company"], "pro"),
      choice("cycle", "", ["monthly", "yearly"], "monthly"),
      choice("status", "Stripe status", ["trialing", "active", "past_due", "unpaid", "canceled", "incomplete", "incomplete_expired", "paused"], "incomplete"),
      str("stripe_subscription", "", { required: true, unique: true, max: 64, meta: { readonly: true } }),
      str("stripe_customer", "", { max: 64, width: "half", meta: { readonly: true } }),
      int("seats", "Team: people included", 1),
      ts("trial_end", ""), ts("period_end", "Current period ends / renews"),
      bool("cancel_at_period_end", "Cancelled; access runs to period_end"),
      created, updated,
    ],
  },
  {
    collection: "team_seats",
    icon: "group",
    note: "People added to a Team subscription by its owner. Matched to members by email.",
    display_template: "{{email}}",
    fields: [uuidPk, rel("subscription", "subscriptions", "Team subscription"), str("email", "", { required: true, max: 320 }), created],
  },
  {
    collection: "purchases",
    icon: "receipt_long",
    note: "One-off purchases (reports). Written by the website from Stripe webhooks.",
    display_template: "{{product}} · {{member.email}}",
    fields: [uuidPk, member("Buyer"), str("product", "Report slug", { required: true, max: 120, width: "half" }), str("stripe_session", "", { unique: true, max: 128, meta: { readonly: true } }), int("amount", "Minor units (cents)"), str("currency", "", { max: 3, width: "half" }), created],
  },
  {
    collection: "reports",
    icon: "menu_book",
    note: "Paid reports sold one by one on /reports/. The file is only downloadable by buyers.",
    display_template: "{{title}}",
    fields: [
      uuidPk, str("slug", "URL name", { required: true, unique: true, max: 120, width: "half" }), review("draft"),
      str("title", "", { required: true, max: 200 }), text("summary", "Shown on the shop page"), json("contents", "Table of contents: [\"…\"]"),
      int("price_usd", "Whole US dollars", 299), str("stripe_price", "Stripe price id (one-off)", { max: 64, width: "half" }),
      int("pages", "", 0), ts("published_at", ""), file("file", "The report PDF (private)"), file("cover", "Cover image (public)"), file("sample", "Free sample pages PDF (public)"),
      created, updated,
    ],
  },

  /* ---------------- Tenders and project leads ---------------- */
  {
    collection: "tenders",
    icon: "gavel",
    note: "Tenders and project leads. The website's fetchers add drafts (TED, World Bank, SAM.gov); editors check, add products and publish.",
    display_template: "{{title}} · {{country}} · {{status}}",
    fields: [
      uuidPk, review("draft"),
      str("title", "", { required: true, max: 300 }), text("summary", "Plain-English summary written or checked by the editor"),
      str("buyer", "Contracting authority / owner", { max: 255 }), str("country", "ISO alpha-2", { max: 2, width: "half" }), str("city", "", { max: 120, width: "half" }),
      json("products", "Product codes (vocabulary: product), e.g. [\"welded_mesh_panel\"]"),
      choice("kind", "", ["tender", "prequalification", "award", "project"], "tender"),
      str("quantity", "As stated", { max: 255 }), num("value", "Estimated value"), str("currency", "", { max: 3, width: "half" }),
      ts("published_on", "Date the notice was published"), ts("deadline", "Submission deadline"),
      str("source", "ted / worldbank / sam / manual", { max: 40, width: "half" }), str("source_id", "Notice id at the source", { max: 120, width: "half" }),
      str("url", "Original notice", { max: 500 }), str("language", "", { max: 8, width: "half" }), json("raw", "What the fetcher found (for the editor)"),
      ts("published_at", "Set by the website when an editor publishes it (used for alerts)"),
      created, updated,
    ],
  },
  {
    collection: "tender_alerts",
    icon: "notifications",
    note: "Saved tender searches (Pro). A daily email lists new matches.",
    fields: [uuidPk, member(), str("name", "", { max: 80 }), json("products", ""), json("countries", ""), ts("last_sent", ""), created],
  },

  /* ---------------- Trade defence (anti-dumping) ---------------- */
  {
    collection: "trade_cases",
    icon: "balance",
    note: "Anti-dumping, countervailing and safeguard cases on wire, mesh, fencing and grating.",
    display_template: "{{importing_country}} · {{product}} · {{origin}}",
    fields: [
      uuidPk, review("draft"), str("slug", "", { unique: true, max: 160, width: "half" }),
      str("importing_country", "Country or bloc imposing the measure (ISO, or EU)", { max: 8, width: "half" }),
      json("origins", "Exporting countries (ISO) [\"CN\", …]"),
      str("product", "Product as named in the case", { max: 255 }), json("hs_codes", "[\"7314.20\", …]"), json("products", "Product codes (vocabulary)"),
      choice("measure", "", ["anti_dumping", "countervailing", "safeguard", "anti_circumvention"], "anti_dumping"),
      choice("stage", "", ["initiation", "provisional", "definitive", "expiry_review", "interim_review", "terminated", "expired"], "initiation"),
      json("rates", "Duty rates: [{\"company\":\"…\",\"country\":\"CN\",\"rate\":\"35.2%\"}]"),
      text("summary", "Editor summary"), ts("next_date", "Next key date (expiry, review deadline)"), str("authority", "e.g. US Commerce / EU Commission", { max: 160 }),
      str("case_no", "", { max: 80, width: "half" }), str("url", "Official page", { max: 500 }),
      created, updated,
    ],
  },
  {
    collection: "trade_case_updates",
    icon: "update",
    note: "Notices about a case (initiation, duties, reviews). Fetchers add drafts from official journals; editors link them to a case and publish.",
    display_template: "{{title}} · {{status}}",
    fields: [
      uuidPk, review("draft"), rel("case", "trade_cases", "Case this notice belongs to", "SET NULL"),
      str("title", "", { required: true, max: 400 }), text("summary", ""), ts("date", "Publication date"),
      str("source", "federal_register / eu_oj / rss / manual", { max: 40, width: "half" }), str("source_id", "", { max: 160, width: "half" }), str("url", "", { max: 500 }), json("raw", ""),
      ts("published_at", "Set by the website when an editor publishes it (used for alerts)"),
      created,
    ],
  },
  {
    collection: "case_follows",
    icon: "bookmark_added",
    note: "Members following a trade case (Pro); emailed when a published update is added.",
    fields: [uuidPk, member(), rel("case", "trade_cases", "Followed case"), created],
  },

  /* ---------------- Company premium ---------------- */
  {
    collection: "company_extras",
    icon: "add_business",
    note: "Extra profile content for companies on the Company plan (catalogue, video, contacts). Reviewed before it shows.",
    display_template: "{{company_slug}} · {{status}}",
    fields: [
      uuidPk, member("Submitted by"), str("company_slug", "", { required: true, max: 120, width: "half" }),
      choice("status", "", ["pending", "approved", "rejected"], "pending"),
      file("catalogue", "Product catalogue PDF"), str("video_url", "YouTube or Vimeo link", { max: 255 }),
      json("contacts", "[{\"name\":\"…\",\"role\":\"…\",\"email\":\"…\",\"phone\":\"…\"}]"),
      text("editor_note", ""), created, updated,
    ],
  },
];

/** Extra field on directus_files so the website can tell who uploaded a private file. */
export const FILE_FIELDS = [
  { field: "owner_member", type: "uuid", meta: { interface: "input", note: "Member who uploaded this (website uploads only)", readonly: true }, schema: { is_nullable: true } },
  { field: "visibility", type: "string", meta: { interface: "select-dropdown", options: { choices: [{ text: "public", value: "public" }, { text: "private", value: "private" }] }, note: "private = only the uploader and editors (until approved)" }, schema: { default_value: "private", is_nullable: false, max_length: 20 } },
];

export const FOLDERS = ["website-avatars", "website-submissions", "website-company", "website-reports"];
