"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthStatus() {
  const pathname = usePathname();
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let activo = true;

    async function cargar() {
      const { data: userData } = await supabase.auth.getUser();
      if (!activo) return;

      setUsuario(userData.user);

      if (userData.user) {
        const { data: perfil } = await supabase
          .from("perfiles")
          .select("nombre")
          .eq("id", userData.user.id)
          .maybeSingle();
        if (activo) setNombre(perfil?.nombre || userData.user.email);
      }

      if (activo) setCargando(false);
    }

    cargar();

    const { data: suscripcion } = supabase.auth.onAuthStateChange(() => cargar());
    return () => {
      activo = false;
      suscripcion.subscription.unsubscribe();
    };
  }, []);

  async function cerrarSesion() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (cargando) return <div className="h-8" />;

  if (!usuario) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link
          href={`/login?returnTo=${encodeURIComponent(pathname)}`}
          className="text-slate-600 hover:text-sky-600"
        >
          Iniciar sesión
        </Link>
        <Link
          href={`/registro?returnTo=${encodeURIComponent(pathname)}`}
          className="rounded-lg bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-700"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-600">{nombre}</span>
      <button type="button" onClick={cerrarSesion} className="text-slate-400 hover:text-red-600">
        Cerrar sesión
      </button>
    </div>
  );
}
