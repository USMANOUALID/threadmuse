import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY in trusted server
 * code (cron jobs, webhooks, admin actions). NEVER pass this to a client
 * component. NEVER import from a file that ships to the browser.
 *
 * Throws at call time if `SUPABASE_SERVICE_ROLE_KEY` is unset so a misconfigured
 * production deploy fails loudly instead of silently degrading.
 */
export function createAdminClient() {
  if (!supabaseEnv.serviceRoleKey) {
    throw new Error(
      "createAdminClient: SUPABASE_SERVICE_ROLE_KEY is not set — refusing to construct an admin client.",
    );
  }
  return createClient<Database>(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
