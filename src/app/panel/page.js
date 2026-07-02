"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTiendaDueno } from "@/lib/supabase/use-tienda-dueno";
import EstadoBadge from "@/components/panel/EstadoBadge";

export default function ResumenPage() {
  const { cargando, tienda } = useTiendaDueno();
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  useEffect(() => {
    if (!tienda) return;
    const supabase = createClient();
    supabase
      .from("pedidos")
      .select("id, destinatario_nombre, destinatario_provincia, total, estado")
      .eq("tienda_id", tienda.id)
      .order("creado_en", { ascending: false })
      .then(({ data }) => {
        setPedidos(data ?? []);
        setCargandoPedidos(false);
      });
  }, [tienda]);

  if (cargando || !tienda) return null;

  const nuevos = pedidos.filter((p) => p.estado === "nuevo").length;
  const totalAcumulado = pedidos.reduce((suma, p) => suma + Number(p.total), 0);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Resumen</h1>
      <p className="mt-1 text-sm text-slate-500">{tienda.nombre}</p>

      {!tienda.email_contacto && !tienda.telegram_chat_id && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Todavía no configuras dónde recibir avisos de pedidos nuevos.{" "}
          <Link
            href={`/panel/ajustes${window.location.search}`}
            className="font-medium underline"
          >
            Configúralo en Ajustes
          </Link>
          .
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Pedidos nuevos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{nuevos}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Pedidos totales</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{pedidos.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Monto acumulado</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">${totalAcumulado.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold text-slate-900">Últimos pedidos</h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {cargandoPedidos ? (
          <p className="p-4 text-sm text-slate-500">Cargando...</p>
        ) : pedidos.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">Todavía no tienes pedidos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium">Destinatario</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium">Total</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-t border-slate-100">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {pedido.destinatario_nombre} · {pedido.destinatario_provincia}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      ${Number(pedido.total).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <EstadoBadge estado={pedido.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
