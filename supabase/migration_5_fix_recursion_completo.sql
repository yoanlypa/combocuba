-- 005: elimina toda referencia circular entre las políticas de "perfiles" y
-- las demás tablas (pedidos, productos, combos, tiendas, invitaciones).
-- El problema: varias políticas en esas tablas consultaban "perfiles"
-- directamente, y una política de "perfiles" consultaba "pedidos" — ese
-- ida y vuelta es lo que Postgres reporta como recursión infinita.
-- Ejecutar una sola vez en el SQL Editor de Supabase (después de
-- migration_4_fix_recursion.sql).

create or replace function mi_rol()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select rol from perfiles where id = auth.uid();
$$;

grant execute on function mi_rol() to authenticated;

-- tiendas
drop policy if exists "tiendas_update_propia" on tiendas;
create policy "tiendas_update_propia" on tiendas
  for update using (id = mi_tienda_id());

drop policy if exists "tiendas_select_admin" on tiendas;
create policy "tiendas_select_admin" on tiendas
  for select using (mi_rol() = 'super_admin');

drop policy if exists "tiendas_insert_admin" on tiendas;
create policy "tiendas_insert_admin" on tiendas
  for insert with check (mi_rol() = 'super_admin');

-- productos
drop policy if exists "productos_gestion_dueno" on productos;
create policy "productos_gestion_dueno" on productos
  for all
  using (tienda_id = mi_tienda_id())
  with check (tienda_id = mi_tienda_id());

drop policy if exists "productos_select_admin" on productos;
create policy "productos_select_admin" on productos
  for select using (mi_rol() = 'super_admin');

-- combos
drop policy if exists "combos_gestion_dueno" on combos;
create policy "combos_gestion_dueno" on combos
  for all
  using (tienda_id = mi_tienda_id())
  with check (tienda_id = mi_tienda_id());

drop policy if exists "combos_select_admin" on combos;
create policy "combos_select_admin" on combos
  for select using (mi_rol() = 'super_admin');

-- pedidos
drop policy if exists "pedidos_select_dueno" on pedidos;
create policy "pedidos_select_dueno" on pedidos
  for select using (tienda_id = mi_tienda_id());

drop policy if exists "pedidos_update_dueno" on pedidos;
create policy "pedidos_update_dueno" on pedidos
  for update using (tienda_id = mi_tienda_id());

drop policy if exists "pedidos_select_admin" on pedidos;
create policy "pedidos_select_admin" on pedidos
  for select using (mi_rol() = 'super_admin');

-- invitaciones
drop policy if exists "invitaciones_gestion_admin" on invitaciones;
create policy "invitaciones_gestion_admin" on invitaciones
  for all
  using (mi_rol() = 'super_admin')
  with check (mi_rol() = 'super_admin');
