import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { currentUser } from "@/lib/auth";
import { ensureMember } from "@/lib/server/member";

/* Serves uploaded files from Directus without exposing Directus or its token. Public files
   (avatars, approved images) to anyone; private ones only to the member who uploaded them. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const nf = () => new Response("Not found", { status: 404 });

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!AUTH_LIVE) return nf();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return nf();
  const meta = await dx.file(id).catch(() => null);
  if (!meta) return nf();
  if (meta.visibility !== "public") {
    const user = await currentUser(req.headers);
    if (!user) return nf();
    const m = await ensureMember(user);
    if (meta.owner_member !== m.id) return nf();
  }
  const w = Number(new URL(req.url).searchParams.get("w"));
  const transform = meta.type.startsWith("image/") && [160, 320, 640, 1200].includes(w) ? `width=${w}&format=webp&quality=80` : undefined;
  const res = await dx.asset(id, transform);
  if (!res.ok || !res.body) return nf();
  return new Response(res.body, {
    headers: {
      "Content-Type": meta.type,
      "Cache-Control": meta.visibility === "public" ? "public, max-age=86400, stale-while-revalidate=604800" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      ...(meta.type === "application/pdf" ? { "Content-Disposition": `inline; filename="${meta.filename_download.replace(/[^\w.-]/g, "_")}"` } : {}),
    },
  });
}
