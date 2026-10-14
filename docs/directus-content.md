# Directus integration

How published content gets from the CMS onto wiremeshnews.com, and what has to exist
in Directus for it to work.

## The shape of it

```
editor publishes in Directus
      │
      ├─ Directus flow fires the Vercel deploy hook
      │
      ▼
Vercel build:  pnpm pull:content  →  src/data/content/index.ts
               next build          →  static pages
```

Content is pulled **at build time**, not per request. Three reasons:

- A reader never waits on the CMS, and a CMS outage cannot take the site down — it
  only means the next build has nothing new to pull.
- Every page stays static, which is what the site already is.
- The published HTML is a dated artefact. That matters for a publication: what was on
  the page on a given day is recoverable from the deployment, not only from the CMS.

Pages also regenerate in the background at most once an hour (`revalidate = 3600` in `src/app/layout.tsx`), so date-dependent parts stay current without a scheduled rebuild. CMS edits still go live through the deploy hook.

## The seam

`src/lib/content/source.ts` is the only place that decides where content comes from.
Everything else — pages, boards, the ICS and RSS routes — imports from it.

- `src/data/content/index.ts` holds whatever `pull:content` last wrote. While its
  values are `null`, the seed content in `src/lib/content/` is used instead.
- `CONTENT_SOURCE` exports `"cms"` or `"seed"` so a build can report which it used.

Adding a collection to the CMS later means: add a mapper to the script, add a field to
`PULLED`, and add the fallback line to `source.ts`. No component changes.

## Environment

Set in Vercel (Production and Preview), never committed:

| Variable | Value |
| --- | --- |
| `DIRECTUS_URL` | `https://cms.example.com` — no trailing slash |
| `DIRECTUS_TOKEN` | static token for a **read-only** role limited to the collections below |

With `DIRECTUS_URL` unset the script exits quietly and the build uses seed content, so
local development needs no credentials.

Build command in Vercel: `pnpm pull:content && pnpm build`

## Collections

Both collections need a `status_published` boolean (or a Directus status field mapped
to one); the script only pulls rows where it is true.

### `standards`

| Field | Type | Notes |
| --- | --- | --- |
| `no` | string, required | `EN 10223-4` |
| `slug` | string | derived from `no` when empty |
| `title` | string, required | the official title |
| `body` | string | code from the `standards_body` vocabulary |
| `subject` | string | code from `standard_subject` — the same five families as `category` |
| `status` | string | `current` / `under_review` / `withdrawn` / `draft` |
| `edition` | string | year |
| `checked` | date | when we last checked it against the issuing body |
| `source_url` | string | the publisher's own page for it |
| `replaces`, `replaced_by` | string | standard numbers |
| `adopted_as` | JSON array of strings | national adoptions |
| `covers` | text | **our own** summary of scope, never the standard's wording |
| `why_it_matters` | JSON array of strings | |
| `related` | JSON array of standard numbers | |
| `equivalents` | JSON array of `{body, no, relation}` | relation: `equivalent` / `partial` / `not` |
| `changelog` | JSON array of `{date, kind, text, source}` | kind: `status` / `equivalents` / `added` / `edition` / `withdrawn` |
| `followers` | integer | |
| `certified_companies` | JSON array of company slugs | |

### `events`

| Field | Type | Notes |
| --- | --- | --- |
| `slug`, `name` | string, required | |
| `type` | string | `trade_show` / `conference` / `webinar` |
| `start`, `end` | date | |
| `city`, `country`, `venue`, `organiser` | string | |
| `online` | boolean | |
| `focus`, `summary` | text | |
| `we_attend` | boolean | drives the "we will be there" marker |
| `website` | string | |

## Feeding standards automatically

ISO publishes an open dataset of deliverable metadata — reference, title,
publication date and current stage — as Parquet, JSONLines and CSV under the ODC-By
licence. That covers the facts this site records, legally and without scraping.

The intended job: a scheduled task pulls the ISO dataset, compares it with the
`standards` collection, and writes any difference into a `standards_changes` queue
with `pending` status. **An editor confirms or rejects before it reaches the site.**

Two reasons the queue is not optional. The Editorial Policy on this site promises
that a named editor signs off every change; publishing machine output directly would
break that promise. And a stage code occasionally means something other than the
obvious — one wrong automatic status costs more trust than the automation saves.

Other bodies (CEN, ASTM, DIN, BSI) publish no comparable dataset and their terms
generally forbid scraping. Note the line the site already works to: a standard's
number, title, year and status are facts and can be recorded; its clauses, tables and
values are the publisher's property and are never reproduced here.

Events have no usable feed anywhere. They stay hand-maintained, with past events
archived automatically by date.

## Market data is not content

Prices do not belong in the content pull. They change intraday, they are licensed
under terms that usually forbid redistribution and export, and no editor types them.
They need a cache that a scheduled fetch writes and the page reads — Vercel Edge
Config or KV fits better than a CMS collection — with the page revalidating on a
timer rather than being rebuilt.

Until a feed is licensed, `MARKET_FEED_LIVE` in `src/lib/content/market.ts` stays
`false`: the market pages then show the figures as sample data and name no provider.
