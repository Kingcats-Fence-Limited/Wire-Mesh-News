import "server-only";
import { AUTH_LIVE } from "./env";
import { currentUser, type SessionUser } from "@/lib/auth";
import { ensureMember, type MemberRow } from "./member";
import { entitlement, type Entitlement } from "./billing";

/* Public data endpoints: who is asking (if anyone) and what they may see. Preview mode
   (accounts not live) sees everything, with sample data. */
export type Viewer = { live: boolean; user: SessionUser | null; m: MemberRow | null; ent: Entitlement | null; pro: boolean };

export async function viewer(req: Request): Promise<Viewer> {
  if (!AUTH_LIVE) return { live: false, user: null, m: null, ent: null, pro: true };
  const user = await currentUser(req.headers).catch(() => null);
  if (!user) return { live: true, user: null, m: null, ent: null, pro: false };
  const m = await ensureMember(user);
  const ent = await entitlement(m);
  return { live: true, user, m, ent, pro: ent.pro };
}

export const priv = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });
