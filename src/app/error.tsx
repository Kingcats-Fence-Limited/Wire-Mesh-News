"use client";

import { ErrorCard } from "@/components/boards/error/ErrorBoard";
import "@/styles/board-err.css";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="site b-err" style={{ padding: "48px 16px", display: "flex", justifyContent: "center" }}>
      <ErrorCard code={500} ref={error.digest} onRetry={reset} />
    </div>
  );
}
