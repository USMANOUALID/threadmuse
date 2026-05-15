import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

/**
 * Helpers for reading auth state inside server components / actions.
 * `cache()` dedupes calls within a single render so multiple components on
 * the same page only do one round-trip to Supabase.
 */

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});

export interface CurrentUserBundle {
  user: User;
  profile: ProfileRow;
}

/**
 * Returns the logged-in user *with* their profile row, or null. Useful for
 * pages that need both at once (nav avatar, upload form, dashboard).
 */
export const getCurrentUserWithProfile = cache(async (): Promise<CurrentUserBundle | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!data) return null;
  return { user, profile: data };
});

/**
 * Require a logged-in user inside a server action / route. Throws when
 * unauthenticated; callers should wrap in try/catch and redirect.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("AUTH_REQUIRED");
  return user;
}
