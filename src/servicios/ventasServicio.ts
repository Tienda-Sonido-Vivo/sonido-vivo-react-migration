// Archivo ya modificado/agregado para preparar la integración. No modificar

import { apiRequest } from "./api";

export interface ResumenVentas {
  desde: string;
  hasta: string;
  cantidadPedidos: number;
  unidadesVendidas: number;
  totalVentas: number;
}

export async function obtenerResumenDiario(fecha: string): Promise<ResumenVentas> {
  return apiRequest<ResumenVentas>(`/ventas/resumen/diario?fecha=${fecha}`);
}

export async function obtenerResumenMensual(anio: number, mes: number): Promise<ResumenVentas> {
  return apiRequest<ResumenVentas>(
    `/ventas/resumen/mensual?anio=${anio}&mes=${mes}`,
  );
}
