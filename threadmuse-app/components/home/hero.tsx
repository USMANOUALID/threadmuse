import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostIllustration } from "@/components/feed/post-illustration";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Homepage hero. The design canvas exposes two variants — "split" (image-heavy
 * collage on the right) and "text" (typography-forward). Phase 1 ships the
 * split variant since it's the brand's headline first impression. Variant
 * switching lands as a user preference in Phase 5.
 */
export function Hero({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn("bg-bg px-4 pb-9 pt-7 sm:px-6 lg:px-8 xl:px-12 lg:pb-12 lg:pt-12", className)}
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="flex flex-col items-start gap-5 lg:gap-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-warm px-3 py-1.5 text-[12px] font-medium text-ink">
            <Sparkles className="size-3.5" />
            Fresh drops every Friday
          </div>

          <h1
            id="hero-heading"
            className="text-balance font-display text-display-lg font-semibold text-ink"
          >
            Discover beautiful digital designs.
          </h1>

          <p className="max-w-[520px] text-pretty text-[16px] leading-relaxed text-muted lg:text-[17px]">
            Explore crochet patterns, wallpapers, printable art and more — from a feed handpicked
            for slow, thoughtful makers.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild size="lg">
              <Link href="/explore">
                Start exploring
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/upload">Upload a design</Link>
            </Button>
          </div>

          <dl className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted">
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Designs</dt>
              <dd className="font-bold text-ink">{siteConfig.stats.designs}</dd>
              <span>designs</span>
            </div>
            <div className="hidden h-3 w-px bg-line/15 sm:block" />
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Creators</dt>
              <dd className="font-bold text-ink">{siteConfig.stats.creators}</dd>
              <span>creators</span>
            </div>
            <div className="hidden h-3 w-px bg-line/15 sm:block" />
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Monthly viewers</dt>
              <dd className="font-bold text-ink">{siteConfig.stats.monthlyViewers}</dd>
              <span>monthly viewers</span>
            </div>
          </dl>
        </div>

        {/* Collage — purely decorative; SVG placeholders only. */}
        <div
          aria-hidden
          className="relative hidden h-[460px] lg:block"
        >
          <CollageTile kind="crochet"  seed={3}  className="left-0   top-6    h-[280px] w-[200px] -rotate-[4deg]" />
          <CollageTile kind="wallpaper"seed={5}  className="left-[220px] top-0  h-[320px] w-[220px] rotate-2" />
          <CollageTile kind="print"    seed={7}  className="left-0   top-[320px] h-[140px] w-[200px] -rotate-2" />
          <CollageTile kind="sticker"  seed={11} className="left-[220px] top-[340px] h-[120px] w-[220px] rotate-[4deg]" />
        </div>
      </div>
    </section>
  );
}

function CollageTile({
  kind,
  seed,
  className,
}: React.ComponentProps<typeof PostIllustration> & { className?: string }) {
  return (
    <div
      className={cn(
        "absolute overflow-hidden rounded-2xl shadow-lift",
        className,
      )}
    >
      <PostIllustration kind={kind} seed={seed} />
    </div>
  );
}
