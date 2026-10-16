import "server-only";
import { resolveMx, resolve4, resolve6 } from "node:dns/promises";

/* Checks an address before we send a confirmation email to it. It cannot prove a mailbox
   exists (only the confirmation click does); it stops the common bad cases early:
   - a domain with no mail server (typos such as "gmial.com", invented domains),
   - throwaway / disposable inboxes,
   - obvious typos of the big providers, with a "did you mean …" suggestion.
   A DNS timeout or server failure lets the address through: double opt-in still decides. */

export type EmailCheck = { ok: true; email: string } | { ok: false; error: string; suggestion?: string };

const SYNTAX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

/* The most used disposable-inbox domains. Not complete; extend as they show up. */
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "sharklasers.com", "grr.la", "10minutemail.com", "10minutemail.net",
  "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmail.net", "tempmailo.com", "tempr.email", "throwawaymail.com", "yopmail.com", "yopmail.net", "yopmail.fr",
  "getnada.com", "nada.email", "trashmail.com", "trashmail.de", "dispostable.com", "maildrop.cc", "mailnesia.com", "mintemail.com", "mohmal.com", "moakt.com",
  "fakeinbox.com", "emailondeck.com", "spamgourmet.com", "mailcatch.com", "inboxkitten.com", "burnermail.io", "33mail.com", "spambox.us", "tmail.ws", "tmpmail.org",
  "tmpmail.net", "mail.tm", "mailpoof.com", "dropmail.me", "linshiyouxiang.net", "bccto.me", "chacuo.net", "027168.com", "fakemail.net", "emailfake.com",
]);

/* Frequent misspellings of big providers → the intended domain. */
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gnail.com": "gmail.com", "gmaill.com": "gmail.com", "gmail.om": "gmail.com", "gmal.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com", "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com", "outllok.com": "outlook.com", "outlook.co": "outlook.com", "outlook.con": "outlook.com",
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com",
  "icloud.co": "icloud.com", "iclod.com": "icloud.com", "icoud.com": "icloud.com",
  "qq.co": "qq.com", "163.co": "163.com", "126.co": "126.com",
};

const withTimeout = <T,>(p: Promise<T>, ms: number) => Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), ms))]);

/** "yes" = accepts mail, "no" = the domain does not exist or has no mail server, "unknown" = DNS trouble. */
async function acceptsMail(domain: string): Promise<"yes" | "no" | "unknown"> {
  try {
    const mx = await withTimeout(resolveMx(domain), 3000);
    /* RFC 7505 "null MX" (a single "." record) = this domain never receives mail. */
    if (mx.length === 1 && (mx[0].exchange === "" || mx[0].exchange === ".")) return "no";
    if (mx.length) return "yes";
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code !== "ENODATA" && code !== "ENOTFOUND") return "unknown";
    if (code === "ENOTFOUND") return "no";
  }
  /* No MX record: mail falls back to the domain's own address (RFC 5321 §5.1). */
  try {
    const a = await withTimeout(resolve4(domain).catch(() => resolve6(domain)), 3000);
    return a.length ? "yes" : "no";
  } catch (e) {
    const code = (e as { code?: string }).code;
    return code === "ENODATA" || code === "ENOTFOUND" ? "no" : "unknown";
  }
}

/* Before calling a domain dead, make sure our own resolver works: if a domain that certainly
   has mail servers does not resolve either, DNS is broken here and we must not block anyone.
   The answer is kept for a minute. */
let probe: { at: number; ok: boolean } | null = null;
async function resolverWorks(): Promise<boolean> {
  if (probe && Date.now() - probe.at < 60_000) return probe.ok;
  const ok = await withTimeout(resolveMx("gmail.com"), 3000).then((r) => r.length > 0, () => false);
  probe = { at: Date.now(), ok };
  return ok;
}

/* Big providers always accept mail; no lookup needed. */
const KNOWN = new Set(["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "msn.com", "yahoo.com", "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com", "qq.com", "163.com", "126.com", "foxmail.com", "sina.com", "yandex.com", "gmx.com", "gmx.de", "web.de", "mail.ru", "zoho.com"]);

export async function checkEmail(raw: string): Promise<EmailCheck> {
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !SYNTAX.test(email)) return { ok: false, error: "Enter a valid email address." };
  const [local, domain] = [email.slice(0, email.lastIndexOf("@")), email.slice(email.lastIndexOf("@") + 1)];
  if (local.length > 64) return { ok: false, error: "Enter a valid email address." };
  const fix = TYPOS[domain];
  if (fix) return { ok: false, error: `Did you mean ${local}@${fix}?`, suggestion: `${local}@${fix}` };
  if (DISPOSABLE.has(domain) || [...DISPOSABLE].some((d) => domain.endsWith(`.${d}`))) return { ok: false, error: "Use a permanent email address; temporary inboxes cannot receive the brief." };
  if (!KNOWN.has(domain) && (await acceptsMail(domain)) === "no" && (await resolverWorks())) return { ok: false, error: `${domain} does not receive email. Check the address for typos.` };
  return { ok: true, email };
}
