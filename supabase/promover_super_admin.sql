-- Promueve una cuenta ya registrada a super_admin.
-- Cambia el correo si necesitas promover a otra persona más adelante.

insert into perfiles (id, rol, nombre)
select id, 'super_admin', coalesce(raw_user_meta_data->>'nombre', '')
from auth.users
where email = 'pyoanly@gmail.com'
on conflict (id) do update set rol = 'super_admin';
