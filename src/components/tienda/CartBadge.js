"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useEstaMontado } from "@/lib/use-esta-montado";

export default function CartBadge({ tiendaSlug }) {
  const { items, total } = useCart();
  const montado = useEstaMontado();

  const cantidad = items.reduce((suma, i) => suma + i.cantidad, 0);

  return (
    <Link
      href={`/${tiendaSlug}/pedido`}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      <span>🛒 Mi pedido</span>
      {montado && cantidad > 0 && (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-xs text-white">
          {cantidad}
        </span>
      )}
      {montado && total > 0 && <span className="text-slate-500">${total.toFixed(2)}</span>}
    </Link>
  );
}
