import { NextResponse, type NextRequest } from "next/server";

/* When accounts are live, /account and /submit need a session. This is a fast cookie check
   only (no database call); every account API checks the session properly on the server.
   In preview mode (accounts not live) nothing is protected and the demo works as before. */
const LIVE = process.env.NEXT_PUBLIC_AUTH_LIVE === "1";
const COOKIES = ["wmn.session_token", "__Secure-wmn.session_token"];

export function middleware(req: NextRequest) {
  if (!LIVE) return NextResponse.next();
  if (COOKIES.some((c) => req.cookies.get(c)?.value)) return NextResponse.next();
  const url = req.nextUrl.clone();
  const next = req.nextUrl.pathname + req.nextUrl.search;
  url.pathname = "/signin/";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/account/:path*", "/submit/:path*"] };
