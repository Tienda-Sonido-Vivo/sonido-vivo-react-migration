// src/App.tsx

import { Routes, Route } from "react-router-dom";

import LayoutPublico from "./layouts/LayoutPublico";
import LayoutAdmin from "./layouts/LayoutAdmin";
import RutaProtegida from "./routes/RutaProtegida";

import Inicio from "./paginas/Inicio";
import DetalleProducto from "./paginas/DetalleProducto";
import Catalogo from "./paginas/Catalogo";
import Login from "./paginas/Login";

import InicioAdmin from "./paginas/admin/InicioAdmin";
import GestionUsuarios from "./paginas/admin/GestionUsarios";
import GestionProductos from "./paginas/admin/GestionProductos";
import GestionPedidos from "./paginas/admin/GestionPedidos";

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
