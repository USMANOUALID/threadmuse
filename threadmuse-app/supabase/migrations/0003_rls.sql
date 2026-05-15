-- ────────────────────────────────────────────────────────────────────────────
-- 0003_rls.sql — Row Level Security policies
-- Default-deny everything; opt every table back in explicitly.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.tags        enable row level security;
alter table public.posts       enable row level security;
alter table public.post_tags   enable row level security;
alter table public.likes       enable row level security;
alter table public.saves       enable row level security;
alter table public.follows     enable row level security;
alter table public.comments    enable row level security;
alter table public.post_views  enable row level security;
alter table public.reports     enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
-- Everyone can read non-deleted profiles. Only the owner can update their row.
create policy "profiles are publicly readable"
  on public.profiles for select
  using (deleted_at is null);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users can soft-delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ── categories ──────────────────────────────────────────────────────────────
-- Read-only for the world; admins manage via service-role.
create policy "categories are public"
  on public.categories for select using (true);

-- ── tags ────────────────────────────────────────────────────────────────────
-- Anyone can read; authenticated users can insert (used by upload flow when a
-- new tag is added). Updates restricted to service role.
create policy "tags are public" on public.tags for select using (true);

create policy "authenticated users can add tags"
  on public.tags for insert
  to authenticated
  with check (true);

-- ── posts ───────────────────────────────────────────────────────────────────
-- Published posts are public. The owner sees drafts + can mutate their rows.
-- Removed/flagged stay invisible to everyone except their owner and admins.
create policy "published posts are public"
  on public.posts for select
  using (status = 'published' or auth.uid() = user_id);

create policy "users can insert their own posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- ── post_tags ───────────────────────────────────────────────────────────────
create policy "post_tags are public"
  on public.post_tags for select using (true);

create policy "post owner can manage their post_tags"
  on public.post_tags for all
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_tags.post_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.posts p
      where p.id = post_tags.post_id and p.user_id = auth.uid()
    )
  );

-- ── likes ───────────────────────────────────────────────────────────────────
-- The aggregate (posts.likes_count) is what UI reads — individual rows are
-- exposed so a logged-in user can tell whether they've liked a post.
create policy "likes are readable by the actor"
  on public.likes for select
  using (auth.uid() = user_id);

create policy "users can like as themselves"
  on public.likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can unlike their own likes"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ── saves ───────────────────────────────────────────────────────────────────
create policy "saves are readable by the actor"
  on public.saves for select
  using (auth.uid() = user_id);

create policy "users can save as themselves"
  on public.saves for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can unsave their own saves"
  on public.saves for delete
  using (auth.uid() = user_id);

-- ── follows ─────────────────────────────────────────────────────────────────
create policy "follows are public"
  on public.follows for select
  using (true);

create policy "users can follow as themselves"
  on public.follows for insert
  to authenticated
  with check (auth.uid() = follower_id);

create policy "users can unfollow their own follows"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- ── comments ────────────────────────────────────────────────────────────────
create policy "comments are public"
  on public.comments for select
  using (not is_hidden or auth.uid() = user_id);

create policy "authenticated users can comment"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can edit their own comments"
  on public.comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ── post_views ──────────────────────────────────────────────────────────────
-- Anonymous inserts allowed (anon writes through the record_post_view RPC).
-- Only the post owner can read their own analytics.
create policy "post_views: owner-only read"
  on public.post_views for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_views.post_id and p.user_id = auth.uid()
    )
  );

create policy "anyone can write a view"
  on public.post_views for insert
  with check (true);

-- ── reports ─────────────────────────────────────────────────────────────────
create policy "authenticated users can file reports"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "reporter can read their own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);
