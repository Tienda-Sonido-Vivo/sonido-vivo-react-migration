// src/utilidades/estadosPedido.ts

import type { EstadoPedido } from "../interfaces/EstadoPedido";


// Orden en que avanza un pedido
export const ESTADOS_PEDIDO: EstadoPedido[] = [
    "Confirmado",
    "En preparación",
    "Despachado",
    "Entregado"
];


const CLASES_ESTADO: Record<EstadoPedido, string> = {
    "Confirmado": "text-bg-primary",
    "En preparación": "text-bg-warning",
    "Despachado": "text-bg-info",
    "Entregado": "text-bg-success"
};


export function esEstadoPedido(valor: string): valor is EstadoPedido {

    return ESTADOS_PEDIDO.some((estado) => estado === valor);

}


// Pedido.estado es un string, así que se valida antes de usarlo
export function claseEstado(estado: string): string {

    return esEstadoPedido(estado)
        ? CLASES_ESTADO[estado]
        : "text-bg-secondary";

}


// Un pedido solo puede quedarse como está o avanzar
export function estadosPermitidos(estadoActual: string): EstadoPedido[] {

    const indice = ESTADOS_PEDIDO.findIndex((estado) => estado === estadoActual);

    return ESTADOS_PEDIDO.slice(Math.max(indice, 0));

}
