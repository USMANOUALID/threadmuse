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

drop policy if exists "visitors create analytics events" on public.analytics_events;
create policy "visitors create analytics events" on public.analytics_events for insert with check (true);
drop policy if exists "visitors update own newsletter by email" on public.newsletter_subscribers;

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


drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, value)
values
  ('brand', '{"name":"NoirEdge","primaryColor":"#ef4444","supportEmail":"hello@noiredge.ai","primaryCta":"Book strategy call"}'::jsonb),
  ('social', '{"twitter":"https://x.com/noiredgeai","linkedin":"https://linkedin.com/company/noiredge"}'::jsonb),
  ('analytics', '{"enabled":true,"provider":"supabase_events"}'::jsonb)
on conflict (key) do nothing;

insert into public.seo_settings (path, title, description, canonical_url, noindex, structured_data)
values
  ('/', 'NoirEdge - Premium AI SaaS operating system', 'NoirEdge unifies AI workflows, customer intelligence, automation, and executive analytics for high-growth teams.', null, false, '{}'::jsonb),
  ('/services', 'Services - NoirEdge', 'Premium SaaS websites, AI automation, CMS operations, SEO, and analytics command centers.', null, false, '{}'::jsonb),
  ('/pricing', 'Pricing - NoirEdge', 'Premium plans for SaaS teams that need CMS, AI automation, analytics, and secure admin workflows.', null, false, '{}'::jsonb),
  ('/blog', 'Blog - NoirEdge', 'Insights about premium SaaS growth, Supabase CMS, AI operations, and conversion systems.', null, false, '{}'::jsonb)
on conflict (path) do nothing;

insert into public.homepage_sections (section_key, eyebrow, title, body, cta_label, cta_href, content, display_order, is_published)
values
  ('hero', 'Premium AI SaaS website + CMS', 'A luxury SaaS presence with an AI-powered admin engine.', 'Launch a Stripe-level dark website with conversion pages, Supabase CMS, secure admins, SEO controls, analytics, and editable content.', 'Book strategy call', '/contact', '{"stats":[{"label":"Automated workflows","value":"24M+"},{"label":"Revenue teams onboarded","value":"1200+"},{"label":"Platform uptime","value":"99.98%"}]}'::jsonb, 1, true),
  ('features', 'Platform', 'Everything a premium SaaS brand needs to launch, manage, and grow.', 'Website and admin system are designed together so content, conversion, and database security stay aligned.', 'Explore services', '/services', '{}'::jsonb, 2, true),
  ('cta', 'Call to action', 'Ready for a SaaS site that feels expensive and works hard?', 'Tell us what you want to launch. Every inquiry is stored in Supabase for admin review and follow-up.', 'Request private strategy call', '/contact', '{}'::jsonb, 10, true)
on conflict (section_key) do nothing;

insert into public.services (slug, title, description, deliverables, icon, display_order, is_published)
values
  ('ai-automation', 'AI Automation Systems', 'Design, deploy, and monitor AI workflows that qualify leads, summarize accounts, trigger lifecycle campaigns, and route high-value work.', array['Workflow maps','Prompt operations','Human approval queues','Audit dashboards'], 'bot', 1, true),
  ('saas-growth-sites', 'Premium SaaS Growth Websites', 'Conversion-focused websites with animated sections, pricing, CMS editing, SEO foundations, and launch-ready analytics.', array['Landing pages','SEO architecture','CMS fields','Performance optimization'], 'sparkles', 2, true),
  ('analytics-command-center', 'Analytics Command Centers', 'Board-ready dashboards for pipeline, retention, activation, revenue expansion, content performance, and channel ROI.', array['KPI modeling','Supabase views','Role-based reports','Executive summaries'], 'bar-chart', 3, true),
  ('cms-ops', 'CMS & Content Operations', 'Structured content models for services, pricing, testimonials, FAQs, articles, metadata, media, and global settings.', array['Content schemas','Admin workflows','Media library','Approval flows'], 'database', 4, true)
on conflict (slug) do nothing;

insert into public.pricing_plans (slug, name, price, cadence, description, features, cta_label, is_featured, display_order, is_published)
values
  ('launch', 'Launch', '$149', '/mo', 'For founders and boutique teams launching a premium SaaS presence.', array['Editable website CMS','Contact and newsletter storage','Basic analytics','1 admin seat'], 'Start Launch', false, 1, true),
  ('scale', 'Scale', '$399', '/mo', 'For teams that need automation, content velocity, and richer reporting.', array['Everything in Launch','AI workflow modules','Advanced SEO settings','5 admin seats','Priority support'], 'Choose Scale', true, 2, true),
  ('enterprise', 'Enterprise', 'Custom', null, 'For organizations with bespoke data, security, and operating-model requirements.', array['Custom Supabase architecture','SAML-ready admin access','Dedicated success','Quarterly growth reviews'], 'Talk to sales', false, 3, true)
on conflict (slug) do nothing;

insert into public.testimonials (quote, name, role, company, is_featured, display_order)
values
  ('NoirEdge made our site feel like a category leader and gave our operators a CMS that mirrors how the business works.', 'Maya Chen', 'COO', 'SignalForge', true, 1),
  ('The admin dashboard is the rare combination of beautiful and useful. Our team edits content, reviews leads, and tracks campaigns without engineering tickets.', 'Andre Willis', 'VP Growth', 'Northstar AI', true, 2),
  ('We went from static pages to an AI-enabled operating layer with clean policies, secure roles, and executive-grade analytics.', 'Elena Rossi', 'Founder', 'ArcPilot', true, 3)
on conflict do nothing;

insert into public.faq_items (question, answer, category, display_order, is_published)
values
  ('Is the CMS connected to Supabase?', 'Yes. Content, media, settings, SEO, messages, newsletter leads, analytics, and roles are backed by Supabase tables with RLS.', 'CMS', 1, true),
  ('Can non-technical admins edit the website?', 'Yes. Admins can manage homepage sections, services, pricing, testimonials, FAQ, blog, media, settings, SEO, users, and analytics.', 'Admin', 2, true),
  ('How is admin access protected?', 'Supabase Auth handles sessions. Server layouts and server actions verify admin roles before rendering or mutating data.', 'Security', 3, true),
  ('Is it deployment ready?', 'The project includes migrations, RLS, storage policies, SEO routes, responsive pages, build checks, and a clean dependency audit.', 'Deployment', 4, true)
on conflict do nothing;

insert into public.blog_posts (slug, title, excerpt, body, category, status, published_at, seo_title, seo_description)
values
  ('premium-saas-homepage-anatomy', 'The anatomy of a premium SaaS homepage that converts enterprise buyers', 'A practical breakdown of hero clarity, trust architecture, objections, proof, pricing, and action paths.', 'Premium SaaS homepages convert when positioning, proof, objections, pricing, and action paths are designed as one system.', 'Growth', 'published', now(), 'Premium SaaS homepage anatomy', 'Learn how premium SaaS teams structure high-converting homepages.'),
  ('supabase-cms-rls', 'How to design a Supabase CMS with row-level security and admin roles', 'Secure patterns for editable content, public reads, private messages, media libraries, and user management.', 'A production CMS needs public read policies, admin-only writes, media bucket rules, and strict role checks in server actions.', 'Engineering', 'published', now(), 'Supabase CMS with RLS', 'Build secure Supabase CMS tables with admin role permissions.'),
  ('ai-ops-dashboard', 'What executives actually need from an AI operations dashboard', 'The metrics, workflow states, and governance signals that make AI automation safe enough for revenue teams.', 'Executive dashboards should connect automation throughput, approvals, revenue impact, and governance into a single operating view.', 'Analytics', 'published', now(), 'AI operations dashboard metrics', 'The AI dashboard metrics executives need for safe automation.')
on conflict (slug) do nothing;

insert into public.analytics_events (event_name, path, visitor_id, metadata)
values
  ('page_view', '/', 'seed', '{"source":"seed"}'::jsonb),
  ('contact_submit', '/contact', 'seed', '{"source":"seed"}'::jsonb),
  ('pricing_view', '/pricing', 'seed', '{"source":"seed"}'::jsonb)
on conflict do nothing;
