-- 006: bucket de Storage para fotos de productos, con permisos por tienda.
-- Ejecutar una sola vez en el SQL Editor de Supabase.

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "productos_imagenes_lectura_publica" on storage.objects;
create policy "productos_imagenes_lectura_publica" on storage.objects
  for select using (bucket_id = 'productos');

drop policy if exists "productos_imagenes_gestion_dueno" on storage.objects;
create policy "productos_imagenes_gestion_dueno" on storage.objects
  for all
  using (bucket_id = 'productos' and (storage.foldername(name))[1] = mi_tienda_id()::text)
  with check (bucket_id = 'productos' and (storage.foldername(name))[1] = mi_tienda_id()::text);
