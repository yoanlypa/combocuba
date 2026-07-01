export async function getTiendaPublica(supabase, slug) {
  const { data: tienda } = await supabase
    .from("tiendas")
    .select("id, nombre, slug, descripcion, whatsapp")
    .eq("slug", slug)
    .eq("activa", true)
    .maybeSingle();

  if (!tienda) return null;

  const [{ data: productos }, { data: combos }] = await Promise.all([
    supabase
      .from("productos")
      .select("id, nombre, precio, peso_lb, emoji")
      .eq("tienda_id", tienda.id)
      .eq("disponible", true)
      .order("nombre"),
    supabase
      .from("combos")
      .select("id, nombre, descripcion, precio, combo_productos(cantidad, productos(id, nombre, emoji))")
      .eq("tienda_id", tienda.id)
      .eq("disponible", true)
      .order("nombre"),
  ]);

  return {
    ...tienda,
    productos: productos ?? [],
    combos: (combos ?? []).map((combo) => ({
      id: combo.id,
      nombre: combo.nombre,
      descripcion: combo.descripcion,
      precio: combo.precio,
      productos: combo.combo_productos.map((cp) => cp.productos).filter(Boolean),
    })),
  };
}
