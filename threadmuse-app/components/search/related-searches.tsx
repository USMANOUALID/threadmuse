import Link from "next/link";
import { cn } from "@/lib/utils";

interface RelatedSearch {
  term: string;
  count: string;
}

const defaults: RelatedSearch[] = [
  { term: "Cute iPhone wallpapers",          count: "12.8k items" },
  { term: "Boho desktop wallpapers",         count: "3.2k items"  },
  { term: "Free pink wallpapers",            count: "8.6k items"  },
  { term: "Coquette aesthetic wallpapers",   count: "5.4k items"  },
  { term: "Pink minimalist wallpapers",      count: "2.1k items"  },
  { term: "Y2K pink wallpapers",             count: "1.8k items"  },
];

/**
 * "Related searches" SEO block at the bottom of /search and /category pages.
 * Each row links into /search?q=… so internal anchors compound.
 */
export function RelatedSearches({
  items = defaults,
  heading = "Related searches",
  className,
}: {
  items?: RelatedSearch[];
  heading?: string;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line/10 bg-surface p-6 lg:p-7", className)}>
      <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink">
        {heading}
      </h2>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ term, count }) => (
          <li key={term}>
            <Link
              href={`/search?q=${encodeURIComponent(term)}`}
              className="flex items-center justify-between rounded-md border border-line/10 bg-bg px-3.5 py-2.5 hover:bg-warm"
            >
              <span className="text-[13px] font-medium text-ink">{term}</span>
              <span className="text-[11.5px] text-muted">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
