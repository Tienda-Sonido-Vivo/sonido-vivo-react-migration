// Archivo ya modificado/agregado para preparar la integración. No modificar

import { apiRequest } from "./api";

export interface Pago {
  id: number;
  codigoPedido: string;
  correoCliente: string;
  monto: number;
  metodoPago: string;
  fechaPago: string;
  estado: "PENDIENTE" | "COMPLETADO" | "FALLIDO";
}

export async function confirmarPagoPedido(codigoPedido: string): Promise<Pago> {
  return apiRequest<Pago>(
    `/pagos/${encodeURIComponent(codigoPedido)}/confirmar`,
    {
      method: "PATCH",
    },
  );
}

export async function obtenerPagos(): Promise<Pago[]> {
  return apiRequest<Pago[]>("/pagos");
}
