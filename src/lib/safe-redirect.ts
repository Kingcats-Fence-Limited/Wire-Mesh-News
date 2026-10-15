/** Only same-site paths are accepted as a post-sign-in destination. "/x" passes; "//evil.com",
    "/\\evil.com", "https://…" and anything with a scheme do not (open-redirect protection). */
export function safeNext(next: string | undefined | null, fallback = "/account/") {
  if (!next || typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\") || /[\r\n\t]/.test(next)) return fallback;
  try { const u = new URL(next, "https://x.invalid"); return u.origin === "https://x.invalid" ? u.pathname + u.search + u.hash : fallback; } catch { return fallback; }
}
