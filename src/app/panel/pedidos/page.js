"use client";

import { useState } from "react";
import { pedidosDemo } from "@/lib/mock-data";
import EstadoBadge from "@/components/panel/EstadoBadge";

const ESTADOS = ["nuevo", "contactado", "cerrado", "cancelado"];

function whatsappHref(telefono, texto) {
  const soloNumeros = telefono.replace(/[^\d]/g, "");
  return `https://wa.me/${soloNumeros}?text=${encodeURIComponent(texto)}`;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState(pedidosDemo);

  function cambiarEstado(id, estado) {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Pedidos</h1>
      <p className="mt-1 text-sm text-slate-500">
        Contacta al comprador por WhatsApp para cerrar el pago y coordinar la entrega.
      </p>

      <div className="mt-6 space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{pedido.compradorNombre}</p>
                <p className="text-sm text-slate-500">{pedido.compradorTelefono}</p>
              </div>
              <EstadoBadge estado={pedido.estado} />
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="text-slate-400">Destinatario en Cuba</dt>
                <dd>{pedido.destinatarioNombre} · {pedido.destinatarioProvincia}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Pedido</dt>
                <dd>{pedido.items}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Total</dt>
                <dd>${pedido.total}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Recibido</dt>
                <dd>{pedido.creado}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={whatsappHref(
                  pedido.compradorTelefono,
                  `Hola ${pedido.compradorNombre}, te contacto de la tienda por tu pedido (${pedido.items}) para confirmar el pago.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Contactar por WhatsApp
              </a>

              <select
                value={pedido.estado}
                onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              >
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado} className="capitalize">
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
