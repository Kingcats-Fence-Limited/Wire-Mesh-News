import "server-only";
import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { pool } from "./db";
import { ENV } from "./env";
import { sendMail, codeMail } from "./mail";

/* Codes that prove a member controls a second inbox (a company work email for a claim, or the
   enquiry address on a company profile). Separate from sign-in codes. Hashed at rest, 5
   minutes, 5 tries; a verified address stays usable for an hour. */
export const PURPOSES = { claim: "confirm your work email for the company claim", "company-email": "confirm that this inbox belongs to the company" } as const;
export type CodePurpose = keyof typeof PURPOSES;

const hash = (code: string, id: string) => createHash("sha256").update(`${ENV.authSecret}:${id}:${code}`).digest();

export async function sendCode(userId: string, email: string, purpose: CodePurpose) {
  const id = randomUUID();
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await pool().query(`delete from wmn_email_code where user_id = $1 and purpose = $2 and verified_at is null`, [userId, purpose]);
  await pool().query(`insert into wmn_email_code (id, user_id, email, purpose, code_hash, expires_at) values ($1, $2, $3, $4, $5, now() + interval '5 minutes')`, [id, userId, email, purpose, hash(code, id).toString("hex")]);
  await sendMail(codeMail(email, code, PURPOSES[purpose]));
}

export async function checkCode(userId: string, email: string, purpose: CodePurpose, code: string): Promise<"ok" | "wrong" | "expired" | "tries"> {
  const { rows } = await pool().query<{ id: string; code_hash: string; attempts: number; expired: boolean }>(
    `select id, code_hash, attempts, expires_at < now() as expired from wmn_email_code where user_id = $1 and email = $2 and purpose = $3 and verified_at is null order by expires_at desc limit 1`, [userId, email, purpose]);
  const r = rows[0];
  if (!r || r.expired) return "expired";
  if (r.attempts >= 5) return "tries";
  const ok = /^\d{6}$/.test(code) && timingSafeEqual(Buffer.from(r.code_hash, "hex"), hash(code, r.id));
  if (!ok) { await pool().query(`update wmn_email_code set attempts = attempts + 1 where id = $1`, [r.id]); return "wrong"; }
  await pool().query(`update wmn_email_code set verified_at = now() where id = $1`, [r.id]);
  return "ok";
}

/** Was this address verified by this member, for this purpose, in the last hour? */
export async function isVerified(userId: string, email: string, purpose: CodePurpose) {
  const { rowCount } = await pool().query(`select 1 from wmn_email_code where user_id = $1 and email = $2 and purpose = $3 and verified_at > now() - interval '1 hour' limit 1`, [userId, email, purpose]);
  return (rowCount ?? 0) > 0;
}

export const FREE_MAIL = ["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com", "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com", "qq.com", "163.com", "126.com", "sina.com", "foxmail.com", "yandex.ru", "mail.ru", "gmx.com"];
export const domainOf = (url?: string | null) => (url ?? "").replace(/^https?:\/\/(www\.)?/i, "").split(/[/?#:]/)[0].toLowerCase();
/** A work email at the company's own domain (or a subdomain of it). */
export function atDomain(email: string, website?: string | null) {
  const d = domainOf(website), m = email.split("@")[1]?.toLowerCase() ?? "";
  return !!d && !!m && !FREE_MAIL.includes(m) && (m === d || m.endsWith(`.${d}`));
}
