-- 009: evita que dos tiendas compartan el mismo correo de avisos o el
-- mismo WhatsApp (para que las notificaciones no se crucen entre negocios).
-- Ejecutar una sola vez en el SQL Editor de Supabase.

alter table tiendas add constraint tiendas_email_contacto_unico unique (email_contacto);
alter table tiendas add constraint tiendas_whatsapp_unico unique (whatsapp);
