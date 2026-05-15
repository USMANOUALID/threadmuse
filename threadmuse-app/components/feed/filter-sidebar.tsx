import { cn } from "@/lib/utils";

interface FilterGroup {
  label: string;
  pills: string[];
}

const defaultGroups: FilterGroup[] = [
  { label: "Type",  pills: ["All", "Free", "Premium", "New this week"] },
  { label: "Color", pills: ["Pink", "Blush", "Peach", "Cream", "Sand"] },
  { label: "Style", pills: ["Boho", "Minimalist", "Cottagecore", "Modern", "Vintage", "Y2K"] },
  { label: "Sort",  pills: ["Trending", "Most viewed", "Newest", "Most saved"] },
];

/**
 * Server-rendered filter rail. The active state is intentionally static for
 * Phase 2 (the visual chrome only); Phase 4 wires it to ?type=&color=&… in
 * the URL with a server action.
 */
export function FilterSidebar({
  className,
  groups = defaultGroups,
  initialActive,
}: {
  className?: string;
  groups?: FilterGroup[];
  /** Map of group-label → selected pill, defaults to first pill of each group. */
  initialActive?: Record<string, string>;
}) {
  return (
    <aside
      aria-label="Filters"
      className={cn("w-full lg:sticky lg:top-24 lg:w-60", className)}
    >
      <div className="flex flex-col gap-6">
        {groups.map((g) => {
          const active = initialActive?.[g.label] ?? g.pills[0];
          return (
            <div key={g.label}>
              <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                {g.label}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {g.pills.map((p) => {
                  const isOn = p === active;
                  return (
                    <li key={p}>
                      <button
                        type="button"
                        aria-pressed={isOn}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[12px] transition-colors",
                          isOn
                            ? "bg-ink font-semibold text-bg"
                            : "border border-line/10 bg-surface font-medium text-ink hover:bg-warm",
                        )}
                      >
                        {p}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Price slider — visual only for Phase 2 */}
        <div>
          <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Price
          </h3>
          <div className="rounded-lg border border-line/10 bg-surface p-4">
            <div className="flex justify-between text-[11px] text-muted">
              <span>$0</span>
              <span>$25+</span>
            </div>
            <div className="relative mt-2 h-1 rounded-full bg-line/20">
              <div className="absolute left-[15%] right-[32%] h-1 rounded-full bg-ink" />
              <div className="absolute -top-1.5 left-[15%] size-3.5 -translate-x-1/2 rounded-full border border-ink bg-surface shadow-sm" />
              <div className="absolute -top-1.5 left-[68%] size-3.5 -translate-x-1/2 rounded-full border border-ink bg-surface shadow-sm" />
            </div>
            <p className="mt-2.5 text-right text-[11.5px] text-ink">$3 – $17</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
