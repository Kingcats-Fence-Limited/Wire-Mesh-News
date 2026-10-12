import type { Metadata } from "next";
import { AccountBoard } from "@/components/boards/account/AccountBoard";

export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };

export default function AccountPage() {
  return <AccountBoard />;
}
