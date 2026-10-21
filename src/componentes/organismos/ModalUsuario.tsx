// src/componentes/organismos/ModalUsuario.tsx

import { useState } from "react";

import type { Usuario } from "../../interfaces/Usuario";
import { regionesComunas } from "../../datos/regionesComunas";
import { fechaHoy } from "../../utilidades/formato";
import { formatearRun, normalizarRun, validarRun } from "../../utilidades/run";

import ModalBase from "../moleculas/ModalBase";
import CampoFormulario from "../moleculas/CampoFormulario";

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

  const guardar = () => {
    const runNormalizado = normalizarRun(formulario.run);
    const email = formulario.email.trim();

    if (esNuevo) {
      if (formulario.run.trim() === "") {
        alert("El RUN es obligatorio.");
        return;
      }
      if (!validarRun(formulario.run.trim().toUpperCase())) {
        alert("RUN inválido. Debe ser sin puntos y con guion (ej: 12345678-5).");
        return;
      }
      if (usuarios.some((u) => normalizarRun(u.run) === runNormalizado)) {
        alert("Ya existe un usuario registrado con ese RUN.");
        return;
      }
    }

    if (formulario.nombre.trim().length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (formulario.apellidos.trim().length < 3) {
      alert("Los apellidos deben tener al menos 3 caracteres.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Ingresa un correo electrónico válido.");
      return;
    }
    if (
      usuarios.some(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.run !== usuario?.run,
      )
    ) {
      alert("Ya existe un usuario registrado con ese correo.");
      return;
    }

    if (
      formulario.fechaNacimiento !== "" &&
      formulario.fechaNacimiento > new Date().toISOString().slice(0, 10)
    ) {
      alert("La fecha de nacimiento no puede ser futura.");
      return;
    }

    if (formulario.region === "") {
      alert("Selecciona una región.");
      return;
    }

    if (formulario.comuna === "") {
      alert("Selecciona una comuna.");
      return;
    }

    if (formulario.direccion.trim() === "") {
      alert("La dirección es obligatoria.");
      return;
    }

    const claveObligatoria = esNuevo || formulario.clave !== "";
    if (
      claveObligatoria &&
      (formulario.clave.length < 4 || formulario.clave.length > 10)
    ) {
      alert("La clave debe tener entre 4 y 10 caracteres.");
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
          <CampoFormulario
            etiqueta="RUN"
            tipo="text"
            nombre="run"
            valor={formulario.run}
            alCambiar={(valor) => cambiar("run", valor)}
          />
        </div>

        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Fecha de nacimiento"
            tipo="date"
            nombre="fechaNacimiento"
            valor={formulario.fechaNacimiento}
            alCambiar={(valor) => cambiar("fechaNacimiento", valor)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Nombre"
            tipo="text"
            nombre="nombre"
            valor={formulario.nombre}
            alCambiar={(valor) => cambiar("nombre", valor)}
          />
        </div>

        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Apellidos"
            tipo="text"
            nombre="apellidos"
            valor={formulario.apellidos}
            alCambiar={(valor) => cambiar("apellidos", valor)}
          />
        </div>
      </div>

      <CampoFormulario
        etiqueta="Correo electrónico"
        tipo="email"
        nombre="email"
        valor={formulario.email}
        alCambiar={(valor) => cambiar("email", valor)}
      />

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="mb-3">
            <label htmlFor="usuarioRegion" className="form-label fw-semibold">
              Región
            </label>
            <select
              id="usuarioRegion"
              className="form-select"
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
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="mb-3">
            <label htmlFor="usuarioComuna" className="form-label fw-semibold">
              Comuna
            </label>
            <select
              id="usuarioComuna"
              className="form-select"
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
          </div>
        </div>
      </div>

      <CampoFormulario
        etiqueta="Dirección"
        tipo="text"
        nombre="direccion"
        valor={formulario.direccion}
        alCambiar={(valor) => cambiar("direccion", valor)}
      />

      <div className="row">
        <div className="col-12 col-md-4">
          <div className="mb-3">
            <label htmlFor="usuarioRol" className="form-label fw-semibold">
              Rol
            </label>
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
            {esCuentaPropia && (
              <div className="form-text">No puedes cambiar tu propio rol.</div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="mb-3">
            <label htmlFor="usuarioEstado" className="form-label fw-semibold">
              Estado
            </label>
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
            {esCuentaPropia && (
              <div className="form-text">
                No puedes desactivar tu propia cuenta.
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-4">
          <CampoFormulario
            etiqueta={esNuevo ? "Clave" : "Nueva clave"}
            tipo="password"
            nombre="clave"
            valor={formulario.clave}
            alCambiar={(valor) => cambiar("clave", valor)}
          />
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalUsuario;