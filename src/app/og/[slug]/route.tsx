/* Per-article share card, served at /og/<article-slug>/. */
import { ogCard } from "@/lib/og";
import { ARTICLES, getArticle } from "@/lib/content/articles";
import { getAuthor } from "@/lib/content/people";
import { fmtDateShort, sectionByCode } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => ARTICLES.map((a) => ({ slug: a.slug }));

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug)!;
  const s = sectionByCode(a.section)?.label ?? "";
  const au = getAuthor(a.author);
  return ogCard({ kicker: a.type === "sponsored" ? `Sponsored · ${s}` : s, title: a.title, meta: [au?.name, fmtDateShort(a.date), `${a.readMin} min read`].filter(Boolean).join("  ·  ") });
}
