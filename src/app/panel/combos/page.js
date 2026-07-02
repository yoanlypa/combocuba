"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTiendaDueno } from "@/lib/supabase/use-tienda-dueno";

const FORM_VACIO = { nombre: "", descripcion: "", precio: "", productosIds: [] };

export default function CombosPage() {
  const { cargando, tienda } = useTiendaDueno();
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarDatos = useCallback(async () => {
    setCargandoDatos(true);
    const supabase = createClient();
    const [{ data: productosData }, { data: combosData }] = await Promise.all([
      supabase
        .from("productos")
        .select("id, nombre, emoji, imagen_url")
        .eq("tienda_id", tienda.id)
        .order("nombre"),
      supabase
        .from("combos")
        .select(
          "id, nombre, descripcion, precio, combo_productos(cantidad, productos(id, nombre, emoji, imagen_url))"
        )
        .eq("tienda_id", tienda.id)
        .order("nombre"),
    ]);
    setProductos(productosData ?? []);
    setCombos(combosData ?? []);
    setCargandoDatos(false);
  }, [tienda]);

  useEffect(() => {
    if (tienda) cargarDatos();
  }, [tienda, cargarDatos]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleProducto(id) {
    setForm((f) => ({
      ...f,
      productosIds: f.productosIds.includes(id)
        ? f.productosIds.filter((p) => p !== id)
        : [...f.productosIds, id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const supabase = createClient();

    const { data: combo, error } = await supabase
      .from("combos")
      .insert({
        tienda_id: tienda.id,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
      })
      .select()
      .single();

    if (error) return;

    if (form.productosIds.length > 0) {
      await supabase.from("combo_productos").insert(
        form.productosIds.map((producto_id) => ({
          combo_id: combo.id,
          producto_id,
          cantidad: 1,
        }))
      );
    }

    setForm(FORM_VACIO);
    setMostrarForm(false);
    cargarDatos();
  }

  async function eliminar(id) {
    const supabase = createClient();
    setCombos((prev) => prev.filter((c) => c.id !== id));
    await supabase.from("combos").delete().eq("id", id);
  }

  if (cargando || !tienda) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Combos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Paquetes fijos armados a partir de tus productos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {mostrarForm ? "Cancelar" : "Nuevo combo"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <input
            required
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del combo"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción corta"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <input
            required
            type="number"
            step="0.01"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio del combo $"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Productos incluidos</p>
            {productos.length === 0 ? (
              <p className="text-sm text-slate-500">
                Primero agrega productos en la sección &quot;Productos&quot;.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {productos.map((producto) => (
                  <label
                    key={producto.id}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                      form.productosIds.includes(producto.id)
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={form.productosIds.includes(producto.id)}
                      onChange={() => toggleProducto(producto.id)}
                    />
                    {producto.imagen_url ? (
                      <img
                        src={producto.imagen_url}
                        alt=""
                        className="mr-1 inline h-4 w-4 rounded object-cover align-[-2px]"
                      />
                    ) : (
                      <span>{producto.emoji} </span>
                    )}
                    {producto.nombre}
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Guardar combo
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {combos.map((combo) => (
          <div key={combo.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-900">{combo.nombre}</h3>
            <p className="mt-1 text-sm text-slate-500">{combo.descripcion}</p>
            <ul className="mt-2 text-sm text-slate-600">
              {combo.combo_productos.map((cp) => (
                <li key={cp.productos.id} className="flex items-center gap-1.5">
                  {cp.productos.imagen_url ? (
                    <img
                      src={cp.productos.imagen_url}
                      alt=""
                      className="h-4 w-4 rounded object-cover"
                    />
                  ) : (
                    <span>{cp.productos.emoji}</span>
                  )}
                  {cp.productos.nombre}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-slate-900">${Number(combo.precio).toFixed(2)}</span>
              <button
                type="button"
                onClick={() => eliminar(combo.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      {cargandoDatos && <p className="mt-4 text-sm text-slate-500">Cargando...</p>}
      {!cargandoDatos && combos.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">Todavía no tienes combos.</p>
      )}
    </div>
  );
}
