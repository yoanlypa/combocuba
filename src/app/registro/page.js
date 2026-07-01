"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { asegurarPerfilComprador } from "@/lib/supabase/perfil";

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  );
}

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nombre: form.nombre, telefono: form.telefono } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setCargando(false);
      return;
    }

    if (data.session) {
      await asegurarPerfilComprador(supabase, data.user);
      router.push(returnTo);
      return;
    }

    setMensaje("Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
    setCargando(false);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-xl font-bold text-slate-900">Crear cuenta</h1>
      <p className="mt-1 text-sm text-slate-500">
        Para poder enviar pedidos y ver tu historial.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          required
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          className="w-full rounded border border-slate-200 px-3 py-2"
        />
        <input
          required
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Tu WhatsApp"
          className="w-full rounded border border-slate-200 px-3 py-2"
        />
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
          minLength={6}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full rounded border border-slate-200 px-3 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {mensaje && <p className="text-sm text-emerald-600">{mensaje}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-sky-600 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="text-sky-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
