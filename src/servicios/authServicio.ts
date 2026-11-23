
import type { Usuario } from "../interfaces/Usuario";
import { apiRequest } from "./api";
import { guardarSesion, cerrarSesion } from "./sesion";

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
}

interface LoginApiDTO {
  expiraEnSegundos: number;
  usuario: UsuarioApiDTO;
}

export interface DatosRegistroCliente {
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  fechaNacimiento?: string;
  region: string;
  comuna: string;
  direccion: string;
  clave: string;
}

export function adaptarUsuario(usuario: UsuarioApiDTO): Usuario {
  const roles = {
    CLIENTE: "Cliente",
    VENDEDOR: "Vendedor",
    ADMIN: "Administrador",
  } as const;

  const estados = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
  } as const;

  return {
    id: usuario.id,
    run: usuario.run,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    email: usuario.email,
    fechaNacimiento: usuario.fechaNacimiento,
    region: usuario.region,
    comuna: usuario.comuna,
    direccion: usuario.direccion,
    rol: roles[usuario.rol],
    estado: estados[usuario.estado],
    auditoria: usuario.auditoria ?? [],
  };
}

export async function iniciarSesion(email: string, clave: string): Promise<Usuario> {
  const respuesta = await apiRequest<LoginApiDTO>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, clave }),
  });

  const usuario = adaptarUsuario(respuesta.usuario);
  guardarSesion(usuario);

  return usuario;
}

export async function registrarCliente(datos: DatosRegistroCliente): Promise<Usuario> {
  const respuesta = await apiRequest<UsuarioApiDTO>("/auth/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  return adaptarUsuario(respuesta);
}

export async function obtenerSesionActual(): Promise<Usuario> {
  const respuesta = await apiRequest<UsuarioApiDTO>("/auth/me");
  const usuario = adaptarUsuario(respuesta);
  guardarSesion(usuario);

  return usuario;
}

export async function completarActivacion(token: string, nuevaClave: string): Promise<void> {
  await apiRequest<void>("/auth/activaciones/completar", {
    method: "POST",
    body: JSON.stringify({ token, nuevaClave }),
  });
}

export async function cerrarSesionActual(): Promise<void> {
  await apiRequest<void>("/auth/logout", {
    method: "POST",
  });

  cerrarSesion();
}
