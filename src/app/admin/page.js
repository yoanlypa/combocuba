"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useSuperAdmin } from "@/lib/supabase/use-super-admin";

function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generarCodigo() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const FORM_VACIO = { nombre: "", whatsapp: "", email_contacto: "" };

export default function AdminPage() {
  const listo = useSuperAdmin();
  const [tiendas, setTiendas] = useState([]);
  const [cargandoTiendas, setCargandoTiendas] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [invitacion, setInvitacion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (listo) cargarTiendas();
  }, [listo]);

  async function cargarTiendas() {
    setCargandoTiendas(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("tiendas")
      .select("id, nombre, slug, creada_en")
      .order("creada_en", { ascending: false });
    setTiendas(data ?? []);
    setCargandoTiendas(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const supabase = createClient();

    const { data: tienda, error: tiendaError } = await supabase
      .from("tiendas")
      .insert({
        nombre: form.nombre,
        slug: generarSlug(form.nombre),
        whatsapp: form.whatsapp,
        email_contacto: form.email_contacto || null,
      })
      .select()
      .single();

    if (tiendaError) {
      if (tiendaError.code === "23505") {
        const campo = tiendaError.message.includes("whatsapp")
          ? "ese WhatsApp"
          : tiendaError.message.includes("email_contacto")
            ? "ese correo"
            : "ese nombre";
        setError(`Ya existe una tienda con ${campo}.`);
      } else {
        setError("No se pudo crear la tienda. Intenta de nuevo.");
      }
      return;
    }

    const codigo = generarCodigo();
    const { error: invitacionError } = await supabase
      .from("invitaciones")
      .insert({ tienda_id: tienda.id, codigo });

    if (invitacionError) {
      setError("La tienda se creó, pero no se pudo generar el código de invitación.");
      cargarTiendas();
      return;
    }

    setInvitacion({ tienda, codigo });
    setForm(FORM_VACIO);
    setMostrarForm(false);
    cargarTiendas();
  }

  if (!listo) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tiendas</h2>
          <p className="mt-1 text-sm text-slate-500">
            Empresas de envíos que usan la plataforma.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {mostrarForm ? "Cancelar" : "Nueva tienda"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3"
        >
          <input
            required
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del negocio"
            className="rounded border border-slate-200 px-3 py-2"
          />
          <input
            required
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp (con código de país)"
            className="rounded border border-slate-200 px-3 py-2"
          />
          <input
            type="email"
            name="email_contacto"
            value={form.email_contacto}
            onChange={handleChange}
            placeholder="Correo para avisos (opcional)"
            className="rounded border border-slate-200 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:col-span-3"
          >
            Crear tienda
          </button>
          {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
        </form>
      )}

      {invitacion && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-medium">
            Tienda &quot;{invitacion.tienda.nombre}&quot; creada. Comparte este enlace con el dueño para que active su cuenta:
          </p>
          <p className="mt-2 break-all font-mono text-emerald-900">
            {window.location.origin}/activar-tienda?codigo={invitacion.codigo}
          </p>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium">Nombre</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">Enlace de tienda</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {tiendas.map((tienda) => (
                <tr key={tienda.id} className="border-t border-slate-100">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {tienda.nombre}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sky-600">/{tienda.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-x-2 gap-y-1">
                      <Link href={`/${tienda.slug}`} className="text-sky-600 hover:underline">
                        Ver tienda
                      </Link>
                      <Link
                        href={`/panel?tienda=${tienda.slug}`}
                        className="text-sky-600 hover:underline"
                      >
                        Gestionar panel
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cargandoTiendas && <p className="p-4 text-sm text-slate-500">Cargando...</p>}
        {!cargandoTiendas && tiendas.length === 0 && (
          <p className="p-4 text-sm text-slate-500">Todavía no hay tiendas.</p>
        )}
      </div>
    </div>
  );
}
