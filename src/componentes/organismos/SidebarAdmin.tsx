// src/componentes/organismos/SidebarAdmin.tsx

import { Link, NavLink, useNavigate } from "react-router-dom";

import { enlacesAdmin } from "../../datos/menuAdmin";
import { cerrarSesion, obtenerRol } from "../../servicios/sesion";

function SidebarAdmin() {
  const navigate = useNavigate();

  const rol = obtenerRol();

  const salir = () => {
    cerrarSesion();

    navigate("/");
  };

  const enlacesVisibles = enlacesAdmin.filter(
    (enlace) => rol !== null && enlace.roles.includes(rol),
  );

  return (
    <>
      <h4 className="mb-4 border-bottom pb-3">
        Sonido <span className="admin-acento">Vivo</span>
        <small className="d-block fs-6 fw-normal text-secondary">
          Panel {rol}
        </small>
      </h4>

      <nav>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                "nav-link admin-nav-link" + (isActive ? " active" : "")
              }
            >
              🏠 Inicio
            </NavLink>
          </li>

          {enlacesVisibles.map((enlace) => (
            <li className="nav-item mb-2" key={enlace.ruta}>
              {enlace.disponible ? (
                <NavLink
                  to={enlace.ruta}
                  className={({ isActive }) =>
                    "nav-link admin-nav-link" + (isActive ? " active" : "")
                  }
                >
                  {enlace.icono} {enlace.titulo}
                </NavLink>
              ) : (
                <span
                  className="nav-link admin-nav-link disabled"
                  aria-disabled="true"
                >
                  {enlace.icono} {enlace.titulo}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <hr className="border-secondary mt-4" />

      <div className="d-grid gap-2">
        <Link to="/" className="btn btn-outline-light btn-sm">
          ← Volver al sitio público
        </Link>

        <button
          type="button"
          className="btn btn-outline-warning btn-sm"
          onClick={salir}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default SidebarAdmin;
