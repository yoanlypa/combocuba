"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getTiendaBySlug } from "@/lib/mock-data";

const CAMPOS_INICIALES = {
  compradorNombre: "",
  compradorTelefono: "",
  destinatarioNombre: "",
  destinatarioTelefono: "",
  destinatarioDireccion: "",
  destinatarioProvincia: "",
  notas: "",
};

export default function PedidoPage() {
  const { tienda: slug } = useParams();
  const tienda = getTiendaBySlug(slug);
  const { items, total, cambiarCantidad, quitarItem, vaciarCarrito } = useCart();
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState(CAMPOS_INICIALES);

  if (!tienda) {
    return <p className="p-8 text-center text-slate-500">Tienda no encontrada.</p>;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    vaciarCarrito();
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
      <h1 className="mb-6 text-xl font-bold text-slate-900">
        Confirmar pedido — {tienda.nombre}
      </h1>

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
          <legend className="px-1 font-semibold text-slate-900">Tus datos</legend>
          <input
            required
            name="compradorNombre"
            value={form.compradorNombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
          <input
            required
            name="compradorTelefono"
            value={form.compradorTelefono}
            onChange={handleChange}
            placeholder="Tu WhatsApp"
            className="w-full rounded border border-slate-200 px-3 py-2"
          />
        </fieldset>

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

        <button
          type="submit"
          className="w-full rounded-lg bg-sky-600 py-3 font-medium text-white hover:bg-sky-700"
        >
          Enviar pedido
        </button>
      </form>
    </div>
  );
}
