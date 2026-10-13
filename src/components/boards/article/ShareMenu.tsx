"use client";

/* Share button in the article header. Phones get the system share sheet; elsewhere a small
   menu opens in place with the same channels as the share row at the foot of the article.
   Links only: no share SDKs or tracking pixels are loaded. */
import { useEffect, useRef, useState } from "react";
import { SocialGlyph } from "@/components/ui/SocialButton";

export function ShareMenu({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const enc = encodeURIComponent;
  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const click = async () => {
    const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (touch && navigator.share) { try { await navigator.share({ title, url }); return; } catch { /* cancelled: fall back to the menu */ } }
    setOpen((o) => !o);
  };
  const copy = () => navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  const items: { label: string; href: string; icon: React.ReactNode }[] = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, icon: <SocialGlyph id="linkedin" size={15} /> },
    { label: "X", href: `https://x.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`, icon: <SocialGlyph id="x" size={14} /> },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, icon: <SocialGlyph id="whatsapp" size={16} /> },
    { label: "Email", href: `mailto:?subject=${enc(title)}&body=${enc(url)}`, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg> },
  ];
  return (
    <div ref={box} style={{ position: "relative" }}>
      <button type="button" className="icobtn gh" aria-haspopup="menu" aria-expanded={open} onClick={click}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v7h16v-7M12 16V3M8 7l4-4 4 4" /></svg>Share
      </button>
      {open && (
        <div role="menu" className="sharemenu">
          <div className="sharemenu-hd">Share this article</div>
          {items.map((i) => (
            <a key={i.label} role="menuitem" href={i.href} target={i.label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" onClick={() => setOpen(false)}><span className="ic">{i.icon}</span>{i.label}</a>
          ))}
          <button type="button" role="menuitem" onClick={copy}><span className="ic"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg></span>{copied ? "Link copied" : "Copy link"}</button>
        </div>
      )}
    </div>
  );
}
