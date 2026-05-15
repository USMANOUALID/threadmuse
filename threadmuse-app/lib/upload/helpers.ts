import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Helpers for the upload pipeline. Kept separate from the action file so the
 * server action stays focused on orchestration.
 */

/** Slugify a string into a URL-safe form (mirrors the SQL `slugify` function). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Produce a slug that doesn't already exist in `posts`. We try the base slug
 * first, then `-2`, `-3`, … up to a safety cap. Collisions are rare; the cap
 * exists so a misconfigured DB doesn't loop forever.
 */
export async function uniquePostSlug(baseTitle: string): Promise<string> {
  const base = slugify(baseTitle).slice(0, 80) || "untitled";
  const supabase = await createServerSupabaseClient();

  let candidate = base;
  for (let i = 2; i < 50; i++) {
    const { data, error } = await supabase
      .from("posts")
      .select("slug")
      .eq("slug", candidate)
      .maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
    candidate = `${base}-${i}`;
  }
  // Fall back to a timestamped slug so we never block an upload.
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Build a storage object path scoped to a user. The RLS policies in
 * `0004_storage.sql` require the first path segment to be the uploader's
 * auth uid, so this is the only sanctioned shape.
 *
 *   storageObjectPath("a1b2…", "image/png") → "a1b2…/2026-05-15/k7sl-cover.png"
 */
export function storageObjectPath(userId: string, originalName: string, contentType: string): string {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const rand = Math.random().toString(36).slice(2, 8);

  const extFromName = originalName.includes(".") ? originalName.split(".").pop()!.toLowerCase() : "";
  const extFromMime = contentType.split("/")[1]?.toLowerCase() ?? "";
  const ext = (extFromName || extFromMime || "bin").replace(/[^a-z0-9]/g, "").slice(0, 5);

  const stem = slugify(originalName.replace(/\.[^.]+$/, "")).slice(0, 40) || "file";
  return `${userId}/${today}/${rand}-${stem}.${ext}`;
}

/** MIME types accepted by the post upload form. Matches the bucket allow-list. */
export const ACCEPTED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const MAX_COVER_BYTES = 8 * 1024 * 1024; // 8 MiB (matches bucket limit)
export const MAX_GALLERY_FILES = 6;
