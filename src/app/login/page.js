"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { asegurarPerfilComprador, rutaSegunRol } from "@/lib/supabase/perfil";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const supabase = createClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (loginError) {
      setError("Correo o contraseña incorrectos.");
      setCargando(false);
      return;
    }

    const perfil = await asegurarPerfilComprador(supabase, data.user);
    router.push(perfil.rol === "comprador" ? returnTo : rutaSegunRol(perfil.rol));
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-xl font-bold text-slate-900">Iniciar sesión</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full rounded border border-slate-200 px-3 py-2"
        />
        <input
          required
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full rounded border border-slate-200 px-3 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-sky-600 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link href={`/registro?returnTo=${encodeURIComponent(returnTo)}`} className="text-sky-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
