
import type { ItemCarrito } from "../interfaces/ItemCarrito";
import { apiRequest } from "./api";

export async function obtenerCarrito(): Promise<ItemCarrito[]> {
  return apiRequest<ItemCarrito[]>("/carrito");
}

export async function agregarItemCarrito(
  codigo: string,
  cantidad: number,
): Promise<ItemCarrito[]> {
  return apiRequest<ItemCarrito[]>("/carrito/items", {
    method: "POST",
    body: JSON.stringify({ codigo, cantidad }),
  });
}

export async function actualizarCantidadCarrito(
  codigo: string,
  cantidad: number,
): Promise<ItemCarrito[]> {
  return apiRequest<ItemCarrito[]>(
    `/carrito/items/${encodeURIComponent(codigo)}`,
    {
      method: "PUT",
      body: JSON.stringify({ cantidad }),
    },
  );
}

export async function eliminarItemCarrito(codigo: string): Promise<ItemCarrito[]> {
  return apiRequest<ItemCarrito[]>(
    `/carrito/items/${encodeURIComponent(codigo)}`,
    {
      method: "DELETE",
    },
  );
}

export async function vaciarCarrito(): Promise<void> {
  await apiRequest<void>("/carrito", {
    method: "DELETE",
  });
}
