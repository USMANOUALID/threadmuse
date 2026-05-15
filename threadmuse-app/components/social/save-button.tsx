"use client";

import * as React from "react";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToggle } from "@/lib/hooks/use-toggle";
import { toggleSave } from "@/app/actions/social";
import { cn } from "@/lib/utils";

type Variant = "pill" | "icon" | "tile";

export interface SaveButtonProps {
  postId: string;
  initialActive: boolean;
  /** Saves count for variants that show it. Optional — pill mode hides it. */
  initialCount?: number;
  variant?: Variant;
  signInRedirect?: string;
  size?: ButtonProps["size"];
  className?: string;
}

/**
 * Save / unsave a post.
 *  - "icon"  → small circular overlay (used in post cards, top-right)
 *  - "pill"  → labelled outline button (post sidebar 3-up grid)
 *  - "tile"  → secondary block button (post sidebar primary "Save to collection")
 */
export function SaveButton({
  postId,
  initialActive,
  initialCount = 0,
  variant = "pill",
  signInRedirect,
  size = "sm",
  className,
}: SaveButtonProps) {
  const t = useToggle({
    initialActive,
    initialCount,
    onToggle: () => toggleSave(postId),
  });

  const needsSignIn = t.error?.toLowerCase().includes("sign in");
  const ariaLabel = t.active ? "Remove from saved" : "Save to collection";

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          aria-label={ariaLabel}
          aria-pressed={t.active}
          onClick={(e) => {
            // The card wraps the image in an <a>; this overlay must not trigger nav.
            e.preventDefault();
            e.stopPropagation();
            t.toggle();
          }}
          disabled={t.pending}
          className={cn(
            "flex size-8 items-center justify-center rounded-full bg-surface/95 text-ink shadow-sm transition-transform hover:scale-[1.06] active:scale-95 disabled:opacity-70",
            t.active && "bg-ink text-bg",
            className,
          )}
        >
          <Bookmark className={cn("size-4", t.active && "fill-current")} />
        </button>
        {needsSignIn && <SignInPrompt redirect={signInRedirect} className="mt-1" />}
      </>
    );
  }

  if (variant === "tile") {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={t.toggle}
          disabled={t.pending}
          aria-pressed={t.active}
          className={cn(t.active && "bg-ink text-bg hover:bg-ink/90", className)}
        >
          <Bookmark className={cn("size-4", t.active && "fill-current")} />
          {t.active ? "Saved" : "Save to collection"}
        </Button>
        {needsSignIn && <SignInPrompt redirect={signInRedirect} className="mt-1" />}
      </>
    );
  }

  // pill
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={size}
        className={cn("bg-bg", t.active && "border-ink", className)}
        onClick={t.toggle}
        disabled={t.pending}
        aria-pressed={t.active}
      >
        <Bookmark className={cn("size-3.5", t.active && "fill-current")} />
        {t.active ? "Saved" : "Save"}
      </Button>
      {needsSignIn && <SignInPrompt redirect={signInRedirect} className="mt-1" />}
    </>
  );
}

function SignInPrompt({ redirect, className }: { redirect?: string; className?: string }) {
  const href = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";
  return (
    <Link
      href={href}
      className={cn("block text-[11.5px] text-muted underline-offset-4 hover:underline", className)}
    >
      Sign in to save →
    </Link>
  );
}
