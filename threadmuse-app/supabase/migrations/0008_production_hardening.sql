-- Production hardening: audit logs, user notifications/messages, and security support tables.

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  body text not null,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.messages enable row level security;

drop policy if exists "admins read audit logs" on public.audit_logs;
create policy "admins read audit logs" on public.audit_logs for select using (public.is_admin());

drop policy if exists "admins create audit logs" on public.audit_logs;
create policy "admins create audit logs" on public.audit_logs for insert with check (public.is_admin());

drop policy if exists "users read own notifications" on public.notifications;
create policy "users read own notifications" on public.notifications for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "users update own notifications" on public.notifications;
create policy "users update own notifications" on public.notifications for update using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "admins manage notifications" on public.notifications;
create policy "admins manage notifications" on public.notifications for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "users read own messages" on public.messages;
create policy "users read own messages" on public.messages for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "users update own messages" on public.messages;
create policy "users update own messages" on public.messages for update using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "admins manage messages" on public.messages;
create policy "admins manage messages" on public.messages for all using (public.is_admin()) with check (public.is_admin());
