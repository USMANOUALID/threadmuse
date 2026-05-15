import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Server-side Supabase client used by server components, server actions,
 * and route handlers. Reads + writes the session cookie via Next's
 * `cookies()` API so RLS sees the authenticated user.
 *
 *   const supabase = await createServerSupabaseClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *
 * NOTE: `cookies()` is async in Next 15 — always `await` this factory.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        try {
          items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // `cookies().set` throws if called from a Server Component (read-only).
          // Middleware handles cookie refresh — this branch is just a no-op.
        }
      },
    },
  });
}
