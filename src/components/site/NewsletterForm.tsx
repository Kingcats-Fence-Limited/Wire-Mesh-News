"use client";

import { useState } from "react";
import { clsx } from "clsx";

/**
 * Phase 1: client-side only (no backend). Shows the double-opt-in message
 * the real flow will send. Props let the same form sit on light or dark.
 */
export function NewsletterForm({ tone = "light", label = "Subscribe", compact, listName = "the weekly brief" }: { tone?: "light" | "dark"; label?: string; compact?: boolean; listName?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("sent");
  }
  if (state === "sent") {
    return <p className={clsx("text-[13.5px] font-bold", tone === "dark" ? "text-white" : "text-fg")}>Check your inbox — confirm the link to join {listName}. Nothing is sent until you do.</p>;
  }
  return (
    <form onSubmit={submit} className={clsx("flex w-full gap-2", compact ? "max-w-none" : "md:max-w-[440px]")} noValidate>
      <label htmlFor={`nl-${tone}-${label}`} className="sr-only">Email address</label>
      <input
        id={`nl-${tone}-${label}`}
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setState("idle");
        }}
        placeholder="Email address"
        aria-invalid={state === "error"}
        className={clsx(
          "min-h-[46px] min-w-0 flex-1 rounded-full border px-4 text-[14px] font-semibold outline-none focus:border-red",
          tone === "dark" ? "border-line-dark bg-dark-2 text-white placeholder:text-grey-5" : "border-line bg-bg text-fg placeholder:text-grey",
          state === "error" && "border-red",
        )}
      />
      <button type="submit" className={clsx("inline-flex min-h-[46px] shrink-0 items-center rounded-full px-5 text-[14px] font-extrabold transition-colors", tone === "dark" ? "bg-red text-white hover:bg-red-deep" : "bg-ink text-white hover:bg-red dark:bg-white dark:text-ink")}>{label}</button>
      {state === "error" && <span className="sr-only">Enter a valid email address</span>}
    </form>
  );
}
