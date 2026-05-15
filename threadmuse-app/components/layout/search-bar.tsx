"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Top-bar search. On submit the user is sent to /search?q=… (Phase 2 route).
 * Stays a controlled component so we can hook in autocomplete later without
 * touching consumers.
 */
export function SearchBar({
  className,
  defaultValue = "",
  placeholder = "Search 200k+ designs — “boho wallpaper”, “granny square”…",
  showKbd = true,
}: {
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  showKbd?: boolean;
}) {
  const [q, setQ] = React.useState(defaultValue);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K focuses the bar from anywhere in the page.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    window.location.assign(`/search?q=${encodeURIComponent(v)}`);
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-line/10 bg-bg px-3.5 py-2",
        "focus-within:border-ink",
        className,
      )}
    >
      <Search className="size-4 text-muted" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Search designs"
        className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
      />
      {showKbd && (
        <kbd className="hidden rounded border border-line/10 bg-surface px-1.5 py-0.5 text-[10.5px] text-muted sm:inline-block">
          ⌘ K
        </kbd>
      )}
    </form>
  );
}
