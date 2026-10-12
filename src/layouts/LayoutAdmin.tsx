// src/layouts/LayoutAdmin.tsx

import { Outlet } from "react-router-dom";

import SidebarAdmin from "../components/organisms/SidebarAdmin";

import "../styles/admin.css";

function LayoutAdmin() {
  return (
    <div className="admin-body">
      {/* Barra superior: solo celular */}
      <div className="admin-topbar d-md-none d-flex justify-content-between align-items-center p-3">
        <span className="fw-bold text-white">
          Sonido <span className="admin-acento">Vivo</span>
        </span>

        <button
          className="btn btn-outline-light btn-sm"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarAdmin"
          aria-controls="sidebarAdmin"
          aria-expanded="false"
          aria-label="Abrir menú de administración"
        >
          ☰ Menú
        </button>
      </div>

      <div className="admin-layout">
        {/* Celular: se despliega con el botón. Tablet/escritorio: siempre visible */}
        <aside
          id="sidebarAdmin"
          className="admin-sidebar collapse d-md-block text-white p-3"
        >
          <SidebarAdmin />
        </aside>

        <main className="admin-contenido p-4">
          <Outlet />
        </main>
      </div>
      {/* footer personalizado */}
      <footer className="bg-dark text-white text-center p-4 mt-auto"> {/* solo se le cambio el mt-5 por mt-auto para que no tuviera margen superior y se viera feo */}
        <p className="mb-1 text-center">© 2026 Sonido Vivo - Viña del Mar</p>

        <small className="text-secondary">
          Contacto: tienda.sonido.vivo@gmail.cl | Teléfono: +56 9 5555 5555
        </small>
      </footer>
    </div>
  );
}

export default LayoutAdmin;
