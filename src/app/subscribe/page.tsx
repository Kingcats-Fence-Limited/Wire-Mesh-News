import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { SubscribeCard } from "@/components/boards/subscribe/SubscribeCard";

export const metadata: Metadata = pageMeta({ title: "Subscribe", description: "The weekly brief: news, prices and standards updates every Monday, free.", path: "/subscribe/" });

export default function SubscribePage() {
  return (
    <Shell board="b-ads">
      <div className="subpage">
        <SubscribeCard />
      </div>
    </Shell>
  );
}
