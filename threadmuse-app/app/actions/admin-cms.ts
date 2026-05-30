"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cmsSections, getCmsSection, type CmsSectionKey } from "@/lib/admin/cms-config";

interface DynamicQuery {
  select: (columns?: string, options?: Record<string, unknown>) => DynamicQuery;
  insert: (payload: Record<string, unknown> | Record<string, unknown>[]) => Promise<{ error: { message: string; code?: string } | null; data?: unknown }>;
  update: (payload: Record<string, unknown>) => DynamicQuery;
  delete: () => DynamicQuery;
  upsert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  eq: (column: string, value: unknown) => DynamicQuery;
  or: (filters: string) => DynamicQuery;
  order: (column: string, options?: { ascending?: boolean }) => DynamicQuery;
  limit: (count: number) => Promise<{ data: unknown[] | null; error: { message: string } | null; count?: number | null }>;
  maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
  then: Promise<{ data: unknown[] | null; error: { message: string } | null; count?: number | null }>["then"];
}

type SupabaseAny = Awaited<ReturnType<typeof createServerSupabaseClient>> & {
  from: (table: string) => DynamicQuery;
};

const idSchema = z.string().min(1).max(500);

async function requireAdmin() {
  const supabase = (await createServerSupabaseClient()) as SupabaseAny;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,is_admin,role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = String(profile?.role ?? adminRole?.role ?? "member");
  const allowed = Boolean(profile?.is_admin) || ["owner", "admin", "editor"].includes(role) || Boolean(adminRole);

  if (!allowed) redirect("/admin/login?error=forbidden");

  return { supabase, user, role };
}


function canManageSection(role: string, section: string) {
  if (role === "owner" || role === "admin") return true;
  const editorSections = new Set(["homepage", "services", "pricing", "testimonials", "faq", "blog", "messages", "media", "seo", "newsletter", "analytics"]);
  return role === "editor" && editorSections.has(section);
}

function safeAdminPath(section?: string) {
  return section && getCmsSection(section) ? `/admin/${section}` : "/admin";
}

function parseJson(raw: string, fallback: unknown) {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error("Invalid JSON. Please enter valid JSON before saving.");
  }
}

function parsePayload(section: CmsSectionKey, formData: FormData, mode: "create" | "update") {
  const config = cmsSections[section];
  const payload: Record<string, unknown> = {};

  for (const field of config.fields) {
    if (field.readonly) continue;
    if (mode === "update" && field.name === config.primaryKey) continue;

    const raw = formData.get(field.name);
    const rawString = typeof raw === "string" ? raw : "";

    if (field.type === "boolean") {
      payload[field.name] = raw === "on";
      continue;
    }

    if (!rawString && !field.required) {
      payload[field.name] = null;
      continue;
    }

    if (field.type === "number") {
      payload[field.name] = rawString ? Number(rawString) : 0;
      continue;
    }

    if (field.type === "array") {
      payload[field.name] = rawString
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
      continue;
    }

    if (field.type === "json") {
      payload[field.name] = parseJson(rawString, {});
      continue;
    }

    if (field.type === "datetime") {
      payload[field.name] = rawString ? new Date(rawString).toISOString() : null;
      continue;
    }

    payload[field.name] = rawString;
  }

  return payload;
}

async function writeAdminRoleIfNeeded(supabase: SupabaseAny, section: CmsSectionKey, id: string, payload: Record<string, unknown>) {
  if (section !== "users") return;
  const role = String(payload.role ?? "member");
  const isAdmin = payload.is_admin === true || ["owner", "admin", "editor"].includes(role);

  if (isAdmin) {
    await (supabase.from("admin_roles") as unknown as DynamicQuery).upsert({ user_id: id, role: (role === "member" ? "admin" : role) as "owner" | "admin" | "editor" });
  } else {
    await (supabase.from("admin_roles") as unknown as DynamicQuery).delete().eq("user_id", id);
  }
}

export async function createCmsRecord(formData: FormData) {
  const sectionValue = String(formData.get("section") ?? "");
  const section = getCmsSection(sectionValue);
  if (!section) redirect("/admin");

  const { supabase, user, role } = await requireAdmin();
  if (!canManageSection(role, section.key)) redirect("/admin?error=forbidden");
  if (section.createEnabled === false) redirect(safeAdminPath(sectionValue));

  try {
    const payload = parsePayload(section.key as CmsSectionKey, formData, "create");
    if ("updated_by" in payload || ["homepage", "services", "pricing", "testimonials", "faq", "settings", "seo"].includes(section.key)) {
      payload.updated_by = user.id;
    }
    if (section.key === "blog") payload.author_id = user.id;

    const { error } = await (supabase.from(section.table) as unknown as DynamicQuery).insert(payload);
    if (error) throw new Error(error.message);
  } catch (error) {
    redirect(`${safeAdminPath(sectionValue)}?error=${encodeURIComponent(error instanceof Error ? error.message : "Create failed")}`);
  }

  revalidatePath(safeAdminPath(sectionValue));
  redirect(`${safeAdminPath(sectionValue)}?saved=1`);
}

export async function updateCmsRecord(formData: FormData) {
  const sectionValue = String(formData.get("section") ?? "");
  const id = idSchema.safeParse(formData.get("id"));
  const section = getCmsSection(sectionValue);
  if (!section || !id.success) redirect("/admin");

  const { supabase, user, role } = await requireAdmin();
  if (!canManageSection(role, section.key)) redirect("/admin?error=forbidden");

  try {
    const sectionKey = section.key as CmsSectionKey;
    const payload = parsePayload(sectionKey, formData, "update");
    if (["homepage", "services", "pricing", "testimonials", "faq", "settings", "seo"].includes(section.key)) {
      payload.updated_by = user.id;
    }
    if (!["messages", "media", "analytics", "users"].includes(section.key)) {
      payload.updated_at = new Date().toISOString();
    }
    if (section.key === "newsletter") {
      payload.updated_at = new Date().toISOString();
    }

    const { error } = await (supabase.from(section.table) as unknown as DynamicQuery)
      .update(payload)
      .eq(section.primaryKey, id.data);
    if (error) throw new Error(error.message);

    await writeAdminRoleIfNeeded(supabase, sectionKey, id.data, payload);
  } catch (error) {
    redirect(`${safeAdminPath(sectionValue)}?error=${encodeURIComponent(error instanceof Error ? error.message : "Update failed")}`);
  }

  revalidatePath(safeAdminPath(sectionValue));
  redirect(`${safeAdminPath(sectionValue)}?saved=1`);
}

export async function deleteCmsRecord(formData: FormData) {
  const sectionValue = String(formData.get("section") ?? "");
  const id = idSchema.safeParse(formData.get("id"));
  const section = getCmsSection(sectionValue);
  if (!section || !id.success) redirect("/admin");
  if (section.deleteEnabled === false) redirect(safeAdminPath(sectionValue));

  const { supabase, role } = await requireAdmin();
  if (!canManageSection(role, section.key)) redirect("/admin?error=forbidden");

  try {
    if (section.key === "media") {
      const { data } = await supabase
        .from("media_assets")
        .select("storage_path")
        .eq("id", id.data)
        .maybeSingle();
      if (data?.storage_path) {
        await supabase.storage.from("cms-media").remove([data.storage_path]);
      }
    }

    const { error } = await (supabase.from(section.table) as unknown as DynamicQuery).delete().eq(section.primaryKey, id.data);
    if (error) throw new Error(error.message);
  } catch (error) {
    redirect(`${safeAdminPath(sectionValue)}?error=${encodeURIComponent(error instanceof Error ? error.message : "Delete failed")}`);
  }

  revalidatePath(safeAdminPath(sectionValue));
  redirect(`${safeAdminPath(sectionValue)}?deleted=1`);
}

export async function trackAnalyticsEvent(formData: FormData) {
  const { supabase, role } = await requireAdmin();
  if (!canManageSection(role, "analytics")) redirect("/admin?error=forbidden");
  const eventName = String(formData.get("event_name") ?? "admin_event");
  const path = String(formData.get("path") ?? "/admin");
  await (supabase.from("analytics_events") as unknown as DynamicQuery).insert({
    event_name: eventName,
    path,
    visitor_id: "admin",
    metadata: { source: "admin-dashboard" },
  });
  revalidatePath("/admin/analytics");
  redirect("/admin/analytics?saved=1");
}
