"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTiendaDueno } from "@/lib/supabase/use-tienda-dueno";

const FORM_VACIO = { nombre: "", whatsapp: "", email_contacto: "", telegram_chat_id: "" };

export default function AjustesPage() {
  const { cargando, tienda } = useTiendaDueno();
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!tienda) return;
    setForm({
      nombre: tienda.nombre ?? "",
      whatsapp: tienda.whatsapp ?? "",
      email_contacto: tienda.email_contacto ?? "",
      telegram_chat_id: tienda.telegram_chat_id ?? "",
    });
  }, [tienda]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setMensaje("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const supabase = createClient();
    const { error } = await supabase.from("tiendas").update(form).eq("id", tienda.id);

    setMensaje(error ? "No se pudo guardar. Intenta de nuevo." : "Guardado.");
    setGuardando(false);
  }

  if (cargando || !tienda) return null;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Ajustes</h1>
      <p className="mt-1 text-sm text-slate-500">
        Aquí llegan los avisos cuando un cliente hace un pedido nuevo.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nombre de la tienda
          </label>
          <input
            required
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label>
          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="Con código de país, ej. 5215555555555"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Correo para avisos de pedidos
          </label>
          <input
            type="email"
            name="email_contacto"
            value={form.email_contacto}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Telegram Chat ID (opcional)
          </label>
          <input
            name="telegram_chat_id"
            value={form.telegram_chat_id}
            onChange={handleChange}
            placeholder="Ej. 123456789"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <p className="mt-1 text-xs text-slate-400">
            Escríbele a @userinfobot en Telegram para saber tu Chat ID numérico.
          </p>
        </div>

        {mensaje && (
          <p className={`text-sm ${mensaje === "Guardado." ? "text-emerald-600" : "text-red-600"}`}>
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          disabled={guardando}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
