import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] whitespace-nowrap",
  {
    variants: {
      variant: {
        free: "bg-ink text-bg",
        price: "bg-surface/95 text-ink shadow-sm",
        tag: "bg-warm text-ink border border-line/10 font-medium",
        soft: "bg-soft/30 text-ink border border-soft/40 font-medium",
        outline: "bg-transparent text-ink border border-line/15 font-medium",
      },
      size: {
        sm: "text-[10.5px] px-2 py-0.5",
        md: "text-[11px] px-2.5 py-1",
        lg: "text-[12px] px-3 py-1.5",
      },
    },
    defaultVariants: { variant: "tag", size: "md" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
