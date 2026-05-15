"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-session";
import { PlanGateError, requirePlan, type GateCode } from "@/lib/auth/require-plan";
import { getMyUsage } from "@/lib/queries";
import {
  ACCEPTED_IMAGE_MIMES,
  MAX_COVER_BYTES,
  MAX_GALLERY_FILES,
  slugify,
  storageObjectPath,
  uniquePostSlug,
} from "@/lib/upload/helpers";

/**
 * Create-post server action.
 *
 * Pipeline:
 *   1. require auth
 *   2. plan-gate (counts vs quotas — returns upgradeRequired on fail)
 *   3. validate text fields (zod)
 *   4. validate files (size + mime)
 *   5. upload cover → `covers` bucket  (path: ${uid}/…)
 *   6. upload gallery → `galleries` bucket (path: ${uid}/…)
 *   7. compute a unique slug
 *   8. insert post
 *   9. ensure tags exist + attach post_tags
 *  10. revalidate + redirect
 *
 * Errors at any stage return `{ ok: false, error }` so the form can render
 * inline. Plan-gate failures additionally return `upgradeRequired` so the UI
 * shows <UpgradePrompt /> instead of a plain error. On success we `redirect()`
 * to the new post detail.
 *
 * NOTE: storage uploads can succeed and then a later DB insert can fail. We
 * best-effort cleanup uploaded objects in that branch to avoid orphan files.
 */

const TEXT = z.object({
  title: z.string().trim().min(3, "Add a title.").max(120, "Title is too long."),
  description: z.string().trim().max(2000).optional(),
  category: z.string().min(1, "Pick a category."),
  kind: z.string().min(1, "Pick a kind."),
  price: z
    .string()
    .trim()
    .regex(/^(Free|\$[0-9]+(\.[0-9]{1,2})?)$/, "Price must be 'Free' or '$N' / '$N.NN'.")
    .default("Free"),
  etsyUrl: z
    .string()
    .trim()
    .url("Etsy link must be a full https URL.")
    .startsWith("https://", "Etsy link must use https.")
    .optional()
    .or(z.literal("")),
  tags: z
    .string()
    .optional()
    .transform((s) =>
      (s ?? "")
        .split(/[,\s]+/)
        .map((t) => slugify(t))
        .filter((t) => t.length >= 2 && t.length <= 32)
        .slice(0, 12),
    ),
  illustrationHeight: z.coerce.number().int().min(200).max(900).default(400),
});

type ActionResult =
  | { ok: true; slug: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
      /** When set, the UI should show <UpgradePrompt /> instead of a plain error. */
      upgradeRequired?: {
        code: GateCode;
        currentPlan: string;
        detail?: { used: number; limit: number };
      };
    };

export async function createPost(formData: FormData): Promise<ActionResult> {
  // 1) auth ──────────────────────────────────────────────────
  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false, error: "Sign in to upload." };
  }

  // 2) plan gate ─────────────────────────────────────────────
  // Done before file/text validation so we don't burn bandwidth or storage
  // bytes for a user who's going to be blocked anyway.
  try {
    const usage = await getMyUsage();
    await requirePlan({ feature: { kind: "publish_post", usage } });
  } catch (err) {
    if (err instanceof PlanGateError) {
      return {
        ok: false,
        error: err.message,
        upgradeRequired: {
          code: err.code,
          currentPlan: err.currentPlan,
          detail: err.detail,
        },
      };
    }
    throw err;
  }

  // 3) validate text fields ──────────────────────────────────
  const parsed = TEXT.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "",
    kind: formData.get("kind") ?? "",
    price: formData.get("price") ?? "Free",
    etsyUrl: formData.get("etsyUrl") ?? "",
    tags: formData.get("tags") ?? "",
    illustrationHeight: formData.get("illustrationHeight") ?? "400",
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      error: issue?.message ?? "Check the form and try again.",
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [String(i.path[0] ?? ""), i.message]),
      ),
    };
  }
  const fields = parsed.data;

  // Coerce empty etsyUrl back to null for the DB (constraint allows null).
  const etsyUrl = fields.etsyUrl && fields.etsyUrl.length > 0 ? fields.etsyUrl : null;

  // 4) validate files ────────────────────────────────────────
  const cover = formData.get("cover");
  if (!(cover instanceof File) || cover.size === 0) {
    return { ok: false, error: "Add a cover image." };
  }
  const coverErr = validateImage(cover, "cover");
  if (coverErr) return { ok: false, error: coverErr };

  const galleryFiles = formData
    .getAll("gallery")
    .filter((g): g is File => g instanceof File && g.size > 0)
    .slice(0, MAX_GALLERY_FILES);
  for (const g of galleryFiles) {
    const e = validateImage(g, "gallery");
    if (e) return { ok: false, error: e };
  }

  const supabase = await createServerSupabaseClient();

  // 5) upload cover ─────────────────────────────────────────
  const coverPath = storageObjectPath(user.id, cover.name, cover.type);
  const uploadedPaths: { bucket: "covers" | "galleries"; path: string }[] = [];

  {
    const { error } = await supabase.storage
      .from("covers")
      .upload(coverPath, cover, {
        cacheControl: "31536000, immutable",
        contentType: cover.type,
        upsert: false,
      });
    if (error) return { ok: false, error: `Cover upload failed: ${error.message}` };
    uploadedPaths.push({ bucket: "covers", path: coverPath });
  }
  const coverUrl = publicUrl(supabase, "covers", coverPath);

  // 6) upload gallery files ─────────────────────────────────
  const galleryPaths: string[] = [];
  const galleryUrls: string[] = [];
  for (const g of galleryFiles) {
    const p = storageObjectPath(user.id, g.name, g.type);
    const { error } = await supabase.storage
      .from("galleries")
      .upload(p, g, {
        cacheControl: "31536000, immutable",
        contentType: g.type,
        upsert: false,
      });
    if (error) {
      await cleanup(supabase, uploadedPaths);
      return { ok: false, error: `Gallery upload failed: ${error.message}` };
    }
    uploadedPaths.push({ bucket: "galleries", path: p });
    galleryPaths.push(p);
    galleryUrls.push(publicUrl(supabase, "galleries", p));
  }

  // 7) slug ────────────────────────────────────────────────
  const slug = await uniquePostSlug(fields.title);

  // 8) insert post ─────────────────────────────────────────
  const { data: inserted, error: insertErr } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      slug,
      title: fields.title,
      description: fields.description?.length ? fields.description : null,
      kind: fields.kind,
      category: fields.category,
      cover_image_url: coverUrl,
      cover_storage_path: coverPath,
      gallery_image_urls: galleryUrls,
      gallery_storage_paths: galleryPaths,
      illustration_height: fields.illustrationHeight,
      price: fields.price,
      is_premium: fields.price !== "Free",
      etsy_url: etsyUrl,
      status: "published",
    })
    .select("id, slug")
    .single();

  if (insertErr || !inserted) {
    await cleanup(supabase, uploadedPaths);
    return { ok: false, error: insertErr?.message ?? "Could not save your post." };
  }

  // 9) attach tags ─────────────────────────────────────────
  if (fields.tags.length > 0) {
    // Make sure each tag exists. We can't use service role from here (RLS
    // allows authenticated INSERTs into tags), so a per-tag upsert is fine.
    const tagRows = fields.tags.map((slug) => ({ slug, name: slug }));
    const { error: tagErr } = await supabase
      .from("tags")
      .upsert(tagRows, { onConflict: "slug", ignoreDuplicates: true });
    // A failure here isn't fatal — the post still exists. We surface it as
    // a soft warning by ignoring it (the tag pivot insert below will silently
    // miss any tag that genuinely failed to create).
    if (tagErr) {
      // eslint-disable-next-line no-console
      console.warn("tag upsert warning", tagErr.message);
    }

    const pivotRows = fields.tags.map((tag_slug) => ({ post_id: inserted.id, tag_slug }));
    const { error: pivotErr } = await supabase.from("post_tags").insert(pivotRows);
    if (pivotErr) {
      // eslint-disable-next-line no-console
      console.warn("post_tags insert warning", pivotErr.message);
    }
  }

  // 10) revalidate + redirect ──────────────────────────────
  revalidatePath("/", "layout");        // homepage trending
  revalidatePath(`/category/${fields.category}`);
  revalidatePath("/explore");
  revalidatePath("/profile", "layout"); // own profile uploads tab

  redirect(`/post/${inserted.slug}`);
}

// ── internals ───────────────────────────────────────────────

function validateImage(file: File, label: string): string | null {
  if (!ACCEPTED_IMAGE_MIMES.includes(file.type as (typeof ACCEPTED_IMAGE_MIMES)[number])) {
    return `${label} must be a JPEG, PNG, WebP or AVIF image.`;
  }
  if (file.size > MAX_COVER_BYTES) {
    return `${label} is larger than 8 MB.`;
  }
  return null;
}

function publicUrl(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  bucket: "covers" | "galleries" | "avatars",
  path: string,
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function cleanup(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  items: { bucket: "covers" | "galleries"; path: string }[],
) {
  // Best-effort — RLS allows the uploader to delete their own objects.
  await Promise.all(
    items.map(({ bucket, path }) => supabase.storage.from(bucket).remove([path])),
  );
}
