"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Records a view of a post. Anonymous + authenticated callers both work
 * because the `record_post_view` SQL function is granted to `anon` and
 * the `post_views` RLS lets anyone insert.
 *
 * Call from a `<RecordView postId={…} />` client component (Phase 4) on
 * /post/[slug] mount. For now, the post page calls this directly during
 * its server render to keep Phase 3 surface area small.
 */
export async function recordView(postId: string) {
  if (!postId) return;
  const supabase = await createServerSupabaseClient();
  await supabase.rpc("record_post_view", { p_post_id: postId });
}
