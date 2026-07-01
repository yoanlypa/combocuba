"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function AgregarBoton({ item }) {
  const { agregarItem } = useCart();
  const [agregado, setAgregado] = useState(false);

  function handleClick() {
    agregarItem(item);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        agregado
          ? "bg-emerald-600 text-white"
          : "bg-sky-600 text-white hover:bg-sky-700"
      }`}
    >
      {agregado ? "Agregado ✓" : "Agregar"}
    </button>
  );
}
