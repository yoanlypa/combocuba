export async function asegurarPerfilComprador(supabase, user) {
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, nombre, telefono, tienda_id")
    .eq("id", user.id)
    .maybeSingle();

  if (perfil) return perfil;

  const nombre = user.user_metadata?.nombre ?? "";
  const telefono = user.user_metadata?.telefono ?? "";

  const { data: nuevoPerfil } = await supabase
    .from("perfiles")
    .insert({ id: user.id, rol: "comprador", nombre, telefono })
    .select("rol, nombre, telefono, tienda_id")
    .single();

  return nuevoPerfil ?? { rol: "comprador", nombre, telefono, tienda_id: null };
}

export function rutaSegunRol(rol) {
  if (rol === "super_admin") return "/admin";
  if (rol === "dueno_tienda") return "/panel";
  return "/";
}
