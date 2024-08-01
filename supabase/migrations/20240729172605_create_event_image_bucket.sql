insert into storage.buckets
  (id, name, public, allowed_mime_types)
values
  ('event-thumbnails', 'event-thumbnails', true, '{"image/png", "image/jpeg", "image/jfif", "image/webp"}');

create policy "Staff can upload event thumbnails"
on storage.objects
for insert 
to authenticated 
with check ( ((auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true)) and bucket_id = 'event-thumbnails' );

create policy "Staff can insert event thumbnails"
on storage.objects
for insert 
to authenticated
with check ( ((auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true)) and bucket_id = 'event-thumbnails' );

create policy "Staff can update event thumbnails"
on storage.objects
for update 
to authenticated
using ( ((auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true)) and bucket_id = 'event-thumbnails' );

create policy "Staff can select event thumbnails"
on storage.objects
for select 
to authenticated
using ( (auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true) and bucket_id = 'event-thumbnails' );