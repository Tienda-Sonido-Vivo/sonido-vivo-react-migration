// Archivo ya modificado/agregado para preparar la integración. No modificar


const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const encabezados = new Headers(opciones.headers);

  if (opciones.body && !encabezados.has("Content-Type")) {
    encabezados.set("Content-Type", "application/json");
  }

  encabezados.set("X-Requested-With", "XMLHttpRequest");

  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    ...opciones,
    headers: encabezados,
    credentials: "include",
  });

  if (respuesta.status === 204) {
    return undefined as T;
  }

  const contenido = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      sessionStorage.removeItem("usuarioSesion");
      window.dispatchEvent(new Event("sesionCambiada"));
    }

    const mensaje =
      contenido?.detail ??
      contenido?.message ??
      contenido?.title ??
      `La solicitud falló con estado HTTP ${respuesta.status}.`;

    throw new ApiError(mensaje, respuesta.status);
  }

  return contenido as T;
}
