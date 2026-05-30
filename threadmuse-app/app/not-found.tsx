import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="premium-grid flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <span className="font-display text-[120px] font-semibold leading-none tracking-tight text-accent">
        404
      </span>
      <h1 className="mt-2 font-display text-h1 font-semibold text-ink">
        This premium page is off the grid.
      </h1>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
        The route you requested does not exist. Head back home or search the NoirEdge platform.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">
            <Search className="size-4" />
            Search
          </Link>
        </Button>
      </div>
    </main>
  );
}
