"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";

const CAMPOS_INICIALES = {
  destinatarioNombre: "",
  destinatarioTelefono: "",
  destinatarioDireccion: "",
  destinatarioProvincia: "",
  notas: "",
};

export default function PedidoPage() {
  const { tienda: slug } = useParams();
  const router = useRouter();
  const { items, total, cambiarCantidad, quitarItem, vaciarCarrito } = useCart();

  const [cargando, setCargando] = useState(true);
  const [tienda, setTienda] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(CAMPOS_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function cargar() {
      const [{ data: tiendaData }, { data: userData }] = await Promise.all([
        supabase.from("tiendas").select("id, nombre, whatsapp").eq("slug", slug).maybeSingle(),
        supabase.auth.getUser(),
      ]);

      setTienda(tiendaData);
      setUsuario(userData.user ?? null);

      if (userData.user) {
        const { data: perfilData } = await supabase
          .from("perfiles")
          .select("nombre, telefono")
          .eq("id", userData.user.id)
          .maybeSingle();
        setPerfil(perfilData);
      }

      setCargando(false);
    }

    cargar();
  }, [slug]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const supabase = createClient();

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        tienda_id: tienda.id,
        comprador_id: usuario.id,
        destinatario_nombre: form.destinatarioNombre,
        destinatario_telefono: form.destinatarioTelefono,
        destinatario_direccion: form.destinatarioDireccion,
        destinatario_provincia: form.destinatarioProvincia,
        notas: form.notas,
        total,
      })
      .select()
      .single();

    if (pedidoError) {
      setError("No se pudo enviar el pedido. Intenta de nuevo.");
      setEnviando(false);
      return;
    }

    const itemsPayload = items.map((item) => ({
      pedido_id: pedido.id,
      producto_id: item.tipo === "producto" ? item.id : null,
      combo_id: item.tipo === "combo" ? item.id : null,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
    }));

    const { error: itemsError } = await supabase.from("pedido_items").insert(itemsPayload);

    if (itemsError) {
      setError("El pedido se creó pero hubo un problema guardando los productos.");
      setEnviando(false);
      return;
    }

    setEnviado(true);
    vaciarCarrito();
    setEnviando(false);
  }

  if (cargando) return null;

  if (!tienda) {
    return <p className="p-8 text-center text-slate-500">Tienda no encontrada.</p>;
  }

  if (!usuario) {
    const returnTo = `/${slug}/pedido`;
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Inicia sesión para continuar</h1>
        <p className="mt-2 text-slate-500">
          Necesitas una cuenta para enviar tu pedido a {tienda.nombre}. Tu carrito no se pierde.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
            className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
          >
            Iniciar sesión
          </Link>
          <Link
            href={`/registro?returnTo=${encodeURIComponent(returnTo)}`}
            className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h1 className="text-2xl font-bold text-slate-900">¡Pedido enviado!</h1>
        <p className="mt-2 text-slate-600">
          {tienda.nombre} recibió los detalles de tu pedido y te contactará por
          WhatsApp para confirmar el pago y coordinar la entrega.
        </p>
        <Link href={`/${slug}`} className="mt-6 inline-block text-sky-600 hover:underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Tu pedido está vacío</h1>
        <p className="mt-2 text-slate-500">
          Agrega combos o productos desde la tienda antes de continuar.
        </p>
        <Link href={`/${slug}`} className="mt-6 inline-block text-sky-600 hover:underline">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-xl font-bold text-slate-900">
        Confirmar pedido — {tienda.nombre}
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        A nombre de {perfil?.nombre || usuario.email} · {perfil?.telefono}
      </p>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        {items.map((item) => (
          <div
            key={`${item.tipo}-${item.id}`}
            className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
          >
            <div>
              <p className="font-medium text-slate-900">{item.nombre}</p>
              <p className="text-sm text-slate-500">${item.precio} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.cantidad}
                onChange={(e) =>
                  cambiarCantidad(item.id, item.tipo, Number(e.target.value))
                }
                className="w-14 rounded border border-slate-200 px-2 py-1 text-center"
              />
              <button
                type="button"
                onClick={() => quitarItem(item.id, item.tipo)}
                className="text-sm text-red-500 hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-semibold text-slate-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <legend className="px-1 font-semibold text-slate-900">Destinatario en Cuba</legend>
          <input
            required
            name="destinatarioNombre"
            value={form.destinatarioNombre}
            onChange={handleChange}
            placeholder="Nombre de quien recibe"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <input
            name="destinatarioTelefono"
            value={form.destinatarioTelefono}
            onChange={handleChange}
            placeholder="Teléfono en Cuba"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <input
            required
            name="destinatarioProvincia"
            value={form.destinatarioProvincia}
            onChange={handleChange}
            placeholder="Provincia"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <input
            required
            name="destinatarioDireccion"
            value={form.destinatarioDireccion}
            onChange={handleChange}
            placeholder="Dirección de entrega"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            placeholder="Notas adicionales (opcional)"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-sky-600 py-3 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {enviando ? "Enviando..." : "Enviar pedido"}
        </button>
      </form>
    </div>
  );
}
