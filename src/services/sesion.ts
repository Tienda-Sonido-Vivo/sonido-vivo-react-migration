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

    if (
        rol === "Administrador" ||
        rol === "Vendedor" ||
        rol === "Cliente"
    ) {

        return rol;

    }

    return null;

}


export function cerrarSesion(): void {

    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("rolUsuario");

    // Avisa al Navbar público para que actualice "Mi Cuenta"
    window.dispatchEvent(new Event("sesionCambiada"));

}
