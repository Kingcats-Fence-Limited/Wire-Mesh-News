/* Ported 1:1 from canvas Home-A "The weekly brief" / "Write for us" pair. */
import Link from "next/link";
import { SubscribeForm } from "./SubscribeForm";

export function Subscribe() {
  return (
    <>
<section style={{ background: "var(--paper)", padding: "50px 0" }}>
<div className="wrap">
<div className="split" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "26px" }}>
<div style={{ background: "var(--ink)", color: "#FFFFFF", borderRadius: "18px", padding: "36px", position: "relative", overflow: "hidden" }}>
<svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", color: "var(--fg-2)" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#pWoven)" /></svg>
<div style={{ position: "relative" }}>
<div className="h" style={{ fontSize: "32px", marginBottom: "10px", color: "#FFFFFF" }}>The weekly brief</div>
<p style={{ margin: "0 0 22px", fontSize: "15.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--line-2)", maxWidth: "480px" }}>One email a week: the news, the price moves and the standards changes, on a single page. Subscribing is a separate confirmation; creating an account does not subscribe you.</p>
<SubscribeForm />
<p style={{ margin: "13px 0 0", fontSize: "12.5px", fontWeight: "500", color: "var(--grey-5)" }}>Unsubscribe in one click from any email &#183; see <Link href="/policies/privacy/" style={{ color: "var(--grey-2)", textDecoration: "underline" }}>Privacy</Link></p>
</div>
</div>
<div style={{ background: "#FFFFFF", border: "2px solid var(--ink)", borderRadius: "18px", padding: "36px", display: "flex", flexDirection: "column", gap: "11px" }}>
<div className="h" style={{ fontSize: "27px" }}>Write for us</div>
<p style={{ margin: "0", fontSize: "15px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Experience from the plant, the laboratory or the site that is worth writing down? Articles are published after editorial review, under your real name, with an author page of your own.</p>
<Link href="/submit/" style={{ background: "var(--ink)", color: "#FFFFFF", fontWeight: "800", fontSize: "15px", padding: "0 26px", minHeight: "50px", borderRadius: "999px", display: "inline-flex", alignItems: "center", alignSelf: "flex-start", marginTop: "6px" }}>Start a submission</Link>
<Link href="/submit/#guidelines" style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--red)" }}>SUBMISSION GUIDELINES &#8594;</Link>
</div>
</div>
</div>
</section>
    </>
  );
}
