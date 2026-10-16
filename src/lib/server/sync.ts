import "server-only";
import { randomUUID } from "node:crypto";
import { dx } from "./directus";
import { pool } from "./db";
import { limit } from "./rate-limit";
import { sendMail, htmlFrom } from "./mail";
import { ENV } from "./env";
import { auth, type SessionUser } from "@/lib/auth";
import { notify, sectionCode, type MemberRow, type SubRow } from "./member";
import { COMPANIES } from "@/lib/content/directory";
import { STANDARDS } from "@/lib/content/source";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";

/* The rules for every change the account centre can send. The browser proposes; this file
   decides. Each rule checks ownership, allowed fields, lengths and status transitions, then
   writes to Directus with the website-server token. Anything not listed here is refused. */

export type Change = { coll: string; op: "create" | "update" | "delete"; id?: string; data?: Record<string, unknown> };
type Ctx = { user: SessionUser; m: MemberRow; headers: Headers };

export class Refused extends Error {}
const no = (msg: string): never => { throw new Refused(msg); };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const URL_RE = /^https?:\/\/[^\s/]+\.[^\s]{2,}$/;

const s = (v: unknown, max: number, field: string, required = false): string | null => {
  if (v === undefined || v === null || v === "") { if (required) no(`${field} is required.`); return null; }
  if (typeof v !== "string") no(`${field} must be text.`);
  const t = (v as string).trim();
  if (t.length > max) no(`${field} is too long (max ${max} characters).`);
  if (required && !t) no(`${field} is required.`);
  return t || null;
};
const pick = <T extends object>(data: Record<string, unknown> | undefined, keys: (keyof T)[]) => Object.fromEntries(Object.entries(data ?? {}).filter(([k]) => keys.includes(k as keyof T)));
const newId = (id?: string) => (id && UUID.test(id) ? id : randomUUID());
const own = async <T extends { member?: string | null }>(coll: string, id: string | undefined, m: MemberRow): Promise<T> => {
  if (!id || !UUID.test(id)) no("Unknown item.");
  const row = await dx.get<T>(coll, id!).catch(() => null);
  if (!row || row.member !== m.id) no("Unknown item.");
  return row!;
};

/** Files referenced from drafts must be our own uploads, never pasted data URLs. */
function cleanDraft(d: unknown): Record<string, unknown> | null {
  if (!d || typeof d !== "object") return null;
  const json = JSON.stringify(d);
  if (json.length > 400_000) no("This draft is too large to save. Remove some text or files.");
  const draft = JSON.parse(json) as Record<string, unknown> & { files?: { url?: string }[] };
  if (Array.isArray(draft.files)) draft.files = draft.files.map((f) => ({ ...f, url: typeof f.url === "string" && /^\/api\/files\/[0-9a-f-]{36}\/$/.test(f.url) ? f.url : undefined }));
  return draft;
}

const words = (n: unknown) => (typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.min(Math.round(n), 100_000) : 0);

async function profile(c: Change, { m }: Ctx) {
  if (c.op !== "update") no("Not allowed.");
  const d = c.data ?? {};
  const patch: Record<string, unknown> = {};
  if ("name" in d) patch.name = s(d.name, 80, "Name", true);
  if ("jobTitle" in d) patch.job_title = s(d.jobTitle, 80, "Job title");
  if ("company" in d) patch.company_name = s(d.company, 120, "Company");
  if ("city" in d) patch.city = s(d.city, 80, "City");
  if ("country" in d) { const cc = s(d.country, 2, "Country"); if (cc && !COUNTRY_BY_CODE[cc]) no("Unknown country."); patch.country = cc; }
  if ("avatar" in d) {
    const v = d.avatar;
    if (v === null) patch.avatar = null;
    else {
      const id = typeof v === "string" ? v.match(/^\/api\/files\/([0-9a-f-]{36})\/$/)?.[1] : undefined;
      if (!id) no("Upload the photo again.");
      const f = await dx.file(id!).catch(() => null);
      if (!f || f.owner_member !== m.id || !/^image\//.test(f.type)) no("Upload the photo again.");
      await dx.updateFile(id!, { visibility: "public" });
      patch.avatar = id;
    }
  }
  if (Object.keys(patch).length) await dx.update("members", m.id, patch);
}

async function author(c: Change, { m }: Ctx) {
  if (c.op !== "update") no("Not allowed.");
  const d = c.data ?? {};
  const patch: Record<string, unknown> = {};
  if ("bio" in d) patch.author_bio = s(d.bio, 400, "Bio");
  if ("publicEmail" in d) { const e = s(d.publicEmail, 320, "Public email"); if (e && !EMAIL.test(e)) no("Public email is not valid."); patch.author_public_email = e; }
  for (const [k, col] of [["linkedin", "author_linkedin"], ["x", "author_x"], ["website", "author_website"]] as const) if (k in d) { const u = s(d[k], 255, k); if (u && !URL_RE.test(u)) no(`${k} must be a full https:// address.`); patch[col] = u; }
  if ("expertise" in d) { const e = d.expertise; if (!Array.isArray(e) || e.length > 5 || e.some((x) => typeof x !== "string" || x.length > 40)) no("Up to 5 expertise tags, 40 characters each."); patch.author_expertise = (e as string[]).map((x) => x.trim()).filter(Boolean); }
  if ("visible" in d) patch.author_visible = d.visible === true;
  if (Object.keys(patch).length) await dx.update("members", m.id, patch);
}

async function prefs(c: Change, { m }: Ctx) {
  if (c.op !== "update") no("Not allowed.");
  const keys = ["brief", "reviewResults", "commentReplies", "standardAlerts", "companyEnquiries", "productNews"];
  const next = { ...(m.prefs ?? {}) } as Record<string, boolean>;
  for (const [k, v] of Object.entries(c.data ?? {})) if (keys.includes(k) && typeof v === "boolean") next[k] = v;
  await dx.update("members", m.id, { prefs: next });
}

function readyToSubmit(kind: string, title: string | null, w: number) {
  if (!title || title.length < (kind === "letter" ? 5 : 10)) no("Add a title before sending.");
  if (kind === "letter" ? w < 30 || w > 300 : w < 100) no(kind === "letter" ? "Letters are 30 to 300 words." : "Articles need at least 100 words.");
}

async function submissions(c: Change, ctx: Ctx) {
  const { m } = ctx;
  const d = c.data ?? {};
  if (c.op === "create") {
    const kind = d.section === "Letters" ? "letter" : "article";
    const status = d.status === "pending" ? "pending" : "draft";
    const title = s(d.title, 200, "Title");
    const w = words(d.words);
    if (status === "pending") readyToSubmit(kind, title, w);
    const n = await limit(`sub-create:${m.id}`, 30, 86400);
    if (!n.ok) no("You have created many drafts today. Try again tomorrow.");
    await dx.create("submissions", {
      id: newId(c.id), member: m.id, kind, status,
      title: title === "Untitled draft" ? null : title, excerpt: s(d.excerpt, 4000, "Text"), words: w,
      section: kind === "letter" ? "letters_opinion" : sectionCode(d.section as string), draft: cleanDraft(d.draft),
      submitted_at: status === "pending" ? new Date().toISOString() : null,
    });
    if (status === "pending") await notify(m.id, "submission", `“${title}” was sent to the editors. A reply usually takes five working days.`);
    return;
  }
  const row = await own<SubRow & { member: string }>("submissions", c.id, m);
  if (c.op === "delete") {
    if (!["draft", "withdrawn"].includes(row.status)) no("Only drafts can be deleted.");
    await dx.remove("submissions", row.id);
    return;
  }
  /* update */
  const patch: Record<string, unknown> = {};
  const editable = ["draft", "changes_requested", "withdrawn"].includes(row.status);
  if (row.status === "published") {
    if ("pendingDraft" in d) patch.pending_draft = d.pendingDraft === undefined || d.pendingDraft === null ? null : cleanDraft(d.pendingDraft);
    if ("editPending" in d) {
      const want = d.editPending === true;
      if (want && !(patch.pending_draft ?? row.pending_draft)) no("Save the edit first.");
      patch.edit_pending = want;
      if (want && !row.edit_pending) await notify(m.id, "submission", `Your edit to “${row.title}” was sent to the editors. The live article stays as it is until it is approved.`);
    }
  } else if (editable) {
    if ("title" in d) patch.title = s(d.title, 200, "Title") === "Untitled draft" ? null : s(d.title, 200, "Title");
    if ("excerpt" in d) patch.excerpt = s(d.excerpt, 4000, "Text");
    if ("words" in d) patch.words = words(d.words);
    if ("section" in d && row.kind !== "letter") patch.section = sectionCode(d.section as string);
    if ("draft" in d) patch.draft = cleanDraft(d.draft);
  }
  if ("status" in d && d.status !== row.status) {
    const to = d.status as string;
    if (to === "pending" && editable) {
      readyToSubmit(row.kind, (patch.title as string | null | undefined) ?? row.title, (patch.words as number | undefined) ?? row.words ?? 0);
      Object.assign(patch, { status: "pending", submitted_at: new Date().toISOString(), editor_note: null, reviewed_at: null });
      await notify(m.id, "submission", `“${(patch.title as string) ?? row.title}” was sent to the editors. A reply usually takes five working days.`);
    } else if (to === "draft" && row.status === "pending") {
      Object.assign(patch, { status: "draft", submitted_at: null });
    } else no("That change is made by the editors.");
  } else if (!editable && row.status !== "published" && Object.keys(d).some((k) => k !== "updated")) {
    no(row.status === "pending" ? "The text is locked while the editors review it. Withdraw it to draft to change it." : "This submission can no longer be changed.");
  }
  if (Object.keys(patch).length) await dx.update("submissions", row.id, patch);
}

async function comments(c: Change, { m }: Ctx) {
  const row = await own<{ id: string; member: string; status: string; text: string }>("comments", c.id, m);
  if (c.op === "delete") { await dx.remove("comments", row.id); return; }
  if (c.op !== "update") no("Not allowed.");
  const text = s(c.data?.text, 1500, "Comment", true);
  if (text === row.text) return;
  if (row.status === "removed") no("This comment was removed by the editors.");
  await dx.update("comments", row.id, { text, status: "pending", reason: null });
}

async function bookmarks(c: Change, { m }: Ctx) {
  if (c.op === "delete") { const r = await own<{ id: string; member: string }>("bookmarks", c.id, m); await dx.remove("bookmarks", r.id); return; }
  if (c.op !== "create") no("Not allowed.");
  const href = s(c.data?.href, 255, "Link", true)!;
  if (!href.startsWith("/") || href.startsWith("//")) no("Unknown link.");
  const kind = ["article", "company", "standard", "event"].includes(c.data?.kind as string) ? (c.data!.kind as string) : "article";
  const dup = await dx.list<{ id: string }>("bookmarks", { filter: { member: { _eq: m.id }, href: { _eq: href } }, limit: 1 });
  if (dup.length) return;
  const n = await limit(`bm:${m.id}`, 200, 86400);
  if (!n.ok) no("Too many saves today.");
  await dx.create("bookmarks", { id: newId(c.id), member: m.id, kind, href, title: s(c.data?.title, 255, "Title"), meta: s(c.data?.meta, 120, "Meta") });
}

async function follows(c: Change, { m }: Ctx) {
  if (c.op === "delete") { const r = await own<{ id: string; member: string }>("standard_follows", c.id, m); await dx.remove("standard_follows", r.id); return; }
  if (c.op !== "create") no("Not allowed.");
  const slug = s(c.data?.slug, 120, "Standard", true)!;
  if (!STANDARDS.some((x) => x.slug === slug)) no("Unknown standard.");
  const dup = await dx.list<{ id: string }>("standard_follows", { filter: { member: { _eq: m.id }, standard_slug: { _eq: slug } }, limit: 1 });
  if (!dup.length) await dx.create("standard_follows", { id: newId(c.id), member: m.id, standard_slug: slug });
}

async function messages(c: Change, { m, user }: Ctx) {
  if (c.op === "delete") { const r = await own<{ id: string; member: string }>("enquiries", c.id, m); await dx.remove("enquiries", r.id); return; }
  if (c.op !== "create") no("Not allowed.");
  const d = c.data ?? {};
  const to = (d.to ?? {}) as { href?: string };
  const slug = to.href?.match(/^\/directory\/([a-z0-9-]+)\/$/)?.[1];
  const co = COMPANIES.find((x) => x.slug === slug && x.claimed);
  if (!co) no("This company does not accept messages yet.");
  const subject = s(d.subject, 200, "Subject", true)!;
  const body = s(d.body, 3000, "Message", true)!;
  if (!m.name) no("Add your name in Profile before contacting a company.");
  const n = await limit(`enquiry:${m.id}`, 5, 86400);
  if (!n.ok) no("You can contact up to 5 companies a day. Try again tomorrow.");
  const product = s(d.product, 160, "Product"), quantity = s(d.quantity, 80, "Quantity");
  await dx.create("enquiries", { id: newId(c.id), member: m.id, company_slug: co!.slug, company_name: co!.name, subject, body, product, quantity, status: "sent" });
  /* Companies' verified enquiry addresses move into Directus with the company profiles; until
     then the editors' inbox receives each enquiry and forwards it. */
  const lines = [`To: ${co!.name}`, `From: ${m.name}${m.job_title ? `, ${m.job_title}` : ""}${m.company_name ? `, ${m.company_name}` : ""} <${user.email}>`, `Subject: ${subject}`, product ? `Product: ${product}` : "", quantity ? `Quantity: ${quantity}` : "", "", body].filter((x) => x !== "");
  await sendMail({ to: ENV.editorsInbox, replyTo: user.email, subject: `[Enquiry] ${subject} → ${co!.name}`, text: lines.join("\n"), html: htmlFrom(lines) });
}

async function notices(c: Change, { m }: Ctx) {
  if (c.op === "create") return; // notices are written by the server only
  const r = await own<{ id: string; member: string }>("notifications", c.id, m);
  if (c.op === "delete") { await dx.remove("notifications", r.id); return; }
  const patch: Record<string, unknown> = {};
  if (typeof c.data?.read === "boolean") patch.read = c.data.read;
  if ("archived" in (c.data ?? {})) patch.archived = c.data?.archived === true;
  if (Object.keys(patch).length) await dx.update("notifications", r.id, patch);
}

async function sessions(c: Change, { user, headers }: Ctx) {
  if (c.op !== "delete") no("Not allowed.");
  const { rows } = await pool().query<{ token: string }>(`select token from "session" where id = $1 and "userId" = $2`, [c.id, user.id]);
  if (!rows[0]) return;
  await auth().api.revokeSession({ body: { token: rows[0].token }, headers });
}

async function companyReqs(c: Change, { m }: Ctx) {
  if (!m.company_slug) no("Only a claimed company can request changes.");
  if (c.op === "delete") {
    const rows = await dx.list<{ id: string }>("company_change_requests", { filter: { member: { _eq: m.id }, kind: { _eq: c.id }, status: { _eq: "pending" } }, limit: 5 });
    for (const r of rows) await dx.update("company_change_requests", r.id, { status: "withdrawn" });
    return;
  }
  if (c.op !== "create") no("Not allowed.");
  const kind = s(c.id, 40, "Field", true)!;
  if (!["orgType", "categories", "applications", "coverage", "notes", "cert"].includes(kind)) no("Unknown field.");
  const d = c.data ?? {};
  /* Evidence is an upload of this member's (the panel uploads first and sends the file id). */
  let evidence: string | null = null;
  if (typeof d.file === "string" && /^[0-9a-f-]{36}$/.test(d.file)) {
    const f = await dx.file(d.file).catch(() => null);
    if (!f || f.owner_member !== m.id) no("The evidence file could not be found. Attach it again.");
    evidence = d.file;
  }
  await dx.create("company_change_requests", { id: randomUUID(), member: m.id, company_slug: m.company_slug, kind, changes: { from: s(d.from, 2000, "Current"), to: s(d.to, 2000, "Requested", true) }, reason: s(d.reason, 2000, "Reason"), evidence, status: "pending" });
  await notify(m.id, "company", "Your change request was sent to the directory editor.");
}

async function account(c: Change, { m, user, headers }: Ctx) {
  if (c.op !== "update") no("Not allowed.");
  if (c.data?.deactivated === true && !m.deletion_requested_at) {
    await dx.update("members", m.id, { deletion_requested_at: new Date().toISOString() });
    await auth().api.revokeOtherSessions({ headers }).catch(() => {});
    await sendMail({ to: user.email, subject: "Your Wire Mesh News account will be deleted", text: "You asked us to delete your account. Your private data will be removed in 30 days. To keep the account, sign in before then and choose Cancel deletion in Account settings.", html: htmlFrom(["You asked us to delete your account. Your private data will be removed in 30 days.", "To keep the account, sign in before then and choose Cancel deletion in Account settings."]) }).catch(() => {});
  } else if (c.data?.deactivated === false && m.deletion_requested_at) {
    await dx.update("members", m.id, { deletion_requested_at: null });
  }
}

const RULES: Record<string, (c: Change, ctx: Ctx) => Promise<void>> = {
  profile, author, prefs, submissions, comments, bookmarks, follows, messages, notices, sessions, companyReqs, account,
};
/* Collections the client may hold but never writes: contacts, billing (payments not connected). */
const IGNORED = new Set(["contacts", "billing"]);

export async function applyChanges(changes: Change[], ctx: Ctx): Promise<string[]> {
  const errors: string[] = [];
  if (!Array.isArray(changes) || changes.length > 50) return ["Too many changes at once."];
  for (const c of changes) {
    if (!c || typeof c !== "object" || IGNORED.has(c.coll)) continue;
    const rule = RULES[c.coll];
    if (!rule) { errors.push("That change is not allowed."); continue; }
    try { await rule(c, ctx); }
    catch (e) { errors.push(e instanceof Refused ? e.message : "Could not save. Try again."); if (!(e instanceof Refused)) console.error("sync", c.coll, c.op, e); }
  }
  return errors;
}

export { pick };
