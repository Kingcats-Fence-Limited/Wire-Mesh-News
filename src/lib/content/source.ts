/**
 * The one place that decides where published content comes from.
 *
 * Every page and component imports standards and events from here, never from the
 * seed modules directly. Today the seed files in this folder supply the data; once
 * `pnpm pull:content` has run against Directus, src/data/content/index.ts carries the
 * pulled rows and they win. Nothing else in the codebase changes.
 *
 * Content is resolved at build time rather than per request on purpose: the site is
 * statically generated, so a reader never waits on the CMS and an outage of the CMS
 * cannot take the site down. Directus publishes by firing a Vercel deploy hook, and a
 * daily cron rebuild catches anything else. See docs/directus-content.md.
 */
import { PULLED } from "@/data/content";
import { EVENTS as SEED_EVENTS } from "./directory";
import { STANDARDS as SEED_STANDARDS, slugify } from "./standards";
import type { EventItem, Standard } from "./types";

/** Which of the two supplied the content in this build — shown in the build log. */
export const CONTENT_SOURCE: "cms" | "seed" = PULLED.standards ? "cms" : "seed";
export const CONTENT_PULLED_AT = PULLED.pulledAt;

export const STANDARDS: Standard[] = PULLED.standards ?? SEED_STANDARDS;
export const EVENTS: EventItem[] = PULLED.events ?? SEED_EVENTS;

/* Standards */
export const getStandard = (slug: string) => STANDARDS.find((s) => s.slug === slug);
export const getStandardByNo = (no: string) => STANDARDS.find((s) => s.no === no);
export const standardsBySubject = (subject: string) => STANDARDS.filter((s) => s.subject === subject);
export const recentStandardChanges = (n = 3) =>
  STANDARDS.flatMap((s) => s.changelog.map((c) => ({ ...c, no: s.no, slug: s.slug, status: s.status })))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, n);

/* Events */
export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);
/** Defaults to the build date, so the calendar rolls forward on every rebuild. */
export const upcomingEvents = (from: string = new Date().toISOString().slice(0, 10)) => EVENTS.filter((e) => e.start >= from).sort((a, b) => (a.start > b.start ? 1 : -1));

export { slugify };
