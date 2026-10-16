import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { sha256 } from "@/lib/server/tokens";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const back = (s: string) => Response.redirect(`${u.origin}/subscribe/?${s}`, 303);
  if (!AUTH_LIVE) return back("confirmed=0");
  const t = u.searchParams.get("t") ?? "";
  if (!/^[\w-]{20,64}$/.test(t)) return back("confirmed=0");
  const row = (await dx.list<{ id: string }>("newsletter_subscribers", { filter: { confirm_hash: { _eq: sha256(t) }, status: { _eq: "pending" } }, limit: 1 }))[0];
  if (!row) return back("confirmed=0");
  await dx.update("newsletter_subscribers", row.id, { status: "active", confirmed_at: new Date().toISOString(), confirm_hash: null });
  return back("confirmed=1");
}
