// src/componentes/organismos/ModalUsuario.tsx

import { useState } from "react";

import type { Usuario } from "../../interfaces/Usuario";
import { regionesComunas } from "../../datos/regionesComunas";
import { fechaHoy } from "../../utilidades/formato";
import { formatearRun, normalizarRun, validarRun } from "../../utilidades/run";

import ModalBase from "../moleculas/ModalBase";
import CampoConError from "../moleculas/CampoConError";

interface FormularioUsuario {
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
  rol: Usuario["rol"];
  estado: Usuario["estado"];
  clave: string;
}

type Errores = Partial<Record<keyof FormularioUsuario, string>>;

interface ModalUsuarioProps {
  // null = crear un usuario nuevo
  usuario: Usuario | null;

  usuarios: Usuario[];

  // true = es la cuenta con la sesión iniciada (no puede quitarse su propio acceso)
  esCuentaPropia: boolean;

  onGuardar: (usuario: Usuario, esNuevo: boolean) => void;

  onCerrar: () => void;
}

function formularioInicial(usuario: Usuario | null): FormularioUsuario {
  if (usuario === null) {
    return {
      run: "",
      nombre: "",
      apellidos: "",
      email: "",
      fechaNacimiento: "",
      region: "",
      comuna: "",
      direccion: "",
      rol: "Cliente",
      estado: "Activo",
      clave: "",
    };
  }

  return {
    run: formatearRun(usuario.run),
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    email: usuario.email,
    fechaNacimiento: usuario.fechaNacimiento ?? "",
    region: usuario.region,
    comuna: usuario.comuna,
    direccion: usuario.direccion,
    rol: usuario.rol,
    estado: usuario.estado,
    clave: "",
  };
}

function ModalUsuario({
  usuario,
  usuarios,
  esCuentaPropia,
  onGuardar,
  onCerrar,
}: ModalUsuarioProps) {
  const esNuevo = usuario === null;

  const [formulario, setFormulario] = useState<FormularioUsuario>(() =>
    formularioInicial(usuario),
  );

  const [errores, setErrores] = useState<Errores>({});

  const cambiar = <K extends keyof FormularioUsuario>(
    campo: K,
    valor: FormularioUsuario[K],
  ) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const cambiarRegion = (region: string) => {
    // Al cambiar la región, la comuna anterior deja de ser válida
    setFormulario((anterior) => ({ ...anterior, region, comuna: "" }));
  };

  const validar = (): Errores => {
    const nuevos: Errores = {};

    const runNormalizado = normalizarRun(formulario.run);
    const email = formulario.email.trim();

    if (esNuevo) {
      if (formulario.run.trim() === "") {
        nuevos.run = "El RUN es obligatorio.";
      } else if (!validarRun(formulario.run.trim().toUpperCase())) {
        nuevos.run = "RUN inválido. Sin puntos y con guion (ej: 12345678-5).";
      } else if (
        usuarios.some((u) => normalizarRun(u.run) === runNormalizado)
      ) {
        nuevos.run = "Ya existe un usuario con ese RUN.";
      }
    }

    if (formulario.nombre.trim().length < 3) {
      nuevos.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (formulario.apellidos.trim().length < 3) {
      nuevos.apellidos = "Los apellidos deben tener al menos 3 caracteres.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevos.email = "Ingresa un correo válido (ej: nombre@dominio.cl).";
    } else if (
      usuarios.some(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.run !== usuario?.run,
      )
    ) {
      nuevos.email = "Ya existe un usuario con ese correo.";
    }

    if (
      formulario.fechaNacimiento !== "" &&
      formulario.fechaNacimiento > new Date().toISOString().slice(0, 10)
    ) {
      nuevos.fechaNacimiento = "La fecha no puede ser futura.";
    }

    if (formulario.region === "") {
      nuevos.region = "Selecciona una región.";
    }

    if (formulario.comuna === "") {
      nuevos.comuna = "Selecciona una comuna.";
    }

    if (formulario.direccion.trim() === "") {
      nuevos.direccion = "La dirección es obligatoria.";
    }

    // Misma regla que el Login: entre 4 y 10 caracteres
    const claveObligatoria = esNuevo || formulario.clave !== "";

    if (
      claveObligatoria &&
      (formulario.clave.length < 4 || formulario.clave.length > 10)
    ) {
      nuevos.clave = "La clave debe tener entre 4 y 10 caracteres.";
    }

    return nuevos;
  };

  const guardar = () => {
    const nuevos = validar();

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      return;
    }

    const hoy = fechaHoy();

    const auditoria = [...(usuario?.auditoria ?? [])];

    if (esNuevo) {
      auditoria.push("Usuario creado el " + hoy);
    } else {
      auditoria.push("Datos editados el " + hoy);

      if (usuario.rol !== formulario.rol) {
        auditoria.push(
          `Rol cambiado de ${usuario.rol} a ${formulario.rol} el ${hoy}`,
        );
      }

      if (usuario.estado !== formulario.estado) {
        auditoria.push(`Estado cambiado a ${formulario.estado} el ${hoy}`);
      }
    }

    const resultado: Usuario = {
      run: esNuevo ? normalizarRun(formulario.run) : usuario.run,
      nombre: formulario.nombre.trim(),
      apellidos: formulario.apellidos.trim(),
      email: formulario.email.trim(),
      fechaNacimiento:
        formulario.fechaNacimiento === ""
          ? undefined
          : formulario.fechaNacimiento,
      region: formulario.region,
      comuna: formulario.comuna,
      direccion: formulario.direccion.trim(),
      rol: formulario.rol,
      estado: formulario.estado,
      auditoria,
      // Al editar, si la clave queda vacía se conserva la anterior
      clave:
        formulario.clave !== "" ? formulario.clave : (usuario?.clave ?? ""),
    };

    onGuardar(resultado, esNuevo);
  };

  const comunasDisponibles = regionesComunas[formulario.region] ?? [];

  return (
    <ModalBase
      titulo={esNuevo ? "Añadir usuario" : "Editar usuario"}
      onCerrar={onCerrar}
      pie={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button type="button" className="btn btn-primary" onClick={guardar}>
            Guardar
          </button>
        </>
      }
    >
      <div className="row">
        <div className="col-12 col-md-6">
          <CampoConError
            id="usuarioRun"
            etiqueta="RUN"
            error={errores.run}
            ayuda={
              esNuevo
                ? "Sin puntos y con guion. Ej: 12345678-5"
                : "El RUN no se puede modificar."
            }
          >
            <input
              id="usuarioRun"
              type="text"
              className={"form-control" + (errores.run ? " is-invalid" : "")}
              maxLength={10}
              value={formulario.run}
              disabled={!esNuevo}
              onChange={(e) => cambiar("run", e.target.value)}
            />
          </CampoConError>
        </div>

        <div className="col-12 col-md-6">
          <CampoConError
            id="usuarioFecha"
            etiqueta="Fecha de nacimiento"
            error={errores.fechaNacimiento}
          >
            <input
              id="usuarioFecha"
              type="date"
              className={
                "form-control" + (errores.fechaNacimiento ? " is-invalid" : "")
              }
              value={formulario.fechaNacimiento}
              onChange={(e) => cambiar("fechaNacimiento", e.target.value)}
            />
          </CampoConError>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoConError
            id="usuarioNombre"
            etiqueta="Nombre"
            error={errores.nombre}
          >
            <input
              id="usuarioNombre"
              type="text"
              className={"form-control" + (errores.nombre ? " is-invalid" : "")}
              maxLength={50}
              value={formulario.nombre}
              onChange={(e) => cambiar("nombre", e.target.value)}
            />
          </CampoConError>
        </div>

        <div className="col-12 col-md-6">
          <CampoConError
            id="usuarioApellidos"
            etiqueta="Apellidos"
            error={errores.apellidos}
          >
            <input
              id="usuarioApellidos"
              type="text"
              className={
                "form-control" + (errores.apellidos ? " is-invalid" : "")
              }
              maxLength={100}
              value={formulario.apellidos}
              onChange={(e) => cambiar("apellidos", e.target.value)}
            />
          </CampoConError>
        </div>
      </div>

      <CampoConError
        id="usuarioEmail"
        etiqueta="Correo electrónico"
        error={errores.email}
      >
        <input
          id="usuarioEmail"
          type="email"
          className={"form-control" + (errores.email ? " is-invalid" : "")}
          maxLength={100}
          value={formulario.email}
          onChange={(e) => cambiar("email", e.target.value)}
        />
      </CampoConError>

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoConError
            id="usuarioRegion"
            etiqueta="Región"
            error={errores.region}
          >
            <select
              id="usuarioRegion"
              className={"form-select" + (errores.region ? " is-invalid" : "")}
              value={formulario.region}
              onChange={(e) => cambiarRegion(e.target.value)}
            >
              <option value="">Selecciona una región</option>

              {Object.keys(regionesComunas).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </CampoConError>
        </div>

        <div className="col-12 col-md-6">
          <CampoConError
            id="usuarioComuna"
            etiqueta="Comuna"
            error={errores.comuna}
          >
            <select
              id="usuarioComuna"
              className={"form-select" + (errores.comuna ? " is-invalid" : "")}
              value={formulario.comuna}
              disabled={formulario.region === ""}
              onChange={(e) => cambiar("comuna", e.target.value)}
            >
              <option value="">
                {formulario.region === ""
                  ? "Primero selecciona una región"
                  : "Selecciona una comuna"}
              </option>

              {comunasDisponibles.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </CampoConError>
        </div>
      </div>

      <CampoConError
        id="usuarioDireccion"
        etiqueta="Dirección"
        error={errores.direccion}
      >
        <input
          id="usuarioDireccion"
          type="text"
          className={"form-control" + (errores.direccion ? " is-invalid" : "")}
          maxLength={150}
          value={formulario.direccion}
          onChange={(e) => cambiar("direccion", e.target.value)}
        />
      </CampoConError>

      <div className="row">
        <div className="col-12 col-md-4">
          <CampoConError
            id="usuarioRol"
            etiqueta="Rol"
            ayuda={
              esCuentaPropia ? "No puedes cambiar tu propio rol." : undefined
            }
          >
            <select
              id="usuarioRol"
              className="form-select"
              value={formulario.rol}
              disabled={esCuentaPropia}
              onChange={(e) => cambiar("rol", e.target.value as Usuario["rol"])}
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Cliente">Cliente</option>
            </select>
          </CampoConError>
        </div>

        <div className="col-12 col-md-4">
          <CampoConError
            id="usuarioEstado"
            etiqueta="Estado"
            ayuda={
              esCuentaPropia
                ? "No puedes desactivar tu propia cuenta."
                : undefined
            }
          >
            <select
              id="usuarioEstado"
              className="form-select"
              value={formulario.estado}
              disabled={esCuentaPropia}
              onChange={(e) =>
                cambiar("estado", e.target.value as Usuario["estado"])
              }
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </CampoConError>
        </div>

        <div className="col-12 col-md-4">
          <CampoConError
            id="usuarioClave"
            etiqueta={esNuevo ? "Clave" : "Nueva clave"}
            error={errores.clave}
            ayuda={
              esNuevo
                ? "Entre 4 y 10 caracteres."
                : "Déjala vacía para no cambiarla."
            }
          >
            <input
              id="usuarioClave"
              type="password"
              className={"form-control" + (errores.clave ? " is-invalid" : "")}
              maxLength={10}
              autoComplete="new-password"
              value={formulario.clave}
              onChange={(e) => cambiar("clave", e.target.value)}
            />
          </CampoConError>
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalUsuario;
