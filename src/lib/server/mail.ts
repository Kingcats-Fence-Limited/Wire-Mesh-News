import "server-only";
import { appendFile } from "node:fs/promises";
import { ENV } from "./env";

/* Outgoing email through Resend's HTTP API (no SDK). Plain, short messages; every one has a
   text version. MAIL_SINK_FILE (local testing only) writes them to a file instead. */

export type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Minimal branded HTML from plain paragraphs. Text is escaped; only our own tags are HTML. */
export function htmlFrom(paragraphs: string[], code?: string) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px;font:15px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#15161c">${esc(p)}</p>`).join("");
  const box = code ? `<p style="margin:6px 0 18px;font:800 30px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:#15161c">${esc(code)}</p>` : "";
  return `<div style="max-width:520px;margin:0 auto;padding:24px"><p style="margin:0 0 18px;font:800 18px/1 Arial,sans-serif;color:#15161c">wire mesh <span style="background:#e5242f;color:#fff;padding:2px 6px;border-radius:5px">news</span></p>${box}${body}<p style="margin:22px 0 0;font:12px/1.5 Arial,sans-serif;color:#666b7c">Wire Mesh News · wiremeshnews.com</p></div>`;
}

export async function sendMail(m: Mail): Promise<void> {
  /* Never on Vercel: the sink exists only for local end-to-end tests. */
  if (ENV.mailSinkFile && !process.env.VERCEL) {
    await appendFile(ENV.mailSinkFile, JSON.stringify({ at: new Date().toISOString(), ...m }) + "\n");
    return;
  }
  if (!ENV.resendKey) throw new Error("Email is not configured (RESEND_API_KEY).");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${ENV.resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: ENV.mailFrom, to: [m.to], subject: m.subject, text: m.text, html: m.html, reply_to: m.replyTo }),
  });
  if (!res.ok) throw new Error(`Email failed (${res.status})`);
}

export const codeMail = (to: string, code: string, purpose: string): Mail => ({
  to,
  subject: `${code} is your Wire Mesh News code`,
  text: `Your code is ${code}\n\nUse it to ${purpose}. It expires in 5 minutes. If you did not ask for it, you can ignore this email.`,
  html: htmlFrom([`Use this code to ${purpose}. It expires in 5 minutes.`, "If you did not ask for it, you can ignore this email; nothing changes until the code is entered."], code),
});
