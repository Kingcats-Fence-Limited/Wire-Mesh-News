import "server-only";
import { ENV } from "./env";

/* Cloudflare Turnstile check for anonymous forms (contact, newsletter). When no secret is
   configured the check is skipped, so forms keep working in testing. */
export async function humanCheck(token: string | null | undefined, ip?: string): Promise<boolean> {
  if (!ENV.turnstileSecret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret: ENV.turnstileSecret, response: token, ...(ip ? { remoteip: ip } : {}) });
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = (await r.json()) as { success?: boolean };
    return !!j.success;
  } catch {
    return false;
  }
}
