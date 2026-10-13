"use client";

/* Small shared pieces for the account panels. Styling comes from board-acct.css. */
import { useState } from "react";

export const Head = ({ title, sub, actions }: { title: string; sub?: React.ReactNode; actions?: React.ReactNode }) => (
  <div className="phd">
    <div style={{ minWidth: 0 }}><h2 style={{ margin: 0, fontSize: "26px" }} className="h">{title}</h2>{sub && <p style={{ margin: "6px 0 0", lineHeight: 1.55 }} className="meta">{sub}</p>}</div>
    {actions && <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>{actions}</div>}
  </div>
);

export const Card = ({ children, style, id }: { children: React.ReactNode; style?: React.CSSProperties; id?: string }) => (
  <div className="panel" id={id} style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px", ...style }}>{children}</div>
);

export const Field = ({ id, label, children, hint, aside }: { id: string; label: string; children: React.ReactNode; hint?: React.ReactNode; aside?: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: 0 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}><label htmlFor={id} className="lbl">{label}</label>{aside}</div>
    {children}
    {hint && <span className="meta" style={{ fontSize: "11.5px" }}>{hint}</span>}
  </div>
);

const TONE = {
  red: ["var(--st-red-bg)", "var(--red-deep)"], amber: ["var(--st-review-bg)", "var(--st-review-fg)"], grey: ["var(--line)", "var(--slate)"],
  green: ["var(--st-current-bg)", "var(--up)"], dark: ["var(--ink)", "var(--on-ink)"],
} as const;
export type Tone = keyof typeof TONE;
export const Pill = ({ tone, children }: { tone: Tone; children: React.ReactNode }) => <span style={{ background: TONE[tone][0], color: TONE[tone][1] }} className="st">{children}</span>;

export const Chips = <K extends string>({ value, onChange, items, label }: { value: K; onChange: (k: K) => void; items: { k: K; label: string; n?: number }[]; label: string }) => (
  <div role="group" aria-label={label} className="chips">
    {items.map((it) => (
      <button key={it.k} type="button" aria-pressed={value === it.k} onClick={() => onChange(it.k)} className={`btn sm${value === it.k ? " dark" : ""}`}>{it.label}{it.n !== undefined && <span className="n">{it.n}</span>}</button>
    ))}
  </div>
);

/** Inline two-step confirm: first click arms, second click acts. No browser dialogs. */
export function ConfirmBtn({ label, confirm = "Confirm", onConfirm, danger, small }: { label: string; confirm?: string; onConfirm: () => void; danger?: boolean; small?: boolean }) {
  const [armed, setArmed] = useState(false);
  if (!armed) return <button type="button" className={`btn${small ? " sm" : ""}${danger ? " danger" : ""}`} onClick={() => setArmed(true)}>{label}</button>;
  return (
    <span style={{ display: "inline-flex", gap: "6px" }}>
      <button type="button" className={`btn${small ? " sm" : ""} ${danger ? "danger-solid" : "dark"}`} onClick={() => { setArmed(false); onConfirm(); }}>{confirm}</button>
      <button type="button" className={`btn${small ? " sm" : ""}`} onClick={() => setArmed(false)}>Cancel</button>
    </span>
  );
}

export const Empty = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: "1px dashed var(--line)", borderRadius: "12px", padding: "28px 20px", textAlign: "center", fontSize: "13.5px", fontWeight: 500, color: "var(--slate)" }}>{children}</div>
);

export const Toggle = ({ id, checked, onChange, label, hint }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) => (
  <label htmlFor={id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 0", borderTop: "1px solid var(--line)", cursor: "pointer" }}>
    <span style={{ flex: "1 1 auto" }}><span style={{ fontSize: "14px", fontWeight: 700, display: "block" }}>{label}</span>{hint && <span className="meta">{hint}</span>}</span>
    <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sw" />
  </label>
);
