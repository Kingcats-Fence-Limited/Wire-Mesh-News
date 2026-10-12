import Link from "next/link";
import type { Metadata } from "next";
import { Shell, PageHead } from "@/components/site/Shell";
import { MeshBg } from "@/components/ui/Mesh";
import { TOPICS } from "@/lib/content/market";
import { byTopic } from "@/lib/content/articles";
import { getAuthor } from "@/lib/content/people";
import { fmtDate } from "@/lib/site";

export const metadata: Metadata = { title: "Topics", description: "Long-running subjects that cut across sections, curated in the order a real decision is made." };

export default function TopicsPage() {
  return (
    <Shell>
      <PageHead crumbs={[{ label: "Topics" }]} title="Topics" intro="Long-running subjects that cut across sections. Each topic is curated by an editor in the order a real decision is made, and only exists once there is enough to read." />
      <div className="wrap grid gap-5 pt-7 md:grid-cols-2">
        {TOPICS.map((t, i) => (
          <Link key={t.slug} href={`/topics/${t.slug}/`} className="group relative overflow-hidden rounded-card-lg bg-dark p-6 text-white">
            <MeshBg id={(["weld", "perf", "chain", "exp", "grate"] as const)[i % 5]} color="#FFFFFF" opacity={0.12} />
            <span className="relative block">
              <span className="num text-[10.5px] font-extrabold tracking-[0.1em] text-grey-3">{byTopic(t.slug).length} ARTICLES · UPDATED {fmtDate(t.updated).toUpperCase()}</span>
              <span className="font-display mt-2 block text-[26px] leading-[1.1] group-hover:text-red-text">{t.title}</span>
              <span className="mt-2 block text-[13.5px] font-medium leading-[1.55] text-grey-3">{t.intro.split(". ")[0]}.</span>
              <span className="mt-4 block text-[11.5px] font-bold text-grey-5">Curated by {getAuthor(t.curator)?.name}{t.sponsor ? " · Sponsored topic" : ""}</span>
            </span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
