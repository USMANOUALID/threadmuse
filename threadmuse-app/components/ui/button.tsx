import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white shadow-cta hover:bg-accent/90 active:bg-accent/95",
        secondary:
          "border border-line/10 bg-warm text-ink hover:bg-accent/15 active:bg-warm/80",
        ghost:
          "bg-transparent text-ink hover:bg-line/10",
        outline:
          "border border-line/10 bg-surface text-ink hover:border-accent/50 hover:bg-accent/10",
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
