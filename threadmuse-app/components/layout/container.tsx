import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Page-wide content rail. 1440 max-width matches the design canvas.
 * `narrow` is used by SEO blocks and prose; `wide` is the default for the feed.
 */
export function Container({
  className,
  width = "wide",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { width?: "narrow" | "wide" | "full" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12",
        width === "narrow" && "max-w-3xl",
        width === "wide" && "max-w-[1440px]",
        width === "full" && "max-w-none",
        className,
      )}
      {...props}
    />
  );
}
