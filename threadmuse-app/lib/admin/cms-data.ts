import "server-only";

import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cmsSections, type CmsRecord, type CmsSectionKey } from "@/lib/admin/cms-config";

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

export async function getAdminSupabase() {
  return (await createServerSupabaseClient()) as SupabaseAny;
}

export const getCmsRecords = cache(async (section: CmsSectionKey, query = "") => {
  const config = cmsSections[section];
  const supabase = await getAdminSupabase();
  let request = supabase.from(config.table).select("*");

  if (query) {
    const searchable = config.fields
      .filter((field) => ["text", "email", "url", "textarea", "select"].includes(field.type))
      .slice(0, 4);
    const filters = searchable.map((field) => `${field.name}.ilike.%${query}%`).join(",");
    if (filters) request = request.or(filters);
  }

  if (config.orderBy) {
    request = request.order(config.orderBy, { ascending: config.orderAscending ?? true });
  }

  const { data, error } = await request.limit(100);
  if (error) {
    return { records: [] as CmsRecord[], error: error.message };
  }
  return { records: (data ?? []) as CmsRecord[], error: null as string | null };
});

export const getAdminOverview = cache(async () => {
  const supabase = await getAdminSupabase();
  const keys = Object.keys(cmsSections) as CmsSectionKey[];
  const counts = await Promise.all(
    keys.map(async (key) => {
      const section = cmsSections[key];
      const { count } = await supabase
        .from(section.table)
        .select("*", { count: "exact", head: true });
      return [key, count ?? 0] as const;
    }),
  );

  const { data: recentMessages } = await supabase
    .from("contact_messages")
    .select("id,name,email,company,status,created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentEvents } = await supabase
    .from("analytics_events")
    .select("id,event_name,path,created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return {
    counts: Object.fromEntries(counts) as Record<CmsSectionKey, number>,
    recentMessages: (recentMessages ?? []) as CmsRecord[],
    recentEvents: (recentEvents ?? []) as CmsRecord[],
  };
});

export function stringifyField(value: unknown) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
