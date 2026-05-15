import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <h1 className="font-display text-h1 font-semibold text-ink">
        That category doesn't exist.
      </h1>
      <p className="mt-2 max-w-md text-[14px] text-muted">
        It may have been renamed. Browse what's live or jump to the explore feed.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/categories">All categories</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/explore">Open Explore</Link>
        </Button>
      </div>
    </main>
  );
}
