import { randomUUID } from "node:crypto";
import { AUTH_LIVE, ENV } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { me, json } from "@/lib/server/guard";
import { limit } from "@/lib/server/rate-limit";
import { sendMail } from "@/lib/server/mail";
import { initials } from "@/lib/initials";
import { getArticle } from "@/lib/content/articles";
import { articleHref } from "@/lib/site";

/* GET ?slug= → approved comments for an article (public, cached for a minute).
   POST {slug, text} → a pending comment from the signed-in member. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Row = { id: string; text: string; date_created: string; member: { name: string | null; job_title: string | null; company_name: string | null } | null };

export async function GET(req: Request) {
  if (!AUTH_LIVE) return json({ comments: [] });
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!getArticle(slug)) return json({ comments: [] }, 404);
  const rows = await dx.list<Row>("comments", { filter: { article_slug: { _eq: slug }, status: { _eq: "approved" } }, fields: ["id", "text", "date_created", "member.name", "member.job_title", "member.company_name"], sort: ["-date_created"], limit: 200 });
  const comments = rows.map((r) => {
    const name = r.member?.name || "Reader";
    return { id: r.id, text: r.text, date: r.date_created, name, initials: initials(name), role: [r.member?.job_title, r.member?.company_name].filter(Boolean).join(", ") };
  });
  return Response.json({ comments }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const b = (await req.json().catch(() => ({}))) as { slug?: string; text?: string };
  const a = getArticle(String(b.slug ?? ""));
  if (!a || a.type === "sponsored") return json({ error: "Comments are closed on this page." }, 400);
  const text = String(b.text ?? "").trim();
  if (text.length < 5) return json({ error: "Write a little more." }, 400);
  if (text.length > 1500) return json({ error: "Comments are up to 1,500 characters." }, 400);
  if (!ctx.m.name) return json({ error: "Add your name in your profile first: comments show the writer's name." }, 400);
  if (ctx.m.deletion_requested_at) return json({ error: "This account is scheduled for deletion." }, 403);
  const rl = await limit(`comment:${ctx.m.id}`, 10, 86400);
  if (!rl.ok) return json({ error: "You can post up to 10 comments a day." }, 429);
  const id = randomUUID();
  await dx.create("comments", { id, member: ctx.m.id, article_slug: a.slug, article_title: a.title, article_href: articleHref(a), text, status: "pending" });
  if (ENV.editorsInbox) sendMail({ to: ENV.editorsInbox, subject: `[Comment] ${a.title}`, text: `${ctx.m.name} <${ctx.user.email}> on “${a.title}”:\n\n${text}\n\nModerate in Directus → Comments.` }).catch(() => {});
  return json({ ok: true, id });
}
