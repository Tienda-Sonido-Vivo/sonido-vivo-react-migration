//src/componentes/organismos/FormularioRegistro.tsx

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../moleculas/CampoFormulario";

import { regionesComunas } from "../../datos/regionesComunas";

import type { Usuario } from "../../interfaces/Usuario";

interface FormularioRegistroProps {
    usuarios: Usuario[];
    onRegistrarUsuario: (usuario: Usuario) => void;
}

function FormularioRegistro({
    usuarios,
    onRegistrarUsuario
}: FormularioRegistroProps) {

    const navigate = useNavigate();

    const [run, setRun] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [email, setEmail] = useState("");
    const [fechaNacimiento, setFechaNacimiento] =
        useState("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [direccion, setDireccion] = useState("");
    const [clave, setClave] = useState("");
    const [confirmarClave, setConfirmarClave] =
        useState("");

    const [mensaje, setMensaje] = useState("");

    const comunasDisponibles = region
        ? regionesComunas[region] ?? []
        : [];

    const manejarEnvio = (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setMensaje("");

        const runLimpio = run.trim();
        const emailLimpio = email.trim().toLowerCase();

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

            setMensaje(
                "Debe completar todos los campos obligatorios."
            );

            return;
        }

        const formatoCorreo =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(emailLimpio)) {

            setMensaje(
                "Ingrese un correo electrónico válido."
            );

            return;
        }

        const correoExiste = usuarios.some(
            (usuario) =>
                usuario.email.toLowerCase() ===
                emailLimpio
        );

        if (correoExiste) {

            setMensaje(
                "Ya existe un usuario registrado con ese correo."
            );

            return;
        }

        const runExiste = usuarios.some(
            (usuario) =>
                usuario.run.toLowerCase() ===
                runLimpio.toLowerCase()
        );

        if (runExiste) {

            setMensaje(
                "Ya existe un usuario registrado con ese RUN."
            );

            return;
        }

        if (
            nombre.trim().length < 2 ||
            apellidos.trim().length < 2
        ) {

            setMensaje(
                "El nombre y los apellidos deben tener al menos 2 caracteres."
            );

            return;
        }

        if (clave.length < 4 || clave.length > 10) {

            setMensaje(
                "La clave debe tener entre 4 y 10 caracteres."
            );

            return;
        }

        if (clave !== confirmarClave) {

            setMensaje(
                "Las claves no coinciden."
            );

            return;
        }

        const nuevoUsuario: Usuario = {

            run: runLimpio,

            nombre: nombre.trim(),

            apellidos: apellidos.trim(),

            email: emailLimpio,

            fechaNacimiento:
                fechaNacimiento || undefined,

            region,

            comuna,

            direccion: direccion.trim(),

            rol: "Cliente",

            estado: "Activo",

            auditoria: [],

            clave

        };

        onRegistrarUsuario(nuevoUsuario);

        navigate("/login");
    };

    return (

        <form
            onSubmit={manejarEnvio}
            noValidate
        >

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

                    <label
                        htmlFor="region"
                        className="form-label"
                    >
                        Región
                    </label>

                    <select
                        id="region"
                        name="region"
                        className="form-select"
                        value={region}
                        onChange={(event) => {

                            setRegion(
                                event.target.value
                            );

                            setComuna("");

                        }}
                    >

                        <option value="">
                            Selecciona una región
                        </option>

                        {Object.keys(
                            regionesComunas
                        ).map((nombreRegion) => (

                            <option
                                key={nombreRegion}
                                value={nombreRegion}
                            >
                                {nombreRegion}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="col-12 col-md-6 mb-3">

                    <label
                        htmlFor="comuna"
                        className="form-label"
                    >
                        Comuna
                    </label>

                    <select
                        id="comuna"
                        name="comuna"
                        className="form-select"
                        value={comuna}
                        disabled={!region}
                        onChange={(event) =>
                            setComuna(
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            Selecciona una comuna
                        </option>

                        {comunasDisponibles.map(
                            (nombreComuna) => (

                                <option
                                    key={nombreComuna}
                                    value={nombreComuna}
                                >
                                    {nombreComuna}
                                </option>

                            )
                        )}

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

            {mensaje && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {mensaje}
                </div>

            )}

            <div className="d-grid mt-4">

                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                >
                    Crear cuenta
                </button>

            </div>

        </form>
    );
}

export default FormularioRegistro;