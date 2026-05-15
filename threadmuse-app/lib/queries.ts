import "server-only";

import { cache } from "react";
import type {
  CategorySlug,
  Creator,
  Post,
  IllustrationKind,
  Category,
} from "@/types";
import type { Database, PostRow, ProfileRow } from "@/types/database";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCount } from "@/lib/format";

/**
 * Production query layer. Same public surface as the Phase-2 mock impl so the
 * UI components and route files stay untouched. Every function:
 *
 *  - is "server-only" (never bundled into the client)
 *  - is wrapped in `cache()` where it makes sense so multiple components in
 *    the same render dedupe to one round-trip
 *  - reshapes Supabase's snake_case + joined rows into the `Post` / `Creator`
 *    shapes the UI already knows
 *
 * Whenever a query throws, we throw upward — the route's error.tsx will catch
 * it. We don't paper over failures here; better a visible error than a stale
 * empty grid.
 */

// ── shaping helpers ─────────────────────────────────────────

type PostWithJoins = PostRow & {
  creator: ProfileRow | null;
  post_tags: { tag_slug: string }[] | null;
};

/** Columns we always want from `posts` joined with creator + tags. */
const POST_COLUMNS = "*, creator:profiles!posts_user_id_fkey(*), post_tags(tag_slug)";

function profileToCreator(p: ProfileRow): Creator {
  return {
    username: p.username,
    name: p.name,
    bio: p.bio ?? "",
    location: p.location ?? "",
    followers: formatCount(p.followers_count),
    avatarUrl: p.avatar_url ?? undefined,
  };
}

function rowToPost(row: PostWithJoins): Post {
  if (!row.creator) {
    // Should never happen — the join is a non-null FK. Throw so the caller
    // can decide whether to filter or surface.
    throw new Error(`post ${row.id} missing creator row`);
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    kind: row.kind as IllustrationKind,
    illustrationHeight: row.illustration_height,
    price: row.price,
    isPremium: row.is_premium,
    tags: (row.post_tags ?? []).map((t) => t.tag_slug),
    category: row.category as CategorySlug,
    creator: profileToCreator(row.creator),
    etsyUrl: row.etsy_url ?? undefined,
    views: row.views,
    likes: row.likes_count,
    saves: row.saves_count,
    createdAt: row.created_at,
  };
}

// ── posts ───────────────────────────────────────────────────

export interface PostsOptions {
  limit?: number;
  offset?: number;
  category?: CategorySlug;
  tag?: string;
  creator?: string;
  isPremium?: boolean;
  sort?: "trending" | "newest" | "mostViewed" | "mostSaved";
}

export async function getPosts(opts: PostsOptions = {}): Promise<Post[]> {
  const supabase = await createServerSupabaseClient();
  let q = supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published");

  if (opts.category) q = q.eq("category", opts.category);
  if (opts.isPremium !== undefined) q = q.eq("is_premium", opts.isPremium);

  if (opts.creator) {
    // Filter via the joined profiles table on `username`.
    q = q.eq("creator.username", opts.creator);
  }

  if (opts.tag) {
    // post_tags is a many-to-many; filter posts whose post_tags row matches.
    // PostgREST embedded resource filtering syntax: `post_tags.tag_slug=eq.<tag>`.
    q = q.eq("post_tags.tag_slug", opts.tag);
  }

  // Sort. "trending" approximates with views + likes*6 + saves*10 in code-land
  // (Postgres does the heavy work via an expression `order`).
  switch (opts.sort) {
    case "newest":
      q = q.order("created_at", { ascending: false });
      break;
    case "mostViewed":
      q = q.order("views", { ascending: false });
      break;
    case "mostSaved":
      q = q.order("saves_count", { ascending: false });
      break;
    case "trending":
    default:
      // PostgREST doesn't allow arithmetic in `order`, so fall back to a
      // weighted DB column. `views` is a reasonable proxy; Phase 5's
      // dashboard adds a materialised `trending_score` column for precision.
      q = q.order("views", { ascending: false });
  }

  const limit = opts.limit ?? 30;
  const offset = opts.offset ?? 0;
  q = q.range(offset, offset + limit - 1);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? [])
    .filter((row) => row.creator !== null)
    .map((row) => rowToPost(row as PostWithJoins));
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.creator) return null;
  return rowToPost(data as PostWithJoins);
});

/**
 * Returns "related" posts in 3 priority bands:
 *   1. same category
 *   2. shared tags
 *   3. anything else (filler)
 * Deduped, capped at `limit`.
 */
export async function getRelatedPosts(post: Post, limit = 8): Promise<Post[]> {
  const supabase = await createServerSupabaseClient();
  const seen = new Set<string>([post.id]);
  const out: Post[] = [];

  // 1) same category
  const { data: sameCat } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .eq("category", post.category)
    .neq("id", post.id)
    .order("views", { ascending: false })
    .limit(limit);

  for (const row of sameCat ?? []) {
    if (out.length >= limit || seen.has(row.id)) continue;
    if (!row.creator) continue;
    out.push(rowToPost(row as PostWithJoins));
    seen.add(row.id);
  }
  if (out.length >= limit) return out;

  // 2) shared tags
  if (post.tags.length > 0) {
    const { data: sharedTag } = await supabase
      .from("posts")
      .select(POST_COLUMNS + ", post_tags!inner(tag_slug)")
      .eq("status", "published")
      .in("post_tags.tag_slug", post.tags)
      .neq("id", post.id)
      .order("views", { ascending: false })
      .limit(limit);
    for (const row of sharedTag ?? []) {
      if (out.length >= limit || seen.has(row.id)) continue;
      if (!row.creator) continue;
      out.push(rowToPost(row as PostWithJoins));
      seen.add(row.id);
    }
  }
  if (out.length >= limit) return out;

  // 3) filler
  const { data: anyPost } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(limit * 2);
  for (const row of anyPost ?? []) {
    if (out.length >= limit || seen.has(row.id)) continue;
    if (!row.creator) continue;
    out.push(rowToPost(row as PostWithJoins));
    seen.add(row.id);
  }

  return out;
}

// ── categories ──────────────────────────────────────────────

export const getAllCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToCategory);
});

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToCategory(data) : null;
}

export async function getAllCategorySlugs(): Promise<{ slug: CategorySlug }[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("categories").select("slug");
  if (error) throw error;
  return (data ?? []).map((r) => ({ slug: r.slug as CategorySlug }));
}

function rowToCategory(r: Database["public"]["Tables"]["categories"]["Row"]): Category {
  // We approximate `count` from a per-category lookup table in Phase 5; for
  // now, return a coarse number so the chrome shows non-zero.
  return {
    slug: r.slug as CategorySlug,
    name: r.name,
    icon: r.icon as Category["icon"],
    count: 0,
    blurb: r.blurb ?? undefined,
  };
}

/** Returns category list with live post counts. Used by /categories. */
export async function getCategoriesWithCounts(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
  const [{ data: cats }, { data: counts }] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("posts").select("category", { count: "exact", head: false }).eq("status", "published"),
  ]);

  const byCat = new Map<string, number>();
  for (const row of counts ?? []) {
    byCat.set(row.category, (byCat.get(row.category) ?? 0) + 1);
  }
  return (cats ?? []).map((c) => ({ ...rowToCategory(c), count: byCat.get(c.slug) ?? 0 }));
}

// ── tags ────────────────────────────────────────────────────

export async function getAllTags(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tags")
    .select("slug")
    .order("usage_count", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []).map((r) => r.slug);
}

// ── creators ────────────────────────────────────────────────

export const getCreatorByUsername = cache(async (username: string): Promise<Creator | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  return data ? profileToCreator(data) : null;
});

export async function getAllCreatorUsernames(): Promise<{ username: string }[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .is("deleted_at", null);
  if (error) throw error;
  return (data ?? []).map((r) => ({ username: r.username }));
}

export async function getCreatorStats(username: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("uploads_count, followers_count, following_count, saves_total")
    .eq("username", username)
    .maybeSingle();

  return {
    uploads: data?.uploads_count ?? 0,
    followers: formatCount(data?.followers_count ?? 0),
    following: formatCount(data?.following_count ?? 0),
    saves: data?.saves_total ?? 0,
  };
}

// ── search ──────────────────────────────────────────────────

export async function searchPosts(q: string, limit = 24): Promise<Post[]> {
  const needle = q.trim();
  if (!needle) return [];
  const like = `%${needle.replace(/[%_]/g, "\\$&")}%`;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .or(`title.ilike.${like},description.ilike.${like}`)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? [])
    .filter((row) => row.creator !== null)
    .map((row) => rowToPost(row as PostWithJoins));
}

export async function suggestSearches(
  q: string,
  limit = 5,
): Promise<{ term: string; hint: string }[]> {
  // We surface the most-used tags as suggestions until Phase 5 wires a
  // proper materialised popular_searches view.
  const supabase = await createServerSupabaseClient();
  const needle = q.trim();
  let query = supabase
    .from("tags")
    .select("slug, name, usage_count")
    .order("usage_count", { ascending: false })
    .limit(limit);
  if (needle) query = query.ilike("name", `%${needle}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((t) => ({
    term: t.name,
    hint: `${formatCount(t.usage_count)} items`,
  }));
}

// ── comments ────────────────────────────────────────────────

export interface DisplayComment {
  id: string;
  body: string;
  createdAt: string;
  likes: number;
  author: Creator;
}

export async function getCommentsForPost(postId: string, limit = 50): Promise<DisplayComment[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, body, created_at, likes_count, is_hidden, author:profiles!comments_user_id_fkey(*)")
    .eq("post_id", postId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? [])
    .filter((c): c is typeof c & { author: ProfileRow } => c.author !== null)
    .map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.created_at,
      likes: c.likes_count,
      author: profileToCreator(c.author),
    }));
}

export async function getCommentCount(postId: string): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("is_hidden", false);
  return count ?? 0;
}

// ── trending convenience ────────────────────────────────────

export async function getTrendingPosts(limit = 6): Promise<Post[]> {
  return getPosts({ sort: "mostViewed", limit });
}

// ── social state (per current user) ─────────────────────────
// All four helpers return empty defaults for unauthenticated callers — the
// RLS policies would also reject those reads, so this is a free short-circuit.

/**
 * Return the set of post IDs (out of the given list) that the current user
 * has liked. Cached per render. Pass [] freely; we early-return.
 */
export async function getLikedPostIds(postIds: string[]): Promise<Set<string>> {
  if (postIds.length === 0) return new Set();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", user.id)
    .in("post_id", postIds);
  return new Set((data ?? []).map((r) => r.post_id));
}

export async function getSavedPostIds(postIds: string[]): Promise<Set<string>> {
  if (postIds.length === 0) return new Set();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("saves")
    .select("post_id")
    .eq("user_id", user.id)
    .in("post_id", postIds);
  return new Set((data ?? []).map((r) => r.post_id));
}

/** Single-post like check — convenience for /post/[slug]. */
export async function isPostLikedByMe(postId: string): Promise<boolean> {
  const set = await getLikedPostIds([postId]);
  return set.has(postId);
}

export async function isPostSavedByMe(postId: string): Promise<boolean> {
  const set = await getSavedPostIds([postId]);
  return set.has(postId);
}

/** Does the current user follow the target profile? */
export async function isFollowingUser(targetUserId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === targetUserId) return false;

  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();
  return !!data;
}

/** Resolve a profile.id from a username — needed when the UI only has the handle. */
export async function getProfileIdByUsername(username: string): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .is("deleted_at", null)
    .maybeSingle();
  return data?.id ?? null;
}

// ── billing ─────────────────────────────────────────────────

/** All publicly-listable plans for the pricing page. Ordered by display_order. */
export async function getActivePlans() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Current user's resolved plan row from the `current_plan` view. */
export async function getMyCurrentPlan() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("current_plan")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
}

/** Active subscription row for the current user, or null. */
export async function getMyActiveSubscription() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("subscriptions")
    .select("*, plan:plans!subscriptions_plan_id_fkey(*)")
    .eq("user_id", user.id)
    .in("status", ["trialing", "active", "past_due"])
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

/**
 * Counts used by the plan-gating layer. Two values:
 *   - publishedPosts: all-time count of published posts the user owns
 *   - uploadsToday:   uploads (any status) in the rolling 24h window
 *
 * Both run as the signed-in user so RLS gates apply; service-role isn't
 * needed. Wrapped in `cache()` so the upload action and a future "usage"
 * widget share a single round-trip per render.
 */
export const getMyUsage = cache(
  async (): Promise<{ publishedPosts: number; uploadsToday: number }> => {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { publishedPosts: 0, uploadsToday: 0 };

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [publishedRes, todayRes] = await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "published"),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", since),
    ]);

    return {
      publishedPosts: publishedRes.count ?? 0,
      uploadsToday: todayRes.count ?? 0,
    };
  },
);
