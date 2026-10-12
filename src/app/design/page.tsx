import type { Metadata } from "next";
import {
  AdSlot,
  Badge,
  Button,
  ButtonLink,
  Card,
  Chip,
  Kicker,
  MeshBg,
  MoreLink,
  SectionHead,
  SocialRow,
  Thumb,
  Wordmark,
  BrandIcon,
  APPLICATION_MESH,
} from "@/components/ui";
import type { BadgeTone, MeshId } from "@/components/ui";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SECTION, STANDARD_STATUS, APPLICATION_AREA } from "@/data/vocab";

export const metadata: Metadata = {
  title: "Design tokens & components",
  robots: { index: false, follow: false },
};

const swatches: { name: string; cls: string; hex: string }[] = [
  { name: "ink", cls: "bg-ink", hex: "#15161C" },
  { name: "red", cls: "bg-red", hex: "#E5242F" },
  { name: "red-deep", cls: "bg-red-deep", hex: "#C41822" },
  { name: "slate", cls: "bg-slate", hex: "#555A6B" },
  { name: "grey", cls: "bg-grey", hex: "#8A8F9E" },
  { name: "line", cls: "bg-line", hex: "#E6E6EC" },
  { name: "paper", cls: "bg-paper", hex: "#F6F6F8" },
  { name: "mark", cls: "bg-mark", hex: "#FFE8B0" },
];

const meshes: MeshId[] = ["chain", "weld", "weldQ", "woven", "grate", "perf", "exp"];
const typeBadges: BadgeTone[] = ["article", "letter", "opinion", "company", "standard", "topic", "event"];

function Block({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="border-t border-line py-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[22px]">{title}</h2>
        {note && <span className="meta">{note}</span>}
      </div>
      {children}
    </section>
  );
}

export default function DesignPage() {
  return (
    <main className="wrap pb-24 pt-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Phase 1 · step 1</Kicker>
          <h1 className="font-display mt-2 text-[40px] tracking-[-0.045em]">
            Design tokens &amp; base components<span className="text-red">.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-slate">
            Extracted from the canvas (Home-A, Nav-J, Article-C, Standards-Y, Search-K). Everything below is what every page is built from.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-dark px-3 py-2 text-white">
          <span className="text-[12px] font-extrabold tracking-[0.08em]">THEME</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Brand */}
      <Block title="Brand" note="proportions fixed · red block scales with size">
        <div className="flex flex-wrap items-end gap-10">
          <Wordmark size={54} href={null} />
          <Wordmark size={30} href={null} />
          <Wordmark size={21} href={null} />
          <Wordmark size={15} href={null} />
          <div className="flex items-center gap-4 rounded-card bg-dark p-5 text-white">
            <Wordmark size={24} href={null} tone="white" />
            <BrandIcon size={36} />
          </div>
        </div>
      </Block>

      {/* Colour */}
      <Block title="Colour" note="dark mode remaps surfaces; red text becomes #FF4A54">
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-16 rounded-card border border-line ${s.cls}`} />
              <div className="mt-2 text-[12.5px] font-extrabold">{s.name}</div>
              <div className="num meta">{s.hex}</div>
            </div>
          ))}
        </div>
      </Block>

      {/* Type */}
      <Block title="Type" note="Bricolage Grotesque 800 for display · Manrope for everything else, numerals tabular">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="font-display text-[40px] tracking-[-0.045em]">Nobody loses a tender on wire diameter. They lose the fence on coating.</h1>
            <h2 className="font-display mt-5 text-[23px]">Standards watch · section title at 23px</h2>
            <h3 className="font-display mt-4 text-[19px] leading-[1.26]">Hot-dip vs. electro-galvanizing for fence posts</h3>
            <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.7] text-fg-2">
              A specification that starts with wire diameter has already made its most expensive decision by accident. The coating classes of{" "}
              <a href="#" className="std-link">EN 10244-2</a> are the usual reference, and <mark>galvanizing thickness</mark> is what buyers actually argue about.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <Kicker>Technical guides · Surface treatments</Kicker>
              <div className="meta mt-1">7 Oct 2026 · 8 min</div>
            </div>
            <div className="num rounded-card border border-line p-4">
              <div className="kicker">Zinc, LME 3-month</div>
              <div className="font-display mt-1 text-[30px] tracking-[-0.02em]">2,748.50</div>
              <div className="text-[12px] font-extrabold text-down">▼ 0.84%</div>
              <div className="meta mt-1">AS OF 09:30 UTC · DELAYED 30 MIN</div>
            </div>
            <div className="num text-[13px] font-bold text-slate">SHANGHAI 15:32 · HAMBURG 09:32 · HOUSTON 02:32</div>
          </div>
        </div>
      </Block>

      {/* Buttons & chips */}
      <Block title="Buttons · chips · more-links">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Subscribe free</Button>
          <Button variant="red">Send a letter</Button>
          <Button variant="outline">Report a change</Button>
          <ButtonLink href="#" variant="primary" size="sm">Sign in</ButtonLink>
          <Button variant="ghost">Cancel</Button>
          <span className="rounded-card bg-dark p-2"><Button variant="white" size="sm">Follow this standard</Button></span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Chip active count={128}>All</Chip>
          {SECTION.filter((s) => s.code !== "letters_opinion").map((s) => (
            <Chip key={s.code} count={24}>{s.label}</Chip>
          ))}
          <Chip size="sm">coating weight</Chip>
          <MoreLink href="#" className="ml-4">All letters</MoreLink>
        </div>
      </Block>

      {/* Badges */}
      <Block title="Badges" note="content types are identical in the search overlay and the results page">
        <div className="flex flex-wrap items-center gap-2">
          {typeBadges.map((t) => (
            <Badge key={t} tone={t}>{t}</Badge>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {STANDARD_STATUS.map((s) => (
            <Badge key={s.code} tone={s.code === "under_review" ? "review" : s.code === "withdrawn" ? "withdrawn" : s.code === "draft" ? "draft" : "current"}>
              {s.label}
            </Badge>
          ))}
          <Badge tone="live">Live</Badge>
          <Badge tone="delayed">Delayed 30 min</Badge>
          <Badge tone="sponsored">Sponsored</Badge>
        </div>
      </Block>

      {/* Section head + card */}
      <Block title="Section head · cards">
        <SectionHead title="Letters & Opinion" more="All letters" moreHref="#" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <Kicker>Letter</Kicker>
            <a href="#" className="font-display mt-2 block text-[19px] leading-[1.26]">“Stop quoting ‘galvanised’ without a number.”</a>
            <div className="meta mt-2">Specifier · 4 days ago</div>
          </Card>
          <Card tone="paper">
            <div className="font-display text-[16px]">Write to the editor</div>
            <p className="meta mt-1 leading-[1.6]">200–400 words. One specific point or one experience from site.</p>
          </Card>
          <Card tone="dark">
            <Kicker tone="on-dark">Publication details</Kicker>
            <div className="mt-2 text-[14px] font-extrabold">Wire Mesh News</div>
            <div className="mt-1 text-[12.5px] text-grey-3">Operated by — see About</div>
          </Card>
        </div>
        <div className="mt-6 flex gap-4">
          <Thumb className="w-[150px]" />
          <Thumb className="w-[150px]" ratio="16/9" dark />
        </div>
      </Block>

      {/* Mesh patterns */}
      <Block title="Mesh patterns" note="application areas each own one pattern">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-7">
          {meshes.map((m) => (
            <div key={m} className="relative h-28 overflow-hidden rounded-card bg-dark text-white">
              <MeshBg id={m} opacity={0.3} />
              <span className="num absolute bottom-2 left-3 text-[10.5px] font-extrabold tracking-[0.1em] uppercase">{m}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {APPLICATION_AREA.map((a) => (
            <div key={a.code} className="relative overflow-hidden rounded-[18px] border border-line-dark bg-[#17181F] p-4 text-white">
              <MeshBg id={APPLICATION_MESH[a.code] ?? "chain"} color="#5A5F78" opacity={0.6} scale={1.45} />
              <span className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(135% 85% at 86% -12%, rgba(229,36,47,.26) 0%, rgba(229,36,47,.05) 46%, rgba(229,36,47,0) 64%)" }} />
              <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(23,24,31,0) 0%, rgba(23,24,31,.42) 34%, rgba(23,24,31,.93) 62%, #191A22 100%)" }} />
              <div className="relative flex h-40 flex-col justify-end">
                <div className="font-display text-[17px]">{a.labelEn}</div>
                <div className="mt-1 text-[11px] font-bold leading-[1.5] text-red-text">{a.scenariosEn.split(";")[0]}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Social */}
      <Block title="Social buttons" note="five fixed channels · hover / tap turns the disc red · no SDKs">
        <div className="flex flex-wrap items-center gap-10">
          <div className="rounded-card bg-dark p-5"><SocialRow /></div>
          <SocialRow tone="light" />
        </div>
      </Block>

      {/* Ads */}
      <Block title="Ad slots" note="always labelled · caps and ad-free zones enforced per page">
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <AdSlot kind="leaderboard" />
            <AdSlot kind="in-article" />
            <AdSlot kind="mobile-banner" />
          </div>
          <AdSlot kind="mpu" />
        </div>
      </Block>
    </main>
  );
}
