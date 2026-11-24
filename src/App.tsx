import { Route, Routes } from "react-router-dom";

import LayoutPublico from "./layouts/LayoutPublico";
import LayoutAdmin from "./layouts/LayoutAdmin";
import RutaProtegida from "./rutas/RutaProtegida";

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
import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import Novedades from "./paginas/Novedades";
import NovedadDetalle from "./paginas/NovedadDetalle";
import PreguntasFrecuentes from "./paginas/PreguntasFrecuentes";

import InicioAdmin from "./paginas/admin/InicioAdmin";
import GestionUsuarios from "./paginas/admin/GestionUsuarios";
import GestionProductos from "./paginas/admin/GestionProductos";
import GestionPedidos from "./paginas/admin/GestionPedidos";
import ListadoContactos from "./paginas/ListadoContactos";
import VentasAdmin from "./paginas/admin/VentasAdmin";

import { useAppData } from "./hooks/useAppData";

function App() {
  const {
    usuarios,
    carrito,
    pedidos,
    productosDisponibles,
    categoriasDisponibles,
    correoUsuario,
    cargandoCatalogo,
    cargandoPedidos,
    cargandoCarrito,
    verificandoSesion,
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
    <Routes>
      <Route element={<LayoutPublico />}>
        <Route
          path="/"
          element={
            <Inicio
              productos={productosDisponibles}
              cargando={cargandoCatalogo}
            />
          }
        />

        <Route
          path="/catalogo"
          element={
            <Catalogo
              productos={productosDisponibles}
              cargando={cargandoCatalogo}
            />
          }
        />

        <Route
          path="/producto/:codigo"
          element={
            <DetalleProducto
              productos={productosDisponibles}
              onAgregarCarrito={agregarAlCarrito}
              cargando={cargandoCatalogo}
            />
          }
        />

        <Route
          path="/login"
          element={<Login onIniciarSesion={iniciarSesion} />}
        />

        <Route
          path="/registro"
          element={<Registro onRegistrarUsuario={registrarUsuario} />}
        />

        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              productos={productosDisponibles}
              cargando={cargandoCarrito || verificandoSesion}
              onCambiarCantidad={cambiarCantidad}
              onEliminar={eliminarDelCarrito}
            />
          }
        />

        <Route element={<RutaProtegida rolesPermitidos={["Cliente"]} verificandoSesion={verificandoSesion} />}>
          <Route
            path="/checkout"
            element={
              <Checkout
                carrito={carrito}
                productos={productosDisponibles}
                correoUsuario={correoUsuario}
                cargandoCarrito={cargandoCarrito || verificandoSesion}
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
              <MisPedidos
                pedidos={pedidos}
                correoUsuario={correoUsuario}
                cargando={cargandoPedidos}
              />
            }
          />

          <Route
            path="/mis-pedidos/:codigo"
            element={
              <DetallePedido
                pedidos={pedidos}
                correoUsuario={correoUsuario}
              />
            }
          />
        </Route>

        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/novedades/:slug" element={<NovedadDetalle />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
      </Route>

      <Route element={<RutaProtegida rolesPermitidos={["Administrador", "Vendedor"]} verificandoSesion={verificandoSesion} />}>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<InicioAdmin />} />

          <Route
            path="productos"
            element={
              <GestionProductos
                productos={productosDisponibles}
                categorias={categoriasDisponibles}
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

          <Route path="mensajes" element={<ListadoContactos />} />

          <Route element={<RutaProtegida rolesPermitidos={["Administrador"]} verificandoSesion={verificandoSesion} />}>
            <Route
              path="usuarios"
              element={
                <GestionUsuarios
                  usuarios={usuarios}
                  onCambiarUsuarios={setUsuarios}
                />
              }
            />

            <Route path="ventas" element={<VentasAdmin />} />

          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

