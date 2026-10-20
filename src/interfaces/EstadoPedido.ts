// src/interfaces/EstadoPedido.ts

// Estados por los que avanza un pedido. "Confirmado" es el estado inicial
// con el que lo crea el checkout.
export type EstadoPedido =
    | "Confirmado"
    | "En preparación"
    | "Despachado"
    | "Entregado";
