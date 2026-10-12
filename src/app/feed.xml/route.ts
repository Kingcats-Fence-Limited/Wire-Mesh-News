import { latest } from "@/lib/content/articles";
import { LETTERS } from "@/lib/content/people";
import { articleHref, SITE } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 — summaries only, never full text (framework §3.1). */
export function GET() {
  const items = [
    ...latest(20).map((a) => ({ title: a.title, link: `${SITE.url}${articleHref(a)}`, date: a.date, desc: a.dek, cat: "Article" })),
    ...LETTERS.slice(0, 5).map((l) => ({ title: `“${l.title}”`, link: `${SITE.url}/letters/${l.slug}/`, date: l.date, desc: l.teaser, cat: "Letter" })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(SITE.name)}</title><link>${SITE.url}</link><description>${esc(SITE.tagline)}</description><language>en</language>
${items.map((i) => `<item><title>${esc(i.title)}</title><link>${i.link}</link><guid>${i.link}</guid><pubDate>${new Date(i.date).toUTCString()}</pubDate><category>${i.cat}</category><description>${esc(i.desc)}</description></item>`).join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
