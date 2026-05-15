import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Chip rail + sort menu above feed pages. Visual-only for Phase 2 — Phase 4
 * wires `?sort=` to a server action.
 */
export function SortToolbar({
  options = ["For you", "Following", "Newest", "Free only", "Premium"],
  active = "For you",
  showFilterButton = true,
  className,
}: {
  options?: string[];
  active?: string;
  showFilterButton?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <ul className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {options.map((label) => {
          const isOn = label === active;
          return (
            <li key={label}>
              <Button
                size="sm"
                variant={isOn ? "primary" : "outline"}
                pill
                aria-pressed={isOn}
              >
                {label}
              </Button>
            </li>
          );
        })}
      </ul>

      {showFilterButton && (
        <Button size="sm" variant="outline" className="ml-auto hidden md:inline-flex">
          <Filter className="size-3.5" />
          Filters
        </Button>
      )}
    </div>
  );
}

/** Compact "Sort: Newest ▾" dropdown trigger used on profile / category pages. */
export function SortMenuButton({ value = "Newest" }: { value?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] text-muted">
      Sort:
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md border border-line/10 bg-surface px-3 py-1.5 text-[12px] text-ink hover:bg-warm"
      >
        {value}
        <ChevronDown className="size-3" />
      </button>
    </span>
  );
}
