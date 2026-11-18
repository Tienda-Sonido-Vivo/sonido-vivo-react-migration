import { useCallback, useEffect, useState } from "react";

import {
  obtenerResumenDiario,
  obtenerResumenMensual,
} from "../../servicios/ventasServicio";
import type { ResumenVentas } from "../../servicios/ventasServicio";

function fechaLocal(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function VentasAdmin() {
  const hoy = fechaLocal();
  const [fecha, setFecha] = useState(hoy);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [diario, setDiario] = useState<ResumenVentas | null>(null);
  const [mensual, setMensual] = useState<ResumenVentas | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarResumenes = useCallback(async () => {
    setCargando(true);

    try {
      const [resumenDia, resumenMes] = await Promise.all([
        obtenerResumenDiario(fecha),
        obtenerResumenMensual(anio, mes),
      ]);

      setDiario(resumenDia);
      setMensual(resumenMes);
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudieron consultar las ventas.");
    } finally {
      setCargando(false);
    }
  }, [fecha, anio, mes]);

  useEffect(() => {
    void Promise.resolve().then(() => cargarResumenes());
  }, [cargarResumenes]);

  const formatoMoneda = (valor: number) =>
    `$${Number(valor).toLocaleString("es-CL")}`;

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="mb-0">Ventas</h1>
          <p className="text-muted mb-0">Resumen de ventas registradas y pagadas.</p>
        </div>

        <button type="button" className="btn btn-outline-primary" onClick={() => void cargarResumenes()}>
          Consultar
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <label htmlFor="fechaVenta" className="form-label fw-semibold">Ventas diarias</label>
          <input
            id="fechaVenta"
            type="date"
            className="form-control"
            value={fecha}
            onChange={(event) => setFecha(event.target.value)}
          />
        </div>

        <div className="col-12 col-md-3">
          <label htmlFor="anioVenta" className="form-label fw-semibold">Año</label>
          <input
            id="anioVenta"
            type="number"
            className="form-control"
            value={anio}
            min={2020}
            max={2100}
            onChange={(event) => setAnio(Number(event.target.value))}
          />
        </div>

        <div className="col-12 col-md-3">
          <label htmlFor="mesVenta" className="form-label fw-semibold">Mes</label>
          <select
            id="mesVenta"
            className="form-select"
            value={mes}
            onChange={(event) => setMes(Number(event.target.value))}
          >
            {Array.from({ length: 12 }, (_, indice) => indice + 1).map((numero) => (
              <option key={numero} value={numero}>
                {new Date(2000, numero - 1, 1).toLocaleString("es-CL", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <p className="text-muted">Cargando resumen de ventas...</p>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h2 className="h5">Resumen diario</h2>
                <p className="text-muted">{fecha}</p>
                <div className="row g-3">
                  <div className="col-6">
                    <small className="text-muted d-block">Pedidos pagados</small>
                    <strong className="fs-3">{diario?.cantidadPedidos ?? 0}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Unidades vendidas</small>
                    <strong className="fs-3">{diario?.unidadesVendidas ?? 0}</strong>
                  </div>
                  <div className="col-12">
                    <small className="text-muted d-block">Total vendido</small>
                    <strong className="fs-2">{formatoMoneda(diario?.totalVentas ?? 0)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h2 className="h5">Resumen mensual</h2>
                <p className="text-muted">
                  {new Date(anio, mes - 1, 1).toLocaleString("es-CL", { month: "long", year: "numeric" })}
                </p>
                <div className="row g-3">
                  <div className="col-6">
                    <small className="text-muted d-block">Pedidos pagados</small>
                    <strong className="fs-3">{mensual?.cantidadPedidos ?? 0}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Unidades vendidas</small>
                    <strong className="fs-3">{mensual?.unidadesVendidas ?? 0}</strong>
                  </div>
                  <div className="col-12">
                    <small className="text-muted d-block">Total vendido</small>
                    <strong className="fs-2">{formatoMoneda(mensual?.totalVentas ?? 0)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default VentasAdmin;
