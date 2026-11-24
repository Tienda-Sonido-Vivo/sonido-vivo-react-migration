import { useCallback, useEffect, useState } from "react";

import {
  actualizarRevisionMensaje,
  obtenerMensajes,
} from "../servicios/mensajeriaServicio";
import type { Mensaje } from "../servicios/mensajeriaServicio";

function ListadoContactos() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarMensajes = useCallback(async () => {
    setCargando(true);

    try {
      setMensajes(await obtenerMensajes());
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudieron cargar los mensajes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => cargarMensajes());
  }, [cargarMensajes]);

  const cambiarRevision = async (mensaje: Mensaje) => {
    try {
      const actualizado = await actualizarRevisionMensaje(
        mensaje.id,
        !mensaje.revisado,
      );

      setMensajes((actuales) =>
        actuales.map((actual) =>
          actual.id === actualizado.id ? actualizado : actual,
        ),
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo actualizar el mensaje.");
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="mb-0">Mensajes recibidos</h1>
          <p className="text-muted mb-0">
            Consultar y marcar los mensajes enviados desde el sitio público.
          </p>
        </div>

        <button type="button" className="btn btn-outline-primary" onClick={() => void cargarMensajes()}>
          Actualizar
        </button>
      </div>

      {cargando ? (
        <p className="text-muted">Cargando mensajes...</p>
      ) : mensajes.length === 0 ? (
        <div className="alert alert-info">Todavía no se han recibido mensajes.</div>
      ) : (
        <div className="row g-3">
          {mensajes.map((mensaje) => (
            <div className="col-12" key={mensaje.id}>
              <article className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                    <div>
                      <h2 className="h5 mb-1">{mensaje.nombreCompleto}</h2>
                      <p className="text-muted mb-0">{mensaje.correo}</p>
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                      <span className="badge text-bg-secondary">{mensaje.tipoMensaje}</span>
                      <span className={mensaje.revisado ? "badge text-bg-success" : "badge text-bg-warning"}>
                        {mensaje.revisado ? "Revisado" : "Pendiente"}
                      </span>
                    </div>
                  </div>

                  <p className="mb-2">{mensaje.mensaje}</p>

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <small className="text-muted">
                      Remitente: {mensaje.tipoRemitente} · {new Date(mensaje.fechaCreacion).toLocaleString("es-CL")}
                    </small>

                    <button
                      type="button"
                      className={mensaje.revisado ? "btn btn-outline-secondary btn-sm" : "btn btn-success btn-sm"}
                      onClick={() => void cambiarRevision(mensaje)}
                    >
                      {mensaje.revisado ? "Marcar pendiente" : "Marcar revisado"}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ListadoContactos;
