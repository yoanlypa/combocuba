-- 004: corrige "infinite recursion detected in policy for relation perfiles"
-- Ejecutar una sola vez en el SQL Editor de Supabase.
-- Si algo falla, copia el mensaje de error completo tal cual lo muestra Supabase.

drop policy if exists "perfiles_select_dueno_de_compradores" on perfiles;
drop function if exists mi_tienda_id();

create function mi_tienda_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select tienda_id from perfiles where id = auth.uid();
$$;

grant execute on function mi_tienda_id() to authenticated;

create policy "perfiles_select_dueno_de_compradores" on perfiles
  for select using (
    exists (
      select 1 from pedidos p
      where p.comprador_id = perfiles.id
        and p.tienda_id = mi_tienda_id()
    )
  );
