"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SubscribeCard } from "./SubscribeCard";

/*
 * Ads-S §appearance rules: first shown after the 3rd article in a week or at
 * 70% of an article; closed → 30 days; closed twice in a row → 180 days;
 * never for subscribers; never on phones (the in-article block covers them);
 * Esc and the scrim close; focus returns to where it was.
 */
const KEY = "wmn-submodal";
type S = { count: number; week: string; until?: string; closes: number; subscribed?: boolean };

function weekKey() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  return `${y}-${Math.floor((d.getTime() - start) / 604800000)}`;
}
function load(): S {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null") as S | null;
    if (s) return s;
  } catch {
    /* ignore */
  }
  return { count: 0, week: weekKey(), closes: 0 };
}
function save(s: S) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function SubscribeModal() {
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<string | undefined>();
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (window.innerWidth <= 600) return;
    const s = load();
    if (s.week !== weekKey()) {
      s.week = weekKey();
      s.count = 0;
    }
    s.count += 1;
    save(s);
    if (s.subscribed || (s.until && new Date(s.until).getTime() > Date.now())) return;

    let shown = false;
    const show = (why: string) => {
      if (shown) return;
      shown = true;
      restore.current = document.activeElement as HTMLElement | null;
      setPill(why);
      setOpen(true);
    };
    if (s.count >= 3) {
      show(`YOUR ${s.count === 3 ? "3RD" : `${s.count}TH`} ARTICLE THIS WEEK`);
      return;
    }
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h >= 0.7) show("YOU'RE 70% THROUGH THIS ARTICLE");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const first = document.querySelector<HTMLElement>(".submodal input");
    first?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = Array.from(document.querySelectorAll<HTMLElement>(".submodal a, .submodal button, .submodal input"));
        if (!nodes.length) return;
        const i = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && (i <= 0)) {
          e.preventDefault();
          nodes[nodes.length - 1].focus();
        } else if (!e.shiftKey && i === nodes.length - 1) {
          e.preventDefault();
          nodes[0].focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    const s = load();
    s.closes += 1;
    const days = s.closes >= 2 ? 180 : 30;
    s.until = new Date(Date.now() + days * 86400000).toISOString();
    save(s);
    setOpen(false);
    restore.current?.focus();
  }

  if (!open) return null;
  return createPortal(
    <div className="site b-ads submodal" role="dialog" aria-modal="true" aria-labelledby="sub-title">
      <button type="button" className="subscrim" aria-label="Close" onClick={close} />
      <SubscribeCard modal onClose={close} pill={pill} />
    </div>,
    document.body,
  );
}
