"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { SocialGlyph } from "@/components/ui/SocialButton";

/** Reading progress bar fixed under the header + sticky title. */
export function ReadingProgress({ title }: { title: string }) {
  const [p, setP] = useState(0);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    function on() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      setShown(window.scrollY > 420);
    }
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className={clsx("fixed inset-x-0 top-0 z-[38] transition-transform", shown ? "translate-y-0" : "-translate-y-full")} aria-hidden="true">
      <div className="flex h-10 items-center border-b border-line bg-bg/95 backdrop-blur">
        <div className="wrap flex items-center gap-3">
          <span className="truncate text-[13px] font-extrabold">{title}</span>
          <span className="num ml-auto shrink-0 text-[11px] font-extrabold text-grey">{Math.round(p * 100)}%</span>
        </div>
      </div>
      <div className="h-[3px] bg-line"><div className="h-full bg-red" style={{ width: `${p * 100}%` }} /></div>
    </div>
  );
}

/** Pure-link share row: no SDKs. */
export function ShareRow({ url, title, tone = "light" }: { url: string; title: string; tone?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { id: "linkedin" as const, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { id: "x" as const, label: "Share on X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { id: "whatsapp" as const, label: "Share on WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
  ];
  const btn = clsx("inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border transition-colors hover:border-red hover:bg-red hover:text-white active:bg-red active:text-white", tone === "dark" ? "border-line-dark bg-dark-2 text-white" : "border-line bg-bg text-fg");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="num mr-1 text-[9.5px] font-extrabold tracking-[0.14em] text-grey">SHARE</span>
      {links.map((l) => (
        <a key={l.id} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} className={btn}><SocialGlyph id={l.id} size={14} /></a>
      ))}
      <a href={`mailto:?subject=${t}&body=${u}`} aria-label="Share by email" className={btn}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg>
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            /* ignore */
          }
        }}
        className={clsx("inline-flex min-h-[38px] items-center rounded-full border px-3.5 text-[12px] font-extrabold", tone === "dark" ? "border-line-dark text-white" : "border-line text-fg hover:border-ink")}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

/** Sticky table of contents with current-section highlight. */
export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [cur, setCur] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (es) => {
        const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setCur(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="On this page" className="text-[13px]">
      <div className="font-display mb-3 text-[12px] tracking-[0.1em] text-slate">ON THIS PAGE · {items.length}</div>
      <ol className="flex flex-col border-l border-line">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={clsx("-ml-px block border-l-2 py-1.5 pl-3.5 font-bold leading-[1.35] transition-colors", cur === i.id ? "border-red text-fg" : "border-transparent text-slate hover:text-fg")}>{i.text.replace(/^\d+\s·\s/, "")}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Mobile: TOC collapsed into one row. */
export function TocCollapsed({ items }: { items: { id: string; text: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-y border-line-soft bg-paper-2 lg:hidden">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="font-display text-[12px] tracking-[0.06em] text-slate">ON THIS PAGE · {items.length}</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" className={clsx("transition-transform", open && "rotate-180")}><path d="m5 9 7 7 7-7" /></svg>
      </button>
      {open && (
        <ol className="flex flex-col gap-2 px-4 pb-4">
          {items.map((i) => <li key={i.id}><a href={`#${i.id}`} onClick={() => setOpen(false)} className="text-[14px] font-bold">{i.text}</a></li>)}
        </ol>
      )}
    </div>
  );
}
