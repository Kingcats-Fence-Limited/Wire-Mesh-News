/* Pricing: four plans, the full comparison, and the rules (what money can and cannot buy). */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { PricingPlans } from "./PricingPlans";
import { FEATURES, PLANS, TRIAL_DAYS, FREE_PREMIUM_PER_MONTH } from "@/lib/plans";
import { SITE } from "@/lib/site";
import "@/styles/board-price.css";

const Cell = ({ v }: { v: boolean | string }) => (v === true ? <span className="yes" aria-label="Included">✓</span> : v === false ? <span className="no" aria-label="Not included">—</span> : <span style={{ fontWeight: 600 }}>{v}</span>);

const FAQ: [string, string][] = [
  ["How does the free trial work?", `Every paid plan starts with ${TRIAL_DAYS} days free. You add a card when you start, and nothing is charged until the trial ends. We email you three days before. Cancel in Subscription & billing before the date and you pay nothing. One trial per account.`],
  ["Can I cancel at any time?", "Yes. Cancelling stops the next renewal; you keep access until the end of the period you have paid for. You can resume before that date."],
  ["Do you offer refunds?", "Cancelling stops the next renewal and you keep access to the end of the paid period. Consumers in the United Kingdom and the European Union can withdraw from a new subscription within 14 days. Your other refund rights are set out in our Terms; if something went wrong, write to us and we will put it right."],
  ["Will I get a proper invoice?", "Yes. Add your company name, address and VAT or tax number at checkout; every payment comes with an invoice you can download from your account."],
  ["Which payment methods do you accept?", "Cards (Visa, Mastercard, American Express, UnionPay), Apple Pay and Google Pay, plus other local methods where available. Payments are handled by Stripe; card numbers never reach our systems."],
  ["Does a paid plan change my company's place in the Directory?", "No. Every company is listed free and in the same order for everyone. Companies on the Company plan carry a PAID MEMBER mark; paying never pins, promotes or hides anyone, and never buys coverage."],
  ["Where do tenders and trade data come from?", "Tenders come from public procurement portals (EU TED, the World Bank, US SAM.gov and others) and are checked by an editor before they appear. Trade statistics come from official public sources (Eurostat, US Census Bureau) and always name the source and period."],
  [`What counts towards the ${FREE_PREMIUM_PER_MONTH} free Pro articles?`, `Signed-in Free readers can open ${FREE_PREMIUM_PER_MONTH} different Pro analysis articles each calendar month. Re-opening one you have already read does not count again.`],
];

export function PricingBoard() {
  const groups = [...new Set(FEATURES.map((f) => f.group))];
  return (
    <Shell header="compact" board="b-price">
      <section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
        <svg width="520" height="520" viewBox="0 0 120 120" style={{ position: "absolute", right: "-80px", top: "-120px", color: "var(--mesh-dark)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
        <div style={{ position: "relative", paddingTop: "48px", paddingBottom: "56px" }} className="wrap">
          <nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--grey-2)", marginBottom: "16px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <span style={{ color: "#FFFFFF", fontWeight: 800 }}>Plans &amp; pricing</span></nav>
          <h1 style={{ margin: "0 0 14px", fontSize: "52px", letterSpacing: "-.05em", lineHeight: 1.02, maxWidth: "820px", color: "#FFFFFF" }} className="h">Find the next order before your competitors do<span style={{ color: "var(--red-text)" }}>.</span></h1>
          <p style={{ margin: "0 0 30px", fontSize: "18px", fontWeight: 500, lineHeight: 1.55, maxWidth: "680px", color: "var(--on-dark-2)" }}>Tenders, trade-defence cases, trade statistics and analysis for the wire, mesh, fencing and grating trade. News stays free.</p>
          <PricingPlans />
        </div>
      </section>

      <section style={{ paddingTop: "52px", paddingBottom: "40px" }} className="wrap">
        <h2 style={{ margin: "0 0 6px", fontSize: "30px" }} className="h">Compare plans</h2>
        <p style={{ margin: "0 0 18px", fontSize: "14.5px" }} className="meta">Prices in US dollars, excluding any VAT or sales tax shown at checkout.</p>
        <div className="cmpwrap">
          <table className="cmp">
            <thead><tr><th scope="col"><span className="sr-only">Feature</span></th>{PLANS.map((p) => <th key={p.id} scope="col">{p.name.toUpperCase()}</th>)}</tr></thead>
            <tbody>
              {groups.map((g) => (
                <FeatureGroup key={g} group={g} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "44px 0" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderLeft: "4px solid var(--up)", borderRadius: "14px", padding: "22px 24px" }}>
            <div style={{ fontSize: "18px", marginBottom: "10px" }} className="h">What paying buys</div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "14px", fontWeight: 500, lineHeight: 1.8, color: "var(--fg-3)" }}>
              <li>Tools and information: analysis, tenders, trade data, templates</li>
              <li>An ad-free site</li>
              <li>For companies: analytics and extra content on their own profile, and a PAID MEMBER mark</li>
            </ul>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderLeft: "4px solid var(--red)", borderRadius: "14px", padding: "22px 24px" }}>
            <div style={{ fontSize: "18px", marginBottom: "10px" }} className="h">What money never buys</div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "14px", fontWeight: 500, lineHeight: 1.8, color: "var(--fg-3)" }}>
              <li>Coverage, or a change to what we report</li>
              <li>A higher place in the Directory, search or any list</li>
              <li>Certification badges, or the removal of a competitor</li>
            </ul>
            <p style={{ margin: "10px 0 0", fontSize: "13px" }} className="meta">See the <Link href="/policies/editorial-policy/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Editorial Policy</Link> and the <Link href="/policies/directory-listing-policy/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Directory Listing Policy</Link>.</p>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: "48px", paddingBottom: "56px" }} className="wrap">
        <h2 style={{ margin: "0 0 10px", fontSize: "30px" }} className="h">Questions</h2>
        <div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        <p style={{ margin: "26px 0 0", fontSize: "14px" }} className="meta">Need more than 20 people, invoicing by bank transfer or a data licence? <Link href="/contact/?subject=other" style={{ color: "var(--red-text)", fontWeight: 800 }}>Talk to us</Link> or write to {SITE.email}. Looking for one report? See <Link href="/reports/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Reports</Link>.</p>
        <SellerLine />
      </section>
    </Shell>
  );
}

function FeatureGroup({ group }: { group: string }) {
  const rows = FEATURES.filter((f) => f.group === group);
  return (
    <>
      <tr className="grp"><td colSpan={5}>{group.toUpperCase()}</td></tr>
      {rows.map((f) => (
        <tr key={f.label}>
          <th scope="row" style={{ fontWeight: 700, textAlign: "left" }}>{f.label}{f.hint && <span className="meta" style={{ display: "block", fontWeight: 500, fontSize: "12px", marginTop: "3px" }}>{f.hint}</span>}</th>
          <td><Cell v={f.free} /></td><td><Cell v={f.pro} /></td><td><Cell v={f.team} /></td><td><Cell v={f.company} /></td>
        </tr>
      ))}
    </>
  );
}

function SellerLine() {
  const seller = process.env.NEXT_PUBLIC_SELLER_NAME || "KINGCATS FENCE LIMITED";
  return <p style={{ margin: "14px 0 0", fontSize: "12.5px" }} className="meta">Subscriptions are sold by {seller}, Hong Kong SAR, under our <Link href="/policies/terms/" className="lnk">Terms</Link>. Payments are processed by Stripe.</p>;
}
