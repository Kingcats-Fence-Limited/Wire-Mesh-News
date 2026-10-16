import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { me, json } from "@/lib/server/guard";
import { dx, folderId } from "@/lib/server/directus";
import { limit } from "@/lib/server/rate-limit";

/* Uploads from the account centre. The type is decided from the file's own bytes, never its
   name. Images are re-encoded to WebP (which also drops EXIF and anything hidden in the
   file) and capped in size; SVG logos are turned into PNG; PDFs are checked for their header.
   Files are private until an editor approves the thing they belong to (avatars are public). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* Vercel caps request bodies at 4.5 MB; the browser scales big photos down before sending. */
const LIMITS = { avatar: 4, submission: 4, company: 4, evidence: 4 } as const; // MB
const FOLDER = { avatar: "website-avatars", submission: "website-submissions", company: "website-company", evidence: "website-company" } as const;
type Purpose = keyof typeof LIMITS;

function sniff(b: Buffer): "jpeg" | "png" | "webp" | "pdf" | "svg" | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP") return "webp";
  if (b.subarray(0, 5).toString("latin1") === "%PDF-") return "pdf";
  const head = b.subarray(0, 512).toString("utf8").trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(head)) return "svg";
  return null;
}

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const rl = await limit(`upload:${ctx.m.id}`, 60, 3600);
  if (!rl.ok) return json({ error: "Too many uploads this hour. Try again later." }, 429);

  const form = await req.formData().catch(() => null);
  const f = form?.get("file");
  const purpose = String(form?.get("purpose") ?? "") as Purpose;
  if (!(f instanceof File) || !(purpose in LIMITS)) return json({ error: "No file." }, 400);
  if (f.size > LIMITS[purpose] * 1024 * 1024) return json({ error: `Files up to ${LIMITS[purpose]} MB.` }, 413);

  const raw = Buffer.from(await f.arrayBuffer());
  const kind = sniff(raw);
  const allowed = purpose === "avatar" ? ["jpeg", "png", "webp"] : purpose === "company" ? ["jpeg", "png", "webp", "svg", "pdf"] : ["jpeg", "png", "webp", "pdf"];
  if (!kind || !allowed.includes(kind)) return json({ error: purpose === "avatar" ? "Use a JPG, PNG or WebP photo." : "Use JPG, PNG, WebP or PDF." }, 415);

  let out: Buffer, type: string, ext: string;
  try {
    if (kind === "pdf") { out = raw; type = "application/pdf"; ext = "pdf"; }
    else if (kind === "svg") { out = await sharp(raw, { density: 192 }).resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).png().toBuffer(); type = "image/png"; ext = "png"; }
    else {
      const max = purpose === "avatar" ? 800 : 2400;
      out = await sharp(raw, { limitInputPixels: 60_000_000 }).rotate().resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      type = "image/webp"; ext = "webp";
    }
  } catch {
    return json({ error: "That file could not be read." }, 422);
  }

  const id = randomUUID();
  const up = new FormData();
  const folder = await folderId(FOLDER[purpose]);
  if (folder) up.append("folder", folder);
  up.append("id", id);
  up.append("owner_member", ctx.m.id);
  up.append("visibility", purpose === "avatar" ? "public" : "private");
  up.append("title", `${purpose} upload`);
  up.append("file", new Blob([new Uint8Array(out)], { type }), `${purpose}-${id}.${ext}`);
  const file = await dx.upload(up);
  return json({ id: file.id, url: `/api/files/${file.id}/`, kind: kind === "pdf" ? "pdf" : "image" });
}
