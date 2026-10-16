// src/servicios/usuariosServicio.ts

import type { Usuario } from "../interfaces/Usuario";
import { usuarios as usuariosIniciales } from "../datos/usuarios";

const CLAVE_STORAGE = "usuarios";


// Hoy lee de localStorage. Cuando exista el microservicio,
// solo cambian estas funciones por fetch("/api/usuarios").
export function obtenerUsuarios(): Usuario[] {

    const guardado = localStorage.getItem(CLAVE_STORAGE);

    if (guardado !== null) {

        try {

            return JSON.parse(guardado) as Usuario[];

        } catch {

            // Si el dato guardado está corrupto, se parte de los datos iniciales
        }

    }

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuariosIniciales));

    return [...usuariosIniciales];

}


export function guardarUsuarios(usuarios: Usuario[]): void {

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuarios));

}
