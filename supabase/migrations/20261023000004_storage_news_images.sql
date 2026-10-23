-- Storage-Bucket für News-Bilder: öffentlich lesbar (Public URL), Schreiben nur Redaktion

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-images',
  'news-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Auflisten nur für Redaktion (öffentlicher Abruf läuft über die Public URL)
create policy "news_images_select_editors"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'news-images' and public.has_role('content_creator'));

create policy "news_images_insert_editors"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'news-images' and public.has_role('content_creator'));

create policy "news_images_update_editors"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'news-images' and public.has_role('content_creator'))
  with check (bucket_id = 'news-images' and public.has_role('content_creator'));

create policy "news_images_delete_editors"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'news-images' and public.has_role('content_creator'));
