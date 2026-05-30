"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Auth server actions. All shape their return value as
 *   { ok: true } | { ok: false, error: string }
 * so client forms can render errors without throwing through the boundary.
 */

const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  redirect: z.string().optional(),
});

const resetRequestSchema = z.object({
  email: z.string().email("Enter a valid email."),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  username: z
    .string()
    .min(3, "Pick a username 3–32 characters long.")
    .max(32, "Pick a username 3–32 characters long.")
    .regex(/^[a-z0-9._]+$/, "Lowercase letters, numbers, dots and underscores only."),
  name: z.string().min(1, "Tell us what to call you.").max(80),
  redirect: z.string().optional(),
});

type ActionResult = { ok: true; redirect?: string } | { ok: false; error: string };

export async function signInWithPassword(formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { ok: false, error: error.message };

  const redirectTo = sanitizeRedirect(parsed.data.redirect) ?? "/";
  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signUpWithPassword(formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        preferred_username: parsed.data.username,
        full_name: parsed.data.name,
      },
    },
  });

  if (error) return { ok: false, error: error.message };

  // If email confirmation is enabled, `data.session` is null. Tell the caller.
  if (!data.session) {
    return { ok: true }; // form renders "check your email" state
  }

  // Otherwise the `handle_new_user` trigger ran; rename the auto-generated
  // username to the one they picked (best-effort — falls through if taken).
  if (data.user) {
    await supabase
      .from("profiles")
      .update({ username: parsed.data.username, name: parsed.data.name })
      .eq("id", data.user.id);
  }

  const redirectTo = sanitizeRedirect(parsed.data.redirect) ?? "/";
  revalidatePath("/", "layout");
  redirect(redirectTo);
}


export async function requestPasswordReset(formData: FormData): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const parsed = updatePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  redirect("/settings/account?password=updated");
}

export async function signInWithGoogle(redirectTo?: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const origin = await getOrigin();
  const safeRedirect = sanitizeRedirect(redirectTo) ?? "/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
    },
  });

  if (error) return { ok: false, error: error.message };
  if (!data.url) return { ok: false, error: "Provider did not return a redirect URL." };

  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// ── helpers ─────────────────────────────────────────────────

/** Only allow relative redirects so we can't be used as an open redirector. */
function sanitizeRedirect(input?: string): string | null {
  if (!input) return null;
  if (!input.startsWith("/") || input.startsWith("//")) return null;
  return input;
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}
