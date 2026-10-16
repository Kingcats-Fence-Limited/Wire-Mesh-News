import { AUTH_LIVE } from "@/lib/server/env";
import { currentUser } from "@/lib/auth";
import { ensureMember } from "@/lib/server/member";
import { entitlement } from "@/lib/server/billing";
import { meterUsed, meterTake } from "@/lib/server/meter";
import { sameOrigin } from "@/lib/server/guard";
import { getArticle } from "@/lib/content/articles";
import { prepareBlocks } from "@/lib/article-prepare";
import { FREE_PREMIUM_PER_MONTH } from "@/lib/plans";

/* The full body of a Pro article.
   GET  → the body for Pro readers (and for Free readers who already opened it this month);
          otherwise what is left of the monthly allowance.
   POST → a Free reader uses one of the month's free Pro articles.
   Preview mode (accounts not live): the body is returned so the sample site stays readable. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const out = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });

async function load(req: Request, slug: string, consume: boolean) {
  const a = getArticle(slug);
  if (!a?.premium) return out({ error: "Not found." }, 404);
  const body = () => ({ blocks: prepareBlocks(a.body) });
  if (!AUTH_LIVE) return out({ access: "preview", ...body() });
  const user = await currentUser(req.headers).catch(() => null);
  if (!user) return out({ access: "signin", limit: FREE_PREMIUM_PER_MONTH });
  const m = await ensureMember(user);
  const ent = await entitlement(m);
  if (ent.pro) return out({ access: "pro", ...body() });
  if (consume) {
    const r = await meterTake(user.id, a.slug, FREE_PREMIUM_PER_MONTH);
    return r.ok ? out({ access: "meter", used: r.used, limit: FREE_PREMIUM_PER_MONTH, ...body() }) : out({ access: "limit", used: r.used, limit: FREE_PREMIUM_PER_MONTH });
  }
  /* Already opened this month: no new count. */
  const again = await meterTake(user.id, a.slug, 0);
  if (again.ok) return out({ access: "meter", used: again.used, limit: FREE_PREMIUM_PER_MONTH, ...body() });
  const used = await meterUsed(user.id);
  return out({ access: used >= FREE_PREMIUM_PER_MONTH ? "limit" : "offer", used, limit: FREE_PREMIUM_PER_MONTH });
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  return load(req, (await params).slug, false);
}
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (AUTH_LIVE && !sameOrigin(req)) return out({ error: "Bad origin." }, 403);
  return load(req, (await params).slug, true);
}
