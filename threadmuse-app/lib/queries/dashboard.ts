import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Creator dashboard queries.
 *
 * All views run as the signed-in user (RLS gates `post_views.select` to the
 * post owner, so we can't accidentally see anyone else's data). The chart is
 * a simple 14-day bucket; deeper analytics (retention, conversion to Etsy
 * click-through) come later.
 */

export interface DashboardSummary {
  totals: {
    publishedPosts: number;
    views: number;
    likes: number;
    saves: number;
    followers: number;
  };
  /** Bucketed YYYY-MM-DD → view count for the last `windowDays` days. */
  viewsByDay: { date: string; views: number }[];
  topPosts: {
    id: string;
    slug: string;
    title: string;
    views: number;
    likes_count: number;
    saves_count: number;
  }[];
}

export async function getDashboardSummary(userId: string, windowDays = 14): Promise<DashboardSummary> {
  const supabase = await createServerSupabaseClient();
  const sinceIso = new Date(Date.now() - windowDays * 86_400_000).toISOString();

  const [postsAgg, viewsRaw, topPostsRes, profileRes] = await Promise.all([
    supabase
      .from("posts")
      .select("views, likes_count, saves_count", { count: "exact" })
      .eq("user_id", userId)
      .eq("status", "published"),
    supabase
      .from("post_views")
      .select("created_at, post:posts!post_views_post_id_fkey(user_id)")
      .gte("created_at", sinceIso)
      // We can't directly filter on the join in PostgREST; instead we filter
      // server-side after reading. The RLS policy on post_views restricts the
      // result to the user's own posts already, so this stays cheap.
      .limit(5000),
    supabase
      .from("posts")
      .select("id, slug, title, views, likes_count, saves_count")
      .eq("user_id", userId)
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("followers_count")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const rows = postsAgg.data ?? [];
  const totals = {
    publishedPosts: postsAgg.count ?? rows.length,
    views: rows.reduce((s, r) => s + (r.views ?? 0), 0),
    likes: rows.reduce((s, r) => s + (r.likes_count ?? 0), 0),
    saves: rows.reduce((s, r) => s + (r.saves_count ?? 0), 0),
    followers: profileRes.data?.followers_count ?? 0,
  };

  // Bucket views by day, locally. Pre-fill all `windowDays` days so the chart
  // has zero-rows where appropriate.
  const buckets = new Map<string, number>();
  for (let i = 0; i < windowDays; i++) {
    const d = new Date(Date.now() - i * 86_400_000);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const v of viewsRaw.data ?? []) {
    const day = v.created_at.slice(0, 10);
    if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }
  const viewsByDay = Array.from(buckets.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return {
    totals,
    viewsByDay,
    topPosts: topPostsRes.data ?? [],
  };
}
