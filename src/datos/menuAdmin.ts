
import type { Rol } from "../servicios/sesion";

export interface EnlaceAdmin {
  ruta: string;
  icono: string;
  titulo: string;
  descripcion: string;
  roles: Rol[];
  disponible: boolean;
}

export const enlacesAdmin: EnlaceAdmin[] = [
  {
    ruta: "/admin/usuarios",
    icono: "👤",
    titulo: "Gestión de Usuarios",
    descripcion: "Crea, edita y desactiva usuarios y asigna roles.",
    roles: ["Administrador"],
    disponible: true,
  },

  {
    ruta: "/admin/productos",
    icono: "🎸",
    titulo: "Gestión de Productos",
    descripcion: "Administra el catálogo y controla el stock.",
    roles: ["Administrador", "Vendedor"],
    disponible: true,
  },

  {
    ruta: "/admin/pedidos",
    icono: "📦",
    titulo: "Gestión de Pedidos",
    descripcion: "Consulta pedidos y actualiza su estado.",
    roles: ["Administrador", "Vendedor"],
    disponible: true,
  },
];
