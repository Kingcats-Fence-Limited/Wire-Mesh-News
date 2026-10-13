"use client";

/* Demo account store for the /account preview. Phase 1 has no backend: the server builds a
   seed from the site's own content, the browser keeps edits in localStorage so a reviewer
   can change things, reload and still see them, and "Reset demo data" goes back to the
   seed. Nothing leaves the browser. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type SubStatus = "draft" | "pending" | "changes_requested" | "rejected" | "published" | "withdrawn";
export type Submission = { id: string; title: string; status: SubStatus; section: string; updated: string; submitted?: string; reviewed?: string; note?: string; excerpt: string; href?: string; editPending?: boolean; words: number };
export type CommentStatus = "pending" | "approved" | "rejected" | "removed";
export type Comment = { id: string; text: string; status: CommentStatus; date: string; on: { title: string; href: string }; reason?: string };
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
};

const KEY = "wmn-demo-account";
const VERSION = 3;

type Toast = { id: number; text: string; undo?: () => void };
type Ctx = { d: Demo; set: (fn: (d: Demo) => Demo) => void; reset: () => void; toast: (text: string, undo?: () => void) => void; go: (panel: string) => void };
const C = createContext<Ctx | null>(null);
export const useDemo = () => { const c = useContext(C); if (!c) throw new Error("useDemo outside DemoProvider"); return c; };

export function DemoProvider({ seed, go, children }: { seed: Demo; go: (p: string) => void; children: React.ReactNode }) {
  const [d, setD] = useState<Demo>(seed);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const v = JSON.parse(raw) as Demo; if (v && v.v === VERSION) setD({ ...seed, ...v }); }
    } catch { /* storage blocked: stay on the seed */ }
    loaded.current = true;
  }, [seed]);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify({ ...d, profile: { ...d.profile, avatar: d.profile.avatar?.startsWith("blob:") ? null : d.profile.avatar } })); } catch { /* ignore */ }
  }, [d]);

  const toast = useCallback((text: string, undo?: () => void) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, undo }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), undo ? 6000 : 3800);
  }, []);
  const set = useCallback((fn: (d: Demo) => Demo) => setD((x) => fn(x)), []);
  const reset = useCallback(() => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setD(seed); toast("Demo data reset to the original sample."); }, [seed, toast]);

  return (
    <C.Provider value={{ d, set, reset, toast, go }}>
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
