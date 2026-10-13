import { ARTICLES } from "./articles";
import { COMPANIES } from "./directory";
import { STANDARDS } from "./standards";

/**
 * The figure band on the home page.
 *
 * Every figure is counted from the site's own published content, so it can never
 * go stale and every claim is checkable by opening the page it links to. Nothing
 * here is a hard-coded industry statistic: a trade title cannot stand behind a
 * market number it did not measure, and a wrong one on the home page is a
 * correction waiting to happen.
 *
 * The shape below is also the collection shape for the CMS. When Directus lands,
 * `industryFigures()` either reads an editor-curated list or keeps counting —
 * nothing else in the page has to change.
 */
export type Figure = {
  value: string;
  unit?: string;
  label: string;
  source: string;
  href?: string;
};

const DAY = 86400000;

/** Changelog entries recorded across all tracked standards within `days`. */
function changesWithin(today: string, days: number) {
  const floor = new Date(new Date(today).getTime() - days * DAY).toISOString().slice(0, 10);
  return STANDARDS.reduce((n, s) => n + s.changelog.filter((c) => c.date >= floor).length, 0);
}

/** The most recent date on which any standard was re-checked against its body. */
function lastChecked() {
  return STANDARDS.reduce((d, s) => (s.checked > d ? s.checked : d), "");
}

function fmt(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getUTCDate()} ${["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function industryFigures(today: string): Figure[] {
  const countries = new Set(COMPANIES.map((c) => c.country)).size;
  const sourced = ARTICLES.filter((a) => (a.standards?.length ?? 0) > 0).length;

  return [
    {
      value: String(STANDARDS.length),
      label: "Standards tracked, each checked against its issuing body",
      source: `STANDARDS INDEX · LAST CHECKED ${fmt(lastChecked())}`,
      href: "/standards/",
    },
    {
      value: String(changesWithin(today, 90)),
      label: "Changes logged to those standards in 90 days",
      source: "EVERY ENTRY CARRIES ITS OWN SOURCE LINK",
      href: "/standards/",
    },
    {
      value: String(COMPANIES.length),
      label: "Companies in the directory",
      source: "EDITORIAL LISTING · ORDER UNRELATED TO PAYMENT",
      href: "/directory/",
    },
    {
      value: String(sourced),
      label: "Articles that cite a named standard",
      source: `ACROSS ${countries} COUNTRIES IN THE DIRECTORY`,
      href: "/standards/",
    },
  ];
}
