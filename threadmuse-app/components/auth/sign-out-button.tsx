"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";

/**
 * Sign-out trigger. Wraps the `signOut` server action — which clears the
 * session, revalidates the root layout, and redirects to `/`. Renders as a
 * <form> so the action runs without client JS as well.
 *
 * Usage:
 *   <SignOutButton />
 *   <SignOutButton variant="ghost" size="sm">Sign out</SignOutButton>
 */
export function SignOutButton({
  children,
  variant = "ghost",
  size = "sm",
  showIcon = true,
  ...rest
}: Omit<ButtonProps, "type" | "asChild"> & { showIcon?: boolean }) {
  return (
    <form action={signOut} className="contents">
      <Button type="submit" variant={variant} size={size} {...rest}>
        {showIcon && <LogOut className="size-4" />}
        {children ?? "Sign out"}
      </Button>
    </form>
  );
}
