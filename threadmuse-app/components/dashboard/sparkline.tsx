/**
 * Minimal inline SVG sparkline. Server-renderable (no JS). The visual mood
 * matches the rest of the design system — warm tints, single-stroke path, no
 * grid lines. Intended for the analytics dashboard.
 */
export function Sparkline({
  data,
  width = 640,
  height = 160,
  label,
  ariaLabel,
}: {
  data: { date: string; views: number }[];
  width?: number;
  height?: number;
  label?: string;
  ariaLabel?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-line/15 bg-surface text-[12px] text-muted">
        No data yet.
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.views));
  const padX = 12;
  const padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = padY + innerH - (d.views / max) * innerH;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : `L${x.toFixed(1)} ${y.toFixed(1)}`))
    .join(" ");
  const areaPath = `${linePath} L${(padX + (data.length - 1) * stepX).toFixed(1)} ${(padY + innerH).toFixed(1)} L${padX} ${(padY + innerH).toFixed(1)} Z`;

  const lastDate = data[data.length - 1]?.date ?? "";
  const firstDate = data[0]?.date ?? "";

  return (
    <figure className="overflow-hidden rounded-lg border border-line/10 bg-surface p-4">
      {label && (
        <figcaption className="mb-2 flex items-baseline justify-between text-[12px] text-muted">
          <span className="font-semibold uppercase tracking-[0.12em] text-ink/70">{label}</span>
          <span>
            {fmt(firstDate)} – {fmt(lastDate)}
          </span>
        </figcaption>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block h-40 w-full"
        role="img"
        aria-label={ariaLabel ?? label ?? "Sparkline"}
      >
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="text-accent">
          <path d={areaPath} fill="url(#spark-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </figure>
  );
}

function fmt(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
