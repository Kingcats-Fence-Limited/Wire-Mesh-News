"use client";

import { useState, type ReactNode } from "react";

/* Generic board form: native required-field validation, then a success panel. Phase 1 has no backend; the submission is kept in memory only. */
export function SimpleForm({ children, success, className, style }: { children: ReactNode; success: ReactNode; className?: string; style?: React.CSSProperties }) {
  const [done, setDone] = useState(false);
  if (done) return <div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "28px", background: "#FFFFFF" }}>{success}</div>;
  return (
    <form className={className} style={style} onSubmit={(e) => { e.preventDefault(); if ((e.currentTarget as HTMLFormElement).reportValidity()) setDone(true); }}>
      {children}
    </form>
  );
}
