// src/servicios/pedidosServicio.ts

import type { Pedido } from "../interfaces/Pedido";
import { pedidosIniciales } from "../datos/pedidos";

const CLAVE_STORAGE = "pedidos";

export function obtenerPedidos(): Pedido[] {
  const guardado = localStorage.getItem(CLAVE_STORAGE);

  if (guardado !== null) {
    try {
      return JSON.parse(guardado) as Pedido[];
    } catch {
      // Dato corrupto: se parte de los datos iniciales
    }
  }

  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidosIniciales));

  return [...pedidosIniciales];
}

export function guardarPedidos(pedidos: Pedido[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
}
