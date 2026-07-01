"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./client";

export function useSuperAdmin() {
  const router = useRouter();
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let activo = true;

    async function verificar() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/login?returnTo=/admin");
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (perfil?.rol !== "super_admin") {
        router.replace("/");
        return;
      }

      if (activo) setListo(true);
    }

    verificar();
    return () => {
      activo = false;
    };
  }, [router]);

  return listo;
}
