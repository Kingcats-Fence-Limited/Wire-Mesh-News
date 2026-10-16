import { toNextJsHandler } from "better-auth/next-js";
import { AUTH_LIVE } from "@/lib/server/env";
import { auth } from "@/lib/auth";

/* Better Auth's endpoints (/api/auth/*). Off — 404 — until accounts are configured.
   The site uses trailing slashes, so Next redirects /api/auth/x to /api/auth/x/ first;
   Better Auth's routes have no slash, so it is removed again here. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const off = () => Response.json({ error: "Accounts are not open yet." }, { status: 404 });

async function strip(req: Request): Promise<Request> {
  const u = new URL(req.url);
  if (!u.pathname.endsWith("/")) return req;
  u.pathname = u.pathname.replace(/\/+$/, "");
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer();
  return new Request(u, { method: req.method, headers: req.headers, body, redirect: "manual" });
}

export async function GET(req: Request) {
  return AUTH_LIVE ? toNextJsHandler(auth()).GET(await strip(req)) : off();
}
export async function POST(req: Request) {
  return AUTH_LIVE ? toNextJsHandler(auth()).POST(await strip(req)) : off();
}
