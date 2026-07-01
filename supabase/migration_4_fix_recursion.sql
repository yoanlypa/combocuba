-- 004: corrige "infinite recursion detected in policy for relation perfiles"
-- Ejecutar una sola vez en el SQL Editor de Supabase (después de migration_3).

drop policy if exists "perfiles_select_dueno_de_compradores" on perfiles;

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

create policy "perfiles_select_dueno_de_compradores" on perfiles
  for select using (
    exists (
      select 1 from pedidos p
      where p.comprador_id = perfiles.id
        and p.tienda_id = mi_tienda_id()
    )
  );
