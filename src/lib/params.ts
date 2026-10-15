/* Query strings are untrusted. Next gives a string[] when a parameter is repeated
   (?q=a&q=b), which crashed pages that expect a string, so every page reads its
   searchParams through this: first value only, trimmed to a sane length. */
export function flat<T extends object>(sp: Record<string, string | string[] | undefined>, max = 200): T {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    const s = Array.isArray(v) ? v[0] : v;
    if (typeof s === "string") out[k] = s.slice(0, max);
  }
  return out as T;
}
