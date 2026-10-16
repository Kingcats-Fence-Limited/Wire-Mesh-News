import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { sha256 } from "@/lib/server/tokens";
import { sameOrigin, json } from "@/lib/server/guard";

/* Two steps on purpose. Company mail filters (Outlook Safe Links, Mimecast, Proofpoint) open
   every link in an email to scan it; if opening the link confirmed the subscription, a scanner
   would confirm addresses nobody reads. So the email link (GET) only opens the page, and the
   reader's own click on "Confirm" (POST from that page) activates the address. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const TOKEN = /^[\w-]{20,64}$/;

export async function GET(req: Request) {
  const u = new URL(req.url);
  const t = u.searchParams.get("t") ?? "";
  const q = AUTH_LIVE && TOKEN.test(t) ? `confirm=${encodeURIComponent(t)}` : "confirmed=0";
  return Response.redirect(`${u.origin}/subscribe/?${q}`, 303);
}

export async function POST(req: Request) {
  if (!AUTH_LIVE) return json({ error: "Not open yet." }, 404);
  if (!sameOrigin(req)) return json({ error: "Bad origin." }, 403);
  const b = (await req.json().catch(() => ({}))) as { t?: string };
  const t = String(b.t ?? "");
  if (!TOKEN.test(t)) return json({ error: "That confirmation link has expired or was already used. Sign up again below." }, 400);
  const row = (await dx.list<{ id: string }>("newsletter_subscribers", { filter: { confirm_hash: { _eq: sha256(t) }, status: { _eq: "pending" } }, limit: 1 }))[0];
  if (!row) return json({ error: "That confirmation link has expired or was already used. Sign up again below." }, 400);
  await dx.update("newsletter_subscribers", row.id, { status: "active", confirmed_at: new Date().toISOString(), confirm_hash: null });
  return json({ ok: true });
}
