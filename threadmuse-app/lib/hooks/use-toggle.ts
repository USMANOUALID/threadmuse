"use client";

import * as React from "react";

/**
 * Shared mechanics for an "active/inactive + count" toggle. The action runs
 * inside `React.useTransition` so navigation isn't blocked, and we apply the
 * UI change optimistically before the round-trip — rolling back on failure.
 *
 * Used by like, save, and follow buttons.
 *
 *   const t = useToggle({
 *     initialActive: false,
 *     initialCount: post.likes,
 *     onToggle: () => toggleLike(post.id),
 *   });
 *   <button onClick={t.toggle}>…</button>
 *
 * The hook deliberately does NOT redirect on auth-required errors. Callers
 * can detect the "Sign in to …" error message and route to /login if they
 * want — for now we just surface it.
 */
export interface UseToggleArgs {
  initialActive: boolean;
  initialCount?: number;
  /**
   * Server action that toggles state. Must return
   *   { ok: true; active: boolean } | { ok: false; error: string }
   * (matches the shape produced by app/actions/social.ts).
   */
  onToggle: () => Promise<{ ok: true; active: boolean } | { ok: false; error: string }>;
}

export interface UseToggleReturn {
  active: boolean;
  count: number;
  pending: boolean;
  error: string | null;
  toggle: () => void;
  /** Caller can dismiss the inline error after showing a toast etc. */
  clearError: () => void;
}

export function useToggle({ initialActive, initialCount = 0, onToggle }: UseToggleArgs): UseToggleReturn {
  const [active, setActive] = React.useState(initialActive);
  const [count, setCount] = React.useState(initialCount);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  // If the parent re-renders with a new "initialActive" (e.g. SSR refresh
  // landed after navigation), reconcile. We only mirror the prop on changes,
  // not on every render — the local state remains authoritative between syncs.
  const lastInitialActiveRef = React.useRef(initialActive);
  const lastInitialCountRef = React.useRef(initialCount);
  React.useEffect(() => {
    if (lastInitialActiveRef.current !== initialActive) {
      setActive(initialActive);
      lastInitialActiveRef.current = initialActive;
    }
    if (lastInitialCountRef.current !== initialCount) {
      setCount(initialCount);
      lastInitialCountRef.current = initialCount;
    }
  }, [initialActive, initialCount]);

  const toggle = React.useCallback(() => {
    setError(null);
    // Optimistic flip.
    const prevActive = active;
    const prevCount = count;
    const nextActive = !prevActive;
    const nextCount = nextActive ? prevCount + 1 : Math.max(0, prevCount - 1);
    setActive(nextActive);
    setCount(nextCount);

    startTransition(async () => {
      const result = await onToggle();
      if (result.ok) {
        // Trust the server's `active` — it's the source of truth.
        if (result.active !== nextActive) {
          setActive(result.active);
          // We bumped the count assuming our optimistic direction; if the
          // server disagreed, snap back to the previous count and re-apply.
          setCount(result.active ? prevCount + 1 : Math.max(0, prevCount - 1));
        }
      } else {
        // Roll back.
        setActive(prevActive);
        setCount(prevCount);
        setError(result.error);
      }
    });
  }, [active, count, onToggle]);

  return {
    active,
    count,
    pending,
    error,
    toggle,
    clearError: () => setError(null),
  };
}
