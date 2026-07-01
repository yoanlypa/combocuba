"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTiendaDueno } from "@/lib/supabase/use-tienda-dueno";
import EstadoBadge from "@/components/panel/EstadoBadge";

const ESTADOS = ["nuevo", "contactado", "cerrado", "cancelado"];

function whatsappHref(telefono, texto) {
  const soloNumeros = (telefono || "").replace(/[^\d]/g, "");
  return `https://wa.me/${soloNumeros}?text=${encodeURIComponent(texto)}`;
}

export default function PedidosPage() {
  const { cargando, tienda } = useTiendaDueno();
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  const cargarPedidos = useCallback(async () => {
    setCargandoPedidos(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("pedidos")
      .select("*, perfiles(nombre, telefono)")
      .eq("tienda_id", tienda.id)
      .order("creado_en", { ascending: false });
    setPedidos(data ?? []);
    setCargandoPedidos(false);
  }, [tienda]);

  useEffect(() => {
    if (tienda) cargarPedidos();
  }, [tienda, cargarPedidos]);

  async function cambiarEstado(id, estado) {
    const supabase = createClient();
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
    await supabase.from("pedidos").update({ estado }).eq("id", id);
  }

  if (cargando || !tienda) return null;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Pedidos</h1>
      <p className="mt-1 text-sm text-slate-500">
        Contacta al comprador por WhatsApp para cerrar el pago y coordinar la entrega.
      </p>

      {cargandoPedidos ? (
        <p className="mt-6 text-sm text-slate-500">Cargando...</p>
      ) : pedidos.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">Todavía no tienes pedidos.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {pedido.perfiles?.nombre || "Comprador"}
                  </p>
                  <p className="text-sm text-slate-500">{pedido.perfiles?.telefono}</p>
                </div>
                <EstadoBadge estado={pedido.estado} />
              </div>

              <dl className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <dt className="text-slate-400">Destinatario en Cuba</dt>
                  <dd>
                    {pedido.destinatario_nombre} · {pedido.destinatario_provincia}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Dirección</dt>
                  <dd>{pedido.destinatario_direccion}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Total</dt>
                  <dd>${Number(pedido.total).toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Recibido</dt>
                  <dd>{new Date(pedido.creado_en).toLocaleString("es")}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappHref(
                    pedido.perfiles?.telefono,
                    `Hola ${pedido.perfiles?.nombre || ""}, te contacto por tu pedido para confirmar el pago.`
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
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
