"use client";

/* Demo account store for the /account preview. Phase 1 has no backend: the server builds a
   seed from the site's own content, the browser keeps edits in localStorage so a reviewer
   can change things, reload and still see them, and "Reset demo data" goes back to the
   seed. Nothing leaves the browser. */
import type { ArticleDraft } from "@/components/editor/ArticleEditor";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type SubStatus = "draft" | "pending" | "changes_requested" | "rejected" | "published" | "withdrawn";
export type Submission = { id: string; title: string; status: SubStatus; section: string; updated: string; submitted?: string; reviewed?: string; note?: string; excerpt: string; href?: string; editPending?: boolean; words: number; draft?: ArticleDraft;
  /** Published pieces only: the proposed new version. The live record above stays as it is until the editors approve it. */
  pendingDraft?: ArticleDraft };
export type CommentStatus = "pending" | "approved" | "rejected" | "removed";
export type Comment = { id: string; text: string; status: CommentStatus; date: string; on: { title: string; href: string; slug?: string; section?: string; date?: string }; reason?: string };
export type Bookmark = { id: string; kind: "article" | "company" | "standard" | "event"; title: string; href: string; meta: string; saved: string };
export type MsgStatus = "awaiting_reply" | "replied" | "no_reply" | "sent";
export type Message = { id: string; subject: string; to: { name: string; href: string }; status: MsgStatus; sent: string; replied?: string; body: string; product?: string; quantity?: string };
export type Notice = { id: string; text: string; date: string; read: boolean; archived?: boolean; kind: "submission" | "comment" | "company" | "billing" | "standard"; href?: string };
export type Session = { id: string; device: string; place: string; last: string; current?: boolean };

export type Demo = {
  v: number;
  profile: { name: string; initials: string; avatar: string | null; jobTitle: string; company: string; country: string; city: string; since: string; email: string; pendingEmail: string | null };
  author: { bio: string; publicEmail: string; linkedin: string; x: string; website: string; expertise: string[]; visible: boolean };
  submissions: Submission[];
  comments: Comment[];
  bookmarks: Bookmark[];
  messages: Message[];
  notices: Notice[];
  prefs: { brief: boolean; reviewResults: boolean; commentReplies: boolean; standardAlerts: boolean; companyEnquiries: boolean; productNews: boolean };
  sessions: Session[];
  deactivated: boolean;
  /** Claimed companies that accept messages (recipients for the composer). */
  contacts: { name: string; href: string }[];
  /** Change requests for editor-kept company fields, keyed by field. */
  companyReqs?: Record<string, { id: string; field: string; from: string; to: string; reason: string; file?: string; date: string }>;
  billing: Billing;
};

export type BillingDetails = { name: string; company: string; email: string; country: string; address: string; taxId: string };
export type Invoice = { no: string; date: string; period: string; billedTo: BillingDetails };
export type Billing = {
  cycle: "monthly" | "annual";
  /** A cycle change takes effect at the next renewal. */
  nextCycle: "monthly" | "annual" | null;
  cancelled: boolean;
  cancelReason: string;
  cards: { id: string; brand: string; last4: string; exp: string }[];
  defaultCard: string;
  details: BillingDetails;
  invoices: Invoice[];
};

const KEY = "wmn-demo-account";
const VERSION = 6;

type Toast = { id: number; text: string; undo?: () => void };
type Ctx = { d: Demo; set: (fn: (d: Demo) => Demo) => void; reset: () => void; toast: (text: string, undo?: () => void) => void; go: (panel: string) => void; epoch: number };
const C = createContext<Ctx | null>(null);
export const useDemo = () => { const c = useContext(C); if (!c) throw new Error("useDemo outside DemoProvider"); return c; };

export function DemoProvider({ seed, go, children }: { seed: Demo; go: (p: string) => void; children: React.ReactNode }) {
  const [d, setD] = useState<Demo>(seed);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const loaded = useRef(false);

  const [epoch, setEpoch] = useState(0);
  const full = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = restore(JSON.parse(raw), seed);
        if (v) setD(v); else localStorage.removeItem(KEY);
      }
    } catch { try { localStorage.removeItem(KEY); } catch { /* storage blocked: stay on the seed */ } }
    loaded.current = true;
  }, [seed]);

  const toast = useCallback((text: string, undo?: () => void) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, undo }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), undo ? 6000 : 3800);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...d, profile: { ...d.profile, avatar: d.profile.avatar?.startsWith("blob:") ? null : d.profile.avatar } }));
      full.current = false;
    } catch {
      /* Usually the browser's storage quota (large images). Say so once instead of pretending it saved. */
      if (!full.current) toast("This browser’s storage is full, so recent changes will be lost on reload. Remove some images or reset the demo data.");
      full.current = true;
    }
  }, [d, toast]);

  const set = useCallback((fn: (d: Demo) => Demo) => setD((x) => fn(x)), []);
  const reset = useCallback(() => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setD(seed); setEpoch((n) => n + 1); toast("Demo data reset to the original sample."); }, [seed, toast]);

  return (
    <C.Provider value={{ d, set, reset, toast, go, epoch }}>
      {children}
      <div aria-live="polite" style={{ position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)", zIndex: 70, display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", width: "min(92vw, 520px)", pointerEvents: "none" }}>
        {toasts.map((t) => (
          <div key={t.id} role="status" style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: "14px", background: "var(--ink)", color: "var(--on-ink)", borderRadius: "12px", padding: "11px 16px", fontSize: "13px", fontWeight: 600, lineHeight: 1.45, boxShadow: "0 10px 30px rgba(0,0,0,.25)", width: "100%", boxSizing: "border-box" }}>
            <span style={{ flex: "1 1 auto" }}>{t.text}</span>
            {t.undo && <button type="button" onClick={() => { t.undo!(); setToasts((x) => x.filter((y) => y.id !== t.id)); }} style={{ border: 0, background: "none", color: "#FF4A54", fontFamily: "inherit", fontWeight: 800, fontSize: "13px", cursor: "pointer", padding: "4px 0" }}>Undo</button>}
          </div>
        ))}
      </div>
    </C.Provider>
  );
}

/* Stored data is only trusted if every top-level field has the same kind of value as the
   seed (array, object, string …). Anything else — an older shape, a hand-edited value —
   falls back to the seed instead of crashing the page. */
function restore(v: unknown, seed: Demo): Demo | null {
  if (!v || typeof v !== "object" || (v as Demo).v !== VERSION) return null;
  const kind = (x: unknown) => (Array.isArray(x) ? "array" : x === null ? "null" : typeof x);
  const out: Record<string, unknown> = { ...seed };
  for (const [k, sv] of Object.entries(seed)) {
    const val = (v as Record<string, unknown>)[k];
    if (val === undefined) continue;
    const ok = kind(val) === kind(sv) || (sv === null || sv === undefined) || (k === "companyReqs" && kind(val) === "object");
    if (!ok) return null;
    if (kind(sv) === "object" && sv) {
      for (const [k2, sv2] of Object.entries(sv as object)) {
        const v2 = (val as Record<string, unknown>)[k2];
        if (v2 !== undefined && sv2 !== null && v2 !== null && kind(v2) !== kind(sv2)) return null;
      }
      out[k] = { ...(sv as object), ...(val as object) };
    } else out[k] = val;
  }
  const arraysOfObjects = ["submissions", "comments", "bookmarks", "messages", "notices", "sessions", "contacts"] as const;
  if (arraysOfObjects.some((k) => !(out[k] as unknown[]).every((x) => x && typeof x === "object" && typeof (x as { id?: unknown; name?: unknown }).id !== "number"))) return null;
  /* Links come back from storage too: only same-site paths are accepted. */
  const hrefsOk = (x: unknown): boolean => Array.isArray(x) ? x.every(hrefsOk) : x && typeof x === "object"
    ? Object.entries(x).every(([k, v]) => (k === "href" ? v === undefined || (typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !v.includes("\\")) : hrefsOk(v)))
    : true;
  if (!hrefsOk(out)) return null;
  return out as Demo;
}

/** Real file download from the browser (used for "Export record" and "Download my data"). */
export function download(name: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const today = () => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date());
export const uid = () => Math.random().toString(36).slice(2, 9);
export { VERSION as DEMO_VERSION };
