"use client";

import { useSyncExternalStore } from "react";

const suscribirseVacio = () => () => {};

export function useEstaMontado() {
  return useSyncExternalStore(
    suscribirseVacio,
    () => true,
    () => false
  );
}
