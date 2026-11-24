
import { apiRequest } from "./api";

export type TipoMensaje = "CONTACTO" | "PREGUNTAS_FRECUENTES";

export interface Mensaje {
  id: number;
  nombreCompleto: string;
  correo: string;
  mensaje: string;
  tipoMensaje: TipoMensaje;
  tipoRemitente: "CLIENTE" | "ADMIN" | "VENDEDOR";
  revisado: boolean;
  fechaCreacion: string;
}

export interface NuevoMensaje {
  nombreCompleto: string;
  correo: string;
  mensaje: string;
  tipoMensaje: TipoMensaje;
}

export async function enviarMensaje(datos: NuevoMensaje): Promise<Mensaje> {
  return apiRequest<Mensaje>("/contactos", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export async function obtenerMensajes(): Promise<Mensaje[]> {
  return apiRequest<Mensaje[]>("/contactos");
}

export async function actualizarRevisionMensaje(
  id: number,
  revisado: boolean,
): Promise<Mensaje> {
  return apiRequest<Mensaje>(`/contactos/${id}/revision`, {
    method: "PATCH",
    body: JSON.stringify({ revisado }),
  });
}
