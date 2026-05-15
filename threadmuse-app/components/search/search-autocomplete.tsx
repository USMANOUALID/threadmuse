import Link from "next/link";
import { Search } from "lucide-react";
import { suggestSearches } from "@/lib/queries";
import { cn } from "@/lib/utils";

/**
 * Server-rendered autocomplete panel under the search bar. Renders the first
 * `limit` suggestions inline (no JS needed); the SearchBar client component
 * keeps the input state and Enter-submits to `/search?q=…`.
 */
export async function SearchAutocomplete({
  q,
  recent = [],
  className,
}: {
  q: string;
  recent?: string[];
  className?: string;
}) {
  const suggestions = await suggestSearches(q);

  return (
    <div
      className={cn(
        "rounded-lg border border-line/10 bg-surface p-2 shadow-lift",
        className,
      )}
    >
      <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        Suggestions
      </div>
      <ul>
        {suggestions.map((s, i) => (
          <li key={s.term}>
            <Link
              href={`/search?q=${encodeURIComponent(s.term)}`}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] text-ink",
                i === 0 ? "bg-warm" : "hover:bg-warm",
              )}
            >
              <Search className="size-3.5 text-muted" />
              <span className="flex-1 truncate">
                {highlight(s.term, q)}
              </span>
              <span className="text-[11px] text-muted">{s.hint}</span>
            </Link>
          </li>
        ))}
      </ul>

      {recent.length > 0 && (
        <>
          <div className="my-1.5 h-px bg-line/10" />
          <div className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Recent
          </div>
          <ul className="flex flex-wrap gap-1.5 px-2 pb-2">
            {recent.map((r) => (
              <li key={r}>
                <Link
                  href={`/search?q=${encodeURIComponent(r)}`}
                  className="inline-block rounded-full border border-line/10 bg-warm px-3 py-1.5 text-[12px] text-ink hover:bg-sand"
                >
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/** Bold the query within the suggestion. Server-safe — returns React nodes. */
function highlight(term: string, q: string) {
  const lower = term.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (q.length === 0 || idx === -1) return term;
  return (
    <>
      <strong className="font-semibold">{term.slice(0, idx + q.length)}</strong>
      {term.slice(idx + q.length)}
    </>
  );
}
