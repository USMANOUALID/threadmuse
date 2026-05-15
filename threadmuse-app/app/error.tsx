"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry / Plausible custom-event hookup goes here in Phase 7.
    console.error("[ThreadMuse] route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <h1 className="font-display text-h1 font-semibold text-ink">Something stitched up wrong.</h1>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
        Refresh, head home, or hop back to explore. We've logged it on our side.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-6 text-[11px] text-muted">
          Reference: <code>{error.digest}</code>
        </p>
      )}
    </main>
  );
}
