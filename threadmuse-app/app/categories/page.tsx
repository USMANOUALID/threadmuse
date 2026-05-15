import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryIcon } from "@/components/icons/category-icon";
import { categories } from "@/lib/mock-data";
import { buildMetadata } from "@/config/seo";
import { formatCount } from "@/lib/format";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "All categories — crafts, prints & digital downloads",
  description:
    "Every craft on ThreadMuse — crochet, knitting, embroidery, wallpapers, printable art, planners, SVGs, stickers, AI art and home decor.",
  path: "/categories",
});

const tiles = [
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

export default async function CategoriesIndexPage() {
  return (
    <PageShell>
      <section className="bg-bg px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
          <h1 className="mt-3 font-display text-display font-semibold tracking-tight text-ink">
            Every craft, every palette.
          </h1>
          <p className="mt-2 max-w-[680px] text-pretty text-[14.5px] leading-relaxed text-muted">
            Browse ThreadMuse by category. Each one is its own slow-scroll feed — refreshed daily,
            sorted by what real makers are saving this week.
          </p>
        </div>
      </section>

      <section className="bg-bg px-4 pt-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-line/10 bg-surface p-5 transition-shadow hover:shadow-lift"
                >
                  <div
                    className="flex size-14 items-center justify-center rounded-md text-white"
                    style={{ background: tiles[i % tiles.length] }}
                  >
                    <CategoryIcon kind={c.icon} size={26} />
                  </div>
                  <div>
                    <h2 className="font-display text-[16px] font-semibold text-ink">{c.name}</h2>
                    <p className="mt-1 text-[11.5px] text-muted">
                      {formatCount(c.count)} items
                    </p>
                  </div>
                  {c.blurb && (
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink/75">{c.blurb}</p>
                  )}
                  <span className="mt-auto inline-flex items-center text-[12px] font-semibold text-ink transition-colors group-hover:text-accent">
                    Explore {c.name} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
