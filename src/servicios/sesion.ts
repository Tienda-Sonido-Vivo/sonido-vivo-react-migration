// Archivo ya modificado/agregado para preparar la integración. No modificar

import type { Usuario } from "../interfaces/Usuario";

const CLAVE_USUARIO = "usuarioSesion";

export type Rol = Usuario["rol"];

export function guardarSesion(usuario: Usuario): void {
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  window.dispatchEvent(new Event("sesionCambiada"));
}

export function haySesion(): boolean {
  return sessionStorage.getItem(CLAVE_USUARIO) !== null;
}

export function obtenerUsuarioSesion(): Usuario | null {
  const guardado = sessionStorage.getItem(CLAVE_USUARIO);

  if (!guardado) {
    return null;
  }

  try {
    return JSON.parse(guardado) as Usuario;
  } catch {
    cerrarSesion();
    return null;
  }
}

export function obtenerRol(): Rol | null {
  if (!haySesion()) {
    return null;
  }

  return obtenerUsuarioSesion()?.rol ?? null;
}

export function obtenerCorreo(): string {
  return obtenerUsuarioSesion()?.email ?? "";
}

export function cerrarSesion(): void {
  sessionStorage.removeItem(CLAVE_USUARIO);
  window.dispatchEvent(new Event("sesionCambiada"));
}


/*
import type { Usuario } from "../interfaces/Usuario";

export type Rol = Usuario["rol"];

export function haySesion(): boolean {
  return sessionStorage.getItem("usuarioLogueado") === "true";
}

export function obtenerRol(): Rol | null {
  if (!haySesion()) {
    return null;
  }

  const rol = sessionStorage.getItem("rolUsuario");

  if (rol === "Administrador" || rol === "Vendedor" || rol === "Cliente") {
    return rol;
  }

  return null;
}

export function obtenerCorreo(): string {
  return sessionStorage.getItem("correoUsuario") ?? "";
}

export function cerrarSesion(): void {
  sessionStorage.removeItem("usuarioLogueado");
  sessionStorage.removeItem("rolUsuario");
  sessionStorage.removeItem("correoUsuario");

  window.dispatchEvent(new Event("sesionCambiada"));
}

*/