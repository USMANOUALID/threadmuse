-- ────────────────────────────────────────────────────────────────────────────
-- 0001_schema.sql — ThreadMuse Phase 3 schema
-- Tables, indexes, and foreign keys only. RLS and triggers live in later
-- migrations so each file stays single-purpose.
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ── profiles ────────────────────────────────────────────────────────────────
-- 1:1 with auth.users. The `id` column is the auth user's id so RLS policies
-- can short-circuit to `auth.uid() = id` without a join.
create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  username          citext unique not null,
  name              text not null,
  bio               text,
  location          text,
  website           text,
  avatar_url        text,
  cover_url         text,
  is_verified       boolean not null default false,
  is_admin          boolean not null default false,
  followers_count   integer not null default 0,
  following_count   integer not null default 0,
  uploads_count     integer not null default 0,
  saves_total       integer not null default 0,
  -- Soft delete keeps RLS policies one-line.
  deleted_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9._]{3,32}$')
);
create index profiles_username_idx on public.profiles (username);

-- ── categories ──────────────────────────────────────────────────────────────
create table public.categories (
  slug          text primary key,
  name          text not null,
  icon          text not null, -- maps to IllustrationKind in TS
  blurb         text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ── tags ────────────────────────────────────────────────────────────────────
create table public.tags (
  slug       text primary key,
  name       text not null,
  usage_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── posts ───────────────────────────────────────────────────────────────────
create type public.post_status as enum ('draft', 'published', 'removed', 'flagged');

create table public.posts (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  slug                 text unique not null,
  title                text not null,
  description          text,
  kind                 text not null, -- IllustrationKind
  category             text not null references public.categories(slug) on delete restrict,
  cover_image_url      text not null,
  cover_storage_path   text,                       -- relative path within the bucket
  gallery_image_urls   text[] not null default '{}',
  gallery_storage_paths text[] not null default '{}',
  illustration_height  integer not null default 400,
  price                text not null default 'Free',
  is_premium           boolean not null default false,
  etsy_url             text,
  status               public.post_status not null default 'published',
  -- Aggregate counters maintained by triggers in 0002.
  views                integer not null default 0,
  likes_count          integer not null default 0,
  saves_count          integer not null default 0,
  comments_count       integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint price_format check (price ~ '^(Free|\$[0-9]+(\.[0-9]{1,2})?)$'),
  constraint etsy_url_https check (etsy_url is null or etsy_url ~ '^https://')
);
create index posts_user_id_idx        on public.posts (user_id);
create index posts_category_idx       on public.posts (category);
create index posts_status_created_idx on public.posts (status, created_at desc);
create index posts_status_views_idx   on public.posts (status, views desc);

-- ── post_tags (many-to-many) ────────────────────────────────────────────────
create table public.post_tags (
  post_id   uuid not null references public.posts(id) on delete cascade,
  tag_slug  text not null references public.tags(slug) on delete cascade,
  primary key (post_id, tag_slug)
);
create index post_tags_tag_idx on public.post_tags (tag_slug);

-- ── social: likes, saves, follows ───────────────────────────────────────────
create table public.likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create index likes_post_idx on public.likes (post_id);

create table public.saves (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create index saves_user_idx on public.saves (user_id);
create index saves_post_idx on public.saves (post_id);

create table public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_not_self check (follower_id <> following_id)
);
create index follows_following_idx on public.follows (following_id);

-- ── comments ────────────────────────────────────────────────────────────────
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.posts(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  body          text not null check (length(body) between 1 and 2000),
  parent_id     uuid references public.comments(id) on delete cascade,
  likes_count   integer not null default 0,
  is_hidden     boolean not null default false,
  created_at    timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at desc);

-- ── post_views (analytics log) ──────────────────────────────────────────────
-- Append-only fact table. Aggregated counter lives on posts.views and is
-- maintained by the trigger in 0002.
create table public.post_views (
  id          bigserial primary key,
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  session_id  text,
  referrer    text,
  utm_source  text,
  utm_campaign text,
  created_at  timestamptz not null default now()
);
create index post_views_post_idx on public.post_views (post_id, created_at desc);
create index post_views_user_idx on public.post_views (user_id) where user_id is not null;

-- ── reports (moderation) ────────────────────────────────────────────────────
create table public.reports (
  id            uuid primary key default gen_random_uuid(),
  reporter_id   uuid references public.profiles(id) on delete set null,
  post_id       uuid references public.posts(id) on delete cascade,
  comment_id    uuid references public.comments(id) on delete cascade,
  reason        text not null,
  status        text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at    timestamptz not null default now(),
  check (post_id is not null or comment_id is not null)
);
create index reports_status_idx on public.reports (status, created_at desc);

-- updated_at maintenance — generic trigger reused by profiles + posts
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.tg_set_updated_at();
create trigger posts_updated_at before update on public.posts
  for each row execute function public.tg_set_updated_at();
