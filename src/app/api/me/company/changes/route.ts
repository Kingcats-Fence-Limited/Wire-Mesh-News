import { randomUUID } from "node:crypto";
import { me, json } from "@/lib/server/guard";
import { dx } from "@/lib/server/directus";
import { ENV } from "@/lib/server/env";
import { sendMail } from "@/lib/server/mail";
import { notify } from "@/lib/server/member";
import { isVerified } from "@/lib/server/email-code";
import { limit } from "@/lib/server/rate-limit";
import { COMPANIES } from "@/lib/content/directory";

/* "Submit for review" on the company panel: one change request with every proposed value.
   The public profile is untouched until the directory editor approves it. Files referenced
   must be this member's own uploads. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ID = /^[0-9a-f-]{36}$/;
type Body = { changed?: string[]; values?: Record<string, unknown>; logo?: string | null; cards?: { product?: string; name?: string; spec?: string; keep?: number; photos?: string[] }[]; cert?: Record<string, string> | null };

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const co = COMPANIES.find((c) => c.slug === ctx.m.company_slug);
  if (!co) return json({ error: "No company on this account." }, 403);
  const rl = await limit(`cochange:${ctx.m.id}`, 10, 86400);
  if (!rl.ok) return json({ error: "Too many change requests today." }, 429);
  const raw = await req.text();
  if (raw.length > 60_000) return json({ error: "Too large." }, 413);
  const b = JSON.parse(raw || "{}") as Body;
  const changed = (b.changed ?? []).filter((x) => typeof x === "string").slice(0, 20);
  if (!changed.length) return json({ error: "Nothing changed." }, 400);

  const v = b.values ?? {};
  const email = typeof v.email === "string" ? v.email.trim().toLowerCase() : "";
  if (changed.includes("Contact details") && email && !(await isVerified(ctx.user.id, email, "company-email"))) return json({ error: "Verify the enquiry email with the code first." }, 400);

  const fileIds = [b.logo, ...(b.cards ?? []).flatMap((c) => c.photos ?? [])].filter((x): x is string => typeof x === "string");
  if (fileIds.some((x) => !ID.test(x))) return json({ error: "Bad file." }, 400);
  if (fileIds.length > 60) return json({ error: "Too many photos." }, 400);
  for (const id of fileIds) {
    const f = await dx.file(id).catch(() => null);
    if (!f || f.owner_member !== ctx.m.id) return json({ error: "A photo could not be found. Upload it again." }, 400);
  }
  const cards = (b.cards ?? []).slice(0, 30).map((c) => ({ product: String(c.product ?? "").slice(0, 60), name: String(c.name ?? "").slice(0, 60), spec: String(c.spec ?? "").slice(0, 90), keep: Math.max(0, Math.min(6, Number(c.keep) || 0)), photos: (c.photos ?? []).slice(0, 6) }));
  const changes = { changed, values: v, logo: b.logo ?? null, cards, cert: b.cert ?? null };
  if (JSON.stringify(changes).length > 50_000) return json({ error: "Too large." }, 413);

  const id = randomUUID();
  await dx.create("company_change_requests", { id, member: ctx.m.id, company_slug: co.slug, kind: "profile_edit", changes, status: "pending" });
  await notify(ctx.m.id, "company", `Your edit to ${co.name} (${changed.join(", ")}) was sent for review.`);
  if (ENV.editorsInbox) await sendMail({ to: ENV.editorsInbox, replyTo: ctx.user.email, subject: `Company profile edit: ${co.name}`, text: `${ctx.m.name || ctx.user.email} sent an edit to ${co.name}.\nChanged: ${changed.join(", ")}\nReview it in Directus → Company change requests.` }).catch(() => {});
  return json({ ok: true, id });
}
