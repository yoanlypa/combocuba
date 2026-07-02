-- 008: permite que el super-admin también edite los datos de una tienda
-- (nombre, whatsapp, correo de avisos, telegram) desde /panel?tienda=...
-- Ejecutar una sola vez en el SQL Editor de Supabase.

create policy "tiendas_update_admin" on tiendas
  for update using (mi_rol() = 'super_admin');
