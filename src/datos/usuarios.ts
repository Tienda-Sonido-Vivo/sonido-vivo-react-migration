// src/datos/usuarios.ts

import type { Usuario } from "../interfaces/Usuario";


export const usuarios: Usuario[] = [

    {
        run: "123456789",
        nombre: "Juan",
        apellidos: "Pérez Gómez",
        email: "admin@demo.cl",
        fechaNacimiento: "1985-03-12",
        region: "Metropolitana de Santiago",
        comuna: "Santiago",
        direccion: "Calle Falsa 123",
        rol: "Administrador",
        estado: "Activo",
        auditoria: [
            "Inició sesión el 01/09/2026",
            "Actualizó el stock del producto #245",
            "Creó un nuevo usuario vendedor"
        ],
        clave: "1234"
    },

    {
        run: "987654321",
        nombre: "María",
        apellidos: "González Soto",
        email: "vendedor1@demo.cl",
        fechaNacimiento: "1992-07-21",
        region: "Valparaíso",
        comuna: "Viña del Mar",
        direccion: "Avenida Demo 456",
        rol: "Vendedor",
        estado: "Activo",
        auditoria: [
            "Inició sesión el 02/09/2026",
            "Actualizó el stock del producto #102"
        ],
        clave: "1234"
    },

    {
        run: "112233445",
        nombre: "Pedro",
        apellidos: "Ramírez López",
        email: "vendedor2@demo.cl",
        fechaNacimiento: "1995-11-08",
        region: "Biobío",
        comuna: "Concepción",
        direccion: "Calle Principal 789",
        rol: "Vendedor",
        estado: "Activo",
        auditoria: [
            "Inició sesión el 03/09/2026"
        ],
        clave: "1234"
    },

    {
        run: "556677889",
        nombre: "Ana",
        apellidos: "Martínez Díaz",
        email: "usuario@demo.cl",
        fechaNacimiento: "1998-01-25",
        region: "Metropolitana de Santiago",
        comuna: "Ñuñoa",
        direccion: "Avenida Siempre Viva 123",
        rol: "Cliente",
        estado: "Activo",
        clave: "1234"
    }

];