import "server-only";
import { headers as nextHeaders } from "next/headers";
import { AUTH_LIVE } from "./env";
import { currentUser, type SessionUser } from "@/lib/auth";
import { ensureMember, type MemberRow } from "./member";

/* Every /api/me/* route starts here: accounts must be live, the request must carry a valid
   session, and the member record is created on first use. Writes also need same-origin. */
export type Me = { user: SessionUser; m: MemberRow; headers: Headers };

export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

export async function me(req?: Request): Promise<Me | Response> {
  if (!AUTH_LIVE) return json({ error: "Accounts are not open yet." }, 404);
  const headers = req ? req.headers : await nextHeaders();
  if (req && req.method !== "GET" && !sameOrigin(req)) return json({ error: "Bad origin." }, 403);
  const user = await currentUser(headers);
  if (!user) return json({ error: "Sign in again." }, 401);
  const m = await ensureMember(user);
  return { user, m, headers };
}

/* Cross-site form posts are blocked: the Origin (or Referer) must be this site. */
export function sameOrigin(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const origin = req.headers.get("origin") ?? req.headers.get("referer");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}
