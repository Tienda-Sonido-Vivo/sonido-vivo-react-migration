
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

export async function procesarPagoPedido(codigoPedido: string): Promise<Pago> {
  const pago = await apiRequest<Pago>(
    `/pagos/${encodeURIComponent(codigoPedido)}/procesar`,
    {
      method: "POST",
    },
  );

  if (pago.estado !== "COMPLETADO") {
    throw new Error("El pago no pudo completarse. Tu pedido queda pendiente y tu carrito se conserva para que puedas intentarlo nuevamente.");
  }

  return pago;
}

export async function obtenerPagos(): Promise<Pago[]> {
  return apiRequest<Pago[]>("/pagos");
}
