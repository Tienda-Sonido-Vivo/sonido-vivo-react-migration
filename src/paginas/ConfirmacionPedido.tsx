import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { Pedido } from "../interfaces/Pedido";
import { obtenerPedido } from "../servicios/pedidosServicio";

interface ConfirmacionPedidoProps {
  pedidos: Pedido[];
}

function ConfirmacionPedido({ pedidos }: ConfirmacionPedidoProps) {
  const { codigo } = useParams();
  const pedidoEnEstado = pedidos.find((actual) => actual.codigo === codigo);

  const [pedidoRemoto, setPedidoRemoto] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(!pedidoEnEstado);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pedidoEnEstado || !codigo) {
      queueMicrotask(() => setCargando(false));
      return;
    }

    obtenerPedido(codigo)
      .then(setPedidoRemoto)
      .catch((errorApi: unknown) => {
        setError(errorApi instanceof Error ? errorApi.message : "No se encontró el pedido.");
      })
      .finally(() => setCargando(false));
  }, [codigo, pedidoEnEstado]);

  const pedido = pedidoEnEstado ?? pedidoRemoto;

  if (cargando) {
    return (
      <main className="container py-5">
        <p className="text-center text-muted">Consultando el pedido...</p>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">{error || "No se encontró el pedido solicitado."}</div>
        <Link to="/mis-pedidos" className="btn btn-primary">Volver a mis pedidos</Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4 p-md-5">
              <div className="display-4 text-success mb-3">✓</div>
              <h1 className="h2 fw-bold">¡Compra confirmada!</h1>
              <p className="text-muted">Tu pedido fue registrado correctamente.</p>

              <div className="bg-light rounded p-4 my-4">
                <p className="mb-2">Número de pedido</p>
                <strong className="fs-4">{pedido.codigo}</strong>
                <hr />
                <p className="mb-1">Total</p>
                <strong className="fs-3">${pedido.total.toLocaleString("es-CL")}</strong>
              </div>

              <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                <Link to="/mis-pedidos" className="btn btn-primary">Ver mis pedidos</Link>
                <Link to="/catalogo" className="btn btn-outline-secondary">Seguir comprando</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ConfirmacionPedido;
