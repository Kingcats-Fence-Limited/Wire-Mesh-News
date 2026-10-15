import type { Metadata } from "next";
import { Suspense } from "react";
import { Shell } from "@/components/shell/Shell";
import { byAuthor } from "@/lib/content/articles";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { personLd } from "@/lib/schema";
import { notFound } from "next/navigation";
import { AUTHORS, getAuthor } from "@/lib/content/people";
import { AuthorBoard, AuthorFromUrl, type AuthorArticle } from "@/components/boards/author/AuthorBoard";

/* Unknown slugs get the prerendered 404 (rendered on the server, with the theme script) instead of an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getAuthor((await params).slug);
  return a ? pageMeta({ title: `${a.name} · Authors`, description: a.bio, path: `/authors/${a.slug}/`, type: "profile" }) : {};
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getAuthor((await params).slug);
  if (!a) notFound();
  const all: AuthorArticle[] = byAuthor(a.slug).map((x) => ({ slug: x.slug, title: x.title, dek: x.dek, section: x.section, subsection: x.subsection, date: x.date, readMin: x.readMin }));
  return (
    <Shell header="compact" board="b-auth">
      <JsonLd data={personLd(a)} />
      <Suspense fallback={<AuthorBoard a={a} all={all} />}>
        <AuthorFromUrl a={a} all={all} />
      </Suspense>
    </Shell>
  );
}
