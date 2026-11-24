
import type { Producto } from "../interfaces/Producto";
import { apiRequest } from "./api";

interface CategoriaApiDTO {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface ProductoApiDTO {
  id: number;
  codigo: string;
  nombre: string;
  categoria: CategoriaApiDTO;
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  imagen: string;
  descripcion: string;
}

export function adaptarProducto(producto: ProductoApiDTO): Producto {
  return {
    codigo: producto.codigo,
    nombre: producto.nombre,
    categoria: producto.categoria.nombre,
    marca: producto.marca,
    modelo: producto.modelo,
    precio: Number(producto.precio),
    stock: producto.stock,
    imagen: producto.imagen,
    descripcion: producto.descripcion,
  };
}

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await apiRequest<ProductoApiDTO[]>("/catalogo/productos");
  return respuesta.map(adaptarProducto);
}

export async function obtenerCategorias(): Promise<string[]> {
  const respuesta = await apiRequest<CategoriaApiDTO[]>("/catalogo/categorias");
  return respuesta.map((categoria) => categoria.nombre);
}

export async function crearProducto(producto: Producto): Promise<Producto> {
  const respuesta = await apiRequest<ProductoApiDTO>("/catalogo/productos", {
    method: "POST",
    body: JSON.stringify(producto),
  });

  return adaptarProducto(respuesta);
}

export async function actualizarProducto(producto: Producto): Promise<Producto> {
  const respuesta = await apiRequest<ProductoApiDTO>(
    `/catalogo/productos/${encodeURIComponent(producto.codigo)}`,
    {
      method: "PUT",
      body: JSON.stringify(producto),
    },
  );

  return adaptarProducto(respuesta);
}

export async function actualizarStockProducto(codigo: string, stock: number): Promise<Producto> {
  const respuesta = await apiRequest<ProductoApiDTO>(
    `/catalogo/productos/${encodeURIComponent(codigo)}/stock`,
    {
      method: "PATCH",
      body: JSON.stringify({ stock }),
    },
  );

  return adaptarProducto(respuesta);
}

export async function eliminarProducto(codigo: string): Promise<void> {
  await apiRequest<void>(`/catalogo/productos/${encodeURIComponent(codigo)}`, {
    method: "DELETE",
  });
}



/*
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

*/