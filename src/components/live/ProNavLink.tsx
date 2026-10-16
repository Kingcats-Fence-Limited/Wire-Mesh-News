"use client";

/* "Pro" entry in the main navigation: plans for everyone else, the billing panel for subscribers. */
import Link from "next/link";
import { useMe } from "@/lib/me-client";

export function ProNavLink() {
  const me = useMe();
  const paid = !!me?.pro;
  return (
    <Link href={paid ? "/account/#billing" : "/pricing/"} className="navpro" aria-label={paid ? "Your Pro plan" : "Pro plans and pricing"}>
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" /></svg>
      {paid ? "Pro" : "Go Pro"}
    </Link>
  );
}
