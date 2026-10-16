"use client";

/* Header "Sign In" button: becomes "My account" for a signed-in visitor (live accounts only;
   the page itself stays static and cached). */
import Link from "next/link";
import { useMe } from "@/lib/me-client";

export function AccountLink({ className, style, onClick }: { className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const me = useMe();
  const inside = !!me?.signedIn;
  return <Link href={inside ? "/account/" : "/signin/"} className={className} style={style} onClick={onClick}>{inside ? "My account" : "Sign In"}</Link>;
}
