"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-session";

/**
 * Social server actions: like / save / follow.
 * All are toggles — call once to add, again to remove. The DB counter
 * triggers (likes_count, saves_count, followers_count) update aggregates.
 */

type ToggleResult = { ok: true; active: boolean } | { ok: false; error: string };

export async function toggleLike(postId: string): Promise<ToggleResult> {
  let user;
  try { user = await requireUser(); } catch { return { ok: false, error: "Sign in to like." }; }

  const supabase = await createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("likes").delete().match({ user_id: user.id, post_id: postId });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/post", "layout");
    return { ok: true, active: false };
  }

  const { error } = await supabase.from("likes").insert({ user_id: user.id, post_id: postId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/post", "layout");
  return { ok: true, active: true };
}

export async function toggleSave(postId: string): Promise<ToggleResult> {
  let user;
  try { user = await requireUser(); } catch { return { ok: false, error: "Sign in to save." }; }

  const supabase = await createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("saves")
    .select("post_id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("saves").delete().match({ user_id: user.id, post_id: postId });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/saved", "layout");
    return { ok: true, active: false };
  }

  const { error } = await supabase.from("saves").insert({ user_id: user.id, post_id: postId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/saved", "layout");
  return { ok: true, active: true };
}

export async function toggleFollow(targetUserId: string): Promise<ToggleResult> {
  let user;
  try { user = await requireUser(); } catch { return { ok: false, error: "Sign in to follow." }; }
  if (user.id === targetUserId) return { ok: false, error: "You can't follow yourself." };

  const supabase = await createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .match({ follower_id: user.id, following_id: targetUserId });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/profile", "layout");
    return { ok: true, active: false };
  }

  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: user.id, following_id: targetUserId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/profile", "layout");
  return { ok: true, active: true };
}
