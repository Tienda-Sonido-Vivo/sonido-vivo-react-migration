
import { Fragment, useCallback, useMemo, useState } from "react";

import type { Pedido } from "../../interfaces/Pedido";
import type { EstadoPedido } from "../../interfaces/EstadoPedido";
import { ESTADOS_PEDIDO, claseEstado } from "../../utilidades/estadosPedido";
import { useOrdenamiento } from "../../hooks/useOrdenamiento";
import { formatearMoneda } from "../../utilidades/formato";

import ThOrdenable from "../../componentes/moleculas/ThOrdenable";
import ModalPedido from "../../componentes/organismos/ModalPedido";

const TOTAL_COLUMNAS = 6;

const TEXTO_ENTREGA: Record<Pedido["metodoEntrega"], string> = {
  despacho: "Despacho a domicilio",
  retiro: "Retiro en tienda",
};

const TEXTO_PAGO: Record<Pedido["metodoPago"], string> = {
  debito: "Tarjeta de débito",
  credito: "Tarjeta de crédito",
  transbank: "Transbank Webpay",
  klap: "Klap",
};

interface GestionPedidosProps {
  pedidos: Pedido[];

  onCambiarPedidos: (pedidos: Pedido[]) => void;
}

function GestionPedidos({ pedidos, onCambiarPedidos }: GestionPedidosProps) {
  const [pedidoEnModal, setPedidoEnModal] = useState<Pedido | null>(null);

  const [detalleAbierto, setDetalleAbierto] = useState<string | null>(null);

  const [filtroEstado, setFiltroEstado] = useState("");

  const [mensaje, setMensaje] = useState("");

  const filtrados = useMemo(
    () =>
      pedidos
        .filter((p) => filtroEstado === "" || p.estado === filtroEstado)
        .reverse(),
    [pedidos, filtroEstado],
  );

  const { ordenados, orden, alternarOrden } = useOrdenamiento(filtrados);

  const cerrarModal = useCallback(() => setPedidoEnModal(null), []);

  const actualizarEstado = (nuevoEstado: EstadoPedido) => {
    if (pedidoEnModal === null) {
      return;
    }

    const nuevos = pedidos.map((p) =>
      p.codigo === pedidoEnModal.codigo ? { ...p, estado: nuevoEstado } : p,
    );

    onCambiarPedidos(nuevos);

    setMensaje(
      `El pedido ${pedidoEnModal.codigo} ahora está "${nuevoEstado}".`,
    );

    cerrarModal();
  };

  const alternarDetalle = (codigo: string) => {
    setDetalleAbierto((actual) => (actual === codigo ? null : codigo));
  };

  const encabezado = (etiqueta: string, campo: keyof Pedido) => (
    <ThOrdenable
      etiqueta={etiqueta}
      activo={orden?.campo === campo}
      ascendente={orden?.ascendente ?? true}
      onClick={() => alternarOrden(campo)}
    />
  );

  return (
    <>
      <div className="mb-3">
        <h1 className="mb-0">Gestión de Pedidos</h1>

        <p className="text-muted mb-0">
          Consulta los pedidos realizados y actualiza su estado.
        </p>
      </div>

      {mensaje !== "" && (
        <div className="alert alert-success alert-dismissible" role="status">
          {mensaje}

          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar aviso"
            onClick={() => setMensaje("")}
          ></button>
        </div>
      )}

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6 col-lg-4">
          <select
            className="form-select"
            aria-label="Filtrar por estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>

            {ESTADOS_PEDIDO.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              {encabezado("N° de pedido", "codigo")}

              <th scope="col">Fecha</th>
              <th scope="col">Cliente</th>

              {encabezado("Total", "total")}
              {encabezado("Estado", "estado")}

              <th scope="col" className="admin-col-ajustada">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {ordenados.length === 0 && (
              <tr>
                <td colSpan={TOTAL_COLUMNAS} className="text-center py-4">
                  No existen pedidos para mostrar.
                </td>
              </tr>
            )}

            {ordenados.map((pedido) => (
              <Fragment key={pedido.codigo}>
                <tr>
                  <td className="text-nowrap">
                    <strong>{pedido.codigo}</strong>
                  </td>

                  <td>{pedido.fecha}</td>

                  <td>
                    {pedido.cliente.nombre} {pedido.cliente.apellidos}
                  </td>

                  <td className="text-nowrap">
                    <strong>{formatearMoneda(pedido.total)}</strong>
                  </td>

                  <td>
                    <span className={"badge " + claseEstado(pedido.estado)}>
                      {pedido.estado}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm text-nowrap"
                        aria-expanded={detalleAbierto === pedido.codigo}
                        onClick={() => alternarDetalle(pedido.codigo)}
                      >
                        {detalleAbierto === pedido.codigo
                          ? "Ocultar"
                          : "Ver detalle"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => setPedidoEnModal(pedido)}
                      >
                        Gestionar
                      </button>
                    </div>
                  </td>
                </tr>

                {detalleAbierto === pedido.codigo && (
                  <tr>
                    <td colSpan={TOTAL_COLUMNAS}>
                      <div className="row g-4">
                        <div className="col-12 col-lg-6">
                          <h6>Productos</h6>

                          <ul className="mb-3 ps-3">
                            {pedido.productos.map((item) => (
                              <li key={item.codigo}>
                                {item.nombre} × {item.cantidad}
                                {" — "}
                                {formatearMoneda(item.precio * item.cantidad)}
                              </li>
                            ))}
                          </ul>

                          <dl className="row mb-0">
                            <dt className="col-6">Subtotal</dt>
                            <dd className="col-6 text-end">
                              {formatearMoneda(pedido.subtotal)}
                            </dd>

                            <dt className="col-6">Envío</dt>
                            <dd className="col-6 text-end">
                              {formatearMoneda(pedido.envio)}
                            </dd>

                            <dt className="col-6">IVA (incluido)</dt>
                            <dd className="col-6 text-end">
                              {formatearMoneda(pedido.iva)}
                            </dd>

                            <dt className="col-6">Total</dt>
                            <dd className="col-6 text-end fw-bold">
                              {formatearMoneda(pedido.total)}
                            </dd>
                          </dl>
                        </div>

                        <div className="col-12 col-lg-6">
                          <h6>Cliente y entrega</h6>

                          <dl className="row mb-0">
                            <dt className="col-5">Contacto</dt>
                            <dd className="col-7">
                              {pedido.cliente.correo}
                              <br />
                              {pedido.cliente.telefono}
                            </dd>

                            <dt className="col-5">Dirección</dt>
                            <dd className="col-7">
                              {pedido.cliente.direccion}
                              {pedido.cliente.numeroVivienda
                                ? ", " + pedido.cliente.numeroVivienda
                                : ""}
                              <br />
                              {pedido.cliente.comuna}, {pedido.cliente.region}
                            </dd>

                            <dt className="col-5">Entrega</dt>
                            <dd className="col-7">
                              {TEXTO_ENTREGA[pedido.metodoEntrega]}
                            </dd>

                            <dt className="col-5">Pago</dt>
                            <dd className="col-7">
                              {TEXTO_PAGO[pedido.metodoPago]}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {pedidoEnModal !== null && (
        <ModalPedido
          pedido={pedidoEnModal}
          onGuardar={actualizarEstado}
          onCerrar={cerrarModal}
        />
      )}
    </>
  );
}

export default GestionPedidos;
