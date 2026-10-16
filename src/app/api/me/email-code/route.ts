import { me, json } from "@/lib/server/guard";
import { limit } from "@/lib/server/rate-limit";
import { sendCode, checkCode, PURPOSES, type CodePurpose } from "@/lib/server/email-code";

/* POST {email, purpose}            → sends a code
   POST {email, purpose, code}      → checks it */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const b = (await req.json().catch(() => ({}))) as { email?: string; purpose?: string; code?: string };
  const email = String(b.email ?? "").trim().toLowerCase();
  const purpose = String(b.purpose ?? "") as CodePurpose;
  if (!EMAIL.test(email) || email.length > 320 || !(purpose in PURPOSES)) return json({ error: "Enter a valid email address." }, 400);
  if (b.code === undefined) {
    const rl = await limit(`ecode:${ctx.user.id}`, 5, 3600);
    if (!rl.ok) return json({ error: "Too many codes this hour. Try again later." }, 429);
    await sendCode(ctx.user.id, email, purpose);
    return json({ ok: true });
  }
  const r = await checkCode(ctx.user.id, email, purpose, String(b.code));
  if (r === "ok") return json({ ok: true });
  return json({ error: r === "wrong" ? "That code is not right. Check the latest email we sent." : r === "tries" ? "Too many wrong codes. Send a new one." : "That code has expired. Send a new one." }, 400);
}
