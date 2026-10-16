// src/datos/pedidos.ts

import type { Pedido } from "../interfaces/Pedido";

// Pedidos de ejemplo para probar el panel admin mientras no esté migrado el checkout
export const pedidosIniciales: Pedido[] = [

    {
        codigo: "SV-2026-0001",
        fecha: "05 de septiembre de 2026",
        estado: "Entregado",
        productos: [
            { codigo: "GA001", cantidad: 1 },
            { codigo: "GA003", cantidad: 1 }
        ],
        subtotal: 219980,
        envio: 8990,
        iva: 35123,
        total: 228970,
        metodoEntrega: "despacho",
        metodoPago: "debito",
        cliente: {
            nombre: "Ana",
            apellidos: "Martínez Díaz",
            telefono: "+56 9 1111 2222",
            correo: "usuario@demo.cl",
            region: "Metropolitana de Santiago",
            comuna: "Ñuñoa",
            direccion: "Avenida Siempre Viva 123"
        }
    },

    {
        codigo: "SV-2026-0002",
        fecha: "08 de septiembre de 2026",
        estado: "Despachado",
        productos: [
            { codigo: "BA002", cantidad: 1 }
        ],
        subtotal: 699990,
        envio: 8990,
        iva: 111763,
        total: 708980,
        metodoEntrega: "despacho",
        metodoPago: "credito",
        cliente: {
            nombre: "Luis",
            apellidos: "Fuentes Vera",
            telefono: "+56 9 3333 4444",
            correo: "luis.fuentes@correo.cl",
            region: "Biobío",
            comuna: "Concepción",
            direccion: "Calle Los Aromos 456",
            numeroVivienda: "Depto 12"
        }
    },

    {
        codigo: "SV-2026-0003",
        fecha: "12 de septiembre de 2026",
        estado: "En preparación",
        productos: [
            { codigo: "BT003", cantidad: 2 }
        ],
        subtotal: 179980,
        envio: 0,
        iva: 28736,
        total: 179980,
        metodoEntrega: "retiro",
        metodoPago: "transbank",
        cliente: {
            nombre: "Camila",
            apellidos: "Rojas Pino",
            telefono: "+56 9 5555 6666",
            correo: "camila.rojas@correo.cl",
            region: "Valparaíso",
            comuna: "Viña del Mar",
            direccion: "Avenida España 789"
        }
    }

];
