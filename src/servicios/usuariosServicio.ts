
import type { Usuario } from "../interfaces/Usuario";
import { usuarios as usuariosIniciales } from "../datos/usuarios";

const CLAVE_STORAGE = "usuarios";


export function obtenerUsuarios(): Usuario[] {
  const guardado = localStorage.getItem(CLAVE_STORAGE);

  if (guardado !== null) {
    try {
      return JSON.parse(guardado) as Usuario[];
    } catch {
    }
  }

  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuariosIniciales));

  return [...usuariosIniciales];
}

export function guardarUsuarios(usuarios: Usuario[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuarios));
}
