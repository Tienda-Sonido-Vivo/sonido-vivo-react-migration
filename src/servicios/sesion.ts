// src/servicios/sesion.ts

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

// Correo del usuario con la sesión iniciada ("" si no hay sesión)
export function obtenerCorreo(): string {
  return sessionStorage.getItem("correoUsuario") ?? "";
}

// Borra las mismas tres claves que borra el Navbar público
export function cerrarSesion(): void {
  sessionStorage.removeItem("usuarioLogueado");
  sessionStorage.removeItem("rolUsuario");
  sessionStorage.removeItem("correoUsuario");

  // App y Navbar escuchan este evento para actualizar la sesión
  window.dispatchEvent(new Event("sesionCambiada"));
}
