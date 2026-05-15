import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  key: string;
  label: string;
  done: boolean;
}

const defaultSteps: Step[] = [
  { key: "images",  label: "1. Images",  done: true  },
  { key: "details", label: "2. Details", done: true  },
  { key: "pricing", label: "3. Pricing", done: false },
  { key: "seo",     label: "4. SEO",     done: false },
  { key: "preview", label: "5. Preview", done: false },
];

/** Horizontal "wizard" stepper. Pure visual. */
export function UploadStepper({
  steps = defaultSteps,
  className,
}: {
  steps?: Step[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-wrap gap-2", className)}>
      {steps.map((s) => (
        <li
          key={s.key}
          aria-current={s.done ? undefined : "step"}
          className={cn(
            "inline-flex flex-1 min-w-[120px] items-center gap-2 rounded-md px-3.5 py-2.5 text-[12px] font-semibold",
            s.done
              ? "bg-ink text-bg"
              : "border border-line/10 bg-surface text-muted",
          )}
        >
          {s.done ? (
            <Check className="size-3.5" />
          ) : (
            <span className="size-3.5 rounded-full border-[1.5px] border-current" />
          )}
          {s.label}
        </li>
      ))}
    </ol>
  );
}
