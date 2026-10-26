
import { Navigate, Outlet } from "react-router-dom";

import { obtenerRol } from "../servicios/sesion";
import type { Rol } from "../servicios/sesion";

interface RutaProtegidaProps {
  rolesPermitidos: Rol[];
}

function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const rol = obtenerRol();

  if (rol === null) {
    return <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(rol)) {
    return <Navigate to={rol === "Cliente" ? "/" : "/admin"} replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;
