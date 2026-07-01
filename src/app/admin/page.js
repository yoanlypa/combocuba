"use client";

import { useState } from "react";
import Link from "next/link";
import { tiendas as tiendasIniciales } from "@/lib/mock-data";

function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FORM_VACIO = { nombre: "", email: "", whatsapp: "" };

export default function AdminPage() {
  const [tiendas, setTiendas] = useState(tiendasIniciales);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nueva = {
      slug: generarSlug(form.nombre),
      nombre: form.nombre,
      descripcion: "",
      whatsapp: form.whatsapp,
      emailContacto: form.email,
      productos: [],
      combos: [],
    };
    setTiendas((prev) => [...prev, nueva]);
    setForm(FORM_VACIO);
    setMostrarForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
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
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email del dueño"
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
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:col-span-3"
          >
            Crear tienda
          </button>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Enlace de tienda</th>
              <th className="px-4 py-2 font-medium">Productos</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {tiendas.map((tienda) => (
              <tr key={tienda.slug} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{tienda.nombre}</td>
                <td className="px-4 py-3 text-sky-600">/{tienda.slug}</td>
                <td className="px-4 py-3 text-slate-500">{tienda.productos.length}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/${tienda.slug}`} className="text-sky-600 hover:underline">
                    Ver tienda
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
