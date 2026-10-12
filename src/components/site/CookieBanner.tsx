"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";

/**
 * Cookie consent (Cookie-Z). Accept all and Reject all are equally
 * prominent; no pre-ticked boxes; no close ✕. Choice is stored with a
 * version so a policy change can re-ask. Nothing non-essential loads
 * before a choice — Phase 1 has no such scripts anyway.
 */
const KEY = "wmn-consent";
const VERSION = 1;

type Consent = { v: number; necessary: true; analytics: boolean; media: boolean; ads: false; at: string };

const EVT = "wmn:open-cookie-settings";

export function CookieSettingsButton({ className, children = "Cookie settings" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(EVT))}>
      {children}
    </button>
  );
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [media, setMedia] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const c: Consent | null = raw ? JSON.parse(raw) : null;
      if (!c || c.v !== VERSION) setVisible(true);
      else {
        setAnalytics(c.analytics);
        setMedia(c.media);
      }
    } catch {
      setVisible(true);
    }
    function openSettings() {
      setManage(true);
      setVisible(true);
    }
    window.addEventListener(EVT, openSettings);
    return () => window.removeEventListener(EVT, openSettings);
  }, []);

  function save(a: boolean, m: boolean) {
    const c: Consent = { v: VERSION, necessary: true, analytics: a, media: m, ads: false, at: new Date().toISOString() };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
    setAnalytics(a);
    setMedia(m);
    setVisible(false);
    setManage(false);
  }

  if (!visible) return null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cookie-title" className="fixed inset-x-0 bottom-0 z-[35] p-3 md:p-5">
      <div className="mx-auto max-w-[1240px] rounded-card-lg border border-line bg-bg shadow-[0_-10px_40px_rgba(21,22,28,.18)] dark:border-line-dark">
        {!manage ? (
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-8 md:p-6">
            <div className="flex-1">
              <div id="cookie-title" className="font-display text-[17px]">Cookies on Wire Mesh News</div>
              <p className="mt-1 text-[13.5px] font-medium leading-[1.6] text-slate">
                We use necessary cookies to run the site. With your consent we also use analytics to see which articles are read and allow embedded media from third parties. No advertising tracking is used. <Link href="/policies/cookie-policy/" className="font-extrabold text-red-text">Cookie policy</Link>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 md:flex md:shrink-0">
              <button type="button" onClick={() => save(false, false)} className="inline-flex min-h-[46px] items-center justify-center rounded-full border-[1.5px] border-ink px-5 text-[14px] font-extrabold hover:border-red hover:text-red-text dark:border-white">Reject all</button>
              <button type="button" onClick={() => save(true, true)} className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-ink px-5 text-[14px] font-extrabold text-white hover:bg-red dark:bg-white dark:text-ink">Accept all</button>
              <button type="button" onClick={() => setManage(true)} className="col-span-2 inline-flex min-h-[44px] items-center justify-center text-[13px] font-extrabold text-slate hover:text-red-text md:px-2">Manage</button>
            </div>
          </div>
        ) : (
          <div className="p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <div id="cookie-title" className="font-display text-[19px]">Cookie preferences</div>
              <Link href="/policies/cookie-policy/" className="text-[12px] font-extrabold tracking-[0.06em] text-red-text">FULL COOKIE POLICY →</Link>
            </div>
            <div className="mt-4 divide-y divide-line border-y border-line">
              <Row title="Necessary" desc="Sign-in, consent record, security. Always on." locked checked />
              <Row title="Analytics" desc="Anonymous page-view counts so we know what is read. No cross-site tracking." checked={analytics} onChange={setAnalytics} />
              <Row title="Embedded media" desc="Lets third-party video and map embeds load inside articles." checked={media} onChange={setMedia} />
              <Row title="Advertising measurement" desc="Not in use. Display ads are served without personal data." locked checked={false} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button type="button" onClick={() => save(false, false)} className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-ink px-5 text-[13.5px] font-extrabold dark:border-white">Reject all</button>
              <button type="button" onClick={() => save(analytics, media)} className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 text-[13.5px] font-extrabold text-white dark:bg-white dark:text-ink">Save choices</button>
              <button type="button" onClick={() => save(true, true)} className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-line px-5 text-[13.5px] font-extrabold">Accept all</button>
              <span className="meta ml-auto text-[11.5px]">You can change this any time from “Cookie settings” in the footer.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ title, desc, checked, locked, onChange }: { title: string; desc: string; checked: boolean; locked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className={clsx("flex items-start gap-4 py-3.5", locked ? "cursor-default" : "cursor-pointer")}>
      <span className="flex-1">
        <span className="block text-[14px] font-extrabold">{title}</span>
        <span className="meta block leading-[1.55]">{desc}</span>
      </span>
      <span className={clsx("relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", checked ? "bg-red" : "bg-line-2", locked && "opacity-50")}>
        <input type="checkbox" className="peer sr-only" checked={checked} disabled={locked} onChange={(e) => onChange?.(e.target.checked)} />
        <span className={clsx("absolute h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[22px]" : "translate-x-[2px]")} />
      </span>
    </label>
  );
}
