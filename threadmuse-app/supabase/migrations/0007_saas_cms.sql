-- Premium SaaS CMS schema for NoirEdge.
-- Public content can be read by visitors; writes and private operational data are admin-only.

create extension if not exists pgcrypto;

alter table public.profiles add column if not exists role text not null default 'member';
alter table public.profiles add column if not exists last_seen_at timestamptz;

create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'editor')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create or replace function public.is_admin(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = check_user
      and (p.is_admin = true or p.role in ('owner', 'admin', 'editor'))
  )
  or exists (
    select 1
    from public.admin_roles r
    where r.user_id = check_user
  );
$$;

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.seo_settings (
  path text primary key,
  title text not null,
  description text not null,
  canonical_url text,
  og_image_url text,
  noindex boolean not null default false,
  structured_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  eyebrow text,
  body text,
  cta_label text,
  cta_href text,
  content jsonb not null default '{}'::jsonb,
  display_order int not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  deliverables text[] not null default '{}',
  icon text,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price text not null,
  cadence text,
  description text not null,
  features text[] not null default '{}',
  cta_label text not null,
  checkout_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null,
  company text,
  avatar_url text,
  is_featured boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null default '',
  category text not null,
  cover_image_url text,
  author_id uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  budget text,
  message text not null,
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'qualified', 'replied', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  assigned_to uuid references auth.users(id)
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  segment text,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'cms-media',
  storage_path text not null unique,
  public_url text not null,
  alt_text text,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text,
  visitor_id text,
  user_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.services enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq_items enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.media_assets enable row level security;
alter table public.analytics_events enable row level security;

drop policy if exists "public read homepage" on public.homepage_sections;
create policy "public read homepage" on public.homepage_sections for select using (is_published = true);
drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (is_published = true);
drop policy if exists "public read pricing" on public.pricing_plans;
create policy "public read pricing" on public.pricing_plans for select using (is_published = true);
drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (is_featured = true);
drop policy if exists "public read faq" on public.faq_items;
create policy "public read faq" on public.faq_items for select using (is_published = true);
drop policy if exists "public read blog" on public.blog_posts;
create policy "public read blog" on public.blog_posts for select using (status = 'published');
drop policy if exists "public read seo" on public.seo_settings;
create policy "public read seo" on public.seo_settings for select using (noindex = false);

drop policy if exists "visitors create contact messages" on public.contact_messages;
create policy "visitors create contact messages" on public.contact_messages for insert with check (true);
drop policy if exists "visitors subscribe newsletter" on public.newsletter_subscribers;
create policy "visitors subscribe newsletter" on public.newsletter_subscribers for insert with check (true);
drop policy if exists "visitors update own newsletter by email" on public.newsletter_subscribers;
create policy "visitors update own newsletter by email" on public.newsletter_subscribers for update using (true) with check (true);

do $$
declare
  cms_table text;
begin
  foreach cms_table in array array[
    'admin_roles',
    'site_settings',
    'seo_settings',
    'homepage_sections',
    'services',
    'pricing_plans',
    'testimonials',
    'faq_items',
    'blog_posts',
    'contact_messages',
    'newsletter_subscribers',
    'media_assets',
    'analytics_events'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', 'admins manage ' || cms_table, cms_table);
    execute format(
      'create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      'admins manage ' || cms_table,
      cms_table
    );
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-media', 'cms-media', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read cms media" on storage.objects;
create policy "public read cms media" on storage.objects
for select using (bucket_id = 'cms-media');

drop policy if exists "admins upload cms media" on storage.objects;
create policy "admins upload cms media" on storage.objects
for insert with check (bucket_id = 'cms-media' and public.is_admin());

drop policy if exists "admins manage cms media" on storage.objects;
create policy "admins manage cms media" on storage.objects
for all using (bucket_id = 'cms-media' and public.is_admin())
with check (bucket_id = 'cms-media' and public.is_admin());
