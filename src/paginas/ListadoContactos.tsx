
/*
NOTA:

ESTA PAGINA NO CORRESPONDE AL PROYECTO ORIGINAL. ES PARTe  DEL PROYECTO FRONTEND
DE EJEMPLO QUE EL PROFESOR UTILIZÓ PARA MOSTRARNOS COMO UNA PAGINA 
PUEDE RECIBIR INFORMACIÓN DE SU RESPECTIVO BACKEND

TENEMOS QUE IMPLEMENTAR ESTA PAGINA A SONIDO VIVO. ADAPNTANDOLO A SU ESTILO.
EVIDENTEMENTE, HABRÁ QUE IMPLEMENTAR ESTA PAGINA EN ALGUNO DE LOS MENÚS
COMO EN LAS RUTAS.

SUGERIMOS QUE, PARA NUSTRO PROYECTO, SE INTEGRÉ ESTA PÁGINA EN EL MODAL DEL ADMINISTRADOR,
ES DECIR, COMO UNA OPCIÓN EN SU PANEL DE ADMINISTRACIÓN, EN SU MENÚ IZQUIERDO.

ESE MENÚ IZQUIERDO SE ENCUENTRA EN LA CARPETA COMPONENTES/ORGANISMOS
Y SE LLAMA "SiderbarAdmin"

*/

import { useEffect, useState } from "react";
import {
  actualizarRevisionMensaje,
  obtenerMensajes,
  type Mensaje,
} from "../servicios/mensajeriaServicio";

function ListadoContactos() {
  const [contactos, setContactos] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerMensajes()
      .then(setContactos)
      .catch(() => setError("No se pudieron cargar los mensajes."))
      .finally(() => setCargando(false));
  }, []);

  const cambiarRevision = async (mensaje: Mensaje) => {
    try {
      const actualizado = await actualizarRevisionMensaje(
        mensaje.id,
        !mensaje.revisado,
      );
      setContactos((actuales) =>
        actuales.map((actual) =>
          actual.id === actualizado.id ? actualizado : actual,
        ),
      );
    } catch {
      setError("No se pudo actualizar el estado del mensaje.");
    }
  };

  return (
    <>
      <h1>Mensajes recibidos</h1>
      {cargando && <p>Cargando mensajes...</p>}
      {error !== "" && <div className="alert alert-danger">{error}</div>}
      {!cargando && contactos.length === 0 && (
        <p className="text-muted">No hay mensajes para mostrar.</p>
      )}
      {contactos.map((contacto) => (
        <article className="card p-3 mb-3" key={contacto.id}>
          <div className="d-flex justify-content-between gap-3">
            <h2 className="h5">{contacto.nombreCompleto}</h2>
            <span className={"badge " + (contacto.revisado ? "text-bg-success" : "text-bg-warning")}>
              {contacto.revisado ? "Revisado" : "Pendiente"}
            </span>
          </div>
          <p className="mb-1">{contacto.correo}</p>
          <p>{contacto.mensaje}</p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm align-self-start"
            onClick={() => void cambiarRevision(contacto)}
          >
            Marcar como {contacto.revisado ? "pendiente" : "revisado"}
          </button>
        </article>
      ))}
    </>
  );
}

export default ListadoContactos;