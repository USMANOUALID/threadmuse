import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Canonical upgrade UI. Used everywhere an upgrade gate appears — the upload
 * action's blocked state, the past-due banner's recovery CTA, future
 * per-feature gates, etc.
 *
 * Three visual sizes — pick by surface, not by content:
 *   - "card"   default. Standalone block, e.g. when an action is blocked.
 *   - "inline" compact, fits inside a form alongside an error message.
 *   - "banner" full-width strip across the top of a page.
 *
 * Server-renderable. CTA is a plain `<Link>` to `/pricing` so it works without
 * JS and Next can prefetch.
 */
export interface UpgradePromptProps {
  /** Headline. Keep short — 1 line on mobile. */
  title: string;
  /** One-sentence description of what unlocking the upgrade gets the user. */
  description: string;
  /** The user's current plan name. Renders as a small chip. */
  currentPlan?: string;
  /** Override the CTA copy. Defaults to "See plans". */
  ctaLabel?: string;
  /** Override the CTA destination. Defaults to /pricing. */
  ctaHref?: string;
  /** Secondary link (e.g. "Manage billing" for past_due users). */
  secondary?: { label: string; href: string };
  size?: "card" | "inline" | "banner";
  /** Forwarded for layout tweaks at the call site. */
  className?: string;
}

export function UpgradePrompt({
  title,
  description,
  currentPlan,
  ctaLabel = "See plans",
  ctaHref = "/pricing",
  secondary,
  size = "card",
  className,
}: UpgradePromptProps) {
  if (size === "banner") {
    return (
      <div
        role="region"
        aria-label="Upgrade required"
        className={cn(
          "flex flex-wrap items-center gap-3 border-b border-line/10 bg-warm px-4 py-2.5 sm:px-6 lg:px-8 xl:px-12",
          className,
        )}
      >
        <Sparkles className="size-4 shrink-0 text-ink" aria-hidden />
        <div className="flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-semibold text-ink">{title}</span>
          <span className="text-[12.5px] text-ink/80">{description}</span>
        </div>
        {currentPlan && <PlanChip name={currentPlan} />}
        <div className="ml-auto flex items-center gap-2">
          {secondary && (
            <Link
              href={secondary.href}
              className="text-[12.5px] text-ink underline-offset-4 hover:underline"
            >
              {secondary.label}
            </Link>
          )}
          <Button asChild size="sm">
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (size === "inline") {
    return (
      <div
        role="region"
        aria-label="Upgrade required"
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-md border border-line/10 bg-warm px-3.5 py-3",
          className,
        )}
      >
        <Sparkles className="size-4 shrink-0 text-ink" aria-hidden />
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[13px] font-semibold text-ink">{title}</span>
            {currentPlan && <PlanChip name={currentPlan} />}
          </div>
          <p className="mt-0.5 text-[12px] leading-relaxed text-ink/80">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {secondary && (
            <Button asChild size="sm" variant="ghost">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // card (default)
  return (
    <div
      role="region"
      aria-label="Upgrade required"
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-line/10 bg-surface p-5 shadow-soft",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-warm text-ink">
          <Sparkles className="size-4" />
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="font-display text-[15px] font-semibold text-ink">{title}</h3>
          {currentPlan && <PlanChip name={currentPlan} />}
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-ink/85">{description}</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
        {secondary && (
          <Button asChild variant="outline">
            <Link href={secondary.href}>{secondary.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function PlanChip({ name }: { name: string }) {
  return (
    <span className="rounded-full border border-line/10 bg-surface px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">
      {name}
    </span>
  );
}
