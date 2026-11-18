import { useEffect, useState } from "react";

import {
  obtenerResumenDiario,
  obtenerResumenMensual,
  type ResumenVentas,
} from "../../servicios/ventasServicio";
import { formatearMoneda } from "../../utilidades/formato";

function fechaActual() {
  return new Date().toISOString().slice(0, 10);
}

function VentasAdmin() {
  const [fecha, setFecha] = useState(fechaActual);
  const [resumenDiario, setResumenDiario] = useState<ResumenVentas | null>(null);
  const [resumenMensual, setResumenMensual] = useState<ResumenVentas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const date = new Date(`${fecha}T00:00:00`);

    Promise.all([
      obtenerResumenDiario(fecha),
      obtenerResumenMensual(date.getFullYear(), date.getMonth() + 1),
    ])
      .then(([diario, mensual]) => {
        setResumenDiario(diario);
        setResumenMensual(mensual);
        setError("");
      })
      .catch(() => setError("No se pudo cargar el resumen de ventas."))
      .finally(() => setCargando(false));
  }, [fecha]);

  const mostrarResumen = (titulo: string, resumen: ResumenVentas | null) => (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h5">{titulo}</h2>
        {resumen === null ? (
          <p className="text-muted mb-0">Sin datos.</p>
        ) : (
          <dl className="row mb-0">
            <dt className="col-7">Pedidos</dt>
            <dd className="col-5 text-end">{resumen.cantidadPedidos}</dd>
            <dt className="col-7">Unidades</dt>
            <dd className="col-5 text-end">{resumen.unidadesVendidas}</dd>
            <dt className="col-7">Total</dt>
            <dd className="col-5 text-end fw-bold">
              {formatearMoneda(resumen.totalVentas)}
            </dd>
          </dl>
        )}
      </div>
    </section>
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="mb-0">Resumen de ventas</h1>
        <label>
          Fecha de consulta
          <input
            className="form-control"
            type="date"
            value={fecha}
            onChange={(event) => setFecha(event.target.value)}
          />
        </label>
      </div>
      {cargando && <p>Cargando ventas...</p>}
      {error !== "" && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          {mostrarResumen("Resumen diario", resumenDiario)}
        </div>
        <div className="col-12 col-lg-6">
          {mostrarResumen("Resumen mensual", resumenMensual)}
        </div>
      </div>
    </>
  );
}

export default VentasAdmin;
