"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

function leerCarritoGuardado(storageKey) {
  if (typeof window === "undefined") return [];
  const guardado = window.localStorage.getItem(storageKey);
  return guardado ? JSON.parse(guardado) : [];
}

export function CartProvider({ tiendaSlug, children }) {
  const storageKey = `carrito_${tiendaSlug}`;
  const [items, setItems] = useState(() => leerCarritoGuardado(storageKey));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  function agregarItem(item) {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === item.id && i.tipo === item.tipo);
      if (existente) {
        return prev.map((i) =>
          i.id === item.id && i.tipo === item.tipo
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  }

  function quitarItem(id, tipo) {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.tipo === tipo)));
  }

  function cambiarCantidad(id, tipo, cantidad) {
    if (cantidad <= 0) return quitarItem(id, tipo);
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.tipo === tipo ? { ...i, cantidad } : i))
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, agregarItem, quitarItem, cambiarCantidad, vaciarCarrito, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
  return ctx;
}
