import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-bg shadow-cta hover:bg-ink/90 active:bg-ink/95",
        secondary:
          "bg-warm text-ink border border-line/10 hover:bg-sand active:bg-warm/80",
        ghost:
          "bg-transparent text-ink hover:bg-warm",
        outline:
          "bg-surface text-ink border border-line/10 hover:bg-warm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:
          "text-ink underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[12.5px]",
        md: "h-10 px-4 text-[13.5px]",
        lg: "h-12 px-5 text-[14px]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
      },
      pill: {
        true: "rounded-full",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", pill: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Use the child element as the rendered tag (e.g. `<Link>`). */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pill, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, pill }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
