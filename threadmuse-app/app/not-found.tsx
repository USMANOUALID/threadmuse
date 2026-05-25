import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <span className="font-display text-[120px] font-semibold leading-none tracking-tight text-soft">
        404
      </span>
      <h1 className="mt-2 font-display text-h1 font-semibold text-ink">
        This stream is offline.
      </h1>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
        The page you requested is not available. Return home or compare premium IPTV plans.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/pricing">View pricing</Link>
        </Button>
      </div>
    </main>
  );
}
