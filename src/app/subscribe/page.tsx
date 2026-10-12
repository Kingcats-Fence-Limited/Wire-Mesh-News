import type { Metadata } from "next";
import { Shell } from "@/components/site/Shell";
import { AuthCard } from "@/components/site/AuthCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";

export const metadata: Metadata = { title: "Subscribe", description: "The weekly brief: news, prices and standards updates every Monday, free." };

export default function SubscribePage() {
  return (
    <Shell>
      <AuthCard title="The weekly brief" intro="Everything that moved in wire mesh this week, in one email every Monday. Free. Double opt-in; one-click unsubscribe; no sharing of your address." footer={<>Also available: section lists (twice a month), event alerts (monthly) and per-standard alerts — all from your account once it exists.</>}>
        <NewsletterForm compact label="Subscribe free" />
      </AuthCard>
    </Shell>
  );
}
