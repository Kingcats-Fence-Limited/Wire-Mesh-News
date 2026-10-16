import { randomUUID } from "node:crypto";
import { me, json } from "@/lib/server/guard";
import { dx } from "@/lib/server/directus";
import { entitlement } from "@/lib/server/billing";
import { sendMail, htmlFrom } from "@/lib/server/mail";
import { SITE } from "@/lib/site";

/* Team owners add and remove people (by email). The owner counts as one seat. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function owner(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const ent = await entitlement(ctx.m);
  if (ent.own?.plan !== "team") return json({ error: "Only the owner of a Team plan can manage seats." }, 403);
  return { ctx, sub: ent.own };
}

export async function POST(req: Request) {
  const o = await owner(req);
  if (o instanceof Response) return o;
  const email = String(((await req.json().catch(() => ({}))) as { email?: string }).email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 320) return json({ error: "Enter a valid email address." }, 400);
  if (email === o.ctx.m.email?.toLowerCase()) return json({ error: "You are already included as the owner." }, 400);
  const seats = await dx.list<{ id: string; email: string }>("team_seats", { filter: { subscription: { _eq: o.sub.id } }, fields: ["id", "email"], limit: 500 });
  if (seats.some((x) => x.email === email)) return json({ error: "Already on the team." }, 409);
  if (seats.length + 1 >= (o.sub.seats ?? 5)) return json({ error: `All ${o.sub.seats} seats are used. Add seats from Manage billing, or remove someone first.` }, 400);
  const id = randomUUID();
  await dx.create("team_seats", { id, subscription: o.sub.id, email });
  const who = o.ctx.m.name || o.ctx.user.email;
  await sendMail({ to: email, replyTo: o.ctx.user.email, subject: `${who} added you to Wire Mesh News Team`, text: `${who} added you to their Wire Mesh News Team plan. Sign in with this email address to read Pro analysis, tenders and trade data:\n${SITE.url}/signin/`, html: htmlFrom([`${who} added you to their Wire Mesh News Team plan.`, "Sign in with this email address to read Pro analysis, tenders and trade data:", `${SITE.url}/signin/`]) }).catch(() => {});
  return json({ ok: true, id });
}

export async function DELETE(req: Request) {
  const o = await owner(req);
  if (o instanceof Response) return o;
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const row = await dx.get<{ id: string; subscription: string }>("team_seats", id).catch(() => null);
  if (!row || row.subscription !== o.sub.id) return json({ error: "Not found." }, 404);
  await dx.remove("team_seats", id);
  return json({ ok: true });
}
