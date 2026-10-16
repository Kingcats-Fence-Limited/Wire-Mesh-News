import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { readUnsub } from "@/lib/server/tokens";

/* One-click unsubscribe (GET from the email link, POST for List-Unsubscribe-Post). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function run(req: Request) {
  const u = new URL(req.url);
  const email = AUTH_LIVE ? readUnsub(u.searchParams.get("t") ?? "") : null;
  if (email) {
    const rows = await dx.list<{ id: string }>("newsletter_subscribers", { filter: { email: { _eq: email } }, limit: 1 });
    if (rows[0]) await dx.update("newsletter_subscribers", rows[0].id, { status: "unsubscribed" });
  }
  return req.method === "POST" ? new Response(null, { status: 204 }) : Response.redirect(`${u.origin}/subscribe/?unsubscribed=${email ? 1 : 0}`, 303);
}
export const GET = run;
export const POST = run;
