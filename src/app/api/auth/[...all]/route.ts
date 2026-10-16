import { toNextJsHandler } from "better-auth/next-js";
import { AUTH_LIVE } from "@/lib/server/env";
import { auth } from "@/lib/auth";

/* Better Auth's endpoints (/api/auth/*). Off — 404 — until accounts are configured. */
export const dynamic = "force-dynamic";

const off = () => Response.json({ error: "Accounts are not open yet." }, { status: 404 });

export async function GET(req: Request) {
  return AUTH_LIVE ? toNextJsHandler(auth()).GET(req) : off();
}
export async function POST(req: Request) {
  return AUTH_LIVE ? toNextJsHandler(auth()).POST(req) : off();
}
