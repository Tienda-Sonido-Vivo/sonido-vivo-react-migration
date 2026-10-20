// src/rutas/RutaProtegida.tsx

import { Navigate, Outlet } from "react-router-dom";

import { obtenerRol } from "../servicios/sesion";
import type { Rol } from "../servicios/sesion";


interface RutaProtegidaProps {

    rolesPermitidos: Rol[];

}


function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {

    const rol = obtenerRol();


    // Sin sesión: al login
    if (rol === null) {

        return <Navigate to="/login" replace />;

    }


    // Con sesión pero sin permiso para esta ruta
    if (!rolesPermitidos.includes(rol)) {

        return (
            <Navigate
                to={rol === "Cliente" ? "/" : "/admin"}
                replace
            />
        );

    }


    return <Outlet />;

}


export default RutaProtegida;
