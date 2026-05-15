"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToggle } from "@/lib/hooks/use-toggle";
import { toggleLike } from "@/app/actions/social";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Like toggle. Three visual modes:
 *   variant="pill"   → full pill button with label + count (post sidebar, mobile CTA)
 *   variant="meta"   → inline icon+count (post meta row, card footer)
 *   variant="icon"   → bare 32px circular button (card overlay)
 *
 * When the user isn't signed in, the action returns `{ ok: false }`. We
 * intercept that, render a small inline link to /login, and don't toast.
 */

type Variant = "pill" | "meta" | "icon";

export interface LikeButtonProps {
  postId: string;
  initialActive: boolean;
  initialCount: number;
  variant?: Variant;
  /** Where to send the user if they need to sign in. Defaults to current path. */
  signInRedirect?: string;
  /** Forwarded for "pill" variant only. */
  size?: ButtonProps["size"];
  className?: string;
}

export function LikeButton({
  postId,
  initialActive,
  initialCount,
  variant = "pill",
  signInRedirect,
  size = "sm",
  className,
}: LikeButtonProps) {
  const t = useToggle({
    initialActive,
    initialCount,
    onToggle: () => toggleLike(postId),
  });

  const needsSignIn = t.error?.toLowerCase().includes("sign in");
  const ariaLabel = t.active ? "Unlike" : "Like";

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          aria-label={ariaLabel}
          aria-pressed={t.active}
          onClick={t.toggle}
          disabled={t.pending}
          className={cn(
            "flex size-8 items-center justify-center rounded-full bg-surface/95 text-ink shadow-sm transition-transform hover:scale-[1.06] active:scale-95 disabled:opacity-70",
            className,
          )}
        >
          <Heart className={cn("size-4", t.active && "fill-current text-accent")} />
        </button>
        {needsSignIn && <SignInPrompt redirect={signInRedirect} className="mt-1" />}
      </>
    );
  }

  if (variant === "meta") {
    return (
      <>
        <button
          type="button"
          onClick={t.toggle}
          disabled={t.pending}
          aria-pressed={t.active}
          aria-label={`${ariaLabel} (${formatCount(t.count)})`}
          className={cn(
            "inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-ink disabled:opacity-70",
            t.active && "text-accent",
            className,
          )}
        >
          <Heart className={cn("size-3.5", t.active && "fill-current")} />
          {formatCount(t.count)}
        </button>
        {needsSignIn && <SignInPrompt redirect={signInRedirect} className="mt-0.5" />}
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
        className={cn("bg-bg", t.active && "border-accent text-accent", className)}
        onClick={t.toggle}
        disabled={t.pending}
        aria-pressed={t.active}
      >
        <Heart className={cn("size-3.5", t.active && "fill-current")} />
        {t.active ? "Liked" : "Like"}
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
      Sign in to react →
    </Link>
  );
}
