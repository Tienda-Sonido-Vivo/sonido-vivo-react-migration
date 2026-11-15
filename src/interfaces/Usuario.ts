// Archivo ya modificado/agregado para preparar la integración. No modificar

export interface Usuario {
  id?: number;
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
  requiereActivacion?: boolean;
}



/*
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

*/