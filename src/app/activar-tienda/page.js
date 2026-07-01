"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ActivarTiendaPage() {
  return (
    <Suspense>
      <ActivarTiendaForm />
    </Suspense>
  );
}

function ActivarTiendaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    codigo: searchParams.get("codigo") || "",
    nombre: "",
    telefono: "",
    email: "",
    password: "",
  });
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

    if (!data.session) {
      setError("Confirma tu correo y luego vuelve a esta página con el mismo código para activar tu panel.");
      setCargando(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc("activar_dueno", {
      codigo_invitacion: form.codigo.trim(),
      p_nombre: form.nombre,
      p_telefono: form.telefono,
    });

    if (rpcError) {
      setError("El código de invitación no es válido o ya se usó.");
      setCargando(false);
      return;
    }

    router.push("/panel");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-xl font-bold text-slate-900">Activar mi tienda</h1>
      <p className="mt-1 text-sm text-slate-500">
        Usa el código que te compartió ComboCuba para crear tu acceso al panel.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          required
          name="codigo"
          value={form.codigo}
          onChange={handleChange}
          placeholder="Código de invitación"
          className="w-full rounded border border-slate-200 px-3 py-2 uppercase"
        />
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

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-sky-600 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {cargando ? "Activando..." : "Activar mi panel"}
        </button>
      </form>
    </div>
  );
}
