import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Browser-side Supabase client.
 * Use only inside client components (`"use client"`) — auth state and storage
 * paths are read from `document.cookie`.
 *
 *   const supabase = createClient();
 *   await supabase.auth.signInWithOAuth({ provider: "google" });
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseEnv.url, supabaseEnv.anonKey);
}
