"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTiendaDueno } from "@/lib/supabase/use-tienda-dueno";

const FORM_VACIO = { nombre: "", precio: "", peso_lb: "" };

export default function ProductosPage() {
  const { cargando, tienda } = useTiendaDueno();
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [imagen, setImagen] = useState(null);
  const [imagenActualUrl, setImagenActualUrl] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarProductos = useCallback(async () => {
    setCargandoProductos(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("tienda_id", tienda.id)
      .order("nombre");
    setProductos(data ?? []);
    setCargandoProductos(false);
  }, [tienda]);

  useEffect(() => {
    if (tienda) cargarProductos();
  }, [tienda, cargarProductos]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function cerrarFormulario() {
    setMostrarForm(false);
    setEditandoId(null);
    setForm(FORM_VACIO);
    setImagen(null);
    setImagenActualUrl(null);
    setError("");
  }

  function abrirNuevo() {
    if (mostrarForm && !editandoId) {
      cerrarFormulario();
      return;
    }
    setEditandoId(null);
    setForm(FORM_VACIO);
    setImagen(null);
    setImagenActualUrl(null);
    setError("");
    setMostrarForm(true);
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      precio: String(producto.precio),
      peso_lb: String(producto.peso_lb ?? ""),
    });
    setImagen(null);
    setImagenActualUrl(producto.imagen_url);
    setError("");
    setMostrarForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubiendo(true);

    const supabase = createClient();
    let imagen_url = imagenActualUrl;

    if (imagen) {
      const ruta = `${tienda.id}/${crypto.randomUUID()}-${imagen.name}`;
      const { error: subidaError } = await supabase.storage
        .from("productos")
        .upload(ruta, imagen);

      if (subidaError) {
        setError("No se pudo subir la imagen. Intenta de nuevo.");
        setSubiendo(false);
        return;
      }

      imagen_url = supabase.storage.from("productos").getPublicUrl(ruta).data.publicUrl;
    }

    const datos = {
      nombre: form.nombre,
      precio: Number(form.precio),
      peso_lb: Number(form.peso_lb),
      imagen_url,
    };

    if (editandoId) {
      await supabase.from("productos").update(datos).eq("id", editandoId);
    } else {
      await supabase.from("productos").insert({ tienda_id: tienda.id, ...datos });
    }

    cerrarFormulario();
    setSubiendo(false);
    cargarProductos();
  }

  async function eliminar(id) {
    const supabase = createClient();
    setProductos((prev) => prev.filter((p) => p.id !== id));
    await supabase.from("productos").delete().eq("id", id);
  }

  if (cargando || !tienda) return null;

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
          onClick={abrirNuevo}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {mostrarForm && !editandoId ? "Cancelar" : "Nuevo producto"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4"
        >
          <p className="text-sm font-medium text-slate-700 sm:col-span-4">
            {editandoId ? "Editar producto" : "Nuevo producto"}
          </p>
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
            name="peso_lb"
            value={form.peso_lb}
            onChange={handleChange}
            placeholder="Peso (lb)"
            className="rounded border border-slate-200 px-3 py-2"
          />

          <div className="flex items-center gap-3 sm:col-span-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600"
            />
            {imagen ? (
              <img
                src={URL.createObjectURL(imagen)}
                alt="Vista previa"
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              imagenActualUrl && (
                <img
                  src={imagenActualUrl}
                  alt="Imagen actual"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )
            )}
          </div>

          {error && <p className="text-sm text-red-600 sm:col-span-4">{error}</p>}

          <div className="flex gap-2 sm:col-span-4">
            <button
              type="submit"
              disabled={subiendo}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {subiendo ? "Guardando..." : "Guardar producto"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={cerrarFormulario}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
            )}
          </div>
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
                <td className="flex items-center gap-2 px-4 py-3">
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <span className="text-lg">📦</span>
                  )}
                  {producto.nombre}
                </td>
                <td className="px-4 py-3 text-slate-500">{producto.peso_lb} lb</td>
                <td className="px-4 py-3">${Number(producto.precio).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => editar(producto)}
                    className="text-sky-600 hover:underline"
                  >
                    Editar
                  </button>
                  <span className="mx-2 text-slate-300">·</span>
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
        {cargandoProductos && <p className="p-4 text-sm text-slate-500">Cargando...</p>}
        {!cargandoProductos && productos.length === 0 && (
          <p className="p-4 text-sm text-slate-500">Todavía no tienes productos.</p>
        )}
      </div>
    </div>
  );
}
