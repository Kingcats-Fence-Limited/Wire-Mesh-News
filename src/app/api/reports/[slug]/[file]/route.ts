import { dx } from "@/lib/server/directus";
import { DIRECTUS_LIVE } from "@/lib/server/env";

/* Public files of a published report: its cover image and the free sample pages. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params;
  if (!DIRECTUS_LIVE || !["cover", "sample"].includes(file)) return new Response("Not found", { status: 404 });
  const r = (await dx.list<{ cover: string | null; sample: string | null }>("reports", { filter: { slug: { _eq: slug }, status: { _eq: "published" } }, fields: ["cover", "sample"], limit: 1 }))[0];
  const id = r?.[file as "cover" | "sample"];
  if (!id) return new Response("Not found", { status: 404 });
  const meta = await dx.file(id).catch(() => null);
  const res = await dx.asset(id, file === "cover" ? "width=800&format=webp&quality=80" : undefined);
  if (!meta || !res.ok || !res.body) return new Response("Not found", { status: 404 });
  return new Response(res.body, { headers: { "Content-Type": file === "cover" ? "image/webp" : meta.type, "Cache-Control": "public, max-age=3600, s-maxage=86400", "X-Content-Type-Options": "nosniff", ...(file === "sample" ? { "Content-Disposition": `inline; filename="${slug}-sample.pdf"` } : {}) } });
}
