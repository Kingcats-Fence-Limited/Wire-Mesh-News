import "server-only";
import { timingSafeEqual } from "node:crypto";
import { AUTH_LIVE, ENV } from "./env";

/** Vercel Cron (and editors running a job by hand) send "Authorization: Bearer CRON_SECRET". */
export function cronAllowed(req: Request): boolean {
  if (!AUTH_LIVE || !ENV.cronSecret) return false;
  const got = req.headers.get("authorization") ?? "", want = `Bearer ${ENV.cronSecret}`;
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}
