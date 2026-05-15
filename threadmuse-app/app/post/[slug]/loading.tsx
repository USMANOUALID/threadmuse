export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
      <div className="mb-6 h-4 w-72 animate-pulse rounded bg-warm/70" />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_280px]">
        <div>
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-warm/60" />
          <div className="mt-6 h-6 w-2/3 animate-pulse rounded bg-warm/60" />
          <div className="mt-3 h-10 w-3/4 animate-pulse rounded bg-warm/40" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-44 animate-pulse rounded-lg bg-warm/40" />
          <div className="h-32 animate-pulse rounded-lg bg-warm/40" />
        </div>
      </div>
    </div>
  );
}
