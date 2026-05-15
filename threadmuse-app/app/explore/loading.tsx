function SkeletonCard({ h }: { h: number }) {
  return (
    <div className="mb-3.5 break-inside-avoid">
      <div className="rounded-lg bg-warm/60" style={{ height: h }} />
      <div className="mt-3 h-3 w-3/4 rounded bg-warm/50" />
    </div>
  );
}

const HEIGHTS = [340, 420, 280, 360, 480, 320, 360, 240, 420];

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] animate-pulse px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
      <div className="mb-3 h-4 w-40 rounded bg-warm/70" />
      <div className="mb-8 h-12 w-56 rounded-md bg-warm" />
      <div className="columns-2 sm:columns-3 lg:columns-4 [column-gap:0.875rem]">
        {HEIGHTS.map((h, i) => (
          <SkeletonCard key={i} h={h} />
        ))}
      </div>
    </div>
  );
}
