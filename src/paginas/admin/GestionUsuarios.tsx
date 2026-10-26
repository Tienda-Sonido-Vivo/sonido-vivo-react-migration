
import { Fragment, useCallback, useState } from "react";

import type { Usuario } from "../../interfaces/Usuario";
import { obtenerCorreo } from "../../servicios/sesion";
import { useOrdenamiento } from "../../hooks/useOrdenamiento";
import { fechaHoy } from "../../utilidades/formato";
import { formatearRun } from "../../utilidades/run";

import ThOrdenable from "../../componentes/moleculas/ThOrdenable";
import ModalUsuario from "../../componentes/organismos/ModalUsuario";

const TOTAL_COLUMNAS = 12;

interface EstadoModal {
  usuario: Usuario | null;
}

interface GestionUsuariosProps {
  usuarios: Usuario[];

  onCambiarUsuarios: (usuarios: Usuario[]) => void;
}

function GestionUsuarios({
  usuarios,
  onCambiarUsuarios,
}: GestionUsuariosProps) {
  const [modal, setModal] = useState<EstadoModal | null>(null);

  const [detalleAbierto, setDetalleAbierto] = useState<string | null>(null);

  const [mensaje, setMensaje] = useState("");

  const { ordenados, orden, alternarOrden } = useOrdenamiento(usuarios);

  const cerrarModal = useCallback(() => setModal(null), []);

  const actualizarUsuarios = (nuevos: Usuario[]) => {
    onCambiarUsuarios(nuevos);
  };

  const correoActual = obtenerCorreo().toLowerCase();

  const esCuentaPropia = (usuario: Usuario) =>
    usuario.email.toLowerCase() === correoActual;

  const guardar = (usuario: Usuario, esNuevo: boolean) => {
    if (esNuevo) {
      actualizarUsuarios([...usuarios, usuario]);

      setMensaje(`Usuario ${usuario.nombre} creado correctamente.`);
    } else {
      actualizarUsuarios(
        usuarios.map((u) => (u.run === usuario.run ? usuario : u)),
      );

      setMensaje(`Usuario ${usuario.nombre} actualizado correctamente.`);
    }

    cerrarModal();
  };

  const alternarEstado = (usuario: Usuario) => {
    const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";

    if (nuevoEstado === "Inactivo") {
      const confirmar = window.confirm(
        `¿Desactivar a ${usuario.nombre} ${usuario.apellidos}? ` +
          "No podrá iniciar sesión.",
      );

      if (!confirmar) {
        return;
      }
    }

    actualizarUsuarios(
      usuarios.map((u) =>
        u.run === usuario.run
          ? {
              ...u,
              estado: nuevoEstado,
              auditoria: [
                ...(u.auditoria ?? []),
                `Estado cambiado a ${nuevoEstado} el ${fechaHoy()}`,
              ],
            }
          : u,
      ),
    );

    setMensaje(`Usuario ${usuario.nombre} ahora está ${nuevoEstado}.`);
  };

  const alternarDetalle = (run: string) => {
    setDetalleAbierto((actual) => (actual === run ? null : run));
  };

  const encabezado = (
    etiqueta: string,
    campo: keyof Usuario,
    className?: string,
  ) => (
    <ThOrdenable
      etiqueta={etiqueta}
      activo={orden?.campo === campo}
      ascendente={orden?.ascendente ?? true}
      onClick={() => alternarOrden(campo)}
      className={className}
    />
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h1 className="mb-0">Gestión de Usuarios</h1>

          <p className="text-muted mb-0">
            {usuarios.length} usuarios registrados
          </p>
        </div>

        <button
          type="button"
          className="btn btn-success"
          onClick={() => setModal({ usuario: null })}
        >
          Añadir usuario
        </button>
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

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              {encabezado("RUN", "run")}
              {encabezado("Nombre", "nombre")}
              {encabezado("Apellidos", "apellidos")}
              {encabezado("Email", "email")}
              {encabezado(
                "Fecha nac.",
                "fechaNacimiento",
                "d-none d-xl-table-cell",
              )}
              {encabezado("Región", "region", "d-none d-xl-table-cell")}
              {encabezado("Comuna", "comuna", "d-none d-xl-table-cell")}
              {encabezado("Dirección", "direccion", "d-none d-xl-table-cell")}
              {encabezado("Rol", "rol")}
              {encabezado("Estado", "estado")}

              <th scope="col" className="admin-col-ajustada">
                Auditoría
              </th>
              <th scope="col" className="admin-col-ajustada">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {ordenados.length === 0 && (
              <tr>
                <td colSpan={TOTAL_COLUMNAS} className="text-center py-4">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}

            {ordenados.map((usuario) => (
              <Fragment key={usuario.run}>
                <tr>
                  <td className="text-nowrap">{formatearRun(usuario.run)}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellidos}</td>
                  <td>{usuario.email}</td>
                  <td className="d-none d-xl-table-cell">
                    {usuario.fechaNacimiento ?? "—"}
                  </td>
                  <td className="d-none d-xl-table-cell">{usuario.region}</td>
                  <td className="d-none d-xl-table-cell">{usuario.comuna}</td>
                  <td className="d-none d-xl-table-cell">
                    {usuario.direccion}
                  </td>
                  <td>{usuario.rol}</td>

                  <td>
                    <span
                      className={
                        "badge " +
                        (usuario.estado === "Activo"
                          ? "text-bg-success"
                          : "text-bg-secondary")
                      }
                    >
                      {usuario.estado}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm text-nowrap"
                      aria-expanded={detalleAbierto === usuario.run}
                      onClick={() => alternarDetalle(usuario.run)}
                    >
                      {detalleAbierto === usuario.run
                        ? "Ocultar"
                        : "Ver detalle"}
                    </button>
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setModal({ usuario })}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className={
                          "btn btn-sm text-nowrap " +
                          (usuario.estado === "Activo"
                            ? "btn-outline-danger"
                            : "btn-outline-success")
                        }
                        disabled={esCuentaPropia(usuario)}
                        title={
                          esCuentaPropia(usuario)
                            ? "No puedes desactivar tu propia cuenta"
                            : undefined
                        }
                        onClick={() => alternarEstado(usuario)}
                      >
                        {usuario.estado === "Activo" ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>

                {detalleAbierto === usuario.run && (
                  <tr>
                    <td colSpan={TOTAL_COLUMNAS}>
                      <dl className="row mb-3 d-xl-none">
                        <dt className="col-5 col-md-3">Fecha de nacimiento</dt>
                        <dd className="col-7 col-md-9">
                          {usuario.fechaNacimiento ?? "—"}
                        </dd>

                        <dt className="col-5 col-md-3">Región</dt>
                        <dd className="col-7 col-md-9">{usuario.region}</dd>

                        <dt className="col-5 col-md-3">Comuna</dt>
                        <dd className="col-7 col-md-9">{usuario.comuna}</dd>

                        <dt className="col-5 col-md-3">Dirección</dt>
                        <dd className="col-7 col-md-9">{usuario.direccion}</dd>
                      </dl>

                      <strong>Auditoría de {usuario.nombre}:</strong>

                      {usuario.auditoria && usuario.auditoria.length > 0 ? (
                        <ul className="mb-0 ps-3">
                          {usuario.auditoria.map((registro, indice) => (
                            <li key={indice}>{registro}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mb-0 text-muted">
                          Sin registros de actividad.
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <ModalUsuario
          usuario={modal.usuario}
          usuarios={usuarios}
          esCuentaPropia={
            modal.usuario !== null && esCuentaPropia(modal.usuario)
          }
          onGuardar={guardar}
          onCerrar={cerrarModal}
        />
      )}
    </>
  );
}

export default GestionUsuarios;
