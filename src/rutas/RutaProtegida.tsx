// Archivo ya modificado/agregado para preparar la integración. No modificar

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { obtenerRol } from "../servicios/sesion";
import type { Rol } from "../servicios/sesion";

interface RutaProtegidaProps {
  rolesPermitidos: Rol[];
  verificandoSesion?: boolean;
}

function RutaProtegida({
  rolesPermitidos,
  verificandoSesion = false,
}: RutaProtegidaProps) {
  const location = useLocation();

  if (verificandoSesion) {
    return (
      <main className="container py-5">
        <p className="text-center text-muted">Verificando sesión...</p>
      </main>
    );
  }

  const rol = obtenerRol();

  if (!rol) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!rolesPermitidos.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;


/*
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

*/