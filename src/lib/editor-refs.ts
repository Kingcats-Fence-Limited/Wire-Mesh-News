/* Pick-lists for the article editor, built on the server from the same data the site
   publishes, so whatever an author links (standard, company, topic) exists on the site. */
import { STANDARDS } from "@/lib/content/source";
import { COMPANIES } from "@/lib/content/directory";
import { TOPICS } from "@/lib/content/market";
import type { EditorRefs } from "@/components/editor/draft";

export const editorRefs = (): EditorRefs => ({
  standards: STANDARDS.map((s) => ({ no: s.no, title: s.title })),
  companies: COMPANIES.map((c) => ({ slug: c.slug, name: c.name })).sort((a, b) => a.name.localeCompare(b.name)),
  topics: TOPICS.map((t) => ({ slug: t.slug, name: t.name })),
});
