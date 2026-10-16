// src/interfaces/Pedido.ts

export type EstadoPedido =
    | "En preparación"
    | "Despachado"
    | "Entregado";


export interface ProductoPedido {

    codigo: string;

    cantidad: number;

}


export interface ClientePedido {

    nombre: string;

    apellidos: string;

    telefono: string;

    correo: string;

    region: string;

    comuna: string;

    direccion: string;

    numeroVivienda?: string;

    codigoPostal?: string;

}


export interface Pedido {

    codigo: string;

    fecha: string;

    estado: EstadoPedido;

    productos: ProductoPedido[];

    subtotal: number;

    envio: number;

    iva: number;

    total: number;

    metodoEntrega: "despacho" | "retiro";

    metodoPago: "debito" | "credito" | "transbank" | "klap";

    cliente: ClientePedido;

}
