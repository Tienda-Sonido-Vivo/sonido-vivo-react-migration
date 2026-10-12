// src/App.tsx

import { Routes, Route } from "react-router-dom";

import LayoutPublico from "./layouts/LayoutPublico";
import LayoutAdmin from "./layouts/LayoutAdmin";
import RutaProtegida from "./routes/RutaProtegida";

import Inicio from "./pages/Inicio";
import DetalleProducto from "./pages/DetalleProducto";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";

import InicioAdmin from "./pages/admin/InicioAdmin";
import GestionUsuarios from "./pages/admin/GestionUsarios";
import GestionProductos from "./pages/admin/GestionProductos";
import GestionPedidos from "./pages/admin/GestionPedidos";

function App() {
  return (
    <Routes>
      {/* ===== SITIO PÚBLICO (Navbar + Footer) ===== */}
      <Route element={<LayoutPublico />}>
        {" "}
        {/* dentro de element={} se pone el componente que se quiere renderizar */}
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:codigo" element={<DetalleProducto />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ===== PANEL ADMIN (Administrador y Vendedor) ===== */}
      <Route
        element={
          <RutaProtegida rolesPermitidos={["Administrador", "Vendedor"]} />
        }
      >
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<InicioAdmin />} />

          {/* Solo Administrador:*/}
          <Route
            element={<RutaProtegida rolesPermitidos={["Administrador"]} />}
          >
            <Route path="usuarios" element={<GestionUsuarios />} />
          </Route>

          {/* Administrador y Vendedor: */}
          <Route path="productos" element={<GestionProductos />} />
          <Route path="pedidos" element={<GestionPedidos />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
