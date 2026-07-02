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
      const { data: sessionData } = await supabase.auth.getSession();
      const usuario = sessionData.session?.user;

      if (!usuario) {
        router.replace("/login?returnTo=/panel");
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol, tienda_id")
        .eq("id", usuario.id)
        .maybeSingle();

      if (!perfil) {
        router.replace("/");
        return;
      }

      let consulta = supabase
        .from("tiendas")
        .select("id, nombre, slug, whatsapp, email_contacto, telegram_chat_id");

      if (perfil.rol === "super_admin") {
        const tiendaSlug = new URLSearchParams(window.location.search).get("tienda");
        if (!tiendaSlug) {
          router.replace("/admin");
          return;
        }
        consulta = consulta.eq("slug", tiendaSlug);
      } else if (perfil.rol === "dueno_tienda" && perfil.tienda_id) {
        consulta = consulta.eq("id", perfil.tienda_id);
      } else {
        router.replace("/");
        return;
      }

      const { data: tiendaData } = await consulta.maybeSingle();

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
