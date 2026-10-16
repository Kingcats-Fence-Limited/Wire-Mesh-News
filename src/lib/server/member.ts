import "server-only";
import { randomUUID } from "node:crypto";
import { dx } from "./directus";
import { pool } from "./db";
import { auth, type SessionUser } from "@/lib/auth";
import { SECTION } from "@/data/vocab/section";
import { COMPANIES } from "@/lib/content/directory";
import { initials } from "@/lib/initials";
import type { Demo, Submission, Comment, Bookmark, Message, Notice, Session, SubStatus } from "@/components/boards/account/store";

/* The bridge between a signed-in user (Better Auth) and their data in Directus. Builds the
   same state shape the account centre already renders, so the UI is one code path for the
   preview and the live site. */

export type MemberRow = {
  id: string; auth_user_id: string; email: string | null; name: string | null; job_title: string | null; company_name: string | null;
  country: string | null; city: string | null; avatar: string | null; author_bio: string | null; author_public_email: string | null;
  author_linkedin: string | null; author_x: string | null; author_website: string | null; author_expertise: string[] | null; author_visible: boolean;
  prefs: Partial<Demo["prefs"]> | null; roles: string[] | null; company_slug: string | null; terms_accepted_at: string | null; deletion_requested_at: string | null;
  date_created: string;
};

export const DEFAULT_PREFS: Demo["prefs"] = { brief: false, reviewResults: true, commentReplies: true, standardAlerts: true, companyEnquiries: true, productNews: false };

export async function ensureMember(user: SessionUser): Promise<MemberRow> {
  const found = await dx.list<MemberRow>("members", { filter: { auth_user_id: { _eq: user.id } }, limit: 1 });
  if (found[0]) {
    const m = found[0];
    if (m.email !== user.email) await dx.update("members", m.id, { email: user.email });
    return { ...m, email: user.email };
  }
  return dx.create<MemberRow>("members", {
    id: randomUUID(),
    auth_user_id: user.id,
    email: user.email,
    name: (user.name ?? "").trim().slice(0, 80) || null,
    author_visible: true,
    prefs: DEFAULT_PREFS,
    roles: ["reader"],
    /* The sign-in screen states that continuing accepts the Terms and Privacy Policy. */
    terms_accepted_at: new Date().toISOString(),
  });
}

const dmy = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const dm = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const my = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
const dmyt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
export const fmt = (iso?: string | null) => (iso ? dmy.format(new Date(iso)) : undefined);
const fmtShort = (iso?: string | null) => (iso ? dm.format(new Date(iso)) : "");
const fmtTime = (iso?: string | null) => (iso ? dmyt.format(new Date(iso)).replace(",", "") : "");

export const sectionLabel = (code?: string | null) => (code ? SECTION.find((s) => s.code === code)?.label ?? code : "—");
export const sectionCode = (label?: string | null) => (label ? SECTION.find((s) => s.label === label || s.code === label)?.code ?? null : null);

type SubRow = { id: string; kind: string; status: SubStatus; title: string | null; excerpt: string | null; words: number | null; section: string | null; draft: Submission["draft"] | null; pending_draft: Submission["draft"] | null; edit_pending: boolean; editor_note: string | null; submitted_at: string | null; reviewed_at: string | null; published_href: string | null; date_updated: string | null; date_created: string };
type ComRow = { id: string; article_slug: string; article_title: string | null; article_href: string | null; text: string; status: Comment["status"]; reason: string | null; date_created: string; date_updated: string | null };
type BmRow = { id: string; kind: Bookmark["kind"]; href: string; title: string | null; meta: string | null; date_created: string };
type EnqRow = { id: string; company_slug: string; company_name: string | null; subject: string | null; body: string | null; product: string | null; quantity: string | null; status: Message["status"]; replied_at: string | null; date_created: string };
type NotRow = { id: string; kind: Notice["kind"]; text: string; href: string | null; read: boolean; archived: boolean; date_created: string };
type ReqRow = { id: string; kind: string; changes: { from?: string; to?: string } | null; reason: string | null; evidence: string | null; status: string; date_created: string };
type FollowRow = { id: string; standard_slug: string };

export const toSubmission = (r: SubRow): Submission => ({
  id: r.id,
  title: r.title || "Untitled draft",
  status: r.status,
  section: r.kind === "letter" ? "Letters" : sectionLabel(r.section),
  updated: fmt(r.date_updated ?? r.date_created) ?? "",
  submitted: fmt(r.submitted_at),
  reviewed: fmt(r.reviewed_at),
  note: r.editor_note ?? undefined,
  excerpt: r.excerpt ?? "",
  href: r.published_href ?? undefined,
  editPending: r.edit_pending || undefined,
  words: r.words ?? 0,
  draft: r.draft ?? undefined,
  pendingDraft: r.pending_draft ?? undefined,
});

function device(ua?: string | null) {
  const u = ua ?? "";
  const os = /iPhone|iPad/.test(u) ? "iOS" : /Android/.test(u) ? "Android" : /Mac OS X/.test(u) ? "macOS" : /Windows/.test(u) ? "Windows" : /Linux/.test(u) ? "Linux" : "Unknown device";
  const br = /Edg\//.test(u) ? "Edge" : /Chrome\//.test(u) ? "Chrome" : /Firefox\//.test(u) ? "Firefox" : /Safari\//.test(u) ? "Safari" : "Browser";
  return `${br} on ${os}`;
}
const maskIp = (ip?: string | null) => (ip ? (ip.includes(":") ? ip.split(":").slice(0, 3).join(":") + ":…" : ip.split(".").slice(0, 2).join(".") + ".x.x") : "Unknown location");

export async function sessionsFor(userId: string, currentToken?: string): Promise<Session[]> {
  const { rows } = await pool().query<{ id: string; token: string; userAgent: string | null; ipAddress: string | null; updatedAt: Date }>(
    `select id, token, "userAgent", "ipAddress", "updatedAt" from "session" where "userId" = $1 and "expiresAt" > now() order by "updatedAt" desc limit 20`, [userId]);
  return rows.map((r) => ({ id: r.id, device: device(r.userAgent), place: maskIp(r.ipAddress), last: fmtTime(r.updatedAt.toISOString()), current: r.token === currentToken || undefined }));
}

export async function buildState(user: SessionUser, m: MemberRow, currentToken?: string): Promise<Demo & { live: true; follows: { id: string; slug: string }[]; company: string | null; roles: string[] }> {
  const by = { member: { _eq: m.id } };
  const [subs, coms, bms, enqs, nots, reqs, follows, sessions] = await Promise.all([
    dx.list<SubRow>("submissions", { filter: by, sort: ["-date_updated", "-date_created"], limit: 200 }),
    dx.list<ComRow>("comments", { filter: { ...by, status: { _neq: "removed" } }, sort: ["-date_created"], limit: 200 }),
    dx.list<BmRow>("bookmarks", { filter: by, sort: ["-date_created"], limit: 500 }),
    dx.list<EnqRow>("enquiries", { filter: by, sort: ["-date_created"], limit: 200 }),
    dx.list<NotRow>("notifications", { filter: by, sort: ["-date_created"], limit: 200 }),
    dx.list<ReqRow>("company_change_requests", { filter: { ...by, status: { _eq: "pending" }, kind: { _neq: "profile_edit" } }, limit: 50 }),
    dx.list<FollowRow>("standard_follows", { filter: by, limit: 500 }),
    sessionsFor(user.id, currentToken),
  ]);
  const name = m.name ?? "";
  return {
    v: 6,
    live: true,
    profile: {
      name, initials: initials(name || user.email), avatar: m.avatar ? `/api/files/${m.avatar}/` : null, jobTitle: m.job_title ?? "", company: m.company_name ?? "",
      country: m.country ?? "", city: m.city ?? "", since: my.format(new Date(m.date_created)), email: user.email, pendingEmail: null,
    },
    author: { bio: m.author_bio ?? "", publicEmail: m.author_public_email ?? "", linkedin: m.author_linkedin ?? "", x: m.author_x ?? "", website: m.author_website ?? "", expertise: m.author_expertise ?? [], visible: m.author_visible },
    submissions: subs.map(toSubmission),
    comments: coms.map((c) => ({ id: c.id, text: c.text, status: c.status, date: fmt(c.date_updated ?? c.date_created) ?? "", on: { title: c.article_title ?? c.article_slug, href: c.article_href ?? "/", slug: c.article_slug }, reason: c.reason ?? undefined })),
    bookmarks: bms.map((b) => ({ id: b.id, kind: b.kind, title: b.title ?? b.href, href: b.href, meta: b.meta ?? "", saved: fmtShort(b.date_created) })),
    messages: enqs.map((e) => ({ id: e.id, subject: e.subject ?? "", to: { name: e.company_name ?? e.company_slug, href: `/directory/${e.company_slug}/` }, status: e.status, sent: fmt(e.date_created) ?? "", replied: fmt(e.replied_at), body: e.body ?? "", product: e.product ?? undefined, quantity: e.quantity ?? undefined })),
    notices: nots.map((n) => ({ id: n.id, text: n.text, date: fmtTime(n.date_created), read: n.read, archived: n.archived || undefined, kind: n.kind, href: n.href ?? undefined })),
    prefs: { ...DEFAULT_PREFS, ...(m.prefs ?? {}) },
    sessions,
    deactivated: !!m.deletion_requested_at,
    contacts: COMPANIES.filter((c) => c.claimed).map((c) => ({ name: c.name, href: `/directory/${c.slug}/` })),
    companyReqs: Object.fromEntries(reqs.map((r) => [r.kind, { id: r.id, field: r.kind, from: r.changes?.from ?? "", to: r.changes?.to ?? "", reason: r.reason ?? "", file: r.evidence ?? undefined, date: fmt(r.date_created) ?? "" }])),
    /* Payments are not connected yet: the panel shows "Pro opens soon" in live mode. */
    billing: { cycle: "monthly", nextCycle: null, cancelled: false, cancelReason: "", cards: [], defaultCard: "", details: { name, company: m.company_name ?? "", email: user.email, country: m.country ?? "", address: "", taxId: "" }, invoices: [] },
    follows: follows.map((f) => ({ id: f.id, slug: f.standard_slug })),
    company: m.company_slug,
    roles: m.roles ?? ["reader"],
  };
}

export async function notify(memberId: string, kind: Notice["kind"], text: string, href?: string) {
  await dx.create("notifications", { id: randomUUID(), member: memberId, kind, text: text.slice(0, 500), href: href ?? null, read: false, archived: false });
}

/** Session token of this request (to mark "this device" in the sessions list). */
export async function currentSessionToken(h: Headers): Promise<string | undefined> {
  const s = await auth().api.getSession({ headers: h });
  return (s?.session as { token?: string } | undefined)?.token;
}

export type { SubRow };
