-- 002: columna de emoji, seguridad por fila (RLS) y datos de ejemplo
-- Ejecutar una sola vez en el SQL Editor de Supabase.

alter table productos add column if not exists emoji text not null default '📦';

alter table tiendas enable row level security;
alter table perfiles enable row level security;
alter table productos enable row level security;
alter table combos enable row level security;
alter table combo_productos enable row level security;
alter table pedidos enable row level security;
alter table pedido_items enable row level security;

create policy "tiendas_select_publica" on tiendas
  for select using (activa = true);

create policy "tiendas_update_propia" on tiendas
  for update using (id = (select tienda_id from perfiles where id = auth.uid()));

create policy "perfiles_select_propio" on perfiles
  for select using (id = auth.uid());

create policy "perfiles_insert_propio_comprador" on perfiles
  for insert with check (id = auth.uid() and rol = 'comprador');

create policy "productos_select_publica" on productos
  for select using (disponible = true);

create policy "productos_gestion_dueno" on productos
  for all
  using (tienda_id = (select tienda_id from perfiles where id = auth.uid()))
  with check (tienda_id = (select tienda_id from perfiles where id = auth.uid()));

create policy "combos_select_publica" on combos
  for select using (disponible = true);

create policy "combos_gestion_dueno" on combos
  for all
  using (tienda_id = (select tienda_id from perfiles where id = auth.uid()))
  with check (tienda_id = (select tienda_id from perfiles where id = auth.uid()));

create policy "combo_productos_select_publica" on combo_productos
  for select using (true);

create policy "pedidos_insert_propio" on pedidos
  for insert with check (comprador_id = auth.uid());

create policy "pedidos_select_propio" on pedidos
  for select using (comprador_id = auth.uid());

create policy "pedidos_select_dueno" on pedidos
  for select using (tienda_id = (select tienda_id from perfiles where id = auth.uid()));

create policy "pedidos_update_dueno" on pedidos
  for update using (tienda_id = (select tienda_id from perfiles where id = auth.uid()));

create policy "pedido_items_insert_propio" on pedido_items
  for insert with check (
    exists (select 1 from pedidos p where p.id = pedido_id and p.comprador_id = auth.uid())
  );

create policy "pedido_items_select_propio" on pedido_items
  for select using (
    exists (
      select 1 from pedidos p
      where p.id = pedido_id
        and (
          p.comprador_id = auth.uid()
          or p.tienda_id = (select tienda_id from perfiles where id = auth.uid())
        )
    )
  );

-- Datos de ejemplo para poder probar la tienda pública ahora mismo
insert into tiendas (nombre, slug, descripcion, whatsapp)
values ('La Habana Express', 'la-habana-express', 'Combos de comida y aseo con entrega en toda Cuba', '5215555555555')
on conflict (slug) do nothing;

insert into productos (tienda_id, nombre, precio, peso_lb, emoji)
select t.id, v.nombre, v.precio, v.peso_lb, v.emoji
from tiendas t,
  (values
    ('Aceite 1 galón', 18, 8, '🛢️'),
    ('Arroz 25 lb', 22, 25, '🍚'),
    ('Muslos de pollo 10 lb', 19, 10, '🍗'),
    ('Frijoles negros 10 lb', 15, 10, '🫘'),
    ('Detergente 5 lb', 12, 5, '🧼'),
    ('Leche en polvo 5 lb', 24, 5, '🥛')
  ) as v(nombre, precio, peso_lb, emoji)
where t.slug = 'la-habana-express';

insert into combos (tienda_id, nombre, descripcion, precio)
select t.id, v.nombre, v.descripcion, v.precio
from tiendas t,
  (values
    ('Combo Familiar', 'Lo esencial para el mes: aceite, arroz, pollo y frijoles.', 65),
    ('Combo Aseo', 'Detergente y artículos de limpieza del hogar.', 12)
  ) as v(nombre, descripcion, precio)
where t.slug = 'la-habana-express';

insert into combo_productos (combo_id, producto_id, cantidad)
select c.id, p.id, 1
from combos c
join tiendas t on t.id = c.tienda_id and t.slug = 'la-habana-express'
join productos p on p.tienda_id = t.id
where (c.nombre = 'Combo Familiar' and p.nombre in ('Aceite 1 galón', 'Arroz 25 lb', 'Muslos de pollo 10 lb', 'Frijoles negros 10 lb'))
   or (c.nombre = 'Combo Aseo' and p.nombre = 'Detergente 5 lb');
