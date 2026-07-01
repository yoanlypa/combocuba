import { pedidosDemo } from "@/lib/mock-data";
import EstadoBadge from "@/components/panel/EstadoBadge";

export default function ResumenPage() {
  const nuevos = pedidosDemo.filter((p) => p.estado === "nuevo").length;
  const totalMes = pedidosDemo.reduce((suma, p) => suma + p.total, 0);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Resumen</h1>
      <p className="mt-1 text-sm text-slate-500">
        Así va tu tienda esta semana.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Pedidos nuevos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{nuevos}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Pedidos totales</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{pedidosDemo.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Monto acumulado</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">${totalMes}</p>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold text-slate-900">
        Últimos pedidos
      </h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Comprador</th>
              <th className="px-4 py-2 font-medium">Destinatario</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosDemo.map((pedido) => (
              <tr key={pedido.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{pedido.compradorNombre}</td>
                <td className="px-4 py-3 text-slate-500">
                  {pedido.destinatarioNombre} · {pedido.destinatarioProvincia}
                </td>
                <td className="px-4 py-3">${pedido.total}</td>
                <td className="px-4 py-3">
                  <EstadoBadge estado={pedido.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
