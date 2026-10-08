// src/interfaces/Usuario.ts

export interface Usuario {

    run: string;

    nombre: string;

    apellidos: string;

    email: string;

    fechaNacimiento?: string;

    region: string;

    comuna: string;

    direccion: string;

    rol: "Administrador" | "Vendedor" | "Cliente";

    estado: "Activo" | "Inactivo";

    auditoria?: string[];

    clave: string;

}