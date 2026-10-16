import { timingSafeEqual } from "node:crypto";
import { AUTH_LIVE, ENV } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { notify, type MemberRow } from "@/lib/server/member";
import { sendMail, htmlFrom } from "@/lib/server/mail";
import { COMPANIES } from "@/lib/content/directory";
import { SITE } from "@/lib/site";

/* Called by a Directus Flow ("Event hook → Webhook") when an editor changes the status of a
   submission, comment, company claim or company change request. Directus sends
   { collection, keys: [...] } with the header x-wmn-hook: <DIRECTUS_HOOK_SECRET>. We re-read
   the items ourselves, so nothing in the body is trusted beyond the ids. Each decision
   becomes an account notice and, if the member allows it, an email. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ok = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
type Member = Pick<MemberRow, "id" | "email" | "name" | "prefs" | "roles" | "company_slug">;
const MEMBER_FIELDS = ["member.id", "member.email", "member.name", "member.prefs", "member.roles", "member.company_slug"];

async function tell(m: Member | null, kind: "submission" | "comment" | "company", pref: "reviewResults" | "commentReplies" | "companyEnquiries", subject: string, text: string, href?: string) {
  if (!m) return;
  await notify(m.id, kind, text, href);
  const wants = (m.prefs as Record<string, boolean> | null)?.[pref] ?? true;
  if (wants && m.email) await sendMail({ to: m.email, subject, text: `${text}\n\n${SITE.url}${href ?? "/account/"}\n\nChange which emails you get under Account settings.`, html: htmlFrom([text, `${SITE.url}${href ?? "/account/"}`, "Change which emails you get under Account settings."]) }).catch(() => {});
}

export async function POST(req: Request) {
  if (!AUTH_LIVE || !ENV.hookSecret) return new Response("Not found", { status: 404 });
  if (!ok(req.headers.get("x-wmn-hook") ?? "", ENV.hookSecret)) return new Response("Forbidden", { status: 403 });
  const b = (await req.json().catch(() => ({}))) as { collection?: string; keys?: string[]; key?: string };
  const keys = (b.keys ?? (b.key ? [b.key] : [])).filter((k) => typeof k === "string").slice(0, 50);

  for (const id of keys) {
    if (b.collection === "submissions") {
      const s = await dx.get<{ title: string | null; status: string; editor_note: string | null; published_href: string | null; member: Member | null }>("submissions", id, ["title", "status", "editor_note", "published_href", ...MEMBER_FIELDS]).catch(() => null);
      if (!s) continue;
      const t = `“${s.title || "Untitled"}”`;
      const msg = s.status === "published" ? `${t} is published.` : s.status === "changes_requested" ? `The editors returned ${t} — see the note on your submission.` : s.status === "rejected" ? `${t} was not accepted.${s.editor_note ? ` Note: ${s.editor_note}` : ""}` : null;
      if (msg) await tell(s.member, "submission", "reviewResults", `Your submission: ${s.status === "published" ? "published" : s.status === "changes_requested" ? "changes requested" : "not accepted"}`, msg, s.status === "published" && s.published_href ? s.published_href : "/account/#submissions");
      if (s.status === "published" && s.member && !(s.member.roles ?? []).includes("author")) await dx.update("members", s.member.id, { roles: [...new Set([...(s.member.roles ?? ["reader"]), "author"])] });
    } else if (b.collection === "comments") {
      const c = await dx.get<{ status: string; article_title: string | null; article_href: string | null; reason: string | null; member: Member | null }>("comments", id, ["status", "article_title", "article_href", "reason", ...MEMBER_FIELDS]).catch(() => null);
      if (!c || !["approved", "rejected"].includes(c.status)) continue;
      const msg = c.status === "approved" ? `Your comment on “${c.article_title}” is live.` : `Your comment on “${c.article_title}” was not approved.${c.reason ? ` Reason: ${c.reason}` : ""}`;
      await tell(c.member, "comment", "commentReplies", c.status === "approved" ? "Your comment is live" : "Your comment was not approved", msg, c.status === "approved" ? `${c.article_href ?? "/"}#comments` : "/account/#comments");
    } else if (b.collection === "company_claims") {
      const c = await dx.get<{ status: string; company_slug: string; editor_note: string | null; member: Member | null }>("company_claims", id, ["status", "company_slug", "editor_note", ...MEMBER_FIELDS]).catch(() => null);
      if (!c?.member || !["approved", "rejected"].includes(c.status)) continue;
      const name = COMPANIES.find((x) => x.slug === c.company_slug)?.name ?? c.company_slug;
      if (c.status === "approved") {
        /* Approval links the profile to the account. */
        await dx.update("members", c.member.id, { company_slug: c.company_slug, roles: [...new Set([...(c.member.roles ?? ["reader"]), "company"])] });
        await tell(c.member, "company", "companyEnquiries", `You now manage ${name}`, `Your claim for ${name} was approved. You can now edit the profile under My company.`, "/account/#company");
      } else {
        await tell(c.member, "company", "companyEnquiries", `Your claim for ${name}`, `Your claim for ${name} was not approved.${c.editor_note ? ` Note: ${c.editor_note}` : ""}`, "/account/#company");
      }
    } else if (b.collection === "tenders" || b.collection === "trade_case_updates") {
      /* Stamp the publish time once (alerts send what was published since the last email). */
      const t = await dx.get<{ status: string; published_at: string | null }>(b.collection, id, ["status", "published_at"]).catch(() => null);
      if (t?.status === "published" && !t.published_at) await dx.update(b.collection, id, { published_at: new Date().toISOString() });
    } else if (b.collection === "company_change_requests") {
      const r = await dx.get<{ status: string; kind: string; editor_note: string | null; member: Member | null }>("company_change_requests", id, ["status", "kind", "editor_note", ...MEMBER_FIELDS]).catch(() => null);
      if (!r || !["approved", "rejected"].includes(r.status)) continue;
      const what = r.kind === "profile_edit" ? "Your company profile edit" : "Your change request";
      await tell(r.member, "company", "companyEnquiries", `${what} was ${r.status === "approved" ? "approved" : "not accepted"}`, `${what} was ${r.status === "approved" ? "approved and is live" : "not accepted"}.${r.editor_note ? ` Note: ${r.editor_note}` : ""}`, "/account/#company");
    }
  }
  return Response.json({ ok: true });
}
