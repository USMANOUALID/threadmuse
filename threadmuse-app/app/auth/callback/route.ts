import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * OAuth + email-confirm callback. Supabase redirects here with a `code` query
 * param (PKCE flow — the verifier is in an httpOnly cookie set when the OAuth
 * flow began). We exchange it for a session, then send the user to `next`
 * (relative paths only, anti open-redirect).
 *
 * Wired into:
 *  - `signInWithGoogle` server action (passes `?next=…`)
 *  - Supabase email confirmation links (configured under [auth] in
 *    `supabase/config.toml`)
 *
 * Failures land on /auth/auth-code-error so the user sees something useful
 * instead of a half-broken state.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirect(searchParams.get("next")) ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=missing_code`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const params = new URLSearchParams({ reason: "exchange_failed", message: error.message });
    return NextResponse.redirect(`${origin}/auth/auth-code-error?${params.toString()}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

/** Only allow relative redirects so the callback can't be used as an open redirector. */
function sanitizeRedirect(input: string | null): string | null {
  if (!input) return null;
  if (!input.startsWith("/") || input.startsWith("//")) return null;
  return input;
}
