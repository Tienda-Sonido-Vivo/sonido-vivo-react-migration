// Archivo ya modificado/agregado para preparar la integración. No modificar

import type { Usuario } from "../interfaces/Usuario";
import { apiRequest } from "./api";
import { adaptarUsuario } from "./authServicio";

interface UsuarioApiDTO {
  id: number;
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  fechaNacimiento?: string;
  region: string;
  comuna: string;
  direccion: string;
  rol: "CLIENTE" | "VENDEDOR" | "ADMIN";
  estado: "ACTIVO" | "INACTIVO";
  auditoria: string[];
  requiereActivacion: boolean;
}

interface ActivacionApiDTO {
  tokenActivacion: string;
  expiraEn: string;
}

function rolApi(rol: Usuario["rol"]): string {
  return {
    Cliente: "CLIENTE",
    Vendedor: "VENDEDOR",
    Administrador: "ADMIN",
  }[rol];
}

function estadoApi(estado: Usuario["estado"]): string {
  return estado === "Activo" ? "ACTIVO" : "INACTIVO";
}

function datosUsuario(usuario: Usuario) {
  return {
    run: usuario.run,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    email: usuario.email,
    fechaNacimiento: usuario.fechaNacimiento ?? null,
    region: usuario.region,
    comuna: usuario.comuna,
    direccion: usuario.direccion,
    rol: rolApi(usuario.rol),
  };
}

export async function obtenerUsuarios(): Promise<Usuario[]> {
  const respuesta = await apiRequest<UsuarioApiDTO[]>("/auth/usuarios");
  return respuesta.map(adaptarUsuario);
}

export async function crearUsuario(usuario: Usuario): Promise<{ usuario: Usuario; tokenActivacion: string }> {
  const creado = await apiRequest<UsuarioApiDTO>("/auth/usuarios", {
    method: "POST",
    body: JSON.stringify(datosUsuario(usuario)),
  });

  const activacion = await apiRequest<ActivacionApiDTO>(
    `/auth/usuarios/${encodeURIComponent(usuario.run)}/activacion`,
    {
      method: "POST",
    },
  );

  return {
    usuario: adaptarUsuario(creado),
    tokenActivacion: activacion.tokenActivacion,
  };
}

export async function actualizarUsuario(usuario: Usuario): Promise<Usuario> {
  const respuesta = await apiRequest<UsuarioApiDTO>(
    `/auth/usuarios/${encodeURIComponent(usuario.run)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        fechaNacimiento: usuario.fechaNacimiento ?? null,
        region: usuario.region,
        comuna: usuario.comuna,
        direccion: usuario.direccion,
        rol: rolApi(usuario.rol),
        estado: estadoApi(usuario.estado),
      }),
    },
  );

  return adaptarUsuario(respuesta);
}

export async function cambiarEstadoUsuario(usuario: Usuario): Promise<Usuario> {
  const estado = usuario.estado === "Activo" ? "ACTIVO" : "INACTIVO";

  const respuesta = await apiRequest<UsuarioApiDTO>(
    `/auth/usuarios/${encodeURIComponent(usuario.run)}/estado`,
    {
      method: "PATCH",
      body: JSON.stringify(estado),
    },
  );

  return adaptarUsuario(respuesta);
}

export async function generarTokenActivacion(run: string): Promise<string> {
  const respuesta = await apiRequest<ActivacionApiDTO>(
    `/auth/usuarios/${encodeURIComponent(run)}/activacion`,
    {
      method: "POST",
    },
  );

  return respuesta.tokenActivacion;
}


/*
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
*/