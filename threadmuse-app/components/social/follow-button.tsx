"use client";

import * as React from "react";
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToggle } from "@/lib/hooks/use-toggle";
import { toggleFollow } from "@/app/actions/social";
import { cn } from "@/lib/utils";

export interface FollowButtonProps {
  /** Target profile.id (not username) — toggleFollow needs the uuid. */
  targetUserId: string;
  initialActive: boolean;
  /** Hide the button entirely if the viewer is the target (avoids "Follow yourself"). */
  isSelf?: boolean;
  signInRedirect?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  /** Override copy. Defaults: "Follow" / "Following". */
  label?: { idle: string; active: string };
}

/**
 * Follow / unfollow a creator. Hidden when the viewer is the same user.
 * The "following" state flips to a softer outline variant so it doesn't
 * scream at the user from across the page.
 */
export function FollowButton({
  targetUserId,
  initialActive,
  isSelf = false,
  signInRedirect,
  size = "md",
  variant = "primary",
  className,
  label,
}: FollowButtonProps) {
  const t = useToggle({
    initialActive,
    initialCount: 0, // follow buttons don't surface a count locally
    onToggle: () => toggleFollow(targetUserId),
  });

  if (isSelf) return null;

  const needsSignIn = t.error?.toLowerCase().includes("sign in");
  const copy = label ?? { idle: "Follow", active: "Following" };

  return (
    <>
      <Button
        type="button"
        variant={t.active ? "outline" : variant}
        size={size}
        onClick={t.toggle}
        disabled={t.pending}
        aria-pressed={t.active}
        className={className}
      >
        {t.active ? copy.active : copy.idle}
      </Button>
      {needsSignIn && (
        <Link
          href={signInRedirect ? `/login?redirect=${encodeURIComponent(signInRedirect)}` : "/login"}
          className="block text-[11.5px] text-muted underline-offset-4 hover:underline"
        >
          Sign in to follow →
        </Link>
      )}
    </>
  );
}
