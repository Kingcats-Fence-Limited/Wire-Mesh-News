import { randomUUID } from "node:crypto";
import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { limit, clientIp } from "@/lib/server/rate-limit";
import { sendMail, htmlFrom } from "@/lib/server/mail";
import { sameOrigin, json } from "@/lib/server/guard";
import { randomToken, sha256 } from "@/lib/server/tokens";
import { SITE } from "@/lib/site";
import { checkEmail } from "@/lib/server/email-check";

/* Newsletter sign-up, double opt-in. The answer is always the same ("check your inbox"), so
   the form cannot be used to find out who is subscribed. At most one confirmation email per
   address per hour. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const LISTS = ["brief", "events", "guides", "standards", "market"];
type Row = { id: string; email: string; status: string; lists: string[] | null };

export async function POST(req: Request) {
  if (!AUTH_LIVE) return json({ error: "Not open yet." }, 404);
  if (!sameOrigin(req)) return json({ error: "Bad origin." }, 403);
  const b = (await req.json().catch(() => ({}))) as { email?: string; lists?: string[]; source?: string; website?: string };
  if (b.website) return json({ ok: true }); // honeypot
  const raw = String(b.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(raw) || raw.length > 320) return json({ error: "Enter a valid email address." }, 400);
  const ip = await limit(`nl-ip:${clientIp(req)}`, 10, 3600);
  if (!ip.ok) return json({ error: "Too many sign-ups from this network. Try again later." }, 429);
  /* Domain receives mail, not a throwaway inbox, not an obvious typo. */
  const chk = await checkEmail(raw);
  if (!chk.ok) return json({ error: chk.error, suggestion: chk.suggestion }, 422);
  const email = chk.email;
  const lists = (Array.isArray(b.lists) ? b.lists : ["brief"]).filter((l) => LISTS.includes(l));
  const source = String(b.source ?? "").replace(/[^\w-]/g, "").slice(0, 60) || null;

  const found = (await dx.list<Row>("newsletter_subscribers", { filter: { email: { _eq: email } }, limit: 1 }))[0];
  /* An address that bounced or reported us as spam is never mailed again from a form. */
  if (found?.status === "bounced" || found?.status === "complained") return json({ ok: true });
  if (found?.status === "active") {
    const merged = [...new Set([...(found.lists ?? []), ...lists])];
    if (merged.length !== (found.lists ?? []).length) await dx.update("newsletter_subscribers", found.id, { lists: merged });
    return json({ ok: true });
  }
  const perAddr = await limit(`nl-mail:${email}`, 1, 3600);
  if (!perAddr.ok) return json({ ok: true });
  const token = randomToken();
  if (found) await dx.update("newsletter_subscribers", found.id, { status: "pending", lists: [...new Set([...(found.lists ?? []), ...lists])], confirm_hash: sha256(token), source });
  else await dx.create("newsletter_subscribers", { id: randomUUID(), email, lists: lists.length ? lists : ["brief"], status: "pending", confirm_hash: sha256(token), source });
  const link = `${new URL(req.url).origin}/api/newsletter/confirm/?t=${token}`;
  await sendMail({
    to: email,
    subject: "Confirm your Wire Mesh News subscription",
    text: `Confirm your subscription to ${SITE.name}:\n${link}\n\nIf you did not sign up, ignore this email; nothing is sent until you confirm.`,
    html: htmlFrom([`Confirm your subscription to ${SITE.name} by opening this link:`, link, "If you did not sign up, ignore this email; nothing is sent until you confirm."]),
  });
  return json({ ok: true });
}
