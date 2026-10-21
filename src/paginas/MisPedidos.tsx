import { Link, useNavigate } from "react-router-dom";

import type { Pedido } from "../interfaces/Pedido";

interface MisPedidosProps {
  pedidos: Pedido[];

  correoUsuario: string;
}

function MisPedidos({ pedidos, correoUsuario }: MisPedidosProps) {
  const navigate = useNavigate();

  if (!correoUsuario) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning">
          Debes iniciar sesión para consultar tus pedidos.
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

  const pedidosUsuario = pedidos.filter(
    (pedido) =>
      pedido.correoCliente.toLowerCase() === correoUsuario.toLowerCase(),
  );

  return (
    <main className="container py-4 py-md-5">
      <div className="mb-4">
        <h1 className="fw-bold">Mis pedidos</h1>

        <p className="text-muted mb-0">Aquí puedes revisar tus compras.</p>
      </div>

      {pedidosUsuario.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h2 className="h5">Todavía no tienes pedidos.</h2>

            <p className="text-muted">
              Cuando realices una compra, aparecerá aquí.
            </p>

            <Link to="/catalogo" className="btn btn-primary">
              Ir al catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {pedidosUsuario.map((pedido) => (
            <div className="col-12" key={pedido.codigo}>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md-3">
                      <small className="text-muted d-block">Pedido</small>

                      <strong>{pedido.codigo}</strong>
                    </div>

                    <div className="col-12 col-md-3">
                      <small className="text-muted d-block">Fecha</small>

                      <span>{pedido.fecha}</span>
                    </div>

                    <div className="col-12 col-md-2">
                      <small className="text-muted d-block">Estado</small>

                      <span className="badge text-bg-success">
                        {pedido.estado}
                      </span>
                    </div>

                    <div className="col-12 col-md-2">
                      <small className="text-muted d-block">Total</small>

                      <strong>${pedido.total.toLocaleString("es-CL")}</strong>
                    </div>

                    <div className="col-12 col-md-2">
                      <Link
                        to={`/mis-pedidos/${pedido.codigo}`}
                        className="btn btn-outline-primary w-100"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MisPedidos;
