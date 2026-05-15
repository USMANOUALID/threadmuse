import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Accessible breadcrumb trail. Last item is announced as the current page.
 * Emits a JSON-LD BreadcrumbList in Phase 7 — for now visual only.
 */
export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[12px] text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-ink" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3 text-muted" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
