-- 003: invitaciones para dueños de tienda, función de activación y permisos de administración
-- Ejecutar una sola vez en el SQL Editor de Supabase.

create table invitaciones (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references tiendas(id) on delete cascade,
  codigo text not null unique,
  usado boolean not null default false,
  creado_en timestamptz not null default now()
);

alter table invitaciones enable row level security;

create policy "invitaciones_gestion_admin" on invitaciones
  for all
  using (exists (select 1 from perfiles where id = auth.uid() and rol = 'super_admin'))
  with check (exists (select 1 from perfiles where id = auth.uid() and rol = 'super_admin'));

create policy "tiendas_select_admin" on tiendas
  for select using (exists (select 1 from perfiles where id = auth.uid() and rol = 'super_admin'));

create policy "tiendas_insert_admin" on tiendas
  for insert with check (exists (select 1 from perfiles where id = auth.uid() and rol = 'super_admin'));

create policy "productos_select_admin" on productos
  for select using (exists (select 1 from perfiles where id = auth.uid() and rol = 'super_admin'));

create policy "combos_select_admin" on combos
  for select using (exists (select 1 from perfiles where id = auth.uid() and rol = 'super_admin'));

create policy "pedidos_select_admin" on pedidos
  for select using (exists (select 1 from perfiles where id = auth.uid() and rol = 'super_admin'));

-- Función auxiliar para leer el tienda_id del usuario actual sin volver a
-- pasar por las políticas de "perfiles" (evita recursión infinita cuando
-- una política de perfiles necesita consultar la propia tabla perfiles).
create or replace function mi_tienda_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select tienda_id from perfiles where id = auth.uid();
$$;

grant execute on function mi_tienda_id() to authenticated;

-- Permite que el dueño de una tienda vea el nombre/teléfono de los
-- compradores que le hicieron un pedido (para poder contactarlos).
create policy "perfiles_select_dueno_de_compradores" on perfiles
  for select using (
    exists (
      select 1 from pedidos p
      where p.comprador_id = perfiles.id
        and p.tienda_id = mi_tienda_id()
    )
  );

-- El dueño de tienda usa esta función junto con su código de invitación
-- para convertir su cuenta recién creada en cuenta de dueño de esa tienda.
create or replace function activar_dueno(codigo_invitacion text, p_nombre text, p_telefono text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tienda_id uuid;
begin
  select tienda_id into v_tienda_id
  from invitaciones
  where codigo = codigo_invitacion and usado = false;

  if v_tienda_id is null then
    raise exception 'Código de invitación inválido o ya usado';
  end if;

  insert into perfiles (id, rol, tienda_id, nombre, telefono)
  values (auth.uid(), 'dueno_tienda', v_tienda_id, p_nombre, p_telefono)
  on conflict (id) do update
    set rol = 'dueno_tienda',
        tienda_id = v_tienda_id,
        nombre = excluded.nombre,
        telefono = excluded.telefono;

  update invitaciones set usado = true where codigo = codigo_invitacion;

  return v_tienda_id;
end;
$$;

grant execute on function activar_dueno(text, text, text) to authenticated;
