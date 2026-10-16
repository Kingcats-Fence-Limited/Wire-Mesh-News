import { createHmac, timingSafeEqual } from "node:crypto";
import { AUTH_LIVE, ENV } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";

/* Resend delivery events (Resend → Webhooks; events: email.bounced, email.complained).
   A hard bounce means the mailbox does not exist; a complaint means the reader pressed
   "Report spam". Either one takes the address off every list for good, which also protects
   the sending domain's reputation. Signed with Svix: HMAC-SHA256 over "id.timestamp.body". */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function verified(req: Request, body: string): boolean {
  const secret = ENV.resendWebhookSecret;
  const id = req.headers.get("svix-id"), ts = req.headers.get("svix-timestamp"), sig = req.headers.get("svix-signature");
  if (!secret || !id || !ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false; // replay window: 5 minutes
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const want = Buffer.from(createHmac("sha256", key).update(`${id}.${ts}.${body}`).digest("base64"));
  return sig.split(" ").some((p) => {
    const [ver, val] = p.split(",");
    const got = Buffer.from(val ?? "");
    return ver === "v1" && got.length === want.length && timingSafeEqual(got, want);
  });
}

type Event = { type?: string; data?: { to?: string[] | string; bounce?: { type?: string } } };

export async function POST(req: Request) {
  if (!AUTH_LIVE || !ENV.resendWebhookSecret) return new Response("Not found", { status: 404 });
  const body = await req.text();
  if (!verified(req, body)) return new Response("Bad signature", { status: 401 });
  const ev = JSON.parse(body) as Event;
  /* Only a permanent bounce removes an address. Transient (mailbox full, greylisting),
     Undetermined or any unknown type is left alone. */
  const permanent = /^permanent$/i.test(String(ev.data?.bounce?.type ?? "").trim());
  const status = ev.type === "email.complained" ? "complained" : ev.type === "email.bounced" && permanent ? "bounced" : null;
  if (!status) return Response.json({ ok: true, ignored: ev.type });
  const to = (Array.isArray(ev.data?.to) ? ev.data!.to : [ev.data?.to ?? ""]).map((e) => String(e).trim().toLowerCase()).filter(Boolean);
  let changed = 0;
  for (const email of to) {
    const rows = await dx.list<{ id: string; status: string }>("newsletter_subscribers", { filter: { email: { _eq: email } }, fields: ["id", "status"], limit: 1 });
    if (rows[0] && rows[0].status !== status) { await dx.update("newsletter_subscribers", rows[0].id, { status, confirm_hash: null }); changed++; }
  }
  return Response.json({ ok: true, status, changed });
}
