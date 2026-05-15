import Link from "next/link";
import { categories } from "@/lib/mock-data";
import { CategoryIcon } from "@/components/icons/category-icon";
import { cn } from "@/lib/utils";

/**
 * Horizontal-scrolling pill rail used at the top of the mobile feed.
 * `activeSlug` highlights the current category on category pages.
 */
export function CategoryPills({
  activeSlug,
  className,
}: {
  activeSlug?: string;
  className?: string;
}) {
  return (
    <div className={cn("scrollbar-none overflow-x-auto", className)}>
      <ul className="flex gap-2 px-4 py-1">
        <li>
          <Link
            href="/explore"
            aria-current={activeSlug === undefined ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px]",
              activeSlug === undefined
                ? "bg-ink font-semibold text-bg"
                : "border border-line/10 bg-surface font-medium text-ink hover:bg-warm",
            )}
          >
            All
          </Link>
        </li>
        {categories.map((c) => {
          const active = c.slug === activeSlug;
          return (
            <li key={c.slug} className="shrink-0">
              <Link
                href={`/category/${c.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px]",
                  active
                    ? "bg-ink font-semibold text-bg"
                    : "border border-line/10 bg-surface font-medium text-ink hover:bg-warm",
                )}
              >
                <CategoryIcon kind={c.icon} size={14} />
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
