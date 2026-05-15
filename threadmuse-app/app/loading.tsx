/**
 * Homepage skeleton. Pure divs — never imports real data so it can render
 * the instant the route is hit.
 */
function SkeletonCard({ h }: { h: number }) {
  return (
    <div className="mb-3.5 break-inside-avoid">
      <div className="rounded-lg bg-warm/60" style={{ height: h }} />
      <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-warm/50" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-warm/40" />
    </div>
  );
}

const HEIGHTS = [320, 420, 280, 360, 480, 320, 380, 260, 420, 320, 380, 240];

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] animate-pulse px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
      <div className="mb-3 h-12 w-2/3 max-w-2xl rounded-md bg-warm/70" />
      <div className="mb-8 h-5 w-1/3 max-w-sm rounded bg-warm/60" />
      <div className="columns-2 sm:columns-3 lg:columns-4 [column-gap:0.875rem]">
        {HEIGHTS.map((h, i) => (
          <SkeletonCard key={i} h={h} />
        ))}
      </div>
    </div>
  );
}
