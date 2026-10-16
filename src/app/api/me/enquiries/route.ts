import { me, json } from "@/lib/server/guard";
import { applyChanges } from "@/lib/server/sync";
import { ENQUIRY_SUBJECT } from "@/data/vocab/enquiry_subject";
import { PRODUCT_BY_CODE } from "@/data/vocab/product";
import { SURFACE_TREATMENT } from "@/data/vocab/surface_treatment";

/* "Contact this company" from the directory page: the same rules as the account centre
   (claimed companies only, 5 a day, name required), so it goes through applyChanges. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const cut = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const slug = cut(b.company, 120);
  const subject = ENQUIRY_SUBJECT.find((s) => s.code === b.subject)?.label ?? "Enquiry";
  const spec = [
    b.wire && `Wire diameter: ${cut(b.wire, 60)}`, b.opening && `Mesh opening: ${cut(b.opening, 60)}`,
    b.surface && `Surface: ${SURFACE_TREATMENT.find((s) => s.code === b.surface)?.labelEn ?? cut(b.surface, 40)}`, b.standard && `Standard: ${cut(b.standard, 60)}`,
    b.country && `Buyer country: ${cut(b.country, 2)}`, b.company_name && `Buyer company: ${cut(b.company_name, 160)}`,
  ].filter(Boolean).join("\n");
  const body = [cut(b.message, 2500), spec].filter(Boolean).join("\n\n");
  const product = b.product ? PRODUCT_BY_CODE[String(b.product)]?.labelEn ?? cut(b.product, 60) : undefined;
  const errors = await applyChanges([{ coll: "messages", op: "create", data: { to: { href: `/directory/${slug}/` }, subject, body, product, quantity: cut(b.qty, 80) || undefined } }], { user: ctx.user, m: ctx.m, headers: ctx.headers });
  if (errors.length) return json({ error: errors[0] }, 400);
  return json({ ok: true });
}
