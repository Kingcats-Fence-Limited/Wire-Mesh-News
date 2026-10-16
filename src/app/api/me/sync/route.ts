import { me, json } from "@/lib/server/guard";
import { applyChanges, type Change } from "@/lib/server/sync";
import { buildState, ensureMember, currentSessionToken } from "@/lib/server/member";
import { limit } from "@/lib/server/rate-limit";

/* The account centre sends what changed; the server applies what is allowed (src/lib/server/sync.ts)
   and answers with the fresh state, so the screen always shows what is really saved. */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const rl = await limit(`sync:${ctx.m.id}`, 240, 600);
  if (!rl.ok) return json({ error: "Too many changes. Wait a moment." }, 429);
  const body = (await req.json().catch(() => null)) as { changes?: Change[] } | null;
  const errors = await applyChanges(body?.changes ?? [], ctx);
  const m = await ensureMember(ctx.user);
  return json({ errors, state: await buildState(ctx.user, m, await currentSessionToken(ctx.headers)) });
}
