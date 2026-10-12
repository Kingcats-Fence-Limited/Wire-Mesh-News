import { byAuthor } from "@/lib/content/articles";
import { AUTHORS } from "@/lib/content/people";
import { articleHref, SITE } from "@/lib/site";

export const dynamic = "force-static";
export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Per-author RSS (summaries only). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = AUTHORS.find((a) => a.slug === slug);
  if (!author) return new Response("Not found", { status: 404 });
  const items = byAuthor(slug).slice(0, 20);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(author.name)} · ${esc(SITE.name)}</title><link>${SITE.url}/authors/${slug}/</link><description>${esc(author.role)}</description><language>en</language>
${items.map((a) => `<item><title>${esc(a.title)}</title><link>${SITE.url}${articleHref(a)}</link><guid>${SITE.url}${articleHref(a)}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${esc(a.dek)}</description></item>`).join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
