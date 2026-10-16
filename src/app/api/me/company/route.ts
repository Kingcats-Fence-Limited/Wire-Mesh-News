import { me, json } from "@/lib/server/guard";
import { COMPANIES } from "@/lib/content/directory";
import { ARTICLES } from "@/lib/content/articles";
import { articleHref } from "@/lib/site";
import { subdivisionsOf } from "@/lib/vocab-geo";
import { dx } from "@/lib/server/directus";
import { fmt } from "@/lib/server/member";

type Row = { kind: string; changes: { changed?: string[]; from?: string; to?: string } | null; status: string; editor_note: string | null; date_created: string; date_updated: string | null };
const ST = { pending: "review", approved: "approved", rejected: "declined" } as const;

/* The directory profile this member manages, in the shape the company panel renders. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const co = COMPANIES.find((c) => c.slug === ctx.m.company_slug);
  if (!co) return json({ error: "No company on this account." }, 404);
  const related = ARTICLES.filter((x) => x.type !== "sponsored" && x.companies?.includes(co.slug)).slice(0, 4).map((x) => ({ title: x.title, href: articleHref(x) }));
  const rows = await dx.list<Row>("company_change_requests", { filter: { member: { _eq: ctx.m.id }, company_slug: { _eq: co.slug }, status: { _in: ["pending", "approved", "rejected"] } }, sort: ["-date_created"], limit: 30 });
  /* Pending "Request a change" items already show from the account state; list edits and decided requests here. */
  const history = rows.filter((r) => r.kind === "profile_edit" || r.status !== "pending").map((r) => ({
    date: fmt(r.date_created) ?? "",
    field: r.kind === "profile_edit" ? "Profile edit" : r.kind,
    change: r.kind === "profile_edit" ? (r.changes?.changed ?? []).join(", ") : `Change requested: ${r.changes?.from ?? ""} → ${r.changes?.to ?? ""}`,
    status: ST[r.status as keyof typeof ST],
    note: r.editor_note ?? (r.status === "pending" ? "With the directory editor. The public page keeps its current content until this is approved." : undefined),
  }));
  return json({ co, related, subs0: subdivisionsOf(co.country), history });
}
