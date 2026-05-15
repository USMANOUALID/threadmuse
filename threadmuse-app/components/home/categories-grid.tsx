import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { CategoryIcon } from "@/components/icons/category-icon";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Browse-by-category strip. 10-column grid on desktop, scrolls horizontally
 * on smaller screens via `flex` + `overflow-x-auto`.
 */
export function CategoriesGrid({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="categories-heading"
      className={cn("bg-bg px-4 pb-6 pt-2 sm:px-6 lg:px-8 xl:px-12", className)}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="categories-heading" className="tm-section-title">
            Browse by category
          </h2>
          <Link href="/categories" className="tm-section-link hover:underline">
            View all <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Mobile rail */}
        <ul className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 lg:hidden">
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <CategoryTile category={c} />
            </li>
          ))}
        </ul>

        {/* Desktop 10-col grid */}
        <ul className="hidden grid-cols-10 gap-2.5 lg:grid">
          {categories.map((c, i) => (
            <li key={c.slug}>
              <CategoryTile category={c} tintIndex={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const tintGradients = [
  "linear-gradient(135deg, #f5cfc0 0%, #eda692 100%)",
  "linear-gradient(135deg, #f7c0aa 0%, #f4a890 100%)",
  "linear-gradient(135deg, #e8b4c8 0%, #d98ba8 100%)",
  "linear-gradient(135deg, #fadccb 0%, #f7d1b8 100%)",
  "linear-gradient(135deg, #f0bba6 0%, #e89280 100%)",
  "linear-gradient(135deg, #f4a890 0%, #f7c0aa 100%)",
  "linear-gradient(135deg, #d9a4a4 0%, #eda692 100%)",
  "linear-gradient(135deg, #f5cfc0 0%, #e8b4c8 100%)",
  "linear-gradient(135deg, #eda692 0%, #f0bba6 100%)",
  "linear-gradient(135deg, #e89280 0%, #d9a4a4 100%)",
];

function CategoryTile({
  category,
  tintIndex = 0,
}: {
  category: (typeof categories)[number];
  tintIndex?: number;
}) {
  const gradient = tintGradients[tintIndex % tintGradients.length];

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex w-32 flex-col items-start gap-2 rounded-md border border-line/10 bg-surface p-3 transition-shadow hover:shadow-soft lg:w-auto"
    >
      <div
        className="flex size-9 items-center justify-center rounded-md text-white"
        style={{ background: gradient }}
      >
        <CategoryIcon kind={category.icon} size={20} />
      </div>
      <div>
        <div className="text-[12.5px] font-semibold leading-tight text-ink">{category.name}</div>
        <div className="mt-0.5 text-[11px] text-muted">{formatCount(category.count)} items</div>
      </div>
    </Link>
  );
}
