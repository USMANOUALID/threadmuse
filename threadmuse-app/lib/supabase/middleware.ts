import "server-only";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Refresh Supabase's session cookie on every request. Called from
 * `middleware.ts`. Also enforces auth on protected routes — extend
 * `PROTECTED_PATHS` as new authed surfaces land.
 *
 * The dance below is the official Supabase + Next 15 SSR pattern:
 *  1. Make a NextResponse seeded with the request.
 *  2. Build a server client that reads cookies from `request` and writes
 *     to BOTH `request.cookies` (for downstream middleware) AND the response
 *     (for the browser).
 *  3. Call `getUser()` — this triggers a token refresh if needed.
 *  4. Return the response (with refreshed cookies) untouched OR redirect to
 *     /login if the route is gated.
 *
 * Never read cookies from the request in your route — always re-create
 * the server client via `createServerSupabaseClient()` so this response's
 * Set-Cookie headers are honoured.
 */

const PROTECTED_PATHS = ["/upload", "/settings", "/saved", "/notifications", "/messages", "/dashboard", "/admin"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth gate.
  const pathname = request.nextUrl.pathname;
  const requiresAuth = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAdminLogin = pathname === "/admin/login";

  if (requiresAuth && !isAdminLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Bounce signed-in users away from the auth pages.
  if ((pathname === "/login" || pathname === "/signup") && user) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.searchParams.get("redirect") ?? "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
