/**
 * Content pulled from the CMS. This file is REWRITTEN by `pnpm pull:content`,
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
} = {
  pulledAt: null,
  standards: null,
  events: null,
};
