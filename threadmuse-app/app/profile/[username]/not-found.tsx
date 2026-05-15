import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <h1 className="font-display text-h1 font-semibold text-ink">
        That creator isn't on ThreadMuse yet.
      </h1>
      <p className="mt-2 max-w-md text-[14px] text-muted">
        Maybe the handle changed — try Explore to find them another way.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/explore">Browse Explore</Link>
        </Button>
      </div>
    </main>
  );
}
