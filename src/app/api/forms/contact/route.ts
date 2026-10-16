import { randomUUID } from "node:crypto";
import { AUTH_LIVE, ENV } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { limit, clientIp } from "@/lib/server/rate-limit";
import { sendMail, htmlFrom } from "@/lib/server/mail";
import { humanCheck } from "@/lib/server/turnstile";
import { sameOrigin, json } from "@/lib/server/guard";
import { currentUser } from "@/lib/auth";
import { ensureMember } from "@/lib/server/member";
import { CONTACT_SUBJECT } from "@/data/vocab/contact_subject";

/* Contact and advertising forms. Saved to Directus (contact_messages) and emailed to the
   editors' inbox with Reply-To set to the sender. Turnstile + per-IP limit + duplicate check. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const cut = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  if (!AUTH_LIVE) return json({ error: "Not open yet." }, 404);
  if (!sameOrigin(req)) return json({ error: "Bad origin." }, 403);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.website_url) return json({ ok: true }); // honeypot
  const ip = clientIp(req);
  if (!(await humanCheck(String(b.captcha ?? ""), ip))) return json({ error: "Please complete the check above the button and try again." }, 400);
  const rl = await limit(`contact:${ip}`, 5, 3600);
  if (!rl.ok) return json({ error: "Too many messages from this network. Try again later, or email us directly." }, 429);

  const source = b.source === "advertise" ? "advertise" : "contact";
  /* Focused forms from the menu: build the message from their fields. */
  if (b.form === "listing") {
    b.message = [`Directory listing suggestion`, `Company: ${cut(b.company_name, 160)}`, `Website: ${cut(b.website, 255)}`, `Country: ${cut(b.country, 2)}`, `Connection: ${cut(b.relation, 20)}`, "", cut(b.what, 1500)].join("\n");
    b.company = b.company_name;
  } else if (b.form === "event") {
    b.message = [`Event submission`, `Event: ${cut(b.event_name, 200)}`, `Dates: ${cut(b.start, 10)}${b.end ? ` – ${cut(b.end, 10)}` : ""}`, `Format: ${cut(b.format, 20)}`, `Place: ${[cut(b.venue, 160), cut(b.city, 120), cut(b.country, 2)].filter(Boolean).join(", ") || "—"}`, `Website: ${cut(b.website, 255)}`, `Organiser: ${cut(b.organiser, 160)}`].join("\n");
    b.company = b.organiser;
  }
  const email = cut(b.email, 320).toLowerCase();
  const name = cut(b.name, 120);
  if (!EMAIL.test(email) || !name) return json({ error: "Add your name and a valid email address." }, 400);
  const reason = source === "advertise" ? `advertising:${cut(b.type, 30)}` : CONTACT_SUBJECT.some((c) => c.code === b.reason) ? String(b.reason) : "other";
  const message = source === "advertise"
    ? [`Goals: ${cut(b.goals, 3000)}`, b.timing ? `Timing: ${cut(b.timing, 200)}` : "", b.budget ? `Budget: ${cut(b.budget, 40)}` : ""].filter(Boolean).join("\n")
    : cut(b.message, 4000);
  if (message.length < 10) return json({ error: "Add a little more detail to the message." }, 400);
  const organisation = cut(b.company, 160) || null;

  const dupKey = `contact-dup:${email}:${message.slice(0, 80)}`;
  const dup = await limit(dupKey, 1, 86400);
  if (!dup.ok) return json({ error: "We already have this message. We reply by email, usually within two working days." }, 409);

  const user = await currentUser(req.headers).catch(() => null);
  const m = user ? await ensureMember(user).catch(() => null) : null;
  await dx.create("contact_messages", { id: randomUUID(), member: m?.id ?? null, name, email, organisation, reason, message, source, status: "new" });
  const label = source === "advertise" ? `Advertising enquiry (${cut(b.type, 30)})` : b.form === "listing" ? "Directory listing suggestion" : b.form === "event" ? "Event submission" : CONTACT_SUBJECT.find((c) => c.code === reason)?.label ?? "Contact";
  const lines = [`${label}`, `From: ${name}${organisation ? `, ${organisation}` : ""} <${email}>`, "", message];
  if (ENV.editorsInbox) await sendMail({ to: ENV.editorsInbox, replyTo: email, subject: `[${source === "advertise" ? "Advertise" : "Contact"}] ${label} — ${name}`, text: lines.join("\n"), html: htmlFrom(lines) });
  return json({ ok: true });
}
