import { randomUUID } from "node:crypto";
import { me, json } from "@/lib/server/guard";
import { dx } from "@/lib/server/directus";
import { ENV } from "@/lib/server/env";
import { sendMail } from "@/lib/server/mail";
import { notify } from "@/lib/server/member";
import { atDomain, isVerified, FREE_MAIL } from "@/lib/server/email-code";
import { COMPANIES } from "@/lib/content/directory";
import { SITE } from "@/lib/site";

/* Company claims. GET → this member's claims and the profiles that can still be claimed.
   POST {slug, email, role, note} → a pending claim for the directory editor (needs a verified
   work email at the company's domain). DELETE ?id= → withdraw a pending claim. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ClaimRow = { id: string; company_slug: string; work_email: string | null; status: string; editor_note: string | null; date_created: string };

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const mine = await dx.list<ClaimRow>("company_claims", { filter: { member: { _eq: ctx.m.id } }, sort: ["-date_created"], limit: 20 });
  const open = COMPANIES.filter((c) => !c.claimed).map((c) => ({ slug: c.slug, name: c.name, city: c.city, country: c.country, website: c.website ?? null }));
  return json({
    claims: mine.map((c) => ({ id: c.id, slug: c.company_slug, name: COMPANIES.find((x) => x.slug === c.company_slug)?.name ?? c.company_slug, email: c.work_email, status: c.status, note: c.editor_note, date: c.date_created })),
    open,
  });
}

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  if (ctx.m.company_slug) return json({ error: "Your account already manages a company profile." }, 409);
  const b = (await req.json().catch(() => ({}))) as { slug?: string; email?: string; role?: string; note?: string };
  const co = COMPANIES.find((c) => c.slug === b.slug);
  if (!co) return json({ error: "Choose a company from the directory." }, 400);
  if (co.claimed) return json({ error: "This profile is already managed. Contact the directory editor if that is wrong." }, 409);
  const email = String(b.email ?? "").trim().toLowerCase();
  /* With a website on file the email must be at its domain; without one, any company domain
     (never a free mailbox) — the editor checks it against the company before approving. */
  if (co.website ? !atDomain(email, co.website) : FREE_MAIL.includes(email.split("@")[1] ?? "")) return json({ error: "Use a work email at the company's own domain." }, 400);
  if (!(await isVerified(ctx.user.id, email, "claim"))) return json({ error: "Confirm the work email with the code first." }, 400);
  const pending = await dx.list<ClaimRow>("company_claims", { filter: { member: { _eq: ctx.m.id }, status: { _eq: "pending" } }, limit: 1 });
  if (pending[0]) return json({ error: "You already have a claim waiting for review." }, 409);
  const role = String(b.role ?? "").trim().slice(0, 80);
  const note = String(b.note ?? "").trim().slice(0, 1000);
  const id = randomUUID();
  await dx.create("company_claims", { id, member: ctx.m.id, company_slug: co.slug, work_email: email, work_email_verified: true, note: [role && `Role: ${role}`, note].filter(Boolean).join("\n\n") || null, status: "pending" });
  await notify(ctx.m.id, "company", `Your claim for ${co.name} was sent to the directory editor.`);
  if (ENV.editorsInbox) await sendMail({ to: ENV.editorsInbox, replyTo: email, subject: `Company claim: ${co.name}`, text: `${ctx.m.name || ctx.user.email} (${ctx.user.email}) asks to manage ${co.name}.\nVerified work email: ${email}\n${role ? `Role: ${role}\n` : ""}${note ? `\n${note}\n` : ""}\nProfile: ${SITE.url}/directory/${co.slug}/\nReview it in Directus → Company claims.` }).catch(() => {});
  return json({ ok: true, id });
}

export async function DELETE(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const row = await dx.get<ClaimRow & { member: string }>("company_claims", id).catch(() => null);
  if (!row || row.member !== ctx.m.id || row.status !== "pending") return json({ error: "Not found." }, 404);
  await dx.update("company_claims", id, { status: "withdrawn" });
  return json({ ok: true });
}
