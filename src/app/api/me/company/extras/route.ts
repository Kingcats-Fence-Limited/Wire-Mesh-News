import { randomUUID } from "node:crypto";
import { me, json } from "@/lib/server/guard";
import { dx } from "@/lib/server/directus";
import { entitlement } from "@/lib/server/billing";
import { ENV } from "@/lib/server/env";
import { sendMail } from "@/lib/server/mail";

/* Company plan extras on the public profile: catalogue PDF, one video, up to 5 contacts.
   Each change goes to the directory editor; the approved version shows on the profile. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Row = { id: string; status: string; catalogue: string | null; video_url: string | null; contacts: Contact[] | null; editor_note: string | null; date_updated: string | null };
type Contact = { name: string; role: string; email: string; phone: string };
const videoOk = (u: string) => /^https:\/\/(www\.)?(youtube\.com\/watch\?v=[\w-]{6,}|youtu\.be\/[\w-]{6,}|vimeo\.com\/\d{5,})/.test(u);

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  if (!ctx.m.company_slug) return json({ error: "No company on this account." }, 404);
  const rows = await dx.list<Row>("company_extras", { filter: { company_slug: { _eq: ctx.m.company_slug } }, fields: ["id", "status", "catalogue", "video_url", "contacts", "editor_note", "date_updated"], sort: ["-date_created"], limit: 2 });
  return json({ current: rows.find((r) => r.status === "approved") ?? null, pending: rows.find((r) => r.status === "pending") ?? null, last: rows[0] ?? null });
}

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const slug = ctx.m.company_slug;
  if (!slug) return json({ error: "No company on this account." }, 404);
  if (!(await entitlement(ctx.m)).company) return json({ error: "Profile extras are part of the Company plan.", upgrade: true }, 402);
  const b = (await req.json().catch(() => ({}))) as { catalogue?: string | null; video_url?: string; contacts?: Partial<Contact>[] };
  if (b.catalogue) {
    if (!/^[0-9a-f-]{36}$/.test(b.catalogue)) return json({ error: "Bad file." }, 400);
    const f = await dx.file(b.catalogue).catch(() => null);
    if (!f || f.owner_member !== ctx.m.id || f.type !== "application/pdf") return json({ error: "Upload the catalogue as a PDF again." }, 400);
  }
  const video = String(b.video_url ?? "").trim();
  if (video && !videoOk(video)) return json({ error: "Use a YouTube or Vimeo link." }, 400);
  const contacts = (b.contacts ?? []).slice(0, 5).map((c) => ({ name: String(c.name ?? "").trim().slice(0, 80), role: String(c.role ?? "").trim().slice(0, 80), email: String(c.email ?? "").trim().toLowerCase().slice(0, 320), phone: String(c.phone ?? "").trim().slice(0, 40) })).filter((c) => c.name && (c.email || c.phone));
  if (contacts.some((c) => c.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email))) return json({ error: "Check the contact email addresses." }, 400);
  const pending = await dx.list<{ id: string }>("company_extras", { filter: { company_slug: { _eq: slug }, status: { _eq: "pending" } }, fields: ["id"], limit: 1 });
  const data = { member: ctx.m.id, company_slug: slug, status: "pending", catalogue: b.catalogue ?? null, video_url: video || null, contacts };
  if (pending[0]) await dx.update("company_extras", pending[0].id, data); else await dx.create("company_extras", { id: randomUUID(), ...data });
  if (ENV.editorsInbox) await sendMail({ to: ENV.editorsInbox, replyTo: ctx.user.email, subject: `Company profile extras: ${slug}`, text: `${ctx.m.name || ctx.user.email} sent profile extras for ${slug} (catalogue, video, contacts). Review in Directus → Company extras.` }).catch(() => {});
  return json({ ok: true });
}
