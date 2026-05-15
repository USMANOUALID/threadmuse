-- ────────────────────────────────────────────────────────────────────────────
-- 0005_billing.sql — Stripe billing schema
-- Three tables:
--   plans         — local mirror of Stripe Products/Prices, keyed by stripe_price_id
--   customers     — 1:1 with profiles, links a user to a stripe_customer_id
--   subscriptions — current subscription state per user (mirrored from webhooks)
--
-- Source of truth is always Stripe. These tables are a cached projection so
-- the app can render gates and badges without an outbound API call on every
-- request. Webhooks (`stripe.subscription.created/updated/deleted`) keep the
-- projection fresh.
-- ────────────────────────────────────────────────────────────────────────────

-- ── plans ───────────────────────────────────────────────────────────────────
-- A `plan` corresponds to a Stripe Price (not Product). We key by Stripe price
-- id so the app can resolve "which plan is this subscription on" cheaply.
create table public.plans (
  id                 text primary key,             -- stripe_price_id, e.g. "price_…"
  product_id         text not null,                -- stripe_product_id
  name               text not null,                -- "Pro", "Studio", etc.
  description        text,
  interval           text not null check (interval in ('month','year')),
  amount_cents       integer not null check (amount_cents >= 0),
  currency           text not null default 'usd',
  is_active          boolean not null default true,
  display_order      integer not null default 0,
  -- A free plan exists as a row with amount_cents=0 and no Stripe price; we
  -- still want it in the table so the app can describe "what you get free".
  features           text[] not null default '{}',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index plans_active_order_idx on public.plans (is_active, display_order);

-- ── customers ──────────────────────────────────────────────────────────────
-- 1:1 with profiles. We create the row lazily when a user first reaches the
-- checkout flow — `ensure_customer_row` is a SECURITY DEFINER RPC that does
-- it inside the server action.
create table public.customers (
  user_id            uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text unique not null,
  email              citext,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ── subscriptions ──────────────────────────────────────────────────────────
-- Mirrors `subscription.*` events. We store the canonical fields the app
-- needs to render a billing UI without round-tripping to Stripe.
create type public.subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'
);

create table public.subscriptions (
  id                       text primary key,                       -- stripe_subscription_id
  user_id                  uuid not null references public.profiles(id) on delete cascade,
  plan_id                  text not null references public.plans(id) on delete restrict,
  status                   public.subscription_status not null,
  current_period_start     timestamptz not null,
  current_period_end       timestamptz not null,
  cancel_at_period_end     boolean not null default false,
  canceled_at              timestamptz,
  trial_end                timestamptz,
  -- The latest invoice_id is useful for "view receipt" links; nullable for
  -- trialing rows that haven't been invoiced yet.
  latest_invoice_id        text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index subscriptions_user_idx   on public.subscriptions (user_id, status);
create index subscriptions_status_idx on public.subscriptions (status);

-- updated_at maintenance — reuse the trigger function from 0001.
create trigger plans_updated_at         before update on public.plans
  for each row execute function public.tg_set_updated_at();
create trigger customers_updated_at     before update on public.customers
  for each row execute function public.tg_set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.tg_set_updated_at();

-- ── current_plan view ──────────────────────────────────────────────────────
-- Convenience read used by gating code: returns the "best" current plan for
-- a user (active subscription's plan, or the free plan as fallback). The app
-- selects from this with `eq('user_id', uid).maybeSingle()`.
create or replace view public.current_plan as
  select
    p.id        as user_id,
    coalesce(active_sub.plan_id, free.id) as plan_id,
    coalesce(active_plan.name, free.name, 'Free') as plan_name,
    active_sub.status                    as status,
    active_sub.current_period_end        as current_period_end,
    active_sub.cancel_at_period_end      as cancel_at_period_end
  from public.profiles p
  left join lateral (
    select s.*
    from public.subscriptions s
    where s.user_id = p.id
      and s.status in ('trialing','active','past_due')
    order by s.current_period_end desc nulls last
    limit 1
  ) active_sub on true
  left join public.plans active_plan on active_plan.id = active_sub.plan_id
  left join lateral (
    select pl.* from public.plans pl
    where pl.amount_cents = 0 and pl.is_active = true
    order by pl.display_order limit 1
  ) free on true;

-- A view inherits the RLS of its underlying tables in PG15+, but only when
-- declared `security_invoker = on`. Set it so RLS checks run as the caller.
alter view public.current_plan set (security_invoker = on);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.plans         enable row level security;
alter table public.customers     enable row level security;
alter table public.subscriptions enable row level security;

-- Plans are public (pricing page reads them).
create policy "plans are public"
  on public.plans for select using (is_active = true);

-- Customers + subscriptions are owner-readable only. Writes happen via the
-- service role from the webhook + server actions.
create policy "customers: self read"
  on public.customers for select
  using (auth.uid() = user_id);

create policy "subscriptions: self read"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- No INSERT/UPDATE policies — service role bypasses RLS and is the only
-- writer. Anything the app does that mutates billing state must go through
-- a server action that uses `createAdminClient()`.

-- ── helper: ensure customer row exists ─────────────────────────────────────
-- Called from the start-checkout server action. If the row exists, returns
-- the stripe_customer_id; otherwise raises an exception so the caller knows
-- to create one upstream via Stripe API and then insert.
create or replace function public.get_or_null_stripe_customer(p_user uuid)
returns text
language sql
security invoker
as $$
  select stripe_customer_id from public.customers where user_id = p_user;
$$;

grant select on public.current_plan to authenticated;
grant execute on function public.get_or_null_stripe_customer(uuid) to authenticated;
