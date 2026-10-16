"use client";

/* Cloudflare Turnstile ("are you human") for forms that anyone can send. Renders nothing
   when no site key is configured. Usually invisible; shows a checkbox only when unsure. */
import { useEffect, useRef } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/live";

type TS = { render: (el: HTMLElement, o: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: TS } }

let loading: Promise<void> | null = null;
const load = () => (loading ??= new Promise<void>((resolve, reject) => {
  const s = document.createElement("script");
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  s.async = true;
  s.onload = () => resolve();
  s.onerror = () => { loading = null; reject(new Error("turnstile")); };
  document.head.appendChild(s);
}));

export function Turnstile({ onToken }: { onToken: (t: string | null) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const cb = useRef(onToken);
  cb.current = onToken;
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let id: string | null = null;
    let gone = false;
    load().then(() => {
      if (gone || !box.current || !window.turnstile) return;
      id = window.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: "interaction-only",
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(null),
        "error-callback": () => cb.current(null),
      });
    }).catch(() => cb.current(null));
    return () => { gone = true; if (id && window.turnstile) window.turnstile.remove(id); };
  }, []);
  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={box} style={{ marginBottom: "12px", minHeight: "0" }} />;
}
