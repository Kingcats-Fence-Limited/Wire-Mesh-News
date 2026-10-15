import type { Metadata } from "next";
import { privateMeta } from "@/lib/seo";
import { AccountBoard } from "@/components/boards/account/AccountBoard";

export const metadata: Metadata = privateMeta("My account", "/account/");

export default function AccountPage() {
  return <AccountBoard />;
}
