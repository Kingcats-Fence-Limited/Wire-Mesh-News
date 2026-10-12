"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";

type Field = {
  id: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  required?: boolean;
  options?: [string, string][];
  hint?: string;
  placeholder?: string;
};

/**
 * Phase 1 form: full UI, validation and states, no backend. Shows the
 * success / error / duplicate messages the real endpoint will return.
 */
export function FormDemo({ fields, submitLabel, successText, consent, note }: { fields: Field[]; submitLabel: string; successText: string; consent?: string; note?: string }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !vals[f.id]?.trim()) return setErr(`${f.label} is required.`);
      if (f.type === "email" && vals[f.id] && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals[f.id])) return setErr("Enter a valid email address.");
    }
    if (consent && !agree) return setErr("Please confirm the consent box.");
    setErr(null);
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-card border border-line bg-paper p-6">
        <div className="font-display text-[18px]">Sent</div>
        <p className="mt-1.5 text-[14px] font-medium leading-[1.6] text-fg-2">{successText}</p>
        <p className="meta mt-3 text-[11.5px]">Duplicate submissions within a short window are merged; failed notifications are logged and retried.</p>
      </div>
    );
  }

  const inp = "w-full min-h-[46px] rounded-input border border-line bg-bg px-3.5 text-[14.5px] font-semibold outline-none focus:border-red";
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {fields.map((f) => (
        <div key={f.id} className="flex flex-col gap-1.5">
          <label htmlFor={`f-${f.id}`} className="text-[11.5px] font-extrabold tracking-[0.08em] text-fg-3">{f.label.toUpperCase()}{f.required && " *"}</label>
          {f.type === "textarea" ? (
            <textarea id={`f-${f.id}`} rows={5} className={clsx(inp, "py-3 leading-[1.6]")} value={vals[f.id] ?? ""} onChange={(e) => setVals({ ...vals, [f.id]: e.target.value })} placeholder={f.placeholder} />
          ) : f.type === "select" ? (
            <select id={`f-${f.id}`} className={inp} value={vals[f.id] ?? ""} onChange={(e) => setVals({ ...vals, [f.id]: e.target.value })}>
              <option value="">Select…</option>
              {f.options?.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ) : (
            <input id={`f-${f.id}`} type={f.type ?? "text"} className={inp} value={vals[f.id] ?? ""} onChange={(e) => setVals({ ...vals, [f.id]: e.target.value })} placeholder={f.placeholder} />
          )}
          {f.hint && <span className="meta text-[11.5px]">{f.hint}</span>}
        </div>
      ))}
      {consent && (
        <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] font-medium leading-[1.55]">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#E5242F]" />
          <span>{consent} See the <Link href="/policies/privacy/" className="font-extrabold text-red-text underline">Privacy Policy</Link>.</span>
        </label>
      )}
      {err && <p role="alert" className="rounded-lg border-l-4 border-red bg-paper px-3 py-2 text-[13px] font-bold text-red-deep">{err}</p>}
      <button type="submit" className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 text-[15px] font-extrabold text-white hover:bg-red dark:bg-white dark:text-ink">{submitLabel}</button>
      {note && <p className="meta text-[11.5px] leading-[1.55]">{note}</p>}
    </form>
  );
}
