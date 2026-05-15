-- ────────────────────────────────────────────────────────────────────────────
-- 0002_functions_triggers.sql
-- Counter maintenance, new-user handler, slug generation, view recording.
-- ────────────────────────────────────────────────────────────────────────────

-- ── like counts ─────────────────────────────────────────────────────────────
create or replace function public.tg_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set likes_count = likes_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set likes_count = greatest(likes_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;
create trigger likes_count_ins after insert on public.likes
  for each row execute function public.tg_likes_count();
create trigger likes_count_del after delete on public.likes
  for each row execute function public.tg_likes_count();

-- ── save counts (post + profile aggregate) ──────────────────────────────────
create or replace function public.tg_saves_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
begin
  if (tg_op = 'INSERT') then
    update public.posts set saves_count = saves_count + 1 where id = new.post_id
      returning user_id into v_user;
    update public.profiles set saves_total = saves_total + 1 where id = v_user;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set saves_count = greatest(saves_count - 1, 0) where id = old.post_id
      returning user_id into v_user;
    update public.profiles set saves_total = greatest(saves_total - 1, 0) where id = v_user;
    return old;
  end if;
  return null;
end;
$$;
create trigger saves_count_ins after insert on public.saves
  for each row execute function public.tg_saves_count();
create trigger saves_count_del after delete on public.saves
  for each row execute function public.tg_saves_count();

-- ── follower / following counts ─────────────────────────────────────────────
create or replace function public.tg_follow_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.profiles set followers_count = followers_count + 1 where id = new.following_id;
    update public.profiles set following_count = following_count + 1 where id = new.follower_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.profiles set followers_count = greatest(followers_count - 1, 0) where id = old.following_id;
    update public.profiles set following_count = greatest(following_count - 1, 0) where id = old.follower_id;
    return old;
  end if;
  return null;
end;
$$;
create trigger follow_counts_ins after insert on public.follows
  for each row execute function public.tg_follow_counts();
create trigger follow_counts_del after delete on public.follows
  for each row execute function public.tg_follow_counts();

-- ── uploads count + comments count ──────────────────────────────────────────
create or replace function public.tg_uploads_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT' and new.status = 'published') then
    update public.profiles set uploads_count = uploads_count + 1 where id = new.user_id;
  elsif (tg_op = 'UPDATE') then
    if old.status = 'published' and new.status <> 'published' then
      update public.profiles set uploads_count = greatest(uploads_count - 1, 0) where id = new.user_id;
    elsif old.status <> 'published' and new.status = 'published' then
      update public.profiles set uploads_count = uploads_count + 1 where id = new.user_id;
    end if;
  elsif (tg_op = 'DELETE') then
    if old.status = 'published' then
      update public.profiles set uploads_count = greatest(uploads_count - 1, 0) where id = old.user_id;
    end if;
  end if;
  return coalesce(new, old);
end;
$$;
create trigger posts_uploads_count after insert or update of status or delete on public.posts
  for each row execute function public.tg_uploads_count();

create or replace function public.tg_comments_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set comments_count = comments_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set comments_count = greatest(comments_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;
create trigger comments_count_ins after insert on public.comments
  for each row execute function public.tg_comments_count();
create trigger comments_count_del after delete on public.comments
  for each row execute function public.tg_comments_count();

-- ── tag usage counts ────────────────────────────────────────────────────────
create or replace function public.tg_tag_usage()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.tags set usage_count = usage_count + 1 where slug = new.tag_slug;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.tags set usage_count = greatest(usage_count - 1, 0) where slug = old.tag_slug;
    return old;
  end if;
  return null;
end;
$$;
create trigger post_tags_usage_ins after insert on public.post_tags
  for each row execute function public.tg_tag_usage();
create trigger post_tags_usage_del after delete on public.post_tags
  for each row execute function public.tg_tag_usage();

-- ── view recording (atomic) ─────────────────────────────────────────────────
-- Increments posts.views and writes a row into post_views in one round-trip.
create or replace function public.record_post_view(
  p_post_id uuid,
  p_session_id text default null,
  p_referrer text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts set views = views + 1 where id = p_post_id;
  insert into public.post_views (post_id, user_id, session_id, referrer)
    values (p_post_id, auth.uid(), p_session_id, p_referrer);
end;
$$;
grant execute on function public.record_post_view(uuid, text, text) to anon, authenticated;

-- ── new-user handler ────────────────────────────────────────────────────────
-- Creates a stub profile row when a user signs up via auth.users.
-- Username is derived from the email local part + a 6-char nano-id to
-- guarantee uniqueness; users can rename it from /settings later.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base text;
  v_uname citext;
  v_name text;
begin
  v_base := lower(regexp_replace(
    coalesce(
      new.raw_user_meta_data->>'preferred_username',
      split_part(new.email, '@', 1),
      'user'
    ),
    '[^a-z0-9._]+', '', 'g'
  ));
  if length(v_base) < 3 then v_base := 'user' || v_base; end if;
  v_uname := substr(v_base, 1, 25) || '.' || substr(md5(new.id::text), 1, 6);

  v_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    initcap(replace(v_base, '.', ' ')),
    'New maker'
  );

  insert into public.profiles (id, username, name, avatar_url)
  values (
    new.id,
    v_uname,
    v_name,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── slug helper ─────────────────────────────────────────────────────────────
-- Generates a URL-safe slug from a title; uniqueness is enforced by the
-- caller (server action) — it'll suffix with -2, -3, etc. on collision.
create or replace function public.slugify(p_input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    regexp_replace(lower(coalesce(p_input, '')), '[^a-z0-9]+', '-', 'g'),
    '-+', '-', 'g'
  ));
$$;
