import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PostNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <h1 className="font-display text-h1 font-semibold text-ink">
        This design has flown the coop.
      </h1>
      <p className="mt-2 max-w-md text-[14px] text-muted">
        It may have been removed by the creator. Try a different design or jump back to the feed.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/explore">Browse Explore</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/trending">See trending</Link>
        </Button>
      </div>
    </main>
  );
}
