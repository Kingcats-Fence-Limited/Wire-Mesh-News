import { viewer, priv } from "@/lib/server/viewer";
import { getTemplate } from "@/lib/content/templates";

/* A Pro template's full text (free samples and preview mode: for everyone). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const t = getTemplate((await params).slug);
  if (!t) return priv({ error: "Not found." }, 404);
  const v = await viewer(req);
  if (!t.free && !v.pro) return priv({ locked: true, signedIn: !!v.user }, 402);
  return priv({ sections: t.sections });
}
