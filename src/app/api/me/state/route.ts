import { me, json } from "@/lib/server/guard";
import { buildState, currentSessionToken } from "@/lib/server/member";

/* Everything the account centre shows, for the signed-in user only. */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const state = await buildState(ctx.user, ctx.m, await currentSessionToken(ctx.headers));
  return json({ state });
}
