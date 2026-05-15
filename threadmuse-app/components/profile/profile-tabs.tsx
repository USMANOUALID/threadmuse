import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProfileTab {
  key: string;
  label: string;
  count: number;
  hrefSuffix?: string;
}

const tabs: ProfileTab[] = [
  { key: "uploads",     label: "Uploads",     count: 248,  hrefSuffix: "" },
  { key: "saved",       label: "Saved",       count: 1284, hrefSuffix: "/saved" },
  { key: "collections", label: "Collections", count: 14,   hrefSuffix: "/collections" },
  { key: "liked",       label: "Liked",       count: 542,  hrefSuffix: "/liked" },
];

/**
 * Underline tab nav. The active tab is passed in from the page (driven by
 * the route segment in Phase 4 — for Phase 2 it's static "uploads").
 */
export function ProfileTabs({
  username,
  active = "uploads",
  className,
}: {
  username: string;
  active?: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Profile sections"
      className={cn(
        "scrollbar-none overflow-x-auto border-b border-line/10 px-4 md:px-8",
        className,
      )}
    >
      <ul className="flex">
        {tabs.map((t) => {
          const isOn = t.key === active;
          return (
            <li key={t.key} className="shrink-0">
              <Link
                href={`/profile/${username}${t.hrefSuffix ?? ""}`}
                aria-current={isOn ? "page" : undefined}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-4 py-3 text-[13.5px]",
                  isOn
                    ? "border-b-2 border-ink font-semibold text-ink"
                    : "border-b-2 border-transparent font-medium text-muted hover:text-ink",
                )}
              >
                {t.label}
                <span className="rounded-full bg-warm px-1.5 py-px text-[11px] text-muted">
                  {t.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
