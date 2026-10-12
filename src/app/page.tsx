import { Wordmark } from "@/components/ui";

/** Temporary holding page — replaced by the real home in the next batch. */
export default function Home() {
  return (
    <main className="wrap flex min-h-screen flex-col items-start justify-center gap-6 py-20">
      <Wordmark size={40} />
      <p className="max-w-xl text-[17px] font-medium text-slate">
        Independent news, markets and standards for the global wire mesh industry.
      </p>
      <p className="meta">Phase 1 build in progress · see <a className="std-link" href="/design">/design</a> for tokens and components.</p>
    </main>
  );
}
