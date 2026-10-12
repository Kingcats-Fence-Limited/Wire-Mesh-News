"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/board-cook.css";

/**
 * Cookie-Z. Reject all and Accept all share one row, one size, one style;
 * nothing non-essential is set before a choice; no close ✕ on the banner;
 * optional categories default to off. The choice is stored with a policy
 * version and a timestamp so a policy change can re-ask. Global Privacy
 * Control counts as "reject".
 */
const KEY = "wmn-consent";
const VERSION = 1;
const MONTHS = 12;
const EVT = "wmn:open-cookie-settings";

type Consent = { v: number; necessary: true; analytics: boolean; media: boolean; ads: false; at: string };

export function CookieSettingsButton({ className, style, children = "Cookie settings" }: { className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <button type="button" className={className} style={style} onClick={() => window.dispatchEvent(new Event(EVT))}>
      {children}
    </button>
  );
}

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c: Consent = JSON.parse(raw);
    if (c.v !== VERSION) return null;
    const age = Date.now() - new Date(c.at).getTime();
    if (age > MONTHS * 30.4 * 86400000) return null;
    return c;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [media, setMedia] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (c) {
      setAnalytics(c.analytics);
      setMedia(c.media);
    } else if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) {
      persist(false, false);
    } else {
      setVisible(true);
    }
    function openSettings() {
      const cur = readConsent();
      if (cur) {
        setAnalytics(cur.analytics);
        setMedia(cur.media);
      }
      setManage(true);
      setVisible(true);
    }
    window.addEventListener(EVT, openSettings);
    return () => window.removeEventListener(EVT, openSettings);
  }, []);

  function persist(a: boolean, m: boolean) {
    const c: Consent = { v: VERSION, necessary: true, analytics: a, media: m, ads: false, at: new Date().toISOString() };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
  }
  function save(a: boolean, m: boolean) {
    persist(a, m);
    setAnalytics(a);
    setMedia(m);
    setVisible(false);
    setManage(false);
  }

  if (!visible) return null;

  if (manage) {
    return (
      <div className="b-cook prefwrap" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <button type="button" className="prefscrim" aria-label="Close" onClick={() => (readConsent() ? setVisible(false) : setManage(false))} />
        <div className="frame pref">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "6px" }}>
            <div id="cookie-title" className="h" style={{ fontSize: "21px" }}>Cookie preferences</div>
            <button type="button" aria-label="Close" onClick={() => (readConsent() ? setVisible(false) : setManage(false))} style={{ width: "34px", height: "34px", border: "1px solid var(--line)", borderRadius: "999px", background: "#FFFFFF", cursor: "pointer", flexShrink: 0, color: "var(--slate)", fontSize: "15px", fontWeight: 800 }}>✕</button>
          </div>
          <p className="meta" style={{ margin: "0 0 6px", lineHeight: 1.6 }}>Choose what we may store on your device. You can change this at any time from the footer.</p>

          <div className="catrow">
            <span className="sw lock" aria-hidden="true"><i /></span>
            <div style={{ flex: "1 1 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "4px" }}><span style={{ fontSize: "15px", fontWeight: 800 }}>Strictly necessary</span><span style={{ background: "var(--line-soft)", color: "var(--slate)", fontSize: "9.5px", fontWeight: 800, letterSpacing: ".1em", padding: "3px 7px", borderRadius: "3px" }}>ALWAYS ON</span></div>
              <p className="meta" style={{ margin: 0, fontSize: "12.5px", lineHeight: 1.6 }}>Sign-in state, security checks and the cookie choice you make here. The site cannot run without them, so they need no consent and cannot be switched off.</p>
            </div>
          </div>
          <Toggle id="ck-analytics" on={analytics} onChange={setAnalytics} title="Analytics" desc="Which articles are read, where readers come from and where they stop. Aggregate trends only, used to decide what to write — never to identify a person." />
          <Toggle id="ck-media" on={media} onChange={setMedia} title="Embedded media" desc="Articles occasionally embed third-party video or maps. If you decline, a placeholder with a “click to load” button is shown instead and nothing connects to the third party automatically." />
          <div className="catrow">
            <span className="sw lock off" aria-hidden="true"><i /></span>
            <div style={{ flex: "1 1 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "4px" }}><span style={{ fontSize: "15px", fontWeight: 800 }}>Advertising measurement</span><span style={{ background: "#FFF4E2", color: "#8A5A08", fontSize: "9.5px", fontWeight: 800, letterSpacing: ".1em", padding: "3px 7px", borderRadius: "3px" }}>NOT IN USE</span></div>
              <p className="meta" style={{ margin: 0, fontSize: "12.5px", lineHeight: 1.6 }}>Counting ad impressions and clicks. <b style={{ color: "var(--ink)" }}>We do no cross-site tracking, no behavioural targeting and use no ad networks</b>, so this category is currently empty. The switch stays here so it can never be turned on quietly.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px", paddingTop: "18px", borderTop: "2px solid var(--ink)" }}>
            <button type="button" className="btn" onClick={() => save(analytics, media)}>Save choices</button>
            <button type="button" className="btn out" onClick={() => save(false, false)}>Reject all</button>
            <button type="button" className="btn out" onClick={() => save(true, true)}>Accept all</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="b-cook cookroot" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
      <div className="banner">
        <div style={{ flex: "1 1 520px", minWidth: 0 }}>
          <div id="cookie-title" className="h" style={{ fontSize: "19px", marginBottom: "7px", color: "#FFFFFF" }}>We use cookies</div>
          <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 500, lineHeight: 1.65, color: "#C4C7D2" }}>
            Necessary cookies keep the site working. We’d also like to set analytics cookies to see which articles get read — only if you agree. Nothing is set before you choose. Read our <Link href="/policies/cookie-policy/" style={{ color: "#FFFFFF", textDecoration: "underline" }}>Cookie Policy</Link> and <Link href="/policies/privacy/" style={{ color: "#FFFFFF", textDecoration: "underline" }}>Privacy Policy</Link>.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", flexShrink: 0 }}>
          <button type="button" className="btn out" style={{ minWidth: "128px" }} onClick={() => save(false, false)}>Reject all</button>
          <button type="button" className="btn out" style={{ minWidth: "128px" }} onClick={() => save(true, true)}>Accept all</button>
          <button type="button" className="btn" style={{ background: "transparent", borderColor: "rgba(255,255,255,.35)", color: "#FFFFFF" }} onClick={() => setManage(true)}>Manage</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ id, on, onChange, title, desc }: { id: string; on: boolean; onChange: (v: boolean) => void; title: string; desc: string }) {
  return (
    <div className="catrow">
      <button type="button" id={id} role="switch" aria-checked={on} aria-labelledby={`${id}-l`} className={`sw${on ? " on" : ""}`} onClick={() => onChange(!on)}><i /></button>
      <div style={{ flex: "1 1 auto" }}>
        <div id={`${id}-l`} style={{ fontSize: "15px", fontWeight: 800, marginBottom: "4px" }}>{title}</div>
        <p className="meta" style={{ margin: 0, fontSize: "12.5px", lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  );
}
