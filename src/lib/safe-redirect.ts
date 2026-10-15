/** Only same-site paths are accepted as a post-sign-in destination. "/x" passes; "//evil.com",
    "/\\evil.com", "https://…" and anything with a scheme do not (open-redirect protection).
    The check runs again AFTER the URL is normalised, because dot segments can collapse into a
    protocol-relative path: "/.//evil.com", "/a/..//evil.com" and "/%2e//evil.com" all become
    "//evil.com". */
export function safeNext(next: string | undefined | null, fallback = "/account/") {
  if (!next || typeof next !== "string" || next.length > 512) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || /\\/.test(next) || /[\r\n\t]/.test(next)) return fallback;
  try {
    const u = new URL(next, "https://x.invalid");
    if (u.origin !== "https://x.invalid") return fallback;
    const out = u.pathname + u.search + u.hash;
    return out.startsWith("/") && !out.startsWith("//") && !out.startsWith("/\\") ? out : fallback;
  } catch { return fallback; }
}
