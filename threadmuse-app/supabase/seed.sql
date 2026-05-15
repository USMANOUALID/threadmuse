-- ────────────────────────────────────────────────────────────────────────────
-- seed.sql — bootstraps fixed data (categories) so the app boots without
-- needing service-role intervention. Re-runnable: every insert uses ON
-- CONFLICT DO UPDATE so re-seeding doesn't error.
-- Run after `supabase db reset` (auto) or `supabase db push`.
-- ────────────────────────────────────────────────────────────────────────────

insert into public.categories (slug, name, icon, blurb, display_order) values
  ('crochet-patterns', 'Crochet Patterns', 'crochet',    'Daisy coasters, granny squares, cottage cardigans.',         1),
  ('wallpapers',       'Wallpapers',       'wallpaper',  'Phone, desktop and tablet — mostly free, all warm-toned.',   2),
  ('printable-art',    'Printable Art',    'print',      'Typographic and botanical prints for slow weekends.',         3),
  ('digital-planners', 'Digital Planners', 'planner',    'Planners that earn their keep.',                              4),
  ('embroidery',       'Embroidery',       'embroidery', 'Hoop patterns, beginner-friendly stitch guides.',             5),
  ('knitting',         'Knitting',         'knit',       'Mittens, beanies, slow-knit sweaters.',                       6),
  ('svg-files',        'SVG Files',        'svg',        'Cricut-ready cut files and bundles.',                         7),
  ('stickers',         'Stickers',         'sticker',    'Journaling sets dropped every Friday.',                       8),
  ('ai-art',           'AI Art',           'ai',         'Hand-curated AI wall art series.',                            9),
  ('home-decor',       'Home Decor',       'home',       'Gallery walls, shelf styling, linen rooms.',                 10)
on conflict (slug) do update
  set name = excluded.name,
      icon = excluded.icon,
      blurb = excluded.blurb,
      display_order = excluded.display_order;

-- ── billing: free plan seed ─────────────────────────────────────────────────
-- Pro / Studio rows are inserted by `scripts/seed-stripe.ts` after Stripe
-- products are created, since their `id` (price id) is provisioned upstream.
insert into public.plans (id, product_id, name, description, interval, amount_cents, currency, is_active, display_order, features) values
  (
    'free',
    'free',
    'Free',
    'Forever-free plan for new makers — everything you need to publish your first shop.',
    'month',
    0,
    'usd',
    true,
    0,
    array[
      'Unlimited free uploads',
      'Personal Etsy affiliate link',
      'Standard SEO meta',
      'Pinterest pin generator'
    ]
  )
on conflict (id) do update
  set name = excluded.name,
      description = excluded.description,
      features = excluded.features,
      display_order = excluded.display_order;
