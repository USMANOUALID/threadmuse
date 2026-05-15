import Link from "next/link";
import { popularSearches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Bottom-of-homepage SEO block. Combines an indexable paragraph with a tag
 * cloud of popular searches — both linkable into `/search?q=…` so internal
 * link graph density goes up.
 */
export function SeoBlock({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="seo-heading"
      className={cn("bg-bg px-4 pt-10 sm:px-6 lg:px-8 xl:px-12", className)}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 rounded-2xl border border-line/10 bg-surface p-7 lg:grid-cols-2 lg:gap-12 lg:p-9">
          <div>
            <h2 id="seo-heading" className="font-display text-[20px] font-semibold tracking-tight text-ink">
              The most-loved digital design feed of 2026
            </h2>
            <p className="mt-3 text-pretty text-[13.5px] leading-relaxed text-muted">
              ThreadMuse is a discovery feed for independent makers. Browse{" "}
              <strong className="font-semibold text-ink">free crochet patterns</strong>,{" "}
              <strong className="font-semibold text-ink">cute iPhone wallpapers</strong>,{" "}
              <strong className="font-semibold text-ink">printable wall art</strong>, planners,
              embroidery PDFs and SVG files — sorted by craft, palette and mood. Save what you
              love, follow makers, and click through to their Etsy shops in one tap.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Popular searches
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {popularSearches.map((term) => (
                <li key={term}>
                  <Link
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="inline-block rounded-full border border-line/10 bg-bg px-3 py-1.5 text-[12px] text-ink hover:bg-warm"
                  >
                    {term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
