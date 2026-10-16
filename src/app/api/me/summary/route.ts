import { AUTH_LIVE } from "@/lib/server/env";
import { currentUser } from "@/lib/auth";
import { ensureMember } from "@/lib/server/member";
import { dx } from "@/lib/server/directus";
import { json } from "@/lib/server/guard";
import { initials } from "@/lib/initials";
import { entitlement } from "@/lib/server/billing";

/* What public pages need about the visitor: signed in or not, name for the comment box, and
   which pages they saved or standards they follow (to show Save / Following correctly). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!AUTH_LIVE) return json({ signedIn: false });
  const user = await currentUser(req.headers).catch(() => null);
  if (!user) return adfree(json({ signedIn: false }), false);
  const m = await ensureMember(user);
  const [bms, fol, ent] = await Promise.all([
    dx.list<{ id: string; href: string }>("bookmarks", { filter: { member: { _eq: m.id } }, fields: ["id", "href"], limit: 500 }),
    dx.list<{ id: string; standard_slug: string }>("standard_follows", { filter: { member: { _eq: m.id } }, fields: ["id", "standard_slug"], limit: 500 }),
    entitlement(m),
  ]);
  const name = m.name ?? "";
  return adfree(json({ signedIn: true, name, initials: initials(name || user.email), plan: ent.plan, pro: ent.pro, company: ent.company, bookmarks: bms.map((b) => ({ id: b.id, href: b.href })), follows: fol.map((f) => ({ id: f.id, slug: f.standard_slug })) }), ent.paid);
}

/* A plain (readable) cookie so the page hides advertising before it paints on the next visit. */
function adfree(res: Response, on: boolean) {
  res.headers.append("Set-Cookie", on ? "wmn_adfree=1; Path=/; Max-Age=2592000; SameSite=Lax; Secure" : "wmn_adfree=; Path=/; Max-Age=0; SameSite=Lax; Secure");
  return res;
}
