"use client";

import { useState } from "react";
import { tiendas } from "@/lib/mock-data";

const FORM_VACIO = { nombre: "", precio: "", pesoLb: "", emoji: "📦" };

export default function ProductosPage() {
  const [productos, setProductos] = useState(tiendas[0].productos);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nuevo = {
      id: `p${Date.now()}`,
      nombre: form.nombre,
      precio: Number(form.precio),
      pesoLb: Number(form.pesoLb),
      emoji: form.emoji || "📦",
    };
    setProductos((prev) => [...prev, nuevo]);
    setForm(FORM_VACIO);
    setMostrarForm(false);
  }

  function eliminar(id) {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Productos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Estos son los productos sueltos que verán tus clientes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {mostrarForm ? "Cancelar" : "Nuevo producto"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4"
        >
          <input
            required
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            className="rounded border border-slate-200 px-3 py-2 sm:col-span-2"
          />
          <input
            required
            type="number"
            step="0.01"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio $"
            className="rounded border border-slate-200 px-3 py-2"
          />
          <input
            type="number"
            step="0.01"
            name="pesoLb"
            value={form.pesoLb}
            onChange={handleChange}
            placeholder="Peso (lb)"
            className="rounded border border-slate-200 px-3 py-2"
          />
          <input
            name="emoji"
            value={form.emoji}
            onChange={handleChange}
            placeholder="Emoji (ej. 🍚)"
            className="rounded border border-slate-200 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:col-span-4"
          >
            Guardar producto
          </button>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Producto</th>
              <th className="px-4 py-2 font-medium">Peso</th>
              <th className="px-4 py-2 font-medium">Precio</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  {producto.emoji} {producto.nombre}
                </td>
                <td className="px-4 py-3 text-slate-500">{producto.pesoLb} lb</td>
                <td className="px-4 py-3">${producto.precio}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => eliminar(producto.id)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
