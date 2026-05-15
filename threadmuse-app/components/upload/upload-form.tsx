"use client";

import * as React from "react";
import { Pin, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadStepper } from "@/components/upload/upload-stepper";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { createPost } from "@/app/actions/upload";
import { cn } from "@/lib/utils";
import type { Category, IllustrationKind } from "@/types";

/**
 * The full upload page form. One client component owns:
 *   - cover File + gallery File[]
 *   - title, description, category, kind, price, etsyUrl, tags, illustrationHeight
 *   - error + submitting state
 *
 * Submission rebuilds a FormData (so files are sent as multipart) and calls
 * the `createPost` server action. Success redirects to `/post/[slug]` via
 * the action's `redirect()`; the failure path renders inline.
 */

const KIND_OPTIONS: { value: IllustrationKind; label: string }[] = [
  { value: "crochet", label: "Crochet" },
  { value: "wallpaper", label: "Wallpaper" },
  { value: "print", label: "Printable" },
  { value: "planner", label: "Planner" },
  { value: "embroidery", label: "Embroidery" },
  { value: "knit", label: "Knit" },
  { value: "svg", label: "SVG" },
  { value: "sticker", label: "Sticker" },
  { value: "ai", label: "AI art" },
  { value: "home", label: "Home decor" },
];

export function UploadForm({ categories }: { categories: Category[] }) {
  const [cover, setCover] = React.useState<File | null>(null);
  const [gallery, setGallery] = React.useState<File[]>([]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<string>(categories[0]?.slug ?? "");
  const [kind, setKind] = React.useState<IllustrationKind>("crochet");
  const [isPremium, setIsPremium] = React.useState(false);
  const [priceValue, setPriceValue] = React.useState("3.20"); // numeric only
  const [etsyUrl, setEtsyUrl] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [pinterest, setPinterest] = React.useState(true);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [upgrade, setUpgrade] = React.useState<{
    code: string;
    currentPlan: string;
    detail?: { used: number; limit: number };
  } | null>(null);

  // Derived: when category changes, default the kind to a reasonable match
  // for that category (this is a UX nicety; the user can still override).
  React.useEffect(() => {
    const guess = categoryToKindGuess(category);
    if (guess) setKind(guess);
  }, [category]);

  function addTagFromInput() {
    const next = tagsInput
      .split(/[,\s]+/)
      .map((t) => t.toLowerCase().replace(/[^a-z0-9-]/g, ""))
      .filter(Boolean);
    if (next.length === 0) return;
    const merged = Array.from(new Set([...tags, ...next])).slice(0, 12);
    setTags(merged);
    setTagsInput("");
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setUpgrade(null);

    if (!cover) {
      setError("Add a cover image.");
      return;
    }
    if (title.trim().length < 3) {
      setError("Add a title (3+ characters).");
      return;
    }
    if (!category) {
      setError("Pick a category.");
      return;
    }

    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("category", category);
    fd.set("kind", kind);
    fd.set("price", isPremium ? `$${priceValue}` : "Free");
    fd.set("etsyUrl", etsyUrl);
    fd.set("tags", tags.join(","));
    fd.set("illustrationHeight", "400");
    fd.set("cover", cover);
    for (const g of gallery) fd.append("gallery", g);

    setSubmitting(true);
    try {
      const result = await createPost(fd);
      // On success the action redirects — code below only runs on failure.
      if (result && result.ok === false) {
        if (result.upgradeRequired) {
          setUpgrade(result.upgradeRequired);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      // Next's redirect() throws a special error that we should re-throw.
      // Anything else is a real failure.
      if (isNextRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Header band */}
      <section className="bg-bg px-4 pt-7 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-display font-semibold tracking-tight text-ink">
                Upload a design
              </h1>
              <p className="mt-1.5 text-[14px] text-muted">
                Share something handmade. It'll be live in your shop within minutes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={submitting}>
                Save draft
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Publishing…" : "Publish"}
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <UploadStepper />
          </div>
        </div>
      </section>

      {/* Form grid */}
      <section className="bg-bg px-4 pt-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* Left column: dropzone + pinterest toggle */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[18px] font-semibold text-ink">Cover & gallery</h2>
            <UploadDropzone
              cover={cover}
              gallery={gallery}
              onCoverChange={setCover}
              onGalleryChange={setGallery}
            />

            <div className="flex items-center gap-3 rounded-md border border-line/10 bg-surface p-3.5">
              <div className="flex size-8 items-center justify-center rounded-md bg-warm text-ink">
                <Pin className="size-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-ink">Generate Pinterest pin</div>
                <div className="text-[11.5px] text-muted">
                  We'll auto-make a 1000×1500 vertical pin with your title baked in.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pinterest}
                onClick={() => setPinterest((v) => !v)}
                className={cn(
                  "flex h-5 w-9 items-center rounded-full p-0.5 transition-colors",
                  pinterest ? "bg-ink" : "bg-line/30",
                )}
              >
                <div
                  className={cn(
                    "size-4 rounded-full bg-surface transition-transform",
                    pinterest ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Right column: fields */}
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-[18px] font-semibold text-ink">Details</h2>

            <Field
              label="Title"
              hint={`${title.length} / 120 characters — keywords like the craft, color and difficulty rank best.`}
            >
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
                placeholder="Daisy Coaster — beginner crochet pattern"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={2000}
                className="min-h-24 w-full rounded-md border border-line/10 bg-surface px-3 py-2.5 text-[13.5px] leading-relaxed text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                placeholder="A buttery-soft daisy coaster you can make in an evening…"
              />
            </Field>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Category">
                <Select value={category} onChange={(v) => setCategory(v)}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Kind">
                <Select value={kind} onChange={(v) => setKind(v as IllustrationKind)}>
                  {KIND_OPTIONS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Price">
                <div className="flex items-center gap-2 rounded-md border border-line/10 bg-surface px-3 py-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPremium}
                    onClick={() => setIsPremium((v) => !v)}
                    className={cn(
                      "flex h-5 w-9 items-center rounded-full p-0.5 transition-colors",
                      isPremium ? "bg-ink" : "bg-line/30",
                    )}
                  >
                    <div
                      className={cn(
                        "size-4 rounded-full bg-surface transition-transform",
                        isPremium ? "translate-x-4" : "translate-x-0",
                      )}
                    />
                  </button>
                  <span className="text-[13px] text-ink">
                    {isPremium ? "Premium" : "Free"}
                  </span>
                  {isPremium && (
                    <div className="ml-auto flex items-center gap-1 text-[13px] text-ink">
                      <span className="text-muted">$</span>
                      <input
                        value={priceValue}
                        onChange={(e) => setPriceValue(e.target.value)}
                        inputMode="decimal"
                        pattern="[0-9]+(\.[0-9]{1,2})?"
                        className="w-16 bg-transparent text-right outline-none"
                      />
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Etsy listing link" hint="We'll auto-tag this as your affiliate link.">
                <Input
                  type="url"
                  value={etsyUrl}
                  onChange={(e) => setEtsyUrl(e.target.value)}
                  placeholder="https://www.etsy.com/listing/…"
                />
              </Field>
            </div>

            {/* Tags */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.01em] text-ink">Tags</label>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-md border border-line/10 bg-surface p-2.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-warm px-2.5 py-1 text-[12px] text-ink"
                  >
                    #{t}
                    <button
                      type="button"
                      aria-label={`Remove ${t}`}
                      onClick={() => removeTag(t)}
                    >
                      <X className="size-3 text-muted hover:text-ink" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTagFromInput();
                    }
                  }}
                  onBlur={addTagFromInput}
                  placeholder={tags.length === 0 ? "+ Add tag" : "+ more"}
                  className="min-w-[90px] flex-1 bg-transparent px-1 py-0.5 text-[12px] text-ink outline-none placeholder:text-muted"
                />
              </div>
              <p className="mt-2 text-[11.5px] text-muted">
                Use 6–10 tags. Mix specific ("daisy coaster") and broad ("crochet").
              </p>
            </div>

            {/* AI tagging callout — unchanged Phase-2 visual, Phase 5 wires it. */}
            <div className="flex items-center gap-3 rounded-md border border-line/10 bg-warm p-3.5">
              <div className="flex size-8 items-center justify-center rounded-md bg-ink text-bg">
                <Sparkles className="size-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-ink">AI tagging available</div>
                <div className="text-[11.5px] text-muted">
                  We can suggest 8 more tags from your image — uses your daily credit.
                </div>
              </div>
              <Button type="button" size="sm" variant="outline">
                Run
              </Button>
            </div>

            {upgrade && (
              <UpgradePrompt
                size="inline"
                title={upgradeTitle(upgrade.code)}
                description={upgradeDescription(upgrade)}
                currentPlan={upgrade.currentPlan}
                ctaLabel={
                  upgrade.code === "SUBSCRIPTION_PAST_DUE" ? "Update payment" : "See plans"
                }
                ctaHref={
                  upgrade.code === "SUBSCRIPTION_PAST_DUE" ? "/settings/billing" : "/pricing"
                }
                secondary={
                  upgrade.code === "SUBSCRIPTION_PAST_DUE"
                    ? { label: "View plans", href: "/pricing" }
                    : undefined
                }
              />
            )}

            {error && !upgrade && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-[12.5px] text-destructive"
              >
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Publishing…" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}

// ── local form primitives ───────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold tracking-[0.01em] text-ink">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-muted">{hint}</span>}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-md border border-line/10 bg-surface px-3 pr-8 text-[13.5px] text-ink focus-visible:border-ink focus-visible:outline-none"
      >
        {children}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        ▾
      </span>
    </div>
  );
}

// ── small helpers ───────────────────────────────────────────

function categoryToKindGuess(slug: string): IllustrationKind | null {
  switch (slug) {
    case "crochet-patterns": return "crochet";
    case "wallpapers": return "wallpaper";
    case "printable-art": return "print";
    case "digital-planners": return "planner";
    case "embroidery": return "embroidery";
    case "knitting": return "knit";
    case "svg-files": return "svg";
    case "stickers": return "sticker";
    case "ai-art": return "ai";
    case "home-decor": return "home";
    default: return null;
  }
}

/**
 * Next's `redirect()` throws an internal error so the runtime can hijack the
 * response. We need to re-throw it instead of treating it as a generic
 * exception in our try/catch.
 */
function isNextRedirectError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const digest = (err as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

// ── upgrade-prompt copy ─────────────────────────────────────
// Centralised so the same wording surfaces here, on the dashboard, and in
// any future per-feature gate. Keep tone matching the rest of the marketing
// copy — warm, never scolding.

function upgradeTitle(code: string): string {
  switch (code) {
    case "OVER_PUBLISHED_POSTS":
      return "You've hit your plan's published-post limit";
    case "OVER_DAILY_UPLOADS":
      return "Daily upload limit reached";
    case "SUBSCRIPTION_PAST_DUE":
      return "Payment issue — uploads are paused";
    default:
      return "Upgrade required";
  }
}

function upgradeDescription(u: {
  code: string;
  currentPlan: string;
  detail?: { used: number; limit: number };
}): string {
  switch (u.code) {
    case "OVER_PUBLISHED_POSTS":
      return u.detail
        ? `You're using ${u.detail.used} of ${u.detail.limit} posts on ${u.currentPlan}. Upgrade for unlimited.`
        : `${u.currentPlan} has a fixed post limit. Upgrade for unlimited.`;
    case "OVER_DAILY_UPLOADS":
      return u.detail
        ? `You've uploaded ${u.detail.used} of ${u.detail.limit} today on ${u.currentPlan}. Wait until tomorrow or upgrade for more headroom.`
        : `Daily upload cap reached. Upgrade for a higher limit.`;
    case "SUBSCRIPTION_PAST_DUE":
      return "Your last payment didn't go through. Update your card to resume uploading; nothing's been deleted.";
    default:
      return "This feature is available on a paid plan.";
  }
}
