"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-session";

const profileSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-z0-9._]+$/),
  name: z.string().min(1).max(80),
  bio: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
  website: z.string().max(200).optional(),
});

const accountSchema = z.object({
  email: z.string().email(),
});

function cleanOptional(value: string | undefined) {
  return value && value.trim() ? value.trim() : null;
}

export async function updateProfileSettings(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/settings/profile?error=invalid");

  const supabase = await createServerSupabaseClient();
  const file = formData.get("avatar");
  let avatarUrl: string | null | undefined;

  if (file instanceof File && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: true,
    });
    if (uploadError) redirect(`/settings/profile?error=${encodeURIComponent(uploadError.message)}`);
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    avatarUrl = data.publicUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username: parsed.data.username,
      name: parsed.data.name,
      bio: cleanOptional(parsed.data.bio),
      location: cleanOptional(parsed.data.location),
      website: cleanOptional(parsed.data.website),
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    })
    .eq("id", user.id);

  if (error) redirect(`/settings/profile?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  revalidatePath("/settings/profile");
  redirect("/settings/profile?saved=1");
}

export async function updateAccountEmail(formData: FormData) {
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/settings/account?error=invalid");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ email: parsed.data.email });
  if (error) redirect(`/settings/account?error=${encodeURIComponent(error.message)}`);
  redirect("/settings/account?email=updated");
}

export async function deleteAccount() {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  await supabase.from("profiles").update({ deleted_at: new Date().toISOString() }).eq("id", user.id);
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/?account=deleted");
}
