import { Header } from "./Header";
import { Footer } from "./Footer";
import { SiteDefs } from "./SiteDefs";

/** Page frame: canvas header (full or compact) + main + full canvas footer. */
export function Shell({ children, header = "compact", active, board }: { children: React.ReactNode; header?: "full" | "compact"; active?: string; board?: string }) {
  return (
    <div className={`site${board ? ` ${board}` : ""}`} style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "'Manrope Variable', 'Manrope', 'PingFang SC', sans-serif" }}>
      <SiteDefs />
      <Header variant={header} active={active} />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
