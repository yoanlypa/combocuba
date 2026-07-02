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

    const { data: suscripcion } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (!activo) return;

      setUsuario(session?.user ?? null);
      setCargando(false);

      if (session?.user) {
        supabase
          .from("perfiles")
          .select("nombre")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data: perfil }) => {
            if (activo) setNombre(perfil?.nombre || session.user.email);
          });
      } else {
        setNombre("");
      }
    });

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
    <div className="flex min-w-0 items-center gap-3 text-sm">
      <span className="max-w-[40vw] truncate text-slate-600 sm:max-w-none">{nombre}</span>
      <button
        type="button"
        onClick={cerrarSesion}
        className="shrink-0 text-slate-400 hover:text-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
