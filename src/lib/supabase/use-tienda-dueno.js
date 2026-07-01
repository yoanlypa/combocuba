"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./client";

export function useTiendaDueno() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [tienda, setTienda] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    let activo = true;

    async function cargar() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/login?returnTo=/panel");
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol, tienda_id")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (!perfil || perfil.rol !== "dueno_tienda" || !perfil.tienda_id) {
        router.replace("/");
        return;
      }

      const { data: tiendaData } = await supabase
        .from("tiendas")
        .select("id, nombre, slug, whatsapp")
        .eq("id", perfil.tienda_id)
        .maybeSingle();

      if (activo) {
        setTienda(tiendaData);
        setCargando(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [router]);

  return { cargando, tienda };
}
