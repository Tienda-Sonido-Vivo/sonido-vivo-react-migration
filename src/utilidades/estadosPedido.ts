import type { EstadoPedido } from "../interfaces/EstadoPedido";

export const ESTADOS_PEDIDO: EstadoPedido[] = [
  "Confirmado",
  "En preparación",
  "Despachado",
  "Entregado",
];

const CLASES_ESTADO: Record<EstadoPedido, string> = {
  Confirmado: "text-bg-primary",
  "En preparación": "text-bg-warning",
  Despachado: "text-bg-info",
  Entregado: "text-bg-success",
};

export function esEstadoPedido(valor: string): valor is EstadoPedido {
  return ESTADOS_PEDIDO.some((estado) => estado === valor);
}

export function claseEstado(estado: string): string {
  return esEstadoPedido(estado) ? CLASES_ESTADO[estado] : "text-bg-secondary";
}

export function estadosPermitidos(estadoActual: string): EstadoPedido[] {
  const indice = ESTADOS_PEDIDO.findIndex((estado) => estado === estadoActual);

  return ESTADOS_PEDIDO.slice(Math.max(indice, 0));
}
