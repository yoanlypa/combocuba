"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/panel", label: "Resumen" },
  { href: "/panel/pedidos", label: "Pedidos" },
  { href: "/panel/productos", label: "Productos" },
  { href: "/panel/combos", label: "Combos" },
  { href: "/panel/ajustes", label: "Ajustes" },
];

export default function PanelNav() {
  const [sufijo, setSufijo] = useState("");

  useEffect(() => {
    const tienda = new URLSearchParams(window.location.search).get("tienda");
    setSufijo(tienda ? `?tienda=${encodeURIComponent(tienda)}` : "");
  }, []);

  return (
    <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:overflow-visible lg:px-2">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={`${item.href}${sufijo}`}
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
