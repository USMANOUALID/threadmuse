-- ────────────────────────────────────────────────────────────────────────────
-- 0004_storage.sql — Buckets + storage policies
-- Three buckets:
--   covers/    cover images for posts (public read)
--   galleries/ gallery images for posts (public read)
--   avatars/   profile avatars + banners (public read)
--
-- Path convention inside every bucket: `${auth_uid}/${filename}` so the RLS
-- check `auth.uid()::text = (storage.foldername(name))[1]` lets us scope
-- writes to the uploader without a separate metadata table.
-- ────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('covers',    'covers',    true, 8 * 1024 * 1024,  array['image/jpeg','image/png','image/webp','image/avif']),
  ('galleries', 'galleries', true, 8 * 1024 * 1024,  array['image/jpeg','image/png','image/webp','image/avif']),
  ('avatars',   'avatars',   true, 2 * 1024 * 1024,  array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ── covers ──────────────────────────────────────────────────────────────────
create policy "covers: public read"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "covers: authenticated upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "covers: owner can update own object"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "covers: owner can delete own object"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── galleries ───────────────────────────────────────────────────────────────
create policy "galleries: public read"
  on storage.objects for select
  using (bucket_id = 'galleries');

create policy "galleries: authenticated upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'galleries'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "galleries: owner can update own object"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'galleries'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "galleries: owner can delete own object"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'galleries'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── avatars ─────────────────────────────────────────────────────────────────
create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: authenticated upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner can update own object"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner can delete own object"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
