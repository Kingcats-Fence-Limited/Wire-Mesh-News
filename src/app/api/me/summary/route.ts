import { AUTH_LIVE } from "@/lib/server/env";
import { currentUser } from "@/lib/auth";
import { ensureMember } from "@/lib/server/member";
import { dx } from "@/lib/server/directus";
import { json } from "@/lib/server/guard";
import { initials } from "@/lib/initials";

/* What public pages need about the visitor: signed in or not, name for the comment box, and
   which pages they saved or standards they follow (to show Save / Following correctly). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!AUTH_LIVE) return json({ signedIn: false });
  const user = await currentUser(req.headers).catch(() => null);
  if (!user) return json({ signedIn: false });
  const m = await ensureMember(user);
  const [bms, fol] = await Promise.all([
    dx.list<{ id: string; href: string }>("bookmarks", { filter: { member: { _eq: m.id } }, fields: ["id", "href"], limit: 500 }),
    dx.list<{ id: string; standard_slug: string }>("standard_follows", { filter: { member: { _eq: m.id } }, fields: ["id", "standard_slug"], limit: 500 }),
  ]);
  const name = m.name ?? "";
  return json({ signedIn: true, name, initials: initials(name || user.email), bookmarks: bms.map((b) => ({ id: b.id, href: b.href })), follows: fol.map((f) => ({ id: f.id, slug: f.standard_slug })) });
}
