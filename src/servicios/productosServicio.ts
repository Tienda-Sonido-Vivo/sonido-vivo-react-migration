
import type { Producto } from "../interfaces/Producto";
import { productos as productosIniciales } from "../datos/productos";

const CLAVE_STORAGE = "productos";

export function obtenerProductos(): Producto[] {
  const guardado = localStorage.getItem(CLAVE_STORAGE);

  if (guardado !== null) {
    try {
      return JSON.parse(guardado) as Producto[];
    } catch {
    }
  }

  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productosIniciales));

  return [...productosIniciales];
}

export function guardarProductos(productos: Producto[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}
