// src/componentes/organismos/FormularioRegistro.tsx

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../moleculas/CampoFormulario";
import { regionesComunas } from "../../datos/regionesComunas";
import type { Usuario } from "../../interfaces/Usuario";
import { normalizarRun, validarRun } from "../../utilidades/run";

interface FormularioRegistroProps {
  usuarios: Usuario[];
  onRegistrarUsuario: (usuario: Usuario) => void;
}

function FormularioRegistro({
  usuarios,
  onRegistrarUsuario,
}: FormularioRegistroProps) {
  const navigate = useNavigate();

  const [run, setRun] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [direccion, setDireccion] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");

  const comunasDisponibles = region ? regionesComunas[region] ?? [] : [];

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const runLimpio = run.trim();
    const runNormalizado = normalizarRun(runLimpio);
    const emailLimpio = email.trim().toLowerCase();

    // 1. Validar campos obligatorios
    if (
      !runLimpio ||
      !nombre.trim() ||
      !apellidos.trim() ||
      !emailLimpio ||
      !region ||
      !comuna ||
      !direccion.trim() ||
      !clave ||
      !confirmarClave
    ) {
      alert("Debe completar todos los campos obligatorios.");
      return;
    }

    // 2. Validar formato de RUT chileno con algoritmo de dígito verificador
    if (!validarRun(runLimpio)) {
      alert(
        "RUN inválido. Ingresa un RUT chileno válido (ej: 12345678-5 o 12.345.678-5)."
      );
      return;
    }

    // 3. Validar si el RUN ya se encuentra registrado
    const runExiste = usuarios.some(
      (usuario) => normalizarRun(usuario.run) === runNormalizado
    );

    if (runExiste) {
      alert("Ya existe un usuario registrado con ese RUN.");
      return;
    }

    // 4. Validar formato de correo electrónico
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(emailLimpio)) {
      alert("Ingrese un correo electrónico válido.");
      return;
    }

    // 5. Validar correo duplicado
    const correoExiste = usuarios.some(
      (usuario) => usuario.email.toLowerCase() === emailLimpio
    );

    if (correoExiste) {
      alert("Ya existe un usuario registrado con ese correo.");
      return;
    }

    // 6. Validar largo de nombres y apellidos
    if (nombre.trim().length < 2 || apellidos.trim().length < 2) {
      alert("El nombre y los apellidos deben tener al menos 2 caracteres.");
      return;
    }

    // 7. Validar largo de clave y coincidencia
    if (clave.length < 4 || clave.length > 10) {
      alert("La clave debe tener entre 4 y 10 caracteres.");
      return;
    }

    if (clave !== confirmarClave) {
      alert("Las claves no coinciden.");
      return;
    }

    // Construcción del nuevo usuario con el RUN normalizado
    const nuevoUsuario: Usuario = {
      run: runNormalizado,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: emailLimpio,
      fechaNacimiento: fechaNacimiento || undefined,
      region,
      comuna,
      direccion: direccion.trim(),
      rol: "Cliente",
      estado: "Activo",
      auditoria: [],
      clave,
    };

    onRegistrarUsuario(nuevoUsuario);

    alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");

    navigate("/login");
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoFormulario
        etiqueta="RUN"
        tipo="text"
        nombre="run"
        valor={run}
        alCambiar={setRun}
      />

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Nombre"
            tipo="text"
            nombre="nombre"
            valor={nombre}
            alCambiar={setNombre}
          />
        </div>

        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Apellidos"
            tipo="text"
            nombre="apellidos"
            valor={apellidos}
            alCambiar={setApellidos}
          />
        </div>
      </div>

      <CampoFormulario
        etiqueta="Correo Electrónico"
        tipo="email"
        nombre="email"
        valor={email}
        alCambiar={setEmail}
      />

      <CampoFormulario
        etiqueta="Fecha de nacimiento"
        tipo="date"
        nombre="fechaNacimiento"
        valor={fechaNacimiento}
        alCambiar={setFechaNacimiento}
      />

      <div className="row">
        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="region" className="form-label">
            Región
          </label>

          <select
            id="region"
            name="region"
            className="form-select"
            value={region}
            onChange={(event) => {
              setRegion(event.target.value);
              setComuna("");
            }}
          >
            <option value="">Selecciona una región</option>

            {Object.keys(regionesComunas).map((nombreRegion) => (
              <option key={nombreRegion} value={nombreRegion}>
                {nombreRegion}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="comuna" className="form-label">
            Comuna
          </label>

          <select
            id="comuna"
            name="comuna"
            className="form-select"
            value={comuna}
            disabled={!region}
            onChange={(event) => setComuna(event.target.value)}
          >
            <option value="">Selecciona una comuna</option>

            {comunasDisponibles.map((nombreComuna) => (
              <option key={nombreComuna} value={nombreComuna}>
                {nombreComuna}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CampoFormulario
        etiqueta="Dirección"
        tipo="text"
        nombre="direccion"
        valor={direccion}
        alCambiar={setDireccion}
      />

      <CampoFormulario
        etiqueta="Contraseña"
        tipo="password"
        nombre="clave"
        valor={clave}
        alCambiar={setClave}
      />

      <CampoFormulario
        etiqueta="Confirmar contraseña"
        tipo="password"
        nombre="confirmarClave"
        valor={confirmarClave}
        alCambiar={setConfirmarClave}
      />

      <div className="d-grid mt-4">
        <button type="submit" className="btn btn-primary btn-lg">
          Crear cuenta
        </button>
      </div>
    </form>
  );
}

export default FormularioRegistro;