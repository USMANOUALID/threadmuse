"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-session";

const createCommentSchema = z.object({
  postId: z.string().uuid(),
  body: z.string().trim().min(1, "Say something.").max(2000),
  parentId: z.string().uuid().optional(),
});

type ActionResult = { ok: true } | { ok: false; error: string };

export async function createComment(input: z.infer<typeof createCommentSchema>): Promise<ActionResult> {
  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid comment." };
  }

  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false, error: "Sign in to comment." };
  }

  const supabase = await createServerSupabaseClient();
  const { error, data } = await supabase
    .from("comments")
    .insert({
      post_id: parsed.data.postId,
      user_id: user.id,
      body: parsed.data.body,
      parent_id: parsed.data.parentId ?? null,
    })
    .select("id, post_id")
    .single();

  if (error) return { ok: false, error: error.message };

  // The post page (by slug) reads comments; revalidate the slug path.
  // We don't have the slug here — revalidate the parent layout instead.
  revalidatePath("/post", "layout");
  return { ok: true };
}

export async function deleteComment(commentId: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false, error: "Sign in to delete a comment." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id); // RLS enforces this too; belt + braces

  if (error) return { ok: false, error: error.message };
  revalidatePath("/post", "layout");
  return { ok: true };
}
