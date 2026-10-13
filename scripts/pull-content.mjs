#!/usr/bin/env node
/**
 * Pull published content out of Directus into src/data/content/index.ts.
 *
 * Run it in the build, before `next build`:
 *     pnpm pull:content && pnpm build
 *
 * With DIRECTUS_URL unset it exits quietly and leaves the file alone, so local
 * development and any build without CMS credentials keeps using the seed content
 * in src/lib/content/. Nothing in the site imports Directus at runtime: readers are
 * served static pages, and a CMS outage cannot take the site down — it only means the
 * next build has nothing new to pull.
 *
 * Publishing flow: an editor publishes in Directus -> Directus flow fires the Vercel
 * deploy hook -> the build runs this script -> the new rows are in the HTML.
 * A daily cron deploy catches anything that missed a hook.
 *
 * Env:
 *   DIRECTUS_URL     https://cms.example.com   (no trailing slash)
 *   DIRECTUS_TOKEN   a static token for a read-only role
 */
import { writeFileSync } from "node:fs";

const URL_BASE = process.env.DIRECTUS_URL?.replace(/\/$/, "");
const TOKEN = process.env.DIRECTUS_TOKEN;
const OUT = new URL("../src/data/content/index.ts", import.meta.url);

const HEADER = `/**
 * Content pulled from the CMS. This file is REWRITTEN by \`pnpm pull:content\`,
 * which reads Directus and writes the published rows here. Do not edit it by hand
 * and do not delete it: while the values below are null the site falls back to the
 * hand-written seed content in src/lib/content/, which is what runs today.
 *
 * Everything reads content through src/lib/content/source.ts, so switching the site
 * from seed to CMS is this file changing — no component or page is touched.
 */
import type { EventItem, Standard } from "@/lib/content/types";

export const PULLED: {
  /** ISO 8601 timestamp of the pull that wrote this file, or null while unpulled. */
  pulledAt: string | null;
  standards: Standard[] | null;
  events: EventItem[] | null;
} = `;

function emit(value) {
  writeFileSync(OUT, HEADER + JSON.stringify(value, null, 2) + ";\n");
}

if (!URL_BASE) {
  console.log("pull:content — DIRECTUS_URL not set, keeping seed content");
  process.exit(0);
}
if (!TOKEN) {
  console.error("pull:content — DIRECTUS_URL is set but DIRECTUS_TOKEN is missing");
  process.exit(1);
}

async function collection(name, params) {
  const qs = new URLSearchParams({ limit: "-1", ...params });
  const res = await fetch(`${URL_BASE}/items/${name}?${qs}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`${name}: ${res.status} ${res.statusText}`);
  const { data } = await res.json();
  if (!Array.isArray(data)) throw new Error(`${name}: unexpected payload`);
  return data;
}

const slugify = (no) => no.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");

/** Directus row -> the Standard shape the site already renders. */
function toStandard(r) {
  if (!r.no || !r.title) throw new Error(`standard ${r.id}: no and title are required`);
  return {
    no: r.no,
    slug: r.slug || slugify(r.no),
    title: r.title,
    body: r.body,
    subject: r.subject,
    status: r.status,
    edition: r.edition ?? undefined,
    checked: (r.checked ?? "").slice(0, 10),
    sourceUrl: r.source_url,
    replaces: r.replaces ?? undefined,
    replacedBy: r.replaced_by ?? undefined,
    adoptedAs: r.adopted_as ?? undefined,
    covers: r.covers ?? "",
    whyItMatters: r.why_it_matters ?? [],
    related: r.related ?? [],
    equivalents: r.equivalents ?? undefined,
    changelog: (r.changelog ?? []).map((c) => ({
      date: (c.date ?? "").slice(0, 10),
      kind: c.kind,
      text: c.text,
      source: c.source ?? undefined,
    })),
    followers: r.followers ?? 0,
    certifiedCompanies: r.certified_companies ?? undefined,
  };
}

function toEvent(r) {
  if (!r.slug || !r.name) throw new Error(`event ${r.id}: slug and name are required`);
  return {
    slug: r.slug,
    name: r.name,
    type: r.type,
    start: (r.start ?? "").slice(0, 10),
    end: r.end ? r.end.slice(0, 10) : undefined,
    city: r.city ?? undefined,
    country: r.country ?? undefined,
    venue: r.venue ?? undefined,
    organiser: r.organiser ?? undefined,
    online: r.online ?? undefined,
    focus: r.focus ?? "",
    summary: r.summary ?? "",
    weAttend: r.we_attend ?? undefined,
    website: r.website ?? undefined,
  };
}

try {
  const [standards, events] = await Promise.all([
    collection("standards", { filter: JSON.stringify({ status_published: { _eq: true } }), sort: "no" }),
    collection("events", { filter: JSON.stringify({ status_published: { _eq: true } }), sort: "start" }),
  ]);
  const mapped = { pulledAt: new Date().toISOString(), standards: standards.map(toStandard), events: events.map(toEvent) };
  emit(mapped);
  console.log(`pull:content — ${mapped.standards.length} standards, ${mapped.events.length} events`);
} catch (err) {
  console.error("pull:content — failed:", err.message);
  console.error("Leaving the existing content file untouched; the build will use whatever is already there.");
  process.exit(1);
}
