-- ────────────────────────────────────────────────────────────────────────────
-- 0006_plan_quotas.sql — Per-plan quotas + feature flags
--
-- Quotas live on `plans` for now (small enough that a side table isn't worth
-- the join cost). Convention: `-1` means unlimited. Helps the app keep its
-- gating check as a simple `usage < quota || quota === -1`.
--
-- Append-only — 0005 is left untouched on purpose so production migrations
-- stay safe to re-run.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.plans
  add column if not exists max_published_posts        integer not null default -1,
  add column if not exists max_uploads_per_day        integer not null default -1,
  add column if not exists feature_ai_tagging         boolean not null default false,
  add column if not exists feature_priority_discovery boolean not null default false,
  add column if not exists feature_advanced_analytics boolean not null default false;

-- Tighten the free plan defensively. If the seed already ran from 0005 the
-- row exists with permissive quotas; this UPDATE makes the gate real.
update public.plans
   set max_published_posts        = 25,
       max_uploads_per_day        = 5,
       feature_ai_tagging         = false,
       feature_priority_discovery = false,
       feature_advanced_analytics = false
 where id = 'free';

-- The Pro/Studio rows themselves are created by `scripts/seed-stripe.ts`
-- after Stripe products are provisioned — the seed script will write the
-- correct quota values at that time. We add safe defaults here purely for
-- the lazy-mirror path in `upsertSubscriptionFromStripe`: if a webhook
-- arrives for a price id we haven't seeded, the row lands with the column
-- defaults (-1, false) which is "paid-tier permissive" — never accidentally
-- gating a paying customer because of a missing seed row.

comment on column public.plans.max_published_posts is
  'Hard cap on published posts. -1 = unlimited.';
comment on column public.plans.max_uploads_per_day is
  'Rolling 24h cap on new uploads. -1 = unlimited.';
