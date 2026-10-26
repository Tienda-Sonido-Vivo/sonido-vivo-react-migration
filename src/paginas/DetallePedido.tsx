import { Link, useNavigate, useParams } from "react-router-dom";

import type { Pedido } from "../interfaces/Pedido";

interface DetallePedidoProps {
  pedidos: Pedido[];

  correoUsuario: string;
}

function DetallePedido({ pedidos, correoUsuario }: DetallePedidoProps) {
  const { codigo } = useParams();

  const navigate = useNavigate();

  if (!correoUsuario) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning">
          Debes iniciar sesión para consultar este pedido.
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
      </main>
    );
  }

  const pedido = pedidos.find(
    (actual) =>
      actual.codigo === codigo &&
      actual.correoCliente.toLowerCase() === correoUsuario.toLowerCase(),
  );

  if (!pedido) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">
          No se encontró el pedido solicitado.
        </div>

        <Link to="/mis-pedidos" className="btn btn-primary">
          Volver a mis pedidos
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Detalle del pedido</h1>

          <p className="text-muted mb-0">{pedido.codigo}</p>
        </div>

        <span className="badge text-bg-success fs-6">{pedido.estado}</span>
      </div>

      <div className="row g-4">
        <section className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h2 className="h5 mb-0">Productos</h2>
            </div>

            <div className="card-body">
              {pedido.productos.map((producto) => (
                <div
                  key={producto.codigo}
                  className="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                  <div>
                    <strong>{producto.nombre}</strong>

                    <small className="text-muted d-block">
                      Cantidad: {producto.cantidad}
                    </small>
                  </div>

                  <span>
                    $
                    {(producto.precio * producto.cantidad).toLocaleString(
                      "es-CL",
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h2 className="h5 mb-0">Datos de entrega</h2>
            </div>

            <div className="card-body">
              <p className="mb-1">
                <strong>Nombre:</strong> {pedido.cliente.nombre}{" "}
                {pedido.cliente.apellidos}
              </p>

              <p className="mb-1">
                <strong>Correo:</strong> {pedido.cliente.correo}
              </p>

              <p className="mb-1">
                <strong>Teléfono:</strong> {pedido.cliente.telefono}
              </p>

              <p className="mb-1">
                <strong>Región:</strong> {pedido.cliente.region}
              </p>

              <p className="mb-1">
                <strong>Comuna:</strong> {pedido.cliente.comuna}
              </p>

              <p className="mb-0">
                <strong>Entrega:</strong>{" "}
                {pedido.metodoEntrega === "despacho"
                  ? "Despacho a domicilio"
                  : "Retiro en tienda"}
              </p>
            </div>
          </div>
        </section>

        <aside className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-bold">Resumen</h2>

              <div className="d-flex justify-content-between mt-3">
                <span>Subtotal</span>

                <span>${pedido.subtotal.toLocaleString("es-CL")}</span>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>Envío</span>

                <span>${pedido.envio.toLocaleString("es-CL")}</span>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>IVA incluido</span>

                <span>${pedido.iva.toLocaleString("es-CL")}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total</strong>

                <strong>${pedido.total.toLocaleString("es-CL")}</strong>
              </div>

              <p className="text-muted small mt-3 mb-0">
                Pago: {pedido.metodoPago}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-4">
        <Link to="/mis-pedidos" className="btn btn-outline-secondary">
          Volver a mis pedidos
        </Link>
      </div>
    </main>
  );
}

export default DetallePedido;
