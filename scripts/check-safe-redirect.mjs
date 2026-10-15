// Regression check for the open-redirect guard. Run: node --experimental-strip-types scripts/check-safe-redirect.mjs
import { safeNext } from "../src/lib/safe-redirect.ts";
const bad=["/.//evil.com","/a/..//evil.com","/%2e//evil.com","/./\\evil.com","//evil.com","/\\evil.com","https://evil.com","javascript:alert(1)","/%2e%2e//evil.com","/..//evil.com"];
const good=["/directory/x/?a=1#b","/a/../b/"];
let fail=0;
for(const b of bad) { if (safeNext(b)!=="/account/") fail++; console.log(safeNext(b)==="/account/"?"ok  ":"FAIL", b, "->", safeNext(b)); }
for(const g of good) { if (safeNext(g)==="/account/") fail++; console.log(safeNext(g)!=="/account/"?"ok  ":"FAIL", g, "->", safeNext(g)); }
process.exit(fail ? 1 : 0);
