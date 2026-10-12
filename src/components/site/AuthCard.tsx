import Link from "next/link";
import { Wordmark } from "@/components/ui/Brand";
import { SITE } from "@/lib/site";

export function AuthCard({ title, intro, children, footer }: { title: string; intro: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="wrap flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-[460px] rounded-card-lg border border-line bg-bg p-7 shadow-[0_18px_60px_rgba(21,22,28,.08)]">
        <Wordmark size={21} />
        <h1 className="font-display mt-5 text-[28px] tracking-[-0.04em]">{title}</h1>
        <p className="meta mt-1.5 leading-[1.6]">{intro}</p>
        <div className="mt-5">{children}</div>
        <div className="meta mt-5 border-t border-line pt-4 text-[12.5px] leading-[1.6]">{footer}</div>
        <p className="meta mt-3 text-[11px]">Accounts are free. Questions: <a href={`mailto:${SITE.email}`} className="font-extrabold text-red-text">{SITE.email}</a> · <Link href="/policies/privacy/" className="underline">Privacy</Link></p>
      </div>
    </div>
  );
}
