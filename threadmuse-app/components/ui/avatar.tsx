"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { hashSeed } from "@/lib/utils";

/** Curated tint pool — same hues as the design canvas TM_TINTS.blush family. */
const tintPool = [
  "#f5cfc0", "#f7c0aa", "#eda692", "#f4a890",
  "#e8b4c8", "#d9a4a4", "#fadccb", "#f7d1b8",
  "#e89280", "#f0bba6",
] as const;

const sizeMap = {
  xs: { wh: "h-6 w-6",  text: "text-[10px]" },
  sm: { wh: "h-8 w-8",  text: "text-[11px]" },
  md: { wh: "h-10 w-10", text: "text-[13px]" },
  lg: { wh: "h-14 w-14", text: "text-[16px]" },
  xl: { wh: "h-20 w-20", text: "text-[22px]" },
  "2xl": { wh: "h-28 w-28", text: "text-[28px]" },
} as const;
type Size = keyof typeof sizeMap;

const Root = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { size?: Size }
>(({ className, size = "md", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative inline-flex shrink-0 overflow-hidden rounded-full bg-warm",
      sizeMap[size].wh,
      className,
    )}
    {...props}
  />
));
Root.displayName = AvatarPrimitive.Root.displayName;

const Image = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
Image.displayName = AvatarPrimitive.Image.displayName;

const Fallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    seed?: string;
    size?: Size;
  }
>(({ className, seed = "tm", size = "md", children, ...props }, ref) => {
  const tint = tintPool[hashSeed(seed) % tintPool.length];
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      style={{ backgroundColor: tint }}
      className={cn(
        "flex h-full w-full items-center justify-center text-white font-display font-semibold",
        sizeMap[size].text,
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});
Fallback.displayName = AvatarPrimitive.Fallback.displayName;

export const Avatar = Object.assign(Root, { Image, Fallback });

/** Convenience wrapper that handles initials + tinted fallback from a creator name. */
export function CreatorAvatar({
  name,
  username,
  src,
  size = "md",
  className,
}: {
  name: string;
  username?: string;
  src?: string;
  size?: Size;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <Avatar size={size} className={className}>
      {src ? <Avatar.Image src={src} alt={name} /> : null}
      <Avatar.Fallback seed={username ?? name} size={size}>
        {initials}
      </Avatar.Fallback>
    </Avatar>
  );
}
