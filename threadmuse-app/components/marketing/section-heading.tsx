import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-display text-display font-semibold text-ink">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-muted md:text-lg">{description}</p>
      )}
    </div>
  );
}
