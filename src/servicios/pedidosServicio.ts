// Archivo ya modificado/agregado para preparar la integración. No modificar

import type { Pedido } from "../interfaces/Pedido";
import type { EstadoPedido } from "../interfaces/EstadoPedido";
import type { DatosFormularioCheckout } from "../componentes/organismos/FormularioCheckout";
import { apiRequest } from "./api";

interface PedidoApiDTO extends Omit<Pedido, "fechaISO"> {
  fechaISO: string;
}

function adaptarPedido(pedido: PedidoApiDTO): Pedido {
  return {
    ...pedido,
    fechaISO: pedido.fechaISO,
  };
}

export async function obtenerMisPedidos(): Promise<Pedido[]> {
  const respuesta = await apiRequest<PedidoApiDTO[]>("/pedidos/mis-pedidos");
  return respuesta.map(adaptarPedido);
}

export async function obtenerPedidosAdministracion(): Promise<Pedido[]> {
  const respuesta = await apiRequest<PedidoApiDTO[]>("/pedidos");
  return respuesta.map(adaptarPedido);
}

export async function obtenerPedido(codigo: string): Promise<Pedido> {
  const respuesta = await apiRequest<PedidoApiDTO>(
    `/pedidos/${encodeURIComponent(codigo)}`,
  );

  return adaptarPedido(respuesta);
}

export async function crearPedido(
  datos: DatosFormularioCheckout,
): Promise<Pedido> {
  const respuesta = await apiRequest<PedidoApiDTO>("/pedidos", {
    method: "POST",
    body: JSON.stringify({
      metodoEntrega: datos.metodoEntrega.toUpperCase(),
      metodoPago: datos.metodoPago.toUpperCase(),
      cliente: {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        telefono: datos.telefono,
        correo: datos.correo,
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion,
        numeroVivienda: datos.numeroVivienda,
        codigoPostal: datos.codigoPostal,
      },
    }),
  });

  return adaptarPedido(respuesta);
}

export async function actualizarEstadoPedido(
  codigo: string,
  estado: EstadoPedido,
): Promise<Pedido> {
  const respuesta = await apiRequest<PedidoApiDTO>(
    `/pedidos/${encodeURIComponent(codigo)}/estado`,
    {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    },
  );

  return adaptarPedido(respuesta);
}




/*
import type { Pedido } from "../interfaces/Pedido";
import { pedidosIniciales } from "../datos/pedidos";

const CLAVE_STORAGE = "pedidos";

export function obtenerPedidos(): Pedido[] {
  const guardado = localStorage.getItem(CLAVE_STORAGE);

  if (guardado !== null) {
    try {
      return JSON.parse(guardado) as Pedido[];
    } catch {
    }
  }

  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidosIniciales));

  return [...pedidosIniciales];
}

export function guardarPedidos(pedidos: Pedido[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
}


*/