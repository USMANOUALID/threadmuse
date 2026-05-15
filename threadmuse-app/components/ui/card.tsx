import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Generic card primitive. Use:
 *   <Card><Card.Body>…</Card.Body></Card>
 * for content cards. The Post feed has its own specialised PostCard.
 */

const Root = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("tm-card overflow-hidden", className)} {...props} />
  ),
);
Root.displayName = "Card";

const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  ),
);
Body.displayName = "Card.Body";

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start justify-between gap-3 p-5 pb-3", className)}
      {...props}
    />
  ),
);
Header.displayName = "Card.Header";

const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-display text-h3 font-semibold text-ink", className)}
      {...props}
    />
  ),
);
Title.displayName = "Card.Title";

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 border-t border-line/10 px-5 py-4", className)}
      {...props}
    />
  ),
);
Footer.displayName = "Card.Footer";

export const Card = Object.assign(Root, { Body, Header, Title, Footer });
