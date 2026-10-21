// src/App.tsx

import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";

// Páginas Públicas
import Inicio from "./paginas/Inicio";
import Catalogo from "./paginas/Catalogo";
import DetalleProducto from "./paginas/DetalleProducto";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import Carrito from "./paginas/Carrito";
import Checkout from "./paginas/Checkout";
import ConfirmacionPedido from "./paginas/ConfirmacionPedido";
import MisPedidos from "./paginas/MisPedidos";
import DetallePedido from "./paginas/DetallePedido";

// Páginas y Componentes de Administración
import LayoutAdmin from "./layouts/LayoutAdmin";
import RutaProtegida from "./rutas/RutaProtegida";
import InicioAdmin from "./paginas/admin/InicioAdmin";
import GestionUsuarios from "./paginas/admin/GestionUsuarios";
import GestionProductos from "./paginas/admin/GestionProductos";
import GestionPedidos from "./paginas/admin/GestionPedidos";

import { useAppData } from "./hooks/useAppData";

function App() {
  /*
   * ADMIN: en las rutas /admin no se muestran el Navbar ni el Footer públicos.
   */
  const { pathname } = useLocation();
  const esRutaAdmin = pathname.startsWith("/admin");

  /*
   * Toda la lógica de estado se consume desde el hook useAppData
   */
  const {
    usuarios,
    carrito,
    pedidos,
    productosDisponibles,
    correoUsuario,
    iniciarSesion,
    registrarUsuario,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    confirmarPedido,
    setUsuarios,
    setProductosDisponibles,
    setPedidos,
  } = useAppData();

  return (
    <div className="app">
      {!esRutaAdmin && <Navbar />}

      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />

        <Route path="/catalogo" element={<Catalogo />} />

        <Route
          path="/producto/:codigo"
          element={
            <DetalleProducto
              productos={productosDisponibles}
              onAgregarCarrito={agregarAlCarrito}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login usuarios={usuarios} onIniciarSesion={iniciarSesion} />
          }
        />

        <Route
          path="/registro"
          element={
            <Registro
              usuarios={usuarios}
              onRegistrarUsuario={registrarUsuario}
            />
          }
        />

        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              productos={productosDisponibles}
              onCambiarCantidad={cambiarCantidad}
              onEliminar={eliminarDelCarrito}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              carrito={carrito}
              productos={productosDisponibles}
              correoUsuario={correoUsuario}
              onConfirmarPedido={confirmarPedido}
            />
          }
        />

        <Route
          path="/confirmacion-pedido/:codigo"
          element={<ConfirmacionPedido pedidos={pedidos} />}
        />

        <Route
          path="/mis-pedidos"
          element={
            <MisPedidos pedidos={pedidos} correoUsuario={correoUsuario} />
          }
        />

        <Route
          path="/mis-pedidos/:codigo"
          element={
            <DetallePedido pedidos={pedidos} correoUsuario={correoUsuario} />
          }
        />

        {/*
         * PANEL DE ADMINISTRACIÓN
         * Protegido por roles y envuelto en LayoutAdmin
         */}
        <Route
          element={
            <RutaProtegida rolesPermitidos={["Administrador", "Vendedor"]} />
          }
        >
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<InicioAdmin />} />

            <Route
              path="productos"
              element={
                <GestionProductos
                  productos={productosDisponibles}
                  onCambiarProductos={setProductosDisponibles}
                />
              }
            />

            <Route
              path="pedidos"
              element={
                <GestionPedidos
                  pedidos={pedidos}
                  onCambiarPedidos={setPedidos}
                />
              }
            />

            {/* Solo el Administrador puede gestionar usuarios */}
            <Route
              element={<RutaProtegida rolesPermitidos={["Administrador"]} />}
            >
              <Route
                path="usuarios"
                element={
                  <GestionUsuarios
                    usuarios={usuarios}
                    onCambiarUsuarios={setUsuarios}
                  />
                }
              />
            </Route>
          </Route>
        </Route>
      </Routes>

      {!esRutaAdmin && <Footer />}
    </div>
  );
}

export default App;