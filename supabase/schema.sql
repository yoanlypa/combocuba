-- Esquema inicial de ComboCuba
-- Se ejecuta en el SQL Editor de Supabase cuando conectemos el proyecto real.

create table tiendas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  descripcion text,
  whatsapp text,
  email_contacto text,
  telegram_chat_id text,
  activa boolean not null default true,
  creada_en timestamptz not null default now()
);

-- Extiende auth.users con el rol de cada persona
create table perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  rol text not null check (rol in ('super_admin', 'dueno_tienda', 'comprador')),
  nombre text,
  telefono text,
  tienda_id uuid references tiendas (id),
  creado_en timestamptz not null default now()
);

create table productos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references tiendas (id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(10, 2) not null,
  peso_lb numeric(6, 2),
  imagen_url text,
  disponible boolean not null default true,
  creado_en timestamptz not null default now()
);

create table combos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references tiendas (id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(10, 2) not null,
  imagen_url text,
  disponible boolean not null default true,
  creado_en timestamptz not null default now()
);

create table combo_productos (
  combo_id uuid not null references combos (id) on delete cascade,
  producto_id uuid not null references productos (id) on delete cascade,
  cantidad int not null default 1,
  primary key (combo_id, producto_id)
);

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references tiendas (id),
  comprador_id uuid not null references perfiles (id),
  destinatario_nombre text not null,
  destinatario_telefono text,
  destinatario_direccion text,
  destinatario_provincia text,
  notas text,
  total numeric(10, 2) not null default 0,
  estado text not null default 'nuevo' check (estado in ('nuevo', 'contactado', 'cerrado', 'cancelado')),
  creado_en timestamptz not null default now()
);

create table pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos (id) on delete cascade,
  producto_id uuid references productos (id),
  combo_id uuid references combos (id),
  cantidad int not null default 1,
  precio_unitario numeric(10, 2) not null,
  check (
    (producto_id is not null and combo_id is null)
    or (producto_id is null and combo_id is not null)
  )
);
