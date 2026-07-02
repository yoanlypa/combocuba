-- 007: el super-admin puede gestionar (no solo ver) productos, combos y
-- pedidos de cualquier tienda, y subir/borrar imágenes en cualquier
-- carpeta del bucket "productos".
-- También corrige un bug: combo_productos tenía RLS activado pero nunca
-- se le dio permiso de insertar/editar a nadie, así que guardar un combo
-- con productos fallaba silenciosamente.
-- Ejecutar una sola vez en el SQL Editor de Supabase.

drop policy if exists "productos_select_admin" on productos;
create policy "productos_gestion_admin" on productos
  for all
  using (mi_rol() = 'super_admin')
  with check (mi_rol() = 'super_admin');

drop policy if exists "combos_select_admin" on combos;
create policy "combos_gestion_admin" on combos
  for all
  using (mi_rol() = 'super_admin')
  with check (mi_rol() = 'super_admin');

drop policy if exists "pedidos_select_admin" on pedidos;
create policy "pedidos_gestion_admin" on pedidos
  for all
  using (mi_rol() = 'super_admin')
  with check (mi_rol() = 'super_admin');

create policy "productos_imagenes_gestion_admin" on storage.objects
  for all
  using (bucket_id = 'productos' and mi_rol() = 'super_admin')
  with check (bucket_id = 'productos' and mi_rol() = 'super_admin');

create policy "combo_productos_gestion_dueno" on combo_productos
  for all
  using (exists (select 1 from combos c where c.id = combo_id and c.tienda_id = mi_tienda_id()))
  with check (exists (select 1 from combos c where c.id = combo_id and c.tienda_id = mi_tienda_id()));

create policy "combo_productos_gestion_admin" on combo_productos
  for all
  using (mi_rol() = 'super_admin')
  with check (mi_rol() = 'super_admin');
