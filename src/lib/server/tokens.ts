import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { ENV } from "./env";

/* Small signed tokens for email links (newsletter confirm / unsubscribe). */
export const randomToken = () => randomBytes(24).toString("base64url");
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const mac = (s: string) => createHmac("sha256", ENV.authSecret).update(s).digest("base64url");
/** A permanent unsubscribe token for an address: email + signature. */
export const unsubToken = (email: string) => `${Buffer.from(email).toString("base64url")}.${mac(`unsub:${email}`)}`;
export function readUnsub(t: string): string | null {
  const [e, sig] = t.split(".");
  if (!e || !sig) return null;
  const email = Buffer.from(e, "base64url").toString();
  const want = Buffer.from(mac(`unsub:${email}`)), got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got) ? email : null;
}
